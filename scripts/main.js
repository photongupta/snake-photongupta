const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const TIME_LIMIT = 120;
const INITIAL_SCORE = 0;

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) => {
  return document.getElementById(getCellId(colId, rowId));
};

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const showScore = function(score) {
  const scoreBox = document.getElementsByClassName('score');
  scoreBox[0].innerText = `score : ${score}`;
};

const displayGameOver = function(scoreBoard) {
  const panel = document.getElementsByClassName('gameOver');
  const panelContent = document.getElementsByClassName('status');
  panel[0].style.marginTop = `0vw`;
  panelContent[0].innerText = `GameOver...\nYour score:${scoreBoard}`;
};

const getRandomDirection = function() {
  const directions = ['turnLeft', 'turnRight', 'turnUp', 'turnDown'];
  return directions[Math.round(Math.random() * 3)];
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.type);
};

const drawSnake = function(snake) {
  const {positions, type} = snake;
  positions.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(type);
  });
};

const drawFood = function(food) {
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.type);
};

const removeFood = function(food) {
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove(food.type);
};

const updateTimeLeft = function(count) {
  const timer = document.getElementsByClassName('timer');
  timer[0].innerText = `Time Left: ${count}s`;
};

const handleKeyPress = game => {
  const input = event.key;
  switch (input) {
    case 'ArrowLeft':
      game.turn('snake', 'turnLeft');
      break;

    case 'ArrowRight':
      game.turn('snake', 'turnRight');
      break;

    case 'ArrowUp':
      game.turn('snake', 'turnUp');
      break;

    case 'ArrowDown':
      game.turn('snake', 'turnDown');
      break;
  }
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const animateSnake = function(snakes) {
  snakes.forEach(snake => {
    eraseTail(snake);
    drawSnake(snake);
  });
};

const animateFood = function(status) {
  removeFood(status.previousFood);
  drawFood(status.food);
};

const drawGame = function(status) {
  animateSnake([status.snake, status.ghostSnake]);
  animateFood(status);
  showScore(status.score);
};

const isGameOver = function(game, timer) {
  return game.isOver() || timer.isTimeOut();
};

const clearTimers = function(timerIds) {
  timerIds.forEach(id => clearInterval(id));
};

const initGame = function(game) {
  createGrids();
  attachEventListeners(game);
};

const main = function() {
  const game = new Game();
  initGame(game);
  const timer = new Timer(TIME_LIMIT);
  const timerId = timer.start();

  const gameTimerId = setInterval(() => {
    game.update();
    const status = game.getStatus();
    drawGame(status);

    if (isGameOver(game, timer)) {
      clearTimers([gameTimerId, ghostTimerId, timerId]);
      displayGameOver(status.score);
    }
  }, 100);

  const ghostTimerId = setInterval(() => {
    const direction = getRandomDirection();
    game.turn('ghostSnake', direction);
  }, 1000);
};

window.onload = main;
