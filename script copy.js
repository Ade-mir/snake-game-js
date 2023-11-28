document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('game-board');
  const score = document.getElementById('score');
  const instructionText = document.getElementById('instruction-text');
  const logo = document.getElementById('logo');
  const highScoreText = document.getElementById('highScore');
  const gridSize = 20;
  let snake = [{ x: 10, y: 10 }];
  let highScore = 0;
  let food = generateFood();
  let direction = 'right';
  let gameSpeedDelay = 200;
  let gameStarted = false;

  function startGame() {
    gameStarted = true; // Set gameStarted to true when the game starts
    instructionText.style.display = 'none'; // Hide the instruction text
    logo.style.display = 'none'; // Hide the instruction text
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  }

  function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
  }

  function draw() {
    board.innerHTML = ''; // Clear the board
    drawSnake();
    drawFood();
    updateScore();
  }

  function drawSnake() {
    snake.forEach((segment) => {
      const snakeElement = createGameElement('div', 'snake');
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  }

  function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }

  function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
  }

  // Generate food without taking into account snake position
  // function generateFood() {
  //   const x = Math.floor(Math.random() * gridSize) + 1;
  //   const y = Math.floor(Math.random() * gridSize) + 1;
  //   return { x, y };
  // }

  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1,
      };
    } while (isFoodOnSnake(newFood));

    return newFood;
  }

  function isFoodOnSnake(food) {
    return snake.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );
  }

  function move() {
    const head = { ...snake[0] };

    switch (direction) {
      case 'up':
        head.y--;
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

    snake.unshift(head);

    // console.log('Head Position:', head);

    if (head.x === food.x && head.y === food.y) {
      food = generateFood();
      increaseSpeed();
      // console.log(gameSpeedDelay);
      clearInterval(gameInterval);
      gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
      }, gameSpeedDelay);
    } else {
      snake.pop();
    }
  }

  function increaseSpeed() {
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

  function handleKeyPress(event) {
    // console.log(event.key);
    if (
      (!gameStarted && event.code === 'Space') ||
      (!gameStarted && event.key === ' ')
    ) {
      startGame(); // Start the game on Enter key press
    } else {
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

  function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame();
      }
    }
  }

  function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
  }

  function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
  }

  function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore(); // Calling this last because we need to call it under the rest of snake variable
  }
});
