// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// LEVEL DATA HERE 
const levelData = [
    {
        level: 1,
        maxAmmo: 10,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'scissors', x: 0.2, y: 0.5, dx: 0.8, dy: -0.6 },
            { type: 'paper', x: 0.8, y: 0.5, dx: -0.8, dy: -0.6 }
        ],
        walls: []
    },
    {
        level: 2,
        maxAmmo: 10,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'paper', x: .2, y: .2, dx: 0.6, dy: 0.8 },
            { type: 'scissors', x: .3, y: .8, dx: -0.8, dy: 0.8 },
            { type: 'paper', x: .5, y: .5, dx: 0.9, dy: -0.2 },
        ]
    },
    {
        level: 3,
        maxAmmo: 10,
        initialSpeedMultipler: 0.5,
        objects: [
            { type: 'scissors', x: .1, y: .6, dx: -1.0, dy: 0.0 },
            { type: 'scissors', x: .2, y: .7, dx: -1.0, dy: 0.0 },
            { type: 'paper', x: .3, y: .8, dx: -1.0, dy: 0.0 },
            { type: 'paper', x: .4, y: .9, dx: -1.0, dy: 0.0 }
        ]
    },
    {
        level: 4,
        maxAmmo: 10,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'paper', x: .5, y: .1, dx: 0.8, dy: 0.5 },
            { type: 'paper', x: .2, y: .9, dx: 0.2, dy: -1.0 },
            { type: 'paper', x: .2, y: .1, dx: -0.6, dy: 1.0 },
            { type: 'scissors', x: .7, y: .1, dx: -0.2, dy: 1. },
            { type: 'scissors', x: .4, y: .7, dx: 1.0, dy: -1.0 },
            { type: 'scissors', x: .9, y: .8, dx: -0.8, dy: -0.4 }
        ]
    },
    {
        level: 5,
        maxAmmo: 10,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'paper', x: .1, y: .1, dx: 0.0, dy: 1.0 },
            { type: 'paper', x: .2, y: .9, dx: 0.0, dy: -1.0 },
            { type: 'paper', x: .3, y: .1, dx: 0.0, dy: 1.0 },
            { type: 'paper', x: .4, y: .9, dx: 0.0, dy: -1.0 },
            { type: 'scissors', x: .6, y: .9, dx: 0.0, dy: -1.0 },
            { type: 'scissors', x: .7, y: .1, dx: -0.0, dy: 1. },
            { type: 'scissors', x: .8, y: .9, dx: 0.0, dy: -1.0 },
            { type: 'scissors', x: .9, y: .1, dx: -0.0, dy: 1. }
        ]
    },
    {
        level: 6,
        maxAmmo: 10,
        initialSpeedMultipler: 0.75,
        objects: [
            { type: 'scissors', x: 0.12, y: 0.93, dx: 0.92, dy: 0.46 },
            { type: 'scissors', x: 0.65, y: 0.51, dx: 0.76, dy: -0.64 },
            { type: 'scissors', x: .33, y: .67, dx: -0.92, dy: -0.31 },
            { type: 'scissors', x: .18, y: .47, dx: -0.27, dy: -0.61 },
            { type: 'paper', x: .62, y: .05, dx: 0.02, dy: 0.04 },
            { type: 'paper', x: .38, y: .94, dx: -0.79, dy: 0.4 },
            { type: 'paper', x: .87, y: .38, dx: -0.4, dy: 0.42 },
            { type: 'paper', x: .92, y: .96, dx: 0.98, dy: -0.34 }
        ]
    },
    {
        level: 7,
        maxAmmo: 10,
        initialSpeedMultipler: 0.75,
        objects: [
            { type: 'scissors', x: .5, y: .6, dx: 0.0, dy: 1.0 },
            { type: 'scissors', x: .5, y: .4, dx: 0.0, dy: -1.0 },
            { type: 'scissors', x: .4, y: .5, dx: -1.0, dy: 0.0 },
            { type: 'scissors', x: .6, y: .5, dx: 1.0, dy: 0.0 },
            { type: 'paper', x: .4, y: .4, dx: -0.5, dy: -0.5 },
            { type: 'paper', x: .4, y: .6, dx: -0.5, dy: 0.5 },
            { type: 'paper', x: .6, y: .6, dx: 0.5, dy: 0.5 },
            { type: 'paper', x: .6, y: .4, dx: 0.5, dy: -0.5 }
        ]
    },
    {
        level: 8,
        maxAmmo: 4,
        initialSpeedMultipler: 0.0,
        objects: [
            { type: 'scissors', x: .5, y: .6, dx: -1.0, dy: 0.0 },
            { type: 'scissors', x: .2, y: .7, dx: -1.0, dy: 0.0 },
            { type: 'paper', x: .3, y: .8, dx: -1.0, dy: 0.0 },
            { type: 'paper', x: .7, y: .3, dx: -1.0, dy: 0.0 }
        ]
    },
    {
        level: 9,
        maxAmmo: 4,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'scissors', x: .5, y: .6, dx: -1.0, dy: 0.5 },
            { type: 'scissors', x: .2, y: .7, dx: -1.0, dy: -0.8 },
            { type: 'paper', x: .3, y: .8, dx: -1.0, dy: 2.0 },
            { type: 'paper', x: .7, y: .3, dx: 1.0, dy: 2.0 }
        ],
        walls: [ // New feature: walls
            { x1: .290, y1: .400, x2: .290, y2: .500, thickness: .010 }, // Vertical wall
            { x1: .710, y1: .400, x2: .710, y2: .500, thickness: .010 }, // Vertical wall
            { x1: .300, y1: .380, x2: .710, y2: .380, thickness: .010 },  // Horizontal wall
            { x1: .300, y1: .510, x2: .710, y2: .510, thickness: .010 }  // Horizontal wall
        ]
    },
    {
        level: 10,
        maxAmmo: 5,
        initialSpeedMultipler: 1.0,
        objects: [
            { type: 'scissors', x: .1, y: .1, dx: 0.4, dy: 1.0 },
            { type: 'paper', x: .2, y: .1, dx: 0.4, dy: 1.0 },
            { type: 'scissors', x: .3, y: .1, dx: 0.4, dy: 1.0 },
            { type: 'paper', x: .4, y: .1, dx: 0.4, dy: 1.0 },
            { type: 'scissors', x: .5, y: .1, dx: 0.4, dy: 1.0 },
            { type: 'paper', x: .6, y: .1, dx: 0.4, dy: 1. },
        ],
        walls: [ // New feature: walls
            { x1: .000, y1: .500, x2: .810, y2: .500, thickness: .010 }  // Horizontal wall
        ]
    },
        {
            level: 11,
            maxAmmo: 6,
            initialSpeedMultipler: 1.0,
            objects: [
                { type: 'paper', x: .2, y: .2, dx: 0.6, dy: 0.8 },
                { type: 'scissors', x: .8, y: .2, dx: -0.6, dy: 0.8 },
                { type: 'paper', x: .4, y: .8, dx: 0, dy: -0.5 },
                { type: 'rock', x: .6, y: .5, dx: -0.8, dy: 0 },
            ],
            walls: [
                { x1: .250, y1: .300, x2: .750, y2: .300, thickness: .010 },  // Horizontal wall
                { x1: .500, y1: .300, x2: .500, y2: .700, thickness: .010 },  // Vertical wall
            ]
        },
        {
            level: 12,
            maxAmmo: 5,
            initialSpeedMultipler: 0.8,
            objects: [
                { type: 'scissors', x: .1, y: .9, dx: 1.0, dy: -0.6 },
                { type: 'paper', x: .9, y: .1, dx: -1.0, dy: 0.6 },
                { type: 'rock', x: .5, y: .5, dx: 0.5, dy: -0.5 },
            ],
            walls: [
                { x1: .360, y1: .410, x2: .740, y2: .410, thickness: .010 },  // Horizontal wall (middle)
                { x1: .260, y1: .600, x2: .740, y2: .600, thickness: .010 },  // Horizontal wall (bottom)
                { x1: .250, y1: .410, x2: .250, y2: .590, thickness: .010 },  // Vertical wall (left)
                { x1: .750, y1: .410, x2: .750, y2: .590, thickness: .010 },  // Vertical wall (right)
            ]
        },
        {
            level: 13,
            maxAmmo: 7,
            initialSpeedMultipler: 1.0,
            objects: [
                { type: 'scissors', x: .2, y: .2, dx: 0.7, dy: 0.3 },
                { type: 'scissors', x: .8, y: .2, dx: -0.7, dy: 0.3 },
                { type: 'paper', x: .4, y: .8, dx: 0, dy: -0.6 },
            ],
            walls: [
                { x1: .250, y1: .500, x2: .500, y2: .500, thickness: .010 },  // Horizontal wall (top left)
                { x1: .500, y1: .500, x2: .500, y2: .800, thickness: .010 },  // Vertical wall (bottom left)
                { x1: .500, y1: .800, x2: .750, y2: .800, thickness: .010 },  // Horizontal wall (bottom right)
                { x1: .750, y1: .500, x2: .750, y2: .800, thickness: .010 },  // Vertical wall (top right)
            ]
        },
        {
            level: 14,
            maxAmmo: 8,
            initialSpeedMultipler: 1.0,
            objects: [
                { type: 'rock', x: .2, y: .2, dx: 0.6, dy: 0.6 },
                { type: 'paper', x: .8, y: .2, dx: -0.6, dy: 0.6 },
                { type: 'scissors', x: .2, y: .8, dx: 0.6, dy: -0.6 },
                { type: 'rock', x: .8, y: .8, dx: -0.6, dy: -0.6 },
            ],
            walls: [
                { x1: .500, y1: .200, x2: .500, y2: .800, thickness: .020 },  // Vertical wall (middle)
                { x1: .300, y1: .400, x2: .700, y2: .400, thickness: .010 },  // Horizontal wall (top)
                { x1: .300, y1: .600, x2: .700, y2: .600, thickness: .010 },  // Horizontal wall (bottom)
            ]
        },
        {
            level: 15,
            maxAmmo: 6,
            initialSpeedMultipler: 0.9,
            objects: [
                { type: 'rock', x: .5, y: .5, dx: 0.7, dy: 0 },
                { type: 'scissors', x: .2, y: .2, dx: 0.5, dy: 0.5 },
                { type: 'paper', x: .8, y: .2, dx: -0.5, dy: 0.5 },
                { type: 'rock', x: .2, y: .8, dx: 0.5, dy: -0.5 },
                { type: 'paper', x: .8, y: .8, dx: -0.5, dy: -0.5 },
            ],
            walls: [
                { x1: .100, y1: .500, x2: .900, y2: .500, thickness: .010 },  // Horizontal wall (middle)
                { x1: .500, y1: .200, x2: .500, y2: .800, thickness: .010 },  // Vertical wall (middle)
            ]
        }
    
];

let objectRadius = 10;
let initialSpeed = 6;  // Standardized speed for all objects, matching rock speed
let initialRockSpeed = 6;
let buffer = 5;
const maxAmmo = 10;  // Start with 10 rocks to shoot

// Function to check if the user is on a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
        
    // // Set canvas size based on screen size
    // function adjustCanvasSize() {
    //     canvas.width = window.innerWidth * 0.8;  // Set canvas width to 90% of the screen width
    //     canvas.height = window.innerHeight * 0.7;  // Set canvas height to 70% of the screen height
    // }

    function adjustCanvasSize() {
        canvas.width = window.innerWidth * 0.95;  // 95% of the viewport width
        canvas.height = window.innerHeight * 0.8;   // 80% of the viewport height
    }

    window.addEventListener('resize', adjustCanvasSize);  // Adjust canvas size when window is resized
    adjustCanvasSize();  // Call on page load

    // Mouse and touch controls for shooting and angle
    canvas.addEventListener('mousedown', (event) => handleInputStart(event));
    canvas.addEventListener('mousemove', (event) => handleInputMove(event));
    canvas.addEventListener('mouseup', () => handleInputEnd());

    // Touch controls for mobile
    // canvas.addEventListener('touchstart', function(event) {
    //     event.preventDefault();  // Prevent scrolling on touch
    //     handleInputStart(event.touches[0]);  // Handle aiming/shooting
        
    //     // Handle clicking for the next level or restarting the game on touch
    //     if (gameOver) {
    //         if (levelWon && level < maxLevels) {
    //             levelUp();
    //         } else {
    //             restartGame();
    //         }
    //     }
    // }, { passive: false });

    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();  // Prevent scrolling on touch
        const touch = event.touches[0];
        updateShootAngle(touch); // Update aiming based on the touch position
        
        if (!gameOver && remainingAmmo > 0) {
            // Fire one rock immediately on tap
            objects.push({
                x: rockStartX,
                y: rockStartY,
                dx: initialRockSpeed * Math.cos(shootAngle),
                dy: initialRockSpeed * Math.sin(shootAngle),
                type: 'rock'
            });
            remainingAmmo--;
            
            // Then start the continuous shooting stream if the user holds down
            startRockStream();
            
            // If this is the first touch, start the object movement
            if (!gameStarted) {
                startObjectMovement();
                gameStarted = true;
            }
        } else if (gameOver) {
            // If the game is over, handle level progression or restart
            if (levelWon && level < maxLevels) {
                levelUp();
            } else {
                restartGame();
            }
        }
    }, { passive: false });
    
    

    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();  // Prevent scrolling on touch
        handleInputMove(event.touches[0]);  // Handle movement for aiming
    }, { passive: false });

    canvas.addEventListener('touchend', function(event) {
        event.preventDefault();  // Prevent scrolling on touch
        handleInputEnd();  // Handle the end of touch for shooting
    }, { passive: false });


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

    objectRadius = 12;
    initialSpeed = 3;  // Standardized speed for all objects, matching rock speed
    initialRockSpeed = 3;
    buffer = 7;
} else {

    canvas.addEventListener('mousemove', (event) => {
        if (!gameOver) {
            updateShootAngle(event);  // Continuously update angle based on mouse movement
        }
    });

    canvas.addEventListener('mouseup', () => {
        isShooting = false;
        clearInterval(streamInterval);  // Stop the stream when the mouse is released
    });

    objectRadius = 20;
    initialSpeed = 6;  // Standardized speed for all objects, matching rock speed
    initialRockSpeed = 6;
    buffer = 5;
}

//         // Mouse controls for shooting and angle
// canvas.addEventListener('mousedown', (event) => {
//     if (!gameOver && remainingAmmo > 0) {  // Only shoot if ammo is left and game is not over
//         isShooting = true;
//         updateShootAngle(event);
//         startRockStream();

//         if (!gameStarted) {
//             startObjectMovement();  // Start object movement on first click
//             gameStarted = true;
//         }
//     } else if (gameOver) {
//         // Handle clicking for next level or restart after the game ends
//         if (levelWon && level < maxLevels) {  // Only allow level up if the player won
//             levelUp();
//         } else {
//             restartGame();  // Restart entire game if all levels are completed or user lost
//         }
//     }
// });


canvas.addEventListener('mousedown', (event) => {
    if (!gameOver && remainingAmmo > 0) {  
        isShooting = true;
        updateShootAngle(event);

        // Fire one rock immediately:
        if (remainingAmmo > 0) {
            objects.push({
                x: rockStartX,
                y: rockStartY,
                dx: initialRockSpeed * Math.cos(shootAngle),
                dy: initialRockSpeed * Math.sin(shootAngle),
                type: 'rock'
            });
            remainingAmmo--;
        }
        
        // Then start the continuous shooting stream if the mouse remains held
        startRockStream();

        if (!gameStarted) {
            startObjectMovement();
            gameStarted = true;
        }
    } else if (gameOver) {
        // Handle level progression or restart
        if (levelWon && level < maxLevels) {
            levelUp();
        } else {
            restartGame();
        }
    }
});


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
const maxLevels = 20;  // Define how many levels there are
let endMessage = ''; // Store end message

// Control buttons
const fastForwardBtn = document.getElementById('fastForwardBtn');
const restartBtn = document.getElementById('restartBtn');
const restartLevelBtn = document.getElementById('restartLevelBtn');  // New restart level button
const nextLevelBtn = document.getElementById('nextLevelBtn');

// Center bottom position for rock spawning
const rockStartX = canvas.width / 2;
const rockStartY = canvas.height - objectRadius;

// Restart level button event listener
nextLevelBtn.addEventListener('click', () => {
    levelUp();  // Restart the current level
});

// Restart button event listener
restartBtn.addEventListener('click', () => {
    level = 1
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
// function updateShootAngle(event) {
//     const rect = canvas.getBoundingClientRect();
//     const targetX = event.clientX - rect.left;
//     const targetY = event.clientY - rect.top;

//     // Calculate angle between the rock start point and the mouse
//     shootAngle = Math.atan2(targetY - rockStartY, targetX - rockStartX);
// }

function updateShootAngle(event) {
    const rect = canvas.getBoundingClientRect();  // Get canvas bounds relative to the viewport
    const targetX = (event.clientX - rect.left) * (canvas.width / rect.width);  // Adjust for canvas scaling
    const targetY = (event.clientY - rect.top) * (canvas.height / rect.height);  // Adjust for canvas scaling

    // Calculate the angle between the rock start point and the touch/click position
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
        const currentLevel = levelData.find(lvl => lvl.level === level);
        // Draw directional arrow before the game starts
        if (!gameStarted) {
            if (currentLevel.initialSpeedMultipler != 0) {
                drawArrow(obj);
            }
        }
    });
}

function drawWalls(walls) {
    ctx.fillStyle = '#000'; // Wall color
    walls.forEach(wall => {
        const xStart = wall.x1 * canvas.width; // Scale x1
        const yStart = wall.y1 * canvas.height; // Scale y1
        const xEnd = wall.x2 * canvas.width; // Scale x2
        const yEnd = wall.y2 * canvas.height; // Scale y2

        // Determine width and height for the wall
        const width = xEnd - xStart || wall.thickness * canvas.width; // Thickness for vertical walls
        const height = yEnd - yStart || wall.thickness * canvas.height; // Thickness for horizontal walls

        // Draw the wall
        ctx.fillRect(xStart, yStart, width, height);
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
        const rockIconSize = 2*objectRadius;  // Size of the rock icon
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
    if (isMobileDevice()) {
        ctx.font = '14px Verdana';
    } else {
        ctx.font = '20px Verdana'; 
    }
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';  // Ensure the text starts from the left edge
    ctx.fillText(`Rock ammo: ${remainingAmmo}`, 20, 30);
}

// Function to display the current level
function drawLevel() {
    if (isMobileDevice()) {
        ctx.font = '14px Verdana';
    } else {
        ctx.font = '20px Verdana'; 
    }
    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';
    ctx.fillText(`Level: ${level}`, canvas.width - 20, 30);
}

// Function to update positions and handle bouncing
function updateObjects() {
    // Update positions and bounce for all objects
    const speedMultiplier = fastForward ? 3 : 1;  // Speed up if fast forward is enabled

    const currentWalls = levelData.find(lvl => lvl.level === level).walls || [];

    objects.forEach((obj) => {
        obj.x += obj.dx * speedMultiplier;
        obj.y += obj.dy * speedMultiplier;
        bounceOffWalls(obj);
        if (currentWalls.length != 0) {
            handleWallCollisions(obj, currentWalls); // Handle wall collisions
        }
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


function handleWallCollisions(obj, walls) {
    walls.forEach(wall => {
        const xStart = wall.x1 * canvas.width;
        const yStart = wall.y1 * canvas.height;
        const xEnd = wall.x2 * canvas.width;
        const yEnd = wall.y2 * canvas.height;

        const isHorizontal = yStart === yEnd; // Check if the wall is horizontal
        const isVertical = xStart === xEnd;   // Check if the wall is vertical

        if (isVertical) {
            // Collision with vertical wall
            if (
                obj.x + objectRadius > xStart && // Object's right side past wall's x
                obj.x - objectRadius < xStart && // Object's left side before wall's x
                obj.y + objectRadius > yStart && // Object's bottom past wall's top
                obj.y - objectRadius < yEnd      // Object's top before wall's bottom
            ) {
                obj.dx = -obj.dx; // Reverse horizontal direction
                // Adjust position to prevent sticking
                if (obj.x < xStart) {
                    obj.x = xStart - objectRadius;
                } else {
                    obj.x = xStart + objectRadius;
                }
            }
        } else if (isHorizontal) {
            // Collision with horizontal wall
            if (
                obj.y + objectRadius > yStart && // Object's bottom past wall's y
                obj.y - objectRadius < yStart && // Object's top before wall's y
                obj.x + objectRadius > xStart && // Object's right side past wall's left edge
                obj.x - objectRadius < xEnd      // Object's left side before wall's right edge
            ) {
                obj.dy = -obj.dy; // Reverse vertical direction
                // Adjust position to prevent sticking
                if (obj.y < yStart) {
                    obj.y = yStart - objectRadius;
                } else {
                    obj.y = yStart + objectRadius;
                }
            }
        }
    });
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
    return distance < objectRadius * 2 - buffer;  // Add a slight buffer to prevent constant collision
}

// Function to create initial objects (paper and scissors) based on the level
async function createInitialObjects() {    
    
    // Reset game status and fastForward
    levelWon = false;  // Reset win flag at the start of each level
    fastForward = false;  // Ensure fast forward is off at the start
    fastForwardBtn.style.display = 'none';  // Ensure fast forward button is hidden

    objects = [];  // Clear existing objects

    // await loadLevels();
    const currentLevel = levelData.find(lvl => lvl.level === level);
    
    if (currentLevel) {
        remainingAmmo = currentLevel.maxAmmo || 10;  // Default to 10 if undefined

        // Create objects based on level data
        currentLevel.objects.forEach(obj => {
            objects.push({
                x: obj.x* canvas.width,
                y: obj.y* canvas.height,
                dx: obj.dx * initialSpeed*currentLevel.initialSpeedMultipler/Math.sqrt(obj.dx*obj.dx + obj.dy*obj.dy),
                dy: obj.dy * initialSpeed*currentLevel.initialSpeedMultipler/Math.sqrt(obj.dx*obj.dx + obj.dy*obj.dy),
                type: obj.type
            });
        });
        gameOver = false;
        gameStarted = false;
        levelWon = false;
    } else {
        console.warn(`Level ${level} data not found.`);
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
            endGame('You win! Click to proceed to the next level.');
            clearInterval(streamInterval);  // Clear any existing intervals
        } else {
            endGame('You completed all levels! Click to restart the game.');
            clearInterval(streamInterval);  // Clear any existing intervals
        }
    } else if (scissorsCount === objects.length || paperCount === objects.length) {
        levelWon = false;  // Set win flag to false
        endGame('You lose! Click to restart the level.');
        clearInterval(streamInterval);  // Clear any existing intervals
    }
}

// Function to progress to the next level
function levelUp() {
    cancelAnimationFrame(requestId);  // Stop the previous loop
    level++;
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
    if (isMobileDevice()) {
        ctx.font = '12px Verdana';
    } else {
        ctx.font = '25px Verdana'; 
    }
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

        // Draw walls if they exist for the current level
        const currentLevel = levelData.find(lvl => lvl.level === level);
        if (currentLevel.walls && currentLevel.walls.length > 0) {
            drawWalls(currentLevel.walls);
        }

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
