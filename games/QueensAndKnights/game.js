(() => {
  "use strict";

  const SIZE = 5;
  const QUEEN = "\u265b";
  const KNIGHT = "\u265e";
  const PIECES = ["", QUEEN, KNIGHT];
  const QUEEN_DIRECTIONS = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];
  const KNIGHT_MOVES = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];

  const elements = {
    board: document.getElementById("board"),
    dateHeading: document.getElementById("puzzle-date-heading"),
    dateSelect: document.getElementById("puzzle-date"),
    archiveSummary: document.getElementById("archive-summary"),
    olderButton: document.getElementById("older-puzzle"),
    newerButton: document.getElementById("newer-puzzle"),
    checkButton: document.getElementById("check-solution"),
    resetButton: document.getElementById("reset-puzzle"),
    revealButton: document.getElementById("show-solution"),
    queenCount: document.getElementById("queen-count"),
    knightCount: document.getElementById("knight-count"),
    status: document.getElementById("status"),
  };

  const state = {
    dates: [],
    currentIndex: -1,
    initialBoard: [],
    board: [],
    fixedCells: [],
    solution: [],
    requiredQueens: 0,
    requiredKnights: 0,
    feedback: null,
    loading: true,
    revealed: false,
  };

  function copyBoard(board) {
    return board.map(row => [...row]);
  }

  function isValidBoard(board) {
    return Array.isArray(board)
      && board.length === SIZE
      && board.every(row => Array.isArray(row) && row.length === SIZE && row.every(cell => PIECES.includes(cell)));
  }

  function formatDate(dateString, includeYear = true) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      ...(includeYear ? { year: "numeric" } : {}),
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  function setStatus(message, tone = "neutral") {
    elements.status.textContent = message;
    elements.status.dataset.tone = tone;
  }

  function setLoading(isLoading) {
    state.loading = isLoading;
    elements.board.setAttribute("aria-busy", String(isLoading));
    elements.checkButton.disabled = isLoading;
    elements.resetButton.disabled = isLoading;
    elements.revealButton.disabled = isLoading;
    updateArchiveControls();
  }

  function populateArchive(dates) {
    elements.dateSelect.replaceChildren();

    [...dates].reverse().forEach((date, reverseIndex) => {
      const option = document.createElement("option");
      option.value = date;
      option.textContent = `${formatDate(date)}${reverseIndex === 0 ? " (latest)" : ""}`;
      elements.dateSelect.appendChild(option);
    });

    const firstDate = formatDate(dates[0]);
    const latestDate = formatDate(dates[dates.length - 1]);
    elements.archiveSummary.textContent = `${dates.length} puzzles available \u00b7 ${firstDate} to ${latestDate}`;
  }

  function updateArchiveControls() {
    const atOldest = state.currentIndex <= 0;
    const atNewest = state.currentIndex >= state.dates.length - 1;
    elements.olderButton.disabled = state.loading || atOldest;
    elements.newerButton.disabled = state.loading || atNewest;
    elements.dateSelect.disabled = state.loading || state.dates.length === 0;
  }

  function updatePageUrl(date) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("date", date);
      history.replaceState({ puzzleDate: date }, "", url);
    } catch {
      // The puzzle still works when the URL cannot be updated (for example, a local file preview).
    }
  }

  function getUserPieceCounts() {
    let queens = 0;
    let knights = 0;

    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        if (state.fixedCells[row]?.[column]) continue;
        if (state.board[row]?.[column] === QUEEN) queens += 1;
        if (state.board[row]?.[column] === KNIGHT) knights += 1;
      }
    }

    return { queens, knights };
  }

  function updatePieceCounts() {
    const counts = getUserPieceCounts();
    elements.queenCount.textContent = `${counts.queens} / ${state.requiredQueens}`;
    elements.knightCount.textContent = `${counts.knights} / ${state.requiredKnights}`;
  }

  function cellKey(row, column) {
    return `${row},${column}`;
  }

  function cellName(row, column) {
    return `${String.fromCharCode(65 + column)}${row + 1}`;
  }

  function pieceName(piece) {
    if (piece === QUEEN) return "queen";
    if (piece === KNIGHT) return "knight";
    return "empty";
  }

  function getCellLabel(row, column, piece, fixed) {
    const name = cellName(row, column);
    if (fixed) return `${name}: given ${pieceName(piece)}`;
    if (state.revealed) return `${name}: solution ${pieceName(piece)}`;

    const nextPiece = PIECES[(PIECES.indexOf(piece) + 1) % PIECES.length];
    return `${name}: ${pieceName(piece)}. Activate to change to ${pieceName(nextPiece)}`;
  }

  function renderBoard() {
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const piece = state.board[row]?.[column] || "";
        const fixed = Boolean(state.fixedCells[row]?.[column]);
        const key = cellKey(row, column);
        const cell = document.createElement("button");

        cell.type = "button";
        cell.className = "board-cell";
        cell.dataset.row = String(row);
        cell.dataset.column = String(column);
        cell.textContent = piece;
        cell.setAttribute("aria-label", getCellLabel(row, column, piece, fixed));
        cell.disabled = state.loading || fixed || state.revealed;

        if ((row + column) % 2 === 1) cell.classList.add("board-cell--dark");
        if (piece === QUEEN) cell.classList.add("board-cell--queen");
        if (piece === KNIGHT) cell.classList.add("board-cell--knight");
        if (fixed) cell.classList.add("board-cell--fixed");
        if (state.revealed && !fixed && piece) cell.classList.add("board-cell--revealed");

        if (state.feedback) {
          if (!piece && state.feedback.covered.has(key)) cell.classList.add("board-cell--covered");
          if (!piece && state.feedback.uncovered.has(key)) cell.classList.add("board-cell--uncovered");
          if (state.feedback.invalid.has(key)) cell.classList.add("board-cell--invalid");
        }

        fragment.appendChild(cell);
      }
    }

    elements.board.replaceChildren(fragment);
    updatePieceCounts();
  }

  function getAttacksFrom(board, row, column, piece) {
    const attacks = [];

    if (piece === QUEEN) {
      QUEEN_DIRECTIONS.forEach(([rowStep, columnStep]) => {
        let targetRow = row + rowStep;
        let targetColumn = column + columnStep;

        while (targetRow >= 0 && targetRow < SIZE && targetColumn >= 0 && targetColumn < SIZE) {
          attacks.push([targetRow, targetColumn]);
          if (board[targetRow][targetColumn] !== "") break;
          targetRow += rowStep;
          targetColumn += columnStep;
        }
      });
    }

    if (piece === KNIGHT) {
      KNIGHT_MOVES.forEach(([rowStep, columnStep]) => {
        const targetRow = row + rowStep;
        const targetColumn = column + columnStep;
        if (targetRow >= 0 && targetRow < SIZE && targetColumn >= 0 && targetColumn < SIZE) {
          attacks.push([targetRow, targetColumn]);
        }
      });
    }

    return attacks;
  }

  function analyzeBoard() {
    const covered = new Set();
    const uncovered = new Set();
    const invalid = new Set();

    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const piece = state.board[row][column];
        if (!piece) continue;

        getAttacksFrom(state.board, row, column, piece).forEach(([targetRow, targetColumn]) => {
          const targetKey = cellKey(targetRow, targetColumn);
          covered.add(targetKey);

          if (state.board[targetRow][targetColumn]) {
            invalid.add(cellKey(row, column));
            invalid.add(targetKey);
          }
        });
      }
    }

    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const key = cellKey(row, column);
        if (!state.board[row][column] && !covered.has(key)) uncovered.add(key);
      }
    }

    return { covered, uncovered, invalid };
  }

  function describePieceTarget(queens, knights) {
    return `${queens} of ${state.requiredQueens} queens and ${knights} of ${state.requiredKnights} knights`;
  }

  function checkSolution() {
    const counts = getUserPieceCounts();
    const feedback = analyzeBoard();
    state.feedback = feedback;
    renderBoard();

    const countsMatch = counts.queens === state.requiredQueens && counts.knights === state.requiredKnights;
    const piecesAreSafe = feedback.invalid.size === 0;
    const allSquaresCovered = feedback.uncovered.size === 0;

    if (countsMatch && piecesAreSafe && allSquaresCovered) {
      setStatus("Solved! Every open square is covered and all pieces are safe.", "success");
      return;
    }

    const issues = [];
    if (!countsMatch) issues.push(`you placed ${describePieceTarget(counts.queens, counts.knights)}`);
    if (!piecesAreSafe) issues.push("one or more pieces are attacking each other");
    if (!allSquaresCovered) {
      const squareWord = feedback.uncovered.size === 1 ? "square is" : "squares are";
      issues.push(`${feedback.uncovered.size} ${squareWord} still uncovered`);
    }

    setStatus(`Not quite: ${issues.join("; ")}.`, "error");
  }

  function clearFeedback(message = "Tap a square to place a piece, then check your board.") {
    state.feedback = null;
    setStatus(message);
  }

  function cycleCell(row, column) {
    if (state.loading || state.revealed || state.fixedCells[row][column]) return;

    const currentIndex = PIECES.indexOf(state.board[row][column]);
    state.board[row][column] = PIECES[(currentIndex + 1) % PIECES.length];
    clearFeedback();
    renderBoard();
  }

  function resetPuzzle() {
    if (!state.initialBoard.length) return;
    state.board = copyBoard(state.initialBoard);
    state.revealed = false;
    clearFeedback("Board reset. Tap a square to start again.");
    renderBoard();
  }

  function showSolution() {
    if (!state.solution.length) return;
    state.board = copyBoard(state.solution);
    state.revealed = true;
    state.feedback = null;
    setStatus("Solution revealed. Select Reset to try this puzzle again.");
    renderBoard();
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return response.json();
  }

  async function loadPuzzle(date) {
    if (!state.dates.includes(date)) return;

    setLoading(true);
    setStatus(`Loading the ${formatDate(date)} puzzle\u2026`);

    try {
      const [puzzle, solution] = await Promise.all([
        fetchJson(`./puzzle_${encodeURIComponent(date)}.json`),
        fetchJson(`./solution_${encodeURIComponent(date)}.json`),
      ]);

      if (!isValidBoard(puzzle.board) || !isValidBoard(solution.board)) {
        throw new Error("Puzzle data has an invalid board");
      }

      state.currentIndex = state.dates.indexOf(date);
      state.initialBoard = copyBoard(puzzle.board);
      state.board = copyBoard(puzzle.board);
      state.fixedCells = puzzle.board.map(row => row.map(cell => cell !== ""));
      state.solution = copyBoard(solution.board);
      state.requiredQueens = Number(puzzle.num_queens) || 0;
      state.requiredKnights = Number(puzzle.num_knights) || 0;
      state.feedback = null;
      state.revealed = false;

      elements.dateSelect.value = date;
      elements.dateHeading.textContent = `${formatDate(date)} puzzle`;
      document.title = `Queens & Knights \u2014 ${formatDate(date)}`;
      updatePageUrl(date);
      renderBoard();
      clearFeedback();
    } catch (error) {
      console.error("Could not load puzzle:", error);
      elements.dateSelect.value = state.dates[state.currentIndex] || "";
      setStatus("This puzzle could not be loaded. Please choose another date or try again.", "error");
    } finally {
      setLoading(false);
      renderBoard();
    }
  }

  function moveThroughArchive(offset) {
    const nextIndex = state.currentIndex + offset;
    if (nextIndex < 0 || nextIndex >= state.dates.length) return;
    loadPuzzle(state.dates[nextIndex]);
  }

  function bindEvents() {
    elements.board.addEventListener("click", event => {
      const cell = event.target.closest(".board-cell");
      if (!cell || !elements.board.contains(cell)) return;
      cycleCell(Number(cell.dataset.row), Number(cell.dataset.column));
    });

    elements.olderButton.addEventListener("click", () => moveThroughArchive(-1));
    elements.newerButton.addEventListener("click", () => moveThroughArchive(1));
    elements.dateSelect.addEventListener("change", event => loadPuzzle(event.target.value));
    elements.checkButton.addEventListener("click", checkSolution);
    elements.resetButton.addEventListener("click", resetPuzzle);
    elements.revealButton.addEventListener("click", showSolution);
  }

  async function initialize() {
    bindEvents();
    setLoading(true);

    try {
      const archive = await fetchJson("./puzzles.json");
      const dates = Array.isArray(archive.dates)
        ? archive.dates.filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort()
        : [];

      if (dates.length === 0) throw new Error("The puzzle archive is empty");

      state.dates = dates;
      populateArchive(dates);

      const requestedDate = new URLSearchParams(window.location.search).get("date");
      const initialDate = dates.includes(requestedDate) ? requestedDate : dates[dates.length - 1];
      await loadPuzzle(initialDate);
    } catch (error) {
      console.error("Could not load puzzle archive:", error);
      elements.archiveSummary.textContent = "The puzzle archive is temporarily unavailable.";
      setStatus("The puzzle archive could not be loaded. Please refresh and try again.", "error");
      setLoading(false);
    }
  }

  initialize();
})();
