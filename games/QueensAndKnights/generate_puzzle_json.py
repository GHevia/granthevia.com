
import random
import json
import os
from datetime import date

BOARD_SIZE = 5
QUEEN_MOVES = [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (-1,1), (1,-1), (1,1)]
KNIGHT_MOVES = [(-2,-1), (-2,1), (-1,-2), (-1,2), (1,-2), (1,2), (2,-1), (2,1)]
PIECE_SYMBOLS = {'Q': '♛', 'N': '♞'}

def in_bounds(r, c):
    return 0 <= r < BOARD_SIZE and 0 <= c < BOARD_SIZE

def attack_squares(r, c, piece):
    attacked = set()
    if piece == 'Q':
        for dr, dc in QUEEN_MOVES:
            nr, nc = r + dr, c + dc
            while in_bounds(nr, nc):
                attacked.add((nr, nc))
                nr += dr
                nc += dc
    elif piece == 'N':
        for dr, dc in KNIGHT_MOVES:
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc):
                attacked.add((nr, nc))
    return attacked

def is_piece_safe(board, r, c, symbol):
    piece_type = [k for k, v in PIECE_SYMBOLS.items() if v == symbol][0]
    new_attacks = attack_squares(r, c, piece_type)
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if (i, j) == (r, c): continue
            other = board[i][j]
            if other:
                other_type = [k for k, v in PIECE_SYMBOLS.items() if v == other][0]
                other_attacks = attack_squares(i, j, other_type)
                if (r, c) in other_attacks or (i, j) in new_attacks:
                    return False
    return True

def validate_board(board):
    all_attacked = set()
    for r in range(BOARD_SIZE):
        for c in range(BOARD_SIZE):
            symbol = board[r][c]
            if symbol and not is_piece_safe(board, r, c, symbol):
                return False
            if symbol:
                piece_type = [k for k, v in PIECE_SYMBOLS.items() if v == symbol][0]
                all_attacked |= attack_squares(r, c, piece_type)
    for r in range(BOARD_SIZE):
        for c in range(BOARD_SIZE):
            if board[r][c] == '' and (r, c) not in all_attacked:
                return False
    return True

def generate_daily_puzzle(overwrite=True):
    today = date.today().isoformat()
    puzzle_file = f"puzzle_{today}.json"
    solution_file = f"solution_{today}.json"

    if not overwrite and os.path.exists(puzzle_file):
        print("✅ Puzzle already exists.")
        return

    for _ in range(100):
        board = [['' for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        num_pieces = random.randint(2, 6)
        num_queens = random.randint(1, min(3, num_pieces - 1))
        num_knights = num_pieces - num_queens
        pieces = ['Q'] * num_queens + ['N'] * num_knights
        random.shuffle(pieces)

        placed = []
        covered = set()

        for piece in pieces:
            candidates = [(r, c) for r in range(BOARD_SIZE) for c in range(BOARD_SIZE) if board[r][c] == '']
            random.shuffle(candidates)
            for r, c in candidates:
                if is_piece_safe(board, r, c, PIECE_SYMBOLS[piece]):
                    new_attacks = attack_squares(r, c, piece)
                    if new_attacks - covered:
                        board[r][c] = PIECE_SYMBOLS[piece]
                        covered |= new_attacks
                        placed.append((r, c, PIECE_SYMBOLS[piece]))
                        break

        uncovered = [(r, c) for r in range(BOARD_SIZE) for c in range(BOARD_SIZE)
                     if board[r][c] == '' and (r, c) not in covered]
        for r, c in uncovered:
            for piece in ['Q', 'N']:
                if is_piece_safe(board, r, c, PIECE_SYMBOLS[piece]):
                    board[r][c] = PIECE_SYMBOLS[piece]
                    covered |= attack_squares(r, c, piece)
                    placed.append((r, c, PIECE_SYMBOLS[piece]))
                    break

        if not validate_board(board):
            continue

        with open(solution_file, "w") as f:
            json.dump({"board": board}, f, indent=2)

        to_remove = random.sample(placed, k=random.randint(1, max(1, len(placed) // 2)))
        puzzle_board = [row[:] for row in board]
        for r, c, _ in to_remove:
            puzzle_board[r][c] = ''

        with open(puzzle_file, "w") as f:
            json.dump({
                "board": puzzle_board,
                "num_queens": sum(1 for _, _, p in to_remove if p == '♛'),
                "num_knights": sum(1 for _, _, p in to_remove if p == '♞')
            }, f, indent=2)

        # overwrite current puzzle
        with open("puzzle.json", "w") as f:
            json.dump({
                "board": puzzle_board,
                "num_queens": sum(1 for _, _, p in to_remove if p == '♛'),
                "num_knights": sum(1 for _, _, p in to_remove if p == '♞')
            }, f, indent=2)
        with open("solution.json", "w") as f:
            json.dump({"board": board}, f, indent=2)

        print("✅ Daily puzzle generated.")
        return

    print("❌ Failed to generate puzzle.")

if __name__ == "__main__":
    generate_daily_puzzle(overwrite=True)
