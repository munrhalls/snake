document.addEventListener("DOMContentLoaded", function(event) {

	var display = {
		displayMsg: function(msg) {
			var msgElement = document.getElementById("message");
			msgElement.innerHTML = msg;
			return msgElement;
		},
		hideMsg: function(element) {
			var element = document.getElementById(element);
			element.style.display = "none";
		},
		pauseMsg: function() {
			if (!controller.gameStarted) {
				gameInterface.startButton.style.display = "block";
				gameInterface.startButton.innerHTML = "Start <span class='start-pause-footnote'> Click or hit enter </span> "
			}
			else if (controller.gamePaused) {
				gameInterface.startButton.style.display = "block";
				gameInterface.startButton.innerHTML = "Paused <span class='start-pause-footnote'> Click or hit spacebar </span> "
			} else {
				gameInterface.startButton.style.display = "none";
			}
		},
		displayScore: function(snakeLength) {
			var scoreElement = document.getElementById("score");
			scoreElement.innerHTML = "Score: " + snake.snakeLength + " points";
		},
		gameOverMsg: function(msg) {
			var msgElement = this.displayMsg(msg);
			msgElement.style.fontSize = "60px";
			msgElement.style.top = "100px";
			msgElement.style.display = "block";
			var canvas = document.getElementById("canvas");
			(canvas).style.backgroundColor = "black";
		}
	};

	var snake = {
		snakeLength: 1,
		snakePathSize: 10,
		snakePositionX: 250,
		snakePositionY: 250,
		snakeInitialDirection: 39,
		userControl: 39,
		snakeSize: 8,
		snakeColor: "#13c512",
		createSnake: function(x, y) {
			this.snakeLife();
		  context.beginPath();
		  context.fillStyle = this.snakeColor;
		 	context.arc(x, y, this.snakeSize, 0,2*Math.PI, false);
		 	context.closePath();
		 	context.fill();
 			},
		snakeLife: function() {
			if (!controller.gameStarted) {
				this.snakeSize = 70;
				this.snakeColor = "red"
			}
		},
		clearSnake: function(x, y) {
			context.clearRect(x - this.snakeSize, y - this.snakeSize, this.snakeSize * 2, this.snakeSize * 2);
		},
		snakeBlocks: [],
		checkFood: function() {
			if (this.snakePositionX === model.foodLocation[0] && this.snakePositionY === model.foodLocation[1]) {
					return true;
			}
			return false;
		},
		getSnakeDirection: function() {
			if (snake.userControl === 37) {
				this.snakePositionX -= this.snakePathSize;
				snake.userControlPrevious = 37;
			} else if(snake.userControl === 38) {
				this.snakePositionY -= this.snakePathSize;
				snake.userControlPrevious = 38;
			} else if(snake.userControl === 39) {
				this.snakePositionX += this.snakePathSize
				snake.userControlPrevious = 39;
			} else if (snake.userControl === 40) {
				this.snakePositionY += this.snakePathSize;
				snake.userControlPrevious = 40;
			}
		},
		eat: function() {
			if (snake.checkFood()) {
				model.generateFoodLocation(model.squaresPerRow);
				snake.snakeLength++;
				snake.snakeColor = "#fff";
				return 1;
			} else {
				snake.snakeColor = "#13c512";
				return 0;

			}
		},
		updateSnake: function() {

			var ignoreFood = snake.eat();

			for (var i = 0; i < this.snakeLength; i++) {
				this.snakeBlocks.push([]);
				this.snakeBlocks[i].push(this.snakePositionX, this.snakePositionY);
			}

			this.getSnakeDirection();
			for (var i = 0; i < this.snakeLength; i++) {
				this.clearSnake(this.snakeBlocks[i][0], this.snakeBlocks[i][1]);
			}
			this.snakeBlocks.pop();
			this.snakeBlocks.unshift([this.snakePositionX, this.snakePositionY]);

			controller.checkCollision(snake.snakeBlocks, ignoreFood);

			for (var i = 0; i < this.snakeLength; i++) {
				this.createSnake(this.snakeBlocks[i][0], this.snakeBlocks[i][1]);
			}
		}
	};

	var model = {
		frames: 0,
		foodColor: "#fff919",
		foodSize: 7.5,
		gridSize: 10,
		squaresPerRow: 50,
		squaresNum: 0,
		gameSize: "Normal",
		gameSpeed: 0,
		isGridSizeValid: function() {

			if (250000 % this.gridSize === 0) {
				return true;
			}
			return false;
		},
		calcGridSquares: function() {
			if (!this.isGridSizeValid()) {
				this.gridSize = 10;
				console.log("This grid square size is not valid!");
			}

			for (var i = 0; i * this.gridSize < 250000 / this.gridSize; i++) {
				this.squaresNum = i;
			}

			var squaresPerRow = Math.floor(Math.sqrt(model.squaresNum));
			model.squaresPerRow = squaresPerRow;

		},
		createGrid: function() {
			var grid = document.getElementById("grid");
			grid.innerHTML = "";
			if (!model.squaresNum) {
				this.calcGridSquares();

				for (var i = 0; i <= this.squaresNum; i++) {
					var cell = document.createElement("div");
					cell.className = "cell";
					cell.style.float = "left";
					cell.style.border = "1px solid #000"
					cell.style.width = (this.gridSize) + "px";
					cell.style.height = (this.gridSize)+ "px";
					grid.appendChild(cell);
				}
			}

		},
		createBoard: function() {
				var canvas = document.getElementById("canvas");
				context = canvas.getContext("2d");
				context.clearRect(0, 0, 500, 500);
			},
		foodLocation: ["", ""],
		generateFoodLocation: function(squaresPerRow) {
			this.foodLocation[0] = (Math.floor(Math.random()	* (squaresPerRow - 1)) + 1) * this.gridSize - this.gridSize / 2
			this.foodLocation[1] = (Math.floor(Math.random()	* (squaresPerRow - 1)) + 1) * this.gridSize - this.gridSize / 2
		},
		generateFood: function() {
			this.styleFood();
			context.beginPath();
			context.fillStyle = this.foodColor;
			context.arc(this.foodLocation[0], this.foodLocation[1], this.foodSize, 0.2 * Math.PI, false);
			context.fill();
		},
		styleFood: function() {
			var random = Math.floor(Math.random() * 3);
			if (random < 1) {
				this.foodColor = "#0a8732";
			} else if (random < 2) {
				this.foodColor = "#ccfce0";
			} else if (random <= 3) {
				this.foodColor = "#ccc800";
			}
		}
	};

	var controller = {
		game: "",
		gamePaused: false,
		gameStarted: false,
		gameDifficulty: 0,
		gameOver: false,
		checkCollision: function(snakeBlocks, ignoreFood) {
			var currentLocation = snakeBlocks[0];
			this.checkWalls(currentLocation);

			for (var i = 1 + ignoreFood; i < snake.snakeLength; i++) {
				if (currentLocation[0] === snakeBlocks[i][0] && currentLocation[1] === snakeBlocks[i][1]) {
				controller.gameStarted = false;
					controller.gameOver = true;
				gameInterface.restartButton.style.boxShadow = "0 0 30px 20px green";
				gameInterface.restartButton.style.fontWeight = "bold";
				display.gameOverMsg("Your snake has hit itself! <br><br> Game over. <br><br> Your score: " + snake.snakeLength);
				}
			}
		},
		checkWalls: function(currentLocation) {
			if (currentLocation[0]  <= 0 || currentLocation[1]  <= 0
				|| currentLocation[0] > 490 || currentLocation[1] > 490) {
					controller.gameStarted = false;
					controller.gameOver = true;
				display.gameOverMsg("Your snake has hit a wall!!! <br><br> Game over. <br><br> Your score: " + snake.snakeLength);
				gameInterface.restartButton.style.boxShadow = "0 0 30px 20px green";
				gameInterface.restartButton.style.fontWeight = "bold";
			}
		},
		changeSize: function(size) {
			model.gameSize = size;

			if (model.gameSize === "Mini") {
				model.gridSize = 10;
				model.foodSize = 4;
				model.gameSpeed = 7 - controller.gameDifficulty;
				snake.snakeSize = 4;
				snake.snakePositionX = 245;
				snake.snakePositionY = 245;
				snake.snakePathSize = 10;
			} else if (model.gameSize === "Normal") {
				model.gridSize = 20;
				model.foodSize = 9;
				model.gameSpeed = 10 - controller.gameDifficulty;
				snake.snakeSize = 9;
				snake.snakePositionX = 250;
				snake.snakePositionY = 250;
				snake.snakePathSize = 20;
			} else if (model.gameSize = "Gargantuan") {
				model.gridSize = 50;
				model.foodSize = 25;
				model.gameSpeed = 15 - controller.gameDifficulty;
				snake.snakeSize = 25;
				snake.snakePositionX = 225;
				snake.snakePositionY = 225;
				snake.snakePathSize = 50;
			}
		},
		prepareGame: function() {
			snake.snakeLength = 1;
			this.changeSize(model.gameSize);
			this.gameOver = false;
			model.squaresNum = 0;
			model.createGrid();
			model.createBoard();
			model.generateFoodLocation(model.squaresPerRow);
		},
		runGame: function() {
			model.frames++;
			if (model.frames % model.gameSpeed === 0) {
				if (!controller.gamePaused && controller.gameStarted) {
					snake.clearSnake();
					model.generateFood();
					snake.updateSnake(snake.userControl);
					display.displayScore(snake.snakeLength);
				}
			}
			controller.game = window.requestAnimationFrame(controller.runGame);
		},
		start: function start() {
			if (!controller.gameStarted) {
				controller.gameStarted = true;
				controller.prepareGame(model.gameSize);
			}
			controller.gamePaused = false;
			display.hideMsg("start-btn");
			gameInterface.restartButton.style = "box-shadow: 0 0 15px 10px #104201";
			gameInterface.restartButton.style.fontWeight = "normal";
			controller.runGame();

		},
		stop: function stop() {
			if (controller.gameStarted) {
				controller.gamePaused = true;
			}

			display.pauseMsg();
			window.cancelAnimationFrame(controller.game);
		},
		restart: function() {
			if (controller.gameStarted = true) {
				window.cancelAnimationFrame(controller.game);
				controller.gameStarted = false;
			}
			controller.gameOver = false;
			gameInterface.startButton.style.display = "block";
			gameInterface.startButton.innerHTML = "Start <span class='start-pause-footnote'> Click or hit enter </span> "
			snake.userControl = 39;

			var msg = display.displayMsg("");
			msg.style.display = "none"
			var canvas = document.getElementById("canvas");
			canvas.style.backgroundColor = "";
			model.frames = 0;
		}
	};

	document.addEventListener("keydown", function(e){
		if (controller.gameStarted) {
			if (e.keyCode === 37 || e.keyCode === 38
				 || e.keyCode === 39 || e.keyCode === 40) {
				snake.userControl = e.keyCode;
			}
		}

		if (e.keyCode - snake.userControlPrevious === 2
			 || e.keyCode - snake.userControlPrevious === -2 ) {
				snake.userControl = snake.userControlPrevious;
		}

		if (e.keyCode === 32 && controller.gameStarted) {
			console.log("Spacebar event")
			e.preventDefault();
			var flow = [controller.start, controller.stop];
			controller.gamePaused ^= true;
			flow[controller.gamePaused]();
		}

		if (e.keyCode === 13) {
				e.preventDefault();
				if (!controller.gameStarted && !controller.gameOver) {
					gameInterface.startButton.style.display = "none"
					controller.start();
				}
			}

	}, false);


	var gameInterface =  {
		sizeButtons: document.getElementsByClassName("size-buttons"),
		sizeButtonsListen: function() {
			for (var i = 0; i <= 2; i++) {
				this.sizeButtons[i].addEventListener("click", gameInterface.activeGameSize);
			};
		},
		activeGameSize: function() {
			if (!controller.gameStarted) {

			for (var i = 0; i <= 2; i++) {
				gameInterface.sizeButtons[i].classList.remove("active");
			}
				model.gameSize = this.innerHTML;
				this.classList.add("active");
			}
		},
		startButton: document.getElementById("start-btn"),
		startButtonListen: function() {
			this.startButton.addEventListener("click", function(e) {
				e.preventDefault();
				this.style.display = "none"
				controller.start();
			});
		},
		restartButton: document.getElementById("restart-btn"),
		restartButtonListen: function() {
			this.restartButton.addEventListener("click", function(e) {
				controller.restart();
			});
		},
		difficultyButton: document.getElementById("toggle-difficulty-options"),
		difficultyContainer: document.getElementsByClassName("difficulty-options-container")[0],
		difficultyButtons: document.getElementsByClassName("difficulty-buttons"),
		difficultyButtonsListen: function() {
			for (var i = 0; i <= 4; i++) {
				this.difficultyButtons[i].addEventListener("click", gameInterface.activeGameDifficulty);
			};
		},
		difficultyButtonListen: function() {
			var difficultyContainer = document.getElementsByClassName("difficulty-options-container")[0];

			this.difficultyButton.addEventListener("click", function() {
				gameInterface.difficultyContainer.style.display = (gameInterface.difficultyContainer.dataset.toggled ^= 1) ? "block" : "none";
			}, false);

			for (var i = 0; i < difficultyContainer.children.length; i++) {

				this.difficultyContainer.children[i].addEventListener("click", function(){
					controller.gameDifficulty = this.value;
				});
			}
		},
		activeGameDifficulty: function() {
				if (!controller.gameStarted) {

			for (var i = 0; i <= 4; i++) {
				gameInterface.difficultyButtons[i].classList.remove("active");
			}

				var difficulty = document.getElementById("difficulty-message");
				difficulty.innerHTML = "Difficulty: " + this.innerHTML;
				controller.gameDifficulty = parseInt(this.value);
				this.classList.add("active");
			}
		},
		run: function() {
			this.sizeButtonsListen();
			this.startButtonListen();
			this.restartButtonListen();
			this.difficultyButtonListen();
			this.difficultyButtonsListen();

		}
	}

	gameInterface.run();
});



