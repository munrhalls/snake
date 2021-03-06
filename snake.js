import grid from './grid.js';

function game() {
  game.size = 40;
  game.frames = 0;
  game.timer = 0;
  game.running = false;
  game.overMessage = '';
  game.score = 0;
  game.gridBg = 'black';
  game.gridlinesColor = 'white';
  snake.timePerFrame = 100;
  snake.framesPerSecond = 1000 / game.timePerFrame;
  grocer.timePerFrame = 500;
  grocer.foodSquareIds = [];
  let gameContainer = document.getElementById('gameContainer');
  let snakeBody = ['19,19'];
  let snakeColor = 'green';
  var activeDirection = 'TOP';
  appendGrid();
  createPanelBtns();
  game.start = function () {
    if (!game.running) {
      game.running = true;
      snakeFrame();
      grocerFrame();
      gameTimer();
      document.onkeydown = debounce(checkKey, snake.timePerFrame, false);
    }
  }
  game.over = function () {
    game.pause();
    game.running = false;
    let gameOverModal = createGameOverModal();
    gameContainer.appendChild(gameOverModal);
  }
  game.restart = function () {
    let gameContainer = document.getElementById('gameContainer');
    while (gameContainer.firstChild) {
      gameContainer.firstChild.remove();
    }
    snakeBody = ['19,19'];
    activeDirection = 'TOP';
    game.timer = 0;
    game.score = 0;
    grocer.foodSquareIds = [];
    appendGrid();
    createPanelBtns();
  }
  function appendGrid() {
    const gridContainer = grid(game.gridBg, game.gridlinesColor);
    gameContainer.appendChild(gridContainer);
  }
  function createPanelBtns() {
    createStartBtn();
    createScoreDisplay();
    // createGridLinesPanel();
  }
  function createStartBtn() {
    let startBtn = document.createElement('h1');
    startBtn.id = 'startBtn';
    let gameContainer = document.getElementById('gameContainer');
    gameContainer.appendChild(startBtn);
    startBtn.innerText = 'START';
    startBtn.style.color = 'black';
    startBtn.style.cursor = 'pointer';
    panelStyleBtn(startBtn);
    startBtn.onclick = function () {
      game.start();
    }
  }
  function panelStyleBtn(btn) {
    btn.style.fontWeight = 'bold';
    btn.style.width = '6.25rem';
    btn.style.padding = '1rem';
    btn.style.border = '3px solid black';
  }
  function createGameOverModal() {
    let gameOverModal = document.createElement('div');
    gameOverModal.id = 'gameOverModal'
    gameOverModal.style.position = 'absolute';
    gameOverModal.style.top = '0';
    gameOverModal.style.left = '0';
    gameOverModal.style.right = '0';
    gameOverModal.style.bottom = '0';
    gameOverModal.style.height = '100vh';
    gameOverModal.style.width = '100vw';
    gameOverModal.style.background = '#030303';
    gameOverModal.style.opacity = '90%';
    gameOverModal.innerText = 'MODAL';

    let textOne = 'GAME OVER.';
    let textTwo = 'Your score: ' + game.score + '.';
    let textThree = 'Time: ' + game.timer + ' seconds.';
    let textFour = 'Reason: ' + game.overMessage;
    let messageOne = createGameOverModalMessage(textOne);
    let messageTwo = createGameOverModalMessage(textTwo);
    let messageThree = createGameOverModalMessage(textThree);
    let messageFour = createGameOverModalMessage(textFour);
    let btnPlayAgain = createPlayAgainButton();
    gameOverModal.appendChild(messageOne);
    gameOverModal.appendChild(messageFour);
    gameOverModal.appendChild(messageTwo);
    gameOverModal.appendChild(messageThree);
    gameOverModal.appendChild(btnPlayAgain);
    return gameOverModal;
  }
  function createScoreDisplay() {
    let gameContainer = document.getElementById('gameContainer');
    let score = document.createElement('h1');
    score.id = 'score';
    let text = 'SCORE: ' + game.score;
    let textNode = document.createTextNode(text);
    score.style.color = 'black'
    score.style.textAlign = 'left';
    score.appendChild(textNode);
    gameContainer.appendChild(score);
  }
  function updateScoreDisplay() {
    let score = document.getElementById('score');
    let text = 'SCORE: ' + game.score;
    let textNode = document.createTextNode(text);
    score.removeChild(score.firstChild);
    score.appendChild(textNode);
  }
  function createGameOverModalMessage(text) {
    let message = document.createElement('h1');
    let textNode = document.createTextNode(text);
    message.style.color = 'white'
    message.style.textAlign = 'center';
    message.style.padding = '2rem';
    message.style.border = '1rem solid white';
    message.appendChild(textNode);
    return message;
  }
  function createPlayAgainButton() {
    let btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'center';
    let button = document.createElement('h1');
    button.innerText = 'PLAY AGAIN';
    button.style.color = 'white'
    button.style.textAlign = 'center';
    button.style.padding = '2rem';
    button.style.border = '3rem solid white';
    button.style.cursor = 'pointer';
    button.onclick = function (e) {
      let gameOverModal = document.getElementById('gameOverModal');
      gameOverModal.remove();
      game.restart();
    }
    btnContainer.appendChild(button);
    return btnContainer;
  }
  game.checkOutOfBounds = function (newCoord) {
    //snake goes out of the grid
    let coords = newCoord.split(',');
    if (coords[0] < 0 || coords[1] < 0 || coords[0] > 39 || coords[1] > 39) {
      game.overMessage = 'the snake has run out of the grid.';
      return true;
    } else {
      return false;
    }
  }
  game.checkSnakeHitsItself = function (newCoord, snakeBody) {
    //snake goes out of the grid
    let condition = false;
    snakeBody.forEach(function (snakeCoord) {
      if (snakeCoord === newCoord) {
        condition = true;
        game.overMessage = 'the snake tried to eat itself!';
      }
    });
    return condition;
  }
  game.pause = function () {
    game.running = false;
  }
  game.resume = function () {
    game.running = true;
  }
  function grocerFrame() {
    setTimeout(function () {
      grocer();
      if (game.running) {
        grocerFrame();
      }
    }, grocer.timePerFrame);
  }
  function snakeFrame() {
    setTimeout(function () {
      snake();
      if (game.running) {
        snakeFrame();
      }
    }, snake.timePerFrame);
  }
  function gameTimer() {
    setTimeout(function () {
      game.timer++;

      if (game.running) {
        gameTimer();
      }
    }, 1000);
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  function checkKey(e) {
    e = e;
    if (e.keyCode == '38' && activeDirection !== 'BOTTOM') {
      activeDirection = 'TOP';
    }
    else if (e.keyCode == '40' && activeDirection !== 'TOP') {
      activeDirection = 'BOTTOM';
    }
    else if (e.keyCode == '37' && activeDirection !== 'RIGHT') {
      activeDirection = 'LEFT';
    }
    else if (e.keyCode == '39' && activeDirection !== 'LEFT') {
      activeDirection = 'RIGHT';
    }
    else if (e.keyCode == '32') {
      game.pause();
    }
  }
  function snake() {
    let newCoord = getNewCoord(snakeBody);
    if (game.checkOutOfBounds(newCoord)) {
      game.over();
      return;
    }
    if (game.checkSnakeHitsItself(newCoord, snakeBody)) {
      game.over();
      return;
    }
    let newSquare = document.getElementById(newCoord);
    snakeBody.unshift(newCoord);

    if (newSquare.className !== 'food') {
      deleteLastCoord();
    } else {
      game.score++;
      updateScoreDisplay();
    }
    paintSnake(snakeBody);
  }
  function paintSnake(snakeBody) {
    for (let i = 0; i < snakeBody.length; i++) {
      let id = snakeBody[i];
      let squareAtId = document.getElementById(id);
      styleSquareToSnake(squareAtId);
    }
  }
  function styleSquareToSnake(square) {
    square.style.background = snakeColor;
    square.style.borderRadius = '50%';
  }
  function restyleSquareToNormal(coord) {
    let lastSnakeEl = document.getElementById(coord);
    lastSnakeEl.style.background = game.gridBg;
    lastSnakeEl.style.borderRadius = '';
  }

  function getNewCoord(snakeBody) {
    var vert = snakeBody[0].split(',')[0];
    var horiz = snakeBody[0].split(',')[1];
    if (activeDirection === 'TOP') {
      vert--;
    } else if (activeDirection === 'BOTTOM') {
      vert++;
    } else if (activeDirection === 'RIGHT') {
      horiz++;
    } else if (activeDirection === 'LEFT') {
      horiz--;
    }
    let newCoord = vert + ',' + horiz;
    return newCoord;
  }
  function deleteLastCoord() {
    let lastCoord = snakeBody[snakeBody.length - 1];
    restyleSquareToNormal(lastCoord);
    snakeBody.pop();
  }
  function grocer() {
    let min = 0;
    let max = game.size / 2
    let random1 = getRandomIntInclusive(min, max);
    let random2 = getRandomIntInclusive(min, max);
    let id = random1 + ',' + random2;
    fillSquareWithFood(id);
    grocer.foodSquareIds.push(id);
  }
  function fillSquareWithFood(id) {
    let square = document.getElementById(id);
    square.className = 'food';
    square.style.background = 'yellow';
    square.style.borderRadius = '50%';
  }
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
game();

