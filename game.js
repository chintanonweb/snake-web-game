let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5;
let appleY = 5;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;

let gulpSound = new Audio("game-sound.mp3");

let gameStarted = false;
let gameOver = false;

function drawGame() {
  if (!gameStarted) {
    return;
  }

  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    showGameOverScreen();
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  
  updateSpeed();

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    updateHighScore();
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 60, 20);
  ctx.fillText("High Score: " + highScore, canvas.width - 60, 40);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

function updateSpeed() {
  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
  }
}

function showGameOverScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";

  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop("0", " magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");
  ctx.fillStyle = gradient;

  ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  
  ctx.font = "20px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2 + 40);
  ctx.fillText("High Score: " + highScore, canvas.width / 2 - 60, canvas.height / 2 + 70);
  ctx.fillText("Click to Restart", canvas.width / 2 - 70, canvas.height / 2 + 100);

  gameStarted = false;
}

function resetGame() {
  speed = 7;
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (event.keyCode == 38 || event.keyCode == 87) { // Up or W
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  if (event.keyCode == 40 || event.keyCode == 83) { // Down or S
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  if (event.keyCode == 37 || event.keyCode == 65) { // Left or A
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  if (event.keyCode == 39 || event.keyCode == 68) { // Right or D
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

canvas.addEventListener("click", handleClick);
canvas.addEventListener("touchstart", handleTouch);

function handleClick() {
  if (!gameStarted) {
    gameStarted = true;
    resetGame();
    drawGame();
  }
}

function handleTouch(e) {
  e.preventDefault(); // Prevent scrolling when touching the canvas
  handleClick();
}

// Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener("touchmove", function(e) {
  e.preventDefault(); // Prevent scrolling when swiping on the canvas
  if (!touchStartX || !touchStartY) {
    return;
  }

  let touchEndX = e.touches[0].clientX;
  let touchEndY = e.touches[0].clientY;

  let dx = touchStartX - touchEndX;
  let dy = touchStartY - touchEndY;

  // Determine swipe direction
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      // Swipe left
      if (inputsXVelocity == 1) return;
      inputsYVelocity = 0;
      inputsXVelocity = -1;
    } else {
      // Swipe right
      if (inputsXVelocity == -1) return;
      inputsYVelocity = 0;
      inputsXVelocity = 1;
    }
  } else {
    if (dy > 0) {
      // Swipe up
      if (inputsYVelocity == 1) return;
      inputsYVelocity = -1;
      inputsXVelocity = 0;
    } else {
      // Swipe down
      if (inputsYVelocity == -1) return;
      inputsYVelocity = 1;
      inputsXVelocity = 0;
    }
  }

  touchStartX = 0;
  touchStartY = 0;
}, false);

// Initial setup
clearScreen();
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("Click to Start", canvas.width / 2 - 70, canvas.height / 2);