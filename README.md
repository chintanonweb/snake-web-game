# Snake Game

Welcome to the **Snake Game**! This classic arcade game has been recreated using HTML, CSS, and JavaScript. Control the snake to eat apples, grow longer, and achieve the highest score possible. This README provides a comprehensive guide to understanding, setting up, and playing the game.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to Play](#how-to-play)
- [Code Structure](#code-structure)
  - [HTML](#html)
  - [JavaScript](#javascript)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)
---

## Project Overview

The **Snake Game** is a simple yet addictive game where the player controls a snake to eat apples appearing randomly on the screen. Each time the snake eats an apple, it grows longer, and the game's difficulty increases by speeding up the snake. The objective is to achieve the highest possible score without colliding with the walls or the snake's own body.

## Features

- **Responsive Design:** The game is centered and adapts to different screen sizes.
- **Keyboard Controls:** Use arrow keys or WASD to navigate the snake.
- **Touch Controls:** Swipe gestures for mobile device compatibility.
- **Sound Effects:** Play a sound when the snake eats an apple.
- **Score Tracking:** Displays current score and high score, with high score saved in local storage.
- **Dynamic Difficulty:** Snake speed increases as the score increases.
- **Game Over Screen:** Displays score and high score with an option to restart.

## Technologies Used

- **HTML5:** Structure of the game interface.
- **CSS3:** Styling and layout.
- **JavaScript (ES6):** Game logic and interactivity.
- **Canvas API:** Rendering the game graphics.
- **Local Storage:** Saving high scores.

## Getting Started

Follow these instructions to set up and run the Snake Game on your local machine.

### Prerequisites

Ensure you have a modern web browser installed (e.g., Chrome, Firefox, Edge, Safari).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/snake-game.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd snake-game
   ```

3. **Download or Create the Sound File**

   - Ensure you have a `game-sound.mp3` file in the project directory. You can download a free sound effect or create your own.

4. **Open the Game in a Browser**

   - Open the `index.html` file in your preferred web browser.

   - **Option 1:** Double-click the `index.html` file.
   - **Option 2:** Right-click the file and select "Open with" followed by your browser.
   - **Option 3:** Serve the files using a local server (recommended for better compatibility):

     ```bash
     # Using Python's SimpleHTTPServer
     python -m http.server 8000
     ```

     Then navigate to `http://localhost:8000` in your browser.

## How to Play

1. **Start the Game**

   - Click on the canvas area or tap on mobile devices to start the game.

2. **Control the Snake**

   - **Keyboard:**
     - **Up:** Arrow Up or `W`
     - **Down:** Arrow Down or `S`
     - **Left:** Arrow Left or `A`
     - **Right:** Arrow Right or `D`
   - **Touch (Mobile Devices):**
     - Swipe in the desired direction to change the snake's movement.

3. **Objective**

   - Navigate the snake to eat red apples appearing on the screen.
   - Each apple eaten increases the snake's length and the score.
   - Avoid colliding with the walls or the snake's own body.

4. **Game Over**

   - When the snake collides with a wall or itself, the game ends.
   - The game over screen displays your score and the high score.
   - Click or tap to restart the game.

## Code Structure

The Snake Game is built using HTML, CSS, and JavaScript. Below is an overview of the code structure and key components.

### HTML

The `index.html` file sets up the basic structure of the game interface.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <h1>Snake Game</h1>
    <canvas id="game" width="400" height="400"></canvas>
    <script src="game.js"></script>
</body>
</html>
```

- **Canvas:** The `<canvas>` element is where the game is rendered.
- **Script:** The `game.js` file contains the game logic.

### JavaScript

The `game.js` file contains all the game logic, including rendering, controls, collision detection, and score management.

#### Key Components

1. **Initialization**

   ```javascript
   let canvas = document.getElementById("game");
   let ctx = canvas.getContext("2d");
   ```

   - Accesses the canvas element and sets up the 2D rendering context.

2. **SnakePart Class**

   ```javascript
   class SnakePart {
     constructor(x, y) {
       this.x = x;
       this.y = y;
     }
   }
   ```

   - Represents each segment of the snake.

3. **Game Variables**

   ```javascript
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
   ```

   - Initializes game settings such as speed, grid size, snake position, and scores.

4. **Sound Effect**

   ```javascript
   let gulpSound = new Audio("game-sound.mp3");
   ```

   - Plays a sound when the snake eats an apple.

5. **Game States**

   ```javascript
   let gameStarted = false;
   let gameOver = false;
   ```

   - Tracks whether the game has started or ended.

6. **Main Game Loop**

   ```javascript
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
   ```

   - Handles the main game updates and rendering at a set interval based on the game speed.

7. **Collision Detection**

   ```javascript
   function isGameOver() {
     // Check for wall collision
     if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
       gameOver = true;
     }

     // Check for self-collision
     for (let part of snakeParts) {
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
   ```

   - Determines if the game has ended due to collisions.

8. **Rendering Functions**

   - **Clear Screen:** Clears the canvas for the next frame.
   - **Draw Snake:** Renders the snake on the canvas.
   - **Draw Apple:** Places an apple on the canvas.
   - **Draw Score:** Displays the current and high scores.
   - **Show Game Over Screen:** Displays the game over message and scores.

9. **Controls**

   ```javascript
   document.body.addEventListener("keydown", keyDown);

   function keyDown(event) {
     // Handle arrow keys and WASD for direction changes
   }

   canvas.addEventListener("click", handleClick);
   canvas.addEventListener("touchstart", handleTouch);

   // Swipe controls for mobile devices
   canvas.addEventListener("touchstart", function(e) { /* ... */ }, false);
   canvas.addEventListener("touchmove", function(e) { /* ... */ }, false);
   ```

   - Handles keyboard inputs and touch gestures for controlling the snake.

10. **Game Initialization**

    ```javascript
    clearScreen();
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";
    ctx.fillText("Click to Start", canvas.width / 2 - 70, canvas.height / 2);
    ```

    - Displays the initial start message on the canvas.

## Customization

You can customize various aspects of the game to enhance your experience or add new features:

- **Change Colors:** Modify the `fillStyle` properties in the JavaScript to change snake, apple, and background colors.
- **Adjust Speed:** Tweak the `speed` variable and the `updateSpeed` function to change game difficulty progression.
- **Add Obstacles:** Introduce new classes or objects to represent obstacles and implement collision logic.
- **Enhance Graphics:** Replace the rectangle-based graphics with images or more complex shapes using the Canvas API.
- **Sound Effects:** Add more sound effects for different game events.

## Contributing

Contributions are welcome! If you'd like to improve the Snake Game, follow these steps:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Make Your Changes**

4. **Commit Your Changes**

   ```bash
   git commit -m "Add Your Feature"
   ```

5. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

6. **Open a Pull Request**

Please ensure your contributions adhere to the project's coding standards and include appropriate documentation.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy playing the Snake Game! If you encounter any issues or have suggestions, feel free to open an issue or contribute to the project.