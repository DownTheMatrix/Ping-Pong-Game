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

const winningScore = 3;

// Paddles
let paddle1Y = 250;
let paddle2Y = 250;
const paddle_height = 100;
const paddle_thickness = 10;

// AI
let opponentIq = 15;

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
    if (player1Score >= winningScore || player2Score >= winningScore) {
        player1Score = 0;
        player2Score = 0;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

// Wait for the whole content to be loaded and initialize
document.addEventListener('DOMContentLoaded', function(){
    canvas = document.querySelector('#game-canvas');
    canvasContext = canvas.getContext('2d');

    // Set frame per seconds
    let fps = 30;

    // Redraw the screen
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / fps);

    // Listen for mouse movement on canvas
    canvas.addEventListener('mousemove', 
        function(evt) {
            let mousePos = calculateMousePosition(evt);
            paddle1Y = mousePos.y - (paddle_height / 2);
        })
    });

    // AI logic
    function computerMovement() {
        const paddle2YCenter = paddle2Y + (paddle_height / 2);
        if (paddle2YCenter < ballY - 35) {
            paddle2Y += opponentIq;

        // Ignore chasing the ball while it's within 35 px above or below the paddle center position
        } else if (paddle2YCenter > ballY + 35) {
            paddle2Y -= opponentIq;
        }
    }

// Move the elements on canvas
function moveEverything() {
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

// Draw elements
function drawEverything() {

     // Draw canvas
    colorRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw left side paddle
    colorRect(0, paddle1Y, paddle_thickness, paddle_height, '#fff');

    // Draw right side paddle
    colorRect(canvas.width - paddle_thickness, paddle2Y, 10, paddle_height, '#fff');

    // Draw ball
    colorCircle(ballX, ballY, 10, '#fff');

    // Draw score
    canvasContext.font = '24px Arial';
    canvasContext.fillText('Player 1', 80, 130);
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText('HAL 9000', canvas.width - 130, 130);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

// Define the ball
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

// Define the colors
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}