// 1) Define DOM elements from HTML. 1
const board = document.getElementById('game-board'); // 1
const instructionText = document.getElementById('instruction-text'); // 12
const logo = document.getElementById('logo'); // 12
const score = document.getElementById('score'); // 17
const highScoreText = document.getElementById('highScore'); // 19

// Define game variables
const gridSize = 20; // 7
let snake = [{ x: 10, y: 10 }]; // 2
let food = generateFood(); // 6
let highScore = 0; // 19
let direction = 'right'; // 9
let gameInterval;
let gameSpeedDelay = 200; // 11
let gameStarted = false; // 12

// 1) Draw game map, snake and food
function draw() {
  board.innerHTML = ''; // Clear the board in case game has started previously.
  drawSnake(); // 2) Draw snake
  drawFood(); // 6 Draw food
  updateScore();
}

// 2) Draw snake function
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake'); // 3
    setPosition(snakeElement, segment); // 4
    board.appendChild(snakeElement); // 5
  });
}

// 3) Create a snake or food cube
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// 4) Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x; // Using CSS gridColumn property to position the cube
  element.style.gridRow = position.y;
}

// 5 Call draw as test
// draw();

// 6) Draw food function
function drawFood() {
  // 20) INITIAL WAY BEFORE END TWEAK TO REMOVE FOOD RENDERING BEFORE START
  // const foodElement = createGameElement('div', 'food');
  // setPosition(foodElement, food);
  // board.appendChild(foodElement);

  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// 7) Initial way to generate food without taking into account snake position
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// 8) Moving the snake function
function move() {
  const head = { ...snake[0] }; // Spread operator creates shalow copy and does not alter the original snake[0] object
  switch (
    direction // 9
  ) {
    case 'up':
      head.y--; // starts at 1 from top.
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head); // Adding head object to beginning of snake array.

  // snake.pop(); 10) Testing move function

  if (head.x === food.x && head.y === food.y) {
    food = generateFood(); // Call function again to replace food position
    increaseSpeed(); // 14) MAKE START GAME FUNCTION FIRST! Increase game speed
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      // The interval ensures the continuous execution of the game loop, preventing it from blocking the event loop and allowing for smooth updates after the snake eats food. Else the game stops when eating food.
      move();
      checkCollision(); // 15
      draw();
    }, gameSpeedDelay); // 11)
  } else {
    snake.pop(); // Removing last object inside snake array, if food is not eated.
  }
}

// 10) Testing the move function
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200); // The interval time in ms

// 12) Start game function
function startGame() {
  gameStarted = true; // Keep track of running game
  instructionText.style.display = 'none'; // Hide text and logo on start
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw(); // REMEMBER to comment out DRAW TEST on line 48!
  }, gameSpeedDelay);
}

// 13) Keypresses
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame(); // Start game on enter key press
  } else {
    // Change direction variable based on arrows
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

// 14)
function increaseSpeed() {
  // console.log('speed'); // just to have the function before start
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// 15)
function checkCollision() {
  // console.log('collision'); // just to have the function before start
  const head = snake[0];

  // Check if snake hits walls
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  // Check if snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// 16)
function resetGame() {
  updateHighScore(); // 19)
  stopGame(); // 18)
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore(); // 17)
}

// 17) REMEMBER TO CALL FUNCTION ON LINE 23!
function updateScore() {
  const currentScore = snake.length - 1; // -1 is added otherwise it would start at 1
  score.textContent = currentScore.toString().padStart(3, '0');
}

// 18)
function stopGame() {
  clearInterval(gameInterval); // We need to stop it else snake keeps moving.
  gameStarted = false; // We need to set it to false so we can start the game with enter again
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

// 19)
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

// 20) Tweak food rendering on line 52
