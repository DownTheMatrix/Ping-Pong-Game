/* Modal */
document.addEventListener('DOMContentLoaded', showModal);

function showModal() {
    const modal = document.querySelector('.md-modal');
    modal.classList.add('md-show');
}

// Canvas and canvas context
let canvas;
let canvasContext;

// Ball
let ballX = 50;
let ballY = 50;
let ballSpeedX = 15;
let ballSpeedY = 4;

// Score
let player1Score = 0;
let player2Score = 0;
const winningScore = 15;

// Pause when game is won
let showingWinScreen = false;

// Paddles
let paddle1Y = 250;
let paddle2Y = 250;
const paddle_height = 100;
const paddle_thickness = 10;

// Players names
let player1Name = "Guest Player";
let player2Name = "HAL 9000";

// Calculate the mouse position
function calculateMousePosition(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

// Reset ball position if misses paddle
function ballReset() {
    // Check winning condition
    if (player1Score >= winningScore || player2Score >= winningScore) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

// Function handleMouseClick()
function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

// Wait for the whole content to be loaded and initialize
document.addEventListener('DOMContentLoaded', function () {
    canvas = document.querySelector('#game-canvas');
    canvasContext = canvas.getContext('2d');

    // Set frame per seconds
    let fps = 30;

    // Redraw the screen
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / fps);

    // Listen for mouse down event
    canvas.addEventListener('mousedown', handleMouseClick);

    // Listen for mouse movement on canvas
    canvas.addEventListener('mousemove',
        function (evt) {
            let mousePos = calculateMousePosition(evt);
            paddle1Y = mousePos.y - (paddle_height / 2);
        })
});

/* AI Logic */
let opponentIq = 0;

const easyBtn = document.querySelector('#easy-md');
easyBtn.addEventListener('click', function() {
    opponentIq = 5;
    const modal = document.querySelector('.md-modal');
    modal.classList.add('md-hide');
});

const normalBtn = document.querySelector('#normal-md');
normalBtn.addEventListener('click', function() {
    opponentIq = 10;
    const modal = document.querySelector('.md-modal');
    modal.classList.add('md-hide');
});

const hardBtn = document.querySelector('#hard-md');
hardBtn.addEventListener('click', function() {
    opponentIq = 15;
    const modal = document.querySelector('.md-modal');
    modal.classList.add('md-hide');
});

function setDifficulty() {
    if (ai[0]["difficulty"] === "easy") {
        opponentIq = 5;
    } else if (ai[1]["difficulty"] === "normal") {
        opponentIq = 10;
    } else {
        opponentIq = 15;
    }
}

// AI Difficulty
function computerMovement() {
    const paddle2YCenter = paddle2Y + (paddle_height / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += opponentIq;

        // Ignore chasing the ball while it's within 35 px above or below the paddle center position
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= opponentIq;
    }
}

/* Game Core */
function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    // AI logic
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // The ball reaches the left side
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
            ballSpeedX = -ballSpeedX;

            const deltaY = ballY - (paddle1Y + paddle_height / 2);
            ballSpeedY = deltaY * 0.35;

        } else {
            player2Score++;
            ballReset();
        }
    }

    // The ball reaches the right side
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
            ballSpeedX = -ballSpeedX;

            const deltaY = ballY - (paddle2Y + paddle_height / 2);
            ballSpeedY = deltaY * 0.35;

        } else {
            player1Score++;
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

/* Draw Canvas */
function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, '#fff');
    }
}

// Draw elements
function drawEverything() {

    // Draw canvas
    colorRect(0, 0, canvas.width, canvas.height, '#000');

    // Show message on game won
    if (showingWinScreen) {
        canvasContext.fillStyle = '#fff';
        if (player1Score >= winningScore) {
            canvasContext.fillText(player1Name + " won!", 350, 200);
        } else if (player2Score >= winningScore) {
            canvasContext.fillText(player2Name + " won!", 350, 200);
        }
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }

    drawNet();

    // Draw left side paddle
    colorRect(0, paddle1Y, paddle_thickness, paddle_height, '#fff');

    // Draw right side paddle
    colorRect(canvas.width - paddle_thickness, paddle2Y, 10, paddle_height, '#fff');

    // Draw ball
    colorCircle(ballX, ballY, 10, '#fff');

    // Draw score
    canvasContext.font = '18px Arial';
    canvasContext.fillText(player1Name, 80, 130);
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Name, canvas.width - 130, 130);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

/* Ball */
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

/* Colors */
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}