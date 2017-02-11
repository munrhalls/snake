document.addEventListener("DOMContentLoaded", function(event) {

	var display = {
		gameOverMsg: function(msg) {
			var msgElement = document.getElementById("message");
			msgElement.innerHTML = msg;
			msgElement.style.fontSize = "60px"
			msgElement.style.top = "100px";
			this.gameOverStyle();
		},
		gameOverStyle: function() {
			var canvas = document.getElementById("canvas");
			( canvas).style.backgroundColor = "black";
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
		  console.log(x, y);
		 	context.arc(x, y, this.snakeSize, 0,2*Math.PI, false);
		 	context.fill();
 			},
		snakeLife: function() {
			if (controller.gameOver) {
				this.snakeSize = 70;
				this.snakeColor = "red"
			}
		},
		clearSnake: function() {
			context.clearRect(0, 0, 500, 500);
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
			this.snakeBlocks.pop();
			this.snakeBlocks.unshift([this.snakePositionX, this.snakePositionY]);

			controller.checkCollision(snake.snakeBlocks, ignoreFood);

			for (var i = 0; i < this.snakeLength; i++) {
				this.createSnake(this.snakeBlocks[i][0], this.snakeBlocks[i][1], 10, 10);
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
		gameSize: "normal",
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
			console.log(squaresPerRow)
			this.foodLocation[0] = (Math.floor(Math.random()	* (squaresPerRow - 1)) + 1) * this.gridSize - this.gridSize / 2
			this.foodLocation[1] = (Math.floor(Math.random()	* (squaresPerRow - 1)) + 1) * this.gridSize - this.gridSize / 2
			console.log(this.foodLocation[0])
			console.log(this.foodLocation[1])
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
				this.foodColor = "red";
			} else if (random < 2) {
				this.foodColor = "yellow";
			} else if (random <= 3) {
				this.foodColor = "purple";
			}
		},
		prepareGame: function() {
			model.createGrid();
			model.createBoard();
			model.generateFoodLocation(model.squaresPerRow);
		}
	};

	var controller = {
		gameOver: false,
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
				display.gameOverMsg("Your snake has hit a wall! <br><br> Game over!!!");
			}
		},
		changeSize: function(size) {
			model.gameSize = size;

			if (model.gameSize === "normal") {
				model.gridSize = 10;
				model.foodSize = 7.5;
				snake.snakeSize = 7.5;
				snake.snakePositionX = 245;
				snake.snakePositionY = 245;
				snake.snakePathSize = 10;
			} else if (model.gameSize === "large") {
				model.gridSize = 20;
				model.foodSize = 10;
				snake.snakeSize = 10;
				snake.snakePathSize = 20;
			} else if (model.gameSize = "gargantuan") {

				model.gridSize = 50;
				model.foodSize = 25;
				model.gameSpeed = 30;
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
			}

		window.requestAnimationFrame(controller.runGame);
		}
	};

	document.addEventListener("keydown", function(e){
		if (!controller.gameOver) {
			if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
				snake.userControl = e.keyCode;
			}
		} else {
			snake.userControl = null;
		}

		if (e.keyCode - snake.userControlPrevious === 2 ||e.keyCode - snake.userControlPrevious === -2 ) {
				snake.userControl = snake.userControlPrevious;
		}
	});

		controller.changeSize("normal");
		model.prepareGame();
		controller.runGame();
		window.requestAnimationFrame(controller.runGame);

});



