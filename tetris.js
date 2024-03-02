// Tetris game logic goes here
const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const blockSize = 30;
const scoreElement = document.getElementById("score"); // Reference to the score element
console.log("scoreElement:", scoreElement);



// Define the Tetris board (represented as a 2D array)
const board = Array.from({ length: 20 }, () => Array(10).fill(""));

// Define the current Tetris piece
let tetrisPiece = generateRandomPiece();
let lastTime = 0;
let score = 0; // Initialize the score


// Function to draw a colored square on the canvas
function drawSquare(x, y, color) {
    if (color !== "") {
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
}


function clearCanvas() {
    ctx.fillStyle = "#222"; // Set your background color here
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to check for completed rows and clear them
function clearCompletedRows() {
    let clearedRows = 0;
    for (let row = 0; row < board.length; row++) {
        if (board[row].every((cell) => cell !== "")) {
            // Remove the completed row and add an empty row at the top
            board.splice(row, 1);
            board.unshift(Array(10).fill(""));
            clearedRows++;
        }
    }
    return clearedRows;
}


// Function to draw the current Tetris piece on the canvas
function drawPiece(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                drawSquare(piece.x + col, piece.y + row, piece.color);
            }
        }
    }
}

// Function to draw the entire Tetris board including landed blocks
function drawBoard() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            drawSquare(col, row, board[row][col]);
        }
    }
}

function tetrisGameLoop(timestamp) {
    console.log("Game loop is running");
    playAgainButton.style.display = "none";

    // Calculate time difference since the last frame
    const deltaTime = timestamp - lastTime;

    // Clear the canvas
    clearCanvas();

    // Draw the entire Tetris board
    drawBoard();

    // Draw the current Tetris piece
    drawPiece(tetrisPiece);

    // Move the Tetris piece down if it's not at the bottom
    if (canMoveDown(tetrisPiece)) {
        tetrisPiece.y += 0.04; // Use a fixed value for movement
    } else {
        // If the piece cannot move down, place it on the board
        placePieceOnBoard(tetrisPiece);

        // Check for completed rows and clear them
        const clearedRows = clearCompletedRows();

        // Update score based on cleared rows
        if (clearedRows > 0) {
            score += Math.pow(2, clearedRows - 1) * 100;
            updateScore(); // Update the score element
        }

        // Check for game over
        if (tetrisPiece.y === 0) {
            console.log("Game Over!");

            // Display "Play Again" button
            playAgainButton.style.display = "block";

            // Stop the game loop
            return;
        }

        // Generate a new Tetris piece
        tetrisPiece = generateRandomPiece();
    }

    lastTime = timestamp;

    requestAnimationFrame(tetrisGameLoop);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}
// Function to check if the Tetris piece can move down
function canMoveDown(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (
                piece.shape[row][col] &&
                ((board[Math.floor(piece.y) + row + 1] && board[Math.floor(piece.y) + row + 1][piece.x + col] !== "") ||
                Math.floor(piece.y) + row + 1 === board.length)
            ) {
                return false; // Collision detected below or reached the bottom
            }
        }
    }
    return Math.floor(piece.y) + piece.shape.length < board.length;
}

// Function to place the Tetris piece on the board
function placePieceOnBoard(piece) {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange", "cyan"]; // Add more colors as needed

    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const colorIndex = piece.shape[row][col] - 1; // Assuming shape values represent color index
                const actualColor = colors[colorIndex] || "white"; // Default to white if no color found
                board[Math.floor(piece.y) + row][piece.x + col] = actualColor;
            }
        }
    }
}



function generateRandomPiece() {
    const shapes = [
        [[1, 1, 1, 1]], // I-piece
        [[1, 1, 1], [0, 1, 0]], // T-piece
        [[1, 1, 1], [1, 0, 0]], // L-piece
        [[1, 1, 1], [0, 0, 1]], // J-piece
        [[1, 1], [1, 1]], // O-piece
        [[1, 1, 0], [0, 1, 1]], // S-piece
        [[0, 1, 1], [1, 1, 0]] // Z-piece
    ];

    const randomIndex = Math.floor(Math.random() * shapes.length);
    const randomShape = shapes[randomIndex];
    const randomColor = "cyan"; // You can change the color as needed

    // Set the initial x position to the middle of the board
    const initialX = Math.floor((board[0].length - randomShape[0].length) / 2);

    return {
        shape: randomShape,
        color: randomColor,
        x: initialX,
        y: 0,
    };
}


function movePieceLeft() {
    if (canMoveLeft(tetrisPiece)) {
        tetrisPiece.x -= 1;
    } 

}

function movePieceRight() {
    if (canMoveRight(tetrisPiece)) {
        tetrisPiece.x += 1;
    } 
}

function canMoveLeft(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (
                piece.shape[row][col] &&
                (piece.x + col - 1 < 0 || board[Math.floor(piece.y) + row][piece.x + col - 1] !== "")
            ) {
                return false; // Collision detected on the left or reached the left edge
            }
        }
    }
    return true;
}

function canMoveRight(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (
                piece.shape[row][col] &&
                (piece.x + col + 1 >= board[0].length || board[Math.floor(piece.y) + row][piece.x + col + 1] !== "")
            ) {
                return false; // Collision detected on the right or reached the right edge
            }
        }
    }
    return true;
}

function rotatePiece() {
    const rotatedShape = [];
    for (let row = 0; row < tetrisPiece.shape.length; row++) {
        for (let col = 0; col < tetrisPiece.shape[row].length; col++) {
            rotatedShape[col] = rotatedShape[col] || [];
            rotatedShape[col][tetrisPiece.shape.length - 1 - row] = tetrisPiece.shape[row][col];
        }
    }

    if (canPlacePiece(tetrisPiece.x, tetrisPiece.y, rotatedShape)) {
        tetrisPiece.shape = rotatedShape;
    }
}


function canPlacePiece(newX, newY, newShape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (
                newShape[row][col] &&
                ((newX + col < 0 ||
                    newX + col >= board[0].length ||
                    newY + row >= board.length ||
                    newY + row < 0) ||
                    (board[Math.floor(newY) + row] && board[Math.floor(newY) + row][newX + col] !== "")
                )
            ) {
                return false; // Collision detected or out of bounds
            }
        }
    }
    return true;
}


// Function to handle keyboard input
function handleKeyPress(event) {
    console.log("Key pressed:", event.key); // Log the pressed key

    switch (event.key) {
        case "ArrowLeft":
            movePieceLeft();
            break;
        case "ArrowRight":
            movePieceRight();
            break;
        case "ArrowUp": // Add this case for rotation
            rotatePiece();
            break;
        case "ArrowDown":
            // Speed up the falling by doubling the increment value
            tetrisPiece.y += 0.6; // You can adjust the value as needed
            break;
        // Add more cases as needed
    }
}

// Event listener for keyboard input
document.addEventListener("keydown", handleKeyPress); 






// ... (your existing code)

// Function to handle "Play Again" button click
function playAgain() {
    console.log("Play Again clicked");
    // Reset the game state
    resetGame();
    // Request animation frame to restart the game loop
    requestAnimationFrame(tetrisGameLoop);
}

// Event listener for "Play Again" button click
const playAgainButton = document.getElementById("playAgainButton");
playAgainButton.addEventListener("click", playAgain);

// Function to reset the game state
function resetGame() {
    // Clear the Tetris board
    for (let row = 0; row < board.length; row++) {
        board[row].fill("");
    }

    // Reset other game variables as needed
    lastTime = 0;
    tetrisPiece = generateRandomPiece();
}

console.log("Script is loaded");

// Check if the canvas element is available
if (!canvas) {
    console.error("Canvas element not found");
} else {
    requestAnimationFrame(tetrisGameLoop);
}