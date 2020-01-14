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

const initFood = function() {
  const foodPosition = getRandomFood();
  const food = new Food(foodPosition, 'normal');
  return food;
};

const initGhostSnake = function() {
  return new Snake(
    [
      [40, 30],
      [41, 30],
      [42, 30]
    ],
    new Direction(SOUTH),
    'ghost'
  );
};

const initSnake = function() {
  return new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );
};

const initializeGame = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = initFood();
  const score = new Score(INITIAL_SCORE);
  const timer = new Timer(TIME_LIMIT);
  return new Game(snake, ghostSnake, food, score, timer);
};

const animateSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const animateFood = function(status) {
  removeFood(status.previousFood);
  drawFood(status.food);
};

const moveSnakes = function(game) {
  game.moveSnake('snake');
  game.moveSnake('ghostSnake');
};

const drawGame = function(status) {
  animateSnake(status.snake);
  animateSnake(status.ghostSnake);
  animateFood(status);
  showScore(status.score);
};

const isGameOver = function(game, timer) {
  return game.isOver() || timer.isTimeOut();
};

const clearTimers = function(gameTimerId, ghostTimerId, timerId) {
  clearInterval(gameTimerId);
  clearInterval(ghostTimerId);
  clearInterval(timerId);
};

const main = function() {
  createGrids();
  const game = initializeGame();
  const status = game.getStatus();
  const timer = new Timer(TIME_LIMIT);
  const timerId = timer.set();
  attachEventListeners(game);
  drawGame(status);

  const gameTimerId = setInterval(() => {
    game.update();
    const status = game.getStatus();
    moveSnakes(game);
    drawGame(status);
    if (isGameOver(game, timer)) {
      clearTimers(gameTimerId, ghostTimerId, timerId);
      displayGameOver(status.score);
    }
    game.wrap('ghostSnake');
  }, 100);

  const ghostTimerId = setInterval(() => {
    const direction = getRandomDirection();
    game.turn('ghostSnake', direction);
  }, 1000);
};
