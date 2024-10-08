

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

let objectRadius = 10;
let initialSpeed = 6;  // Standardized speed for all objects, matching rock speed
let initialRockSpeed = 6;
// const maxAmmo = 10;  // Start with 10 rocks to shoot

// Function to check if the user is on a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
        
    // Set canvas size based on screen size
    function adjustCanvasSize() {
        canvas.width = window.innerWidth * 0.8;  // Set canvas width to 90% of the screen width
        canvas.height = window.innerHeight * 0.7;  // Set canvas height to 70% of the screen height
    }

    window.addEventListener('resize', adjustCanvasSize);  // Adjust canvas size when window is resized
    adjustCanvasSize();  // Call on page load

    // Mouse and touch controls for shooting and angle
    canvas.addEventListener('mousedown', (event) => handleInputStart(event));
    canvas.addEventListener('mousemove', (event) => handleInputMove(event));
    canvas.addEventListener('mouseup', () => handleInputEnd());

    canvas.addEventListener('touchstart', (event) => handleInputStart(event.touches[0]));
    canvas.addEventListener('touchmove', (event) => handleInputMove(event.touches[0]));
    canvas.addEventListener('touchend', () => handleInputEnd());

    // Input handler functions
    function handleInputStart(event) {
        if (!gameOver && remainingAmmo > 0) {  
            isShooting = true;
            updateShootAngle(event);  // Update the shooting angle
            startRockStream();  // Start the stream of rocks

            if (!gameStarted) {
                startObjectMovement();  // Start object movement on first touch/click
                gameStarted = true;
            }
        }
    }

    function handleInputMove(event) {
        if (!gameOver) {
            updateShootAngle(event);  // Continuously update angle based on movement
        }
    }

    function handleInputEnd() {
        isShooting = false;
        clearInterval(streamInterval);  // Stop the stream when touch or mouse is released
    }

    objectRadius = 15;
    initialSpeed = 4;  // Standardized speed for all objects, matching rock speed
    initialRockSpeed = 4;
    // const maxAmmo = 10;  // Start with 10 rocks to shoot

} else {
    objectRadius = 20;
    initialSpeed = 6;  // Standardized speed for all objects, matching rock speed
    initialRockSpeed = 6;
    // const maxAmmo = 10;  // Start with 10 rocks to shoot
}

// Image paths for rock, paper, scissors
const rockImg = new Image();
const paperImg = new Image();
const scissorsImg = new Image();

let imagesLoaded = 0;  // Track number of loaded images

// Load images and ensure game starts only when all are loaded
rockImg.src = 'images/rock.png';
paperImg.src = 'images/paper.png';
scissorsImg.src = 'images/scissors.png';

// Set up game variables
let objects = [];  // General array for all objects (rocks, paper, scissors)
let remainingAmmo = 10;  // Track remaining ammo
let isShooting = false;
let shootAngle = 0; // Direction the rocks will be shot
let streamInterval;
let gameOver = false;
let gameStarted = false;  // Track if the game has started (for movement)
let fastForward = false;  // Speed up flag
let level = 1;  // Start at level 1
let levelWon = false;  // New flag to track whether the player won or lost
const maxLevels = 6;  // Define how many levels there are
let endMessage = ''; // Store end message
const levelSettings = [
    { paper: 5, scissors: 5, maxAmmo: 10, initialSpeedMultipler: 1 },   // Level 1: 5 paper, 5 scissors (50/50)
    { paper: 10, scissors: 10, maxAmmo: 10, initialSpeedMultipler: 1  }, // Level 2: 10 paper, 10 scissors (50/50)
    { paper: 15, scissors: 15, maxAmmo: 10, initialSpeedMultipler: 1  }, // Level 3: 15 paper, 15 scissors (50/50)
    { paper: 10, scissors: 5, maxAmmo: 7, initialSpeedMultipler: 0.5  },  // Level 4: 60% paper, 40% scissors
    { paper: 14, scissors: 6, maxAmmo: 4, initialSpeedMultipler: 0  },  // Level 5: 70% paper, 30% scissors
    { paper: 5, scissors: 5, maxAmmo: 1, initialSpeedMultipler: 0  },  // Level 6: 80% paper, 20% scissors
];

// Control buttons
const fastForwardBtn = document.getElementById('fastForwardBtn');
const restartBtn = document.getElementById('restartBtn');
const restartLevelBtn = document.getElementById('restartLevelBtn');  // New restart level button

// Center bottom position for rock spawning
const rockStartX = canvas.width / 2;
const rockStartY = canvas.height - objectRadius;


// Mouse controls for shooting and angle
canvas.addEventListener('mousedown', (event) => {
    if (!gameOver && remainingAmmo > 0) {  // Only shoot if ammo is left and game is not over
        isShooting = true;
        updateShootAngle(event);
        startRockStream();

        if (!gameStarted) {
            startObjectMovement();  // Start object movement on first click
            gameStarted = true;
        }
    } else if (gameOver) {
        // Handle clicking for next level or restart after the game ends
        if (levelWon && level < maxLevels) {  // Only allow level up if the player won
            levelUp();
        } else {
            restartGame();  // Restart entire game if all levels are completed or user lost
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        updateShootAngle(event);  // Continuously update angle based on mouse movement
    }
});

canvas.addEventListener('mouseup', () => {
    isShooting = false;
    clearInterval(streamInterval);  // Stop the stream when the mouse is released
});

// Restart button event listener
restartBtn.addEventListener('click', () => {
    restartGame();  // Restart the game (goes back to level 1)
});

// Restart level button event listener
restartLevelBtn.addEventListener('click', () => {
    restartCurrentLevel();  // Restart the current level
});

// Fast Forward button event listener
fastForwardBtn.addEventListener('click', () => {
    fastForward = true;  // Enable fast forward mode
    fastForwardBtn.style.display = 'none';  // Hide fast forward button
});

// Function to update the shooting angle based on mouse position
function updateShootAngle(event) {
    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    // Calculate angle between the rock start point and the mouse
    shootAngle = Math.atan2(targetY - rockStartY, targetX - rockStartX);
}

// Function to shoot rocks continuously while mouse is held down
function startRockStream() {
    if (streamInterval) {
        clearInterval(streamInterval);  // Ensure any previous interval is cleared
    }

    streamInterval = setInterval(() => {
        if (remainingAmmo > 0) {
            objects.push({
                x: rockStartX,
                y: rockStartY,
                dx: initialRockSpeed * Math.cos(shootAngle),
                dy: initialRockSpeed * Math.sin(shootAngle),
                type: 'rock'
            });
            remainingAmmo--;
        } else {
            clearInterval(streamInterval);
        }
    }, 100);
}


// Function to draw objects (rock/paper/scissors)
function drawObjects() {
    objects.forEach((obj) => {
        let img;
        if (obj.type === 'rock') {
            img = rockImg;
        } else if (obj.type === 'paper') {
            img = paperImg;
        } else {
            img = scissorsImg;
        }
        ctx.drawImage(img, obj.x - objectRadius, obj.y - objectRadius, objectRadius * 2, objectRadius * 2);

        // Draw directional arrow before the game starts
        if (!gameStarted) {
            drawArrow(obj);
        }
    });
}

// Draw larger arrows for object movement direction
function drawArrow(obj) {
    const arrowLength = 20;  // Increased arrow length for visibility
    const arrowHeadLength = 12;

    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(obj.x + obj.dx * arrowLength, obj.y + obj.dy * arrowLength);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(obj.dy, obj.dx);
    ctx.beginPath();
    ctx.moveTo(obj.x + obj.dx * arrowLength, obj.y + obj.dy * arrowLength);
    ctx.lineTo(
        obj.x + obj.dx * arrowLength - arrowHeadLength * Math.cos(angle - Math.PI / 6),
        obj.y + obj.dy * arrowLength - arrowHeadLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        obj.x + obj.dx * arrowLength - arrowHeadLength * Math.cos(angle + Math.PI / 6),
        obj.y + obj.dy * arrowLength - arrowHeadLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(obj.x + obj.dx * arrowLength, obj.y + obj.dy * arrowLength);
    ctx.fillStyle = '#333';
    ctx.fill();
}

// Draw trajectory dotted line and small rock icon
function drawTrajectoryLine() {
    if (remainingAmmo > 0) {
        // Draw small rock icon at the base of the line
        const rockIconSize = 40;  // Size of the rock icon
        ctx.drawImage(rockImg, rockStartX - rockIconSize / 2, rockStartY - rockIconSize / 2, rockIconSize, rockIconSize);

        // Draw the dotted line showing the trajectory
        ctx.beginPath();
        ctx.setLineDash([5, 5]); // Create dotted line
        ctx.moveTo(rockStartX, rockStartY);
        ctx.lineTo(rockStartX + Math.cos(shootAngle) * 100, rockStartY + Math.sin(shootAngle) * 100); // Extend line for visual indication
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
    }
}

// Draw remaining ammo
function drawAmmoCount() {
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';  // Ensure the text starts from the left edge
    ctx.fillText(`Rock ammo: ${remainingAmmo}`, 20, 30);
}

// Function to display the current level
function drawLevel() {
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';
    ctx.fillText(`Level: ${level}`, canvas.width - 20, 30);
}

// Function to update positions and handle bouncing
function updateObjects() {
    // Update positions and bounce for all objects
    const speedMultiplier = fastForward ? 3 : 1;  // Speed up if fast forward is enabled

    objects.forEach((obj) => {
        obj.x += obj.dx * speedMultiplier;
        obj.y += obj.dy * speedMultiplier;
        bounceOffWalls(obj);
    });

    // Check collisions after all positions are updated
    objects.forEach((currentObj) => {
        objects.forEach((otherObj) => {
            if (currentObj !== otherObj && isColliding(currentObj, otherObj)) {
                resolveCollision(currentObj, otherObj);
            }
        });
    });

    // Check if the game has been won or lost
    checkGameOver();
}

// Function to handle bouncing off walls
function bounceOffWalls(obj) {
    if (obj.x + objectRadius > canvas.width || obj.x - objectRadius < 0) {
        obj.dx = -obj.dx;
    }
    if (obj.y + objectRadius > canvas.height || obj.y - objectRadius < 0) {
        obj.dy = -obj.dy;
    }
}

// Function to resolve collisions and change both objects' type
function resolveCollision(currentObj, otherObj) {
    // Apply the collision logic: both objects change into the same type
    if (currentObj.type === 'rock' && otherObj.type === 'paper') {
        currentObj.type = 'paper';
        otherObj.type = 'paper';
    } else if (currentObj.type === 'rock' && otherObj.type === 'scissors') {
        currentObj.type = 'rock';
        otherObj.type = 'rock';
    } else if (currentObj.type === 'paper' && otherObj.type === 'scissors') {
        currentObj.type = 'scissors';
        otherObj.type = 'scissors';
    }
}

// Helper function to detect collision
function isColliding(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < objectRadius * 2 - 5;  // Add a slight buffer to prevent constant collision
}

// Function to create initial objects (paper and scissors) based on the level
function createInitialObjects() {
    const settings = levelSettings[level - 1];  // Get the settings for the current level
    const { paper, scissors, maxAmmo, initialSpeedMultipler } = settings;
    
    // Reset game status and fastForward
    levelWon = false;  // Reset win flag at the start of each level
    fastForward = false;  // Ensure fast forward is off at the start
    fastForwardBtn.style.display = 'none';  // Ensure fast forward button is hidden

    objects = [];  // Clear existing objects

    // Create paper objects
    for (let i = 0; i < paper; i++) {
        const dx_init = (Math.random() - 0.5) * initialSpeed;
        objects.push({
            x: (Math.random() * 0.9 + 0.05) * canvas.width,
            y: (Math.random() * 0.9 + 0.05) * canvas.height,
            dx: dx_init*initialSpeedMultipler,
            dy: Math.sign(Math.random() - 0.5) * (initialSpeed - Math.abs(dx_init))*initialSpeedMultipler,
            type: 'paper',
        });
    }

    // Create scissors objects
    for (let i = 0; i < scissors; i++) {
        const dx_init = (Math.random() - 0.5) * initialSpeed;
        objects.push({
            x: (Math.random() * 0.9 + 0.05) * canvas.width,
            y: (Math.random() * 0.9 + 0.05) * canvas.height,
            dx: dx_init*initialSpeedMultipler,
            dy: Math.sign(Math.random() - 0.5) * (initialSpeed - Math.abs(dx_init))*initialSpeedMultipler,
            type: 'scissors',
        });
    }
}

// Function to start object movement after the user starts shooting
function startObjectMovement() {
    // Movement already set, so no need to change dx/dy
}

// Function to check if the game is over
function checkGameOver() {
    const rockCount = objects.filter(obj => obj.type === 'rock').length;
    const paperCount = objects.filter(obj => obj.type === 'paper').length;
    const scissorsCount = objects.filter(obj => obj.type === 'scissors').length;

    // Check if all objects have become rocks (win the level)
    if (rockCount === objects.length) {
        levelWon = true;  // Set win flag to true
        if (level < maxLevels) {
            endGame('You win this level! Click to proceed to the next level.');
        } else {
            endGame('You completed all levels! Click to restart the game.');
        }
    } else if (scissorsCount === objects.length || paperCount === objects.length) {
        levelWon = false;  // Set win flag to false
        endGame('You lose! Click to restart the level.');
    }
}

// Function to progress to the next level
function levelUp() {
    cancelAnimationFrame(requestId);  // Stop the previous loop
    level++;
    const settings = levelSettings[level - 1];  // Get the settings for the current level
    const { paper, scissors, maxAmmo, initialSpeedMultipler } = settings;
    remainingAmmo = maxAmmo;  // Reset ammo for the new level
    gameOver = false;  // Reset game over state
    fastForward = false;  // Reset fast forward
    gameStarted = false;
    fastForwardBtn.style.display = 'none';  // Hide fast forward button
    createInitialObjects();  // Create new objects for the next level
    gameLoop();  // Restart game loop
}


// Function to end the game and show restart button
function endGame(message) {
    gameOver = true;

    // Stop further updates
    cancelAnimationFrame(requestId);  // Stop the game loop

    // Store the end message for display
    endMessage = message;

    // Clear the canvas and show the end game message
    drawEndMessage();
}

// Function to draw the end game message on screen
function drawEndMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    drawObjects();  // Redraw the objects before showing the message

    // Draw black background for the message
    ctx.fillStyle = '#000';  // Black background
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);  // Background box

    // Draw white end game message text
    ctx.font = '25px Verdana';
    ctx.fillStyle = '#FFF';  // White text color
    ctx.textAlign = 'center';  // Center align the text
    ctx.fillText(endMessage, canvas.width / 2, canvas.height / 2 + 10);  // Center the text vertically
}

// Function to restart the game or current level
function restartGame() {
    cancelAnimationFrame(requestId);  // Stop the previous loop

    if (levelWon && level >= maxLevels) {
        level = 1;  // Reset to level 1 only if the player has completed all levels
    }

    const settings = levelSettings[level - 1];  // Get the settings for the current level
    const { maxAmmo } = settings;

    // Reset game variables
    remainingAmmo = maxAmmo;
    gameOver = false;
    isShooting = false; // Reset shooting flag
    gameStarted = false; // Reset gameStarted flag
    fastForward = false;
    fastForwardBtn.style.display = 'none';  // Hide fast forward button
    clearInterval(streamInterval);  // Clear any existing intervals

    createInitialObjects();  // Recreate objects for the current level
        // Add a short delay before allowing new input
    setTimeout(() => {
        gameLoop();  // Start the game loop after delay
    }, 100);  // 100ms delay to prevent accidental input
}

// Function to restart the current level
function restartCurrentLevel() {
    cancelAnimationFrame(requestId);  // Stop the previous loop

    const settings = levelSettings[level - 1];  // Get the settings for the current level
    const { maxAmmo } = settings;

    remainingAmmo = maxAmmo;
    gameOver = false;
    isShooting = false;  // Reset shooting flag
    gameStarted = false;  // Reset gameStarted flag
    fastForward = false;
    fastForwardBtn.style.display = 'none';  // Hide fast forward button
    clearInterval(streamInterval);  // Clear any existing intervals

    createInitialObjects();  // Recreate objects for the current level
    
    // Add a short delay before allowing new input
    setTimeout(() => {
        gameLoop();  // Start the game loop after delay
    }, 100);  // 100ms delay to prevent accidental input
}

let requestId;

// Game loop
function gameLoop() {
    
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
        drawObjects();    // Draw all objects (rocks, paper, scissors)
        if (gameStarted) {
            updateObjects();  // Update positions if the game has started
        }
        drawAmmoCount();  // Draw remaining ammo count
        drawTrajectoryLine();  // Show the shooting direction when mouse moves
        drawLevel();  // Show the current level
    } else {
        checkGameOver();
    }

    if (remainingAmmo === 0 && !gameOver && !fastForward) {
        fastForwardBtn.style.display = 'inline';  // Display fast forward button
    }

    requestId = requestAnimationFrame(gameLoop);  // Keep looping the game
}

// Initialize the game
createInitialObjects();
gameLoop();
