document.addEventListener("DOMContentLoaded", function(event) {

	var display = {
		displayMsg: function(msg) {
			var msgElement = document.getElementById("message");
			msgElement.innerHTML = msg;
			return msgElement;
		},
		displayScore: function(snakeLength) {
			var scoreElement = document.getElementById("score");
			scoreElement.innerHTML = "Score: " + snake.snakeLength;
		},
		gameOverMsg: function(msg) {
			var msgElement = this.displayMsg(msg);
			msgElement.style.fontSize = "60px";
			msgElement.style.top = "100px";
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
		 	context.fill();
 			},
		snakeLife: function() {
			if (controller.gameOver) {
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
		squaresNum: "",
		gameSize: "Normal",
		gameSpeed: 10,
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
			this.calcGridSquares();

			for (var i = 0; i <= this.squaresNum; i++) {
				var cell = document.createElement("div");
				cell.className = "cell";
				cell.style.float = "left";
				cell.style.border = "1px solid #000"
				cell.style.width = (this.gridSize - 2) + "px";
				cell.style.height = (this.gridSize - 2)+ "px";
				grid.appendChild(cell);
			}
		},
		createBoard: function() {

				var canvas = document.getElementById("canvas");
				context = canvas.getContext("2d");
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
		},
		prepareGame: function() {
			model.createGrid();
			model.createBoard();
			model.generateFoodLocation(model.squaresPerRow);
		}
	};

	var controller = {
		game: "",
		gameOver: false,
		gamePaused: false,
		checkCollision: function(snakeBlocks, ignoreFood) {
			var currentLocation = snakeBlocks[0];

			this.checkWalls(currentLocation);

			for (var i = 1 + ignoreFood; i < snake.snakeLength; i++) {
				if (currentLocation[0] === snakeBlocks[i][0] && currentLocation[1] === snakeBlocks[i][1]) {
				controller.gameOver = true;
				display.gameOverMsg("Your snake has hit itself! <br><br> It's all over!!!");
				}
			}
		},
		checkWalls: function(currentLocation) {
			if (currentLocation[0]  <= 0 || currentLocation[1]  <= 0
				|| currentLocation[0] > 490 || currentLocation[1] > 490) {
				controller.gameOver = true;
				display.gameOverMsg("Your snake has hit a wall!!! <br><br> Game over. <br><br> Your score: " + snake.snakeLength);
			}
		},
		changeSize: function(size) {
			model.gameSize = size;

			if (model.gameSize === "Mini") {
				model.gridSize = 10;
				model.foodSize = 4;
				snake.snakeSize = 4;
				snake.snakePositionX = 245;
				snake.snakePositionY = 245;
				snake.snakePathSize = 10;
			} else if (model.gameSize === "Normal") {
				model.gridSize = 20;
				model.foodSize = 9;
				model.gameSpeed = 10;
				snake.snakeSize = 9;
				snake.snakePathSize = 20;
			} else if (model.gameSize = "Gargantuan") {

				model.gridSize = 50;
				model.foodSize = 25;
				model.gameSpeed = 15;
				snake.snakeSize = 25;
				snake.snakePositionX = 225;
				snake.snakePositionY = 225;
				snake.snakePathSize = 50;
			}

		},
		runGame: function() {
			model.frames++;

			if (model.frames % model.gameSpeed === 0 && !controller.gameOver) {
				snake.clearSnake();
				model.generateFood();
				snake.updateSnake(snake.userControl);
				display.displayScore(snake.snakeLength);
			}

			controller.game = window.requestAnimationFrame(controller.runGame);
		},
		start: function start() {
			controller.changeSize(model.gameSize);
			model.prepareGame();
			if (!controller.game) {
				controller.runGame();
			}
		},
		stop: function stop() {
			if (controller.game)  {
				window.cancelAnimationFrame(controller.game);
				controller.game = null;
			}
		}
	};





	document.addEventListener("keydown", function(e){
		if (!controller.gameOver) {
			if (e.keyCode === 37 || e.keyCode === 38
				 || e.keyCode === 39 || e.keyCode === 40) {
				snake.userControl = e.keyCode;
			}
		} else {
			snake.userControl = null;
		}

		if (e.keyCode - snake.userControlPrevious === 2
			 || e.keyCode - snake.userControlPrevious === -2 ) {
				snake.userControl = snake.userControlPrevious;
		}
	}, false);




	var gameSizeButton = document.getElementById("game-size-btn");
	var sizeOptions = document.getElementById("size-options-container");

	gameSizeButton.addEventListener("click", function() {
		sizeOptions.style.display = (sizeOptions.dataset.toggled ^= 1) ? "block" : "none";
	}, false);


	for (var i = 1; i <= 3; i++) {
		var button = document.getElementById("size-option-" + i);

		button.addEventListener("click", function() {
			model.gameSize = this.innerHTML;
			console.log(model.gameSize)
		});
	};





	console.log(model.gameSize)






	controller.start();





});



