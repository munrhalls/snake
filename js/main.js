document.addEventListener("DOMContentLoaded", function(event) {


	var display = {
		displayMessage: function(msg) {
			var msgElement = document.getElementById("message");
			msgElement.innerHTML = msg;
		}

	};

	var snake = {
		snakeLength: 1,
		snakePositionX: 250,
		snakePositionY: 250,
		snakeInitialDirection: 39,
		createSnake: function(x, y) {
		  context.beginPath();
		 	context.arc(x, y, 5,0,2*Math.PI);
		 	context.fillStyle = "#13c512";
		 	context.fill();
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
		getSnakeDirection: function(input) {

			if (input === 37) {
				this.snakePositionX -= 10;
			} else if(input === 38) {
				this.snakePositionY -= 10;
			} else if(input === 39) {
				this.snakePositionX += 10
			} else if (input === 40) {
				this.snakePositionY += 10;
			}

		},
		updateSnake: function(input) {

			var ignoreFood;

			if (snake.checkFood()) {
				model.generateFoodLocation();
				snake.snakeLength++;
				ignoreFood = 1;
			} else {
				ignoreFood = 0;
			}

			for (var i = 0; i < this.snakeLength; i++) {
				this.snakeBlocks.push([]);
				this.snakeBlocks[i].push(this.snakePositionX, this.snakePositionY);
			}

			this.getSnakeDirection(input);
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
		createGrid: function() {
			var grid = document.getElementById("grid");
			for (var i = 0; i < 2500; i++) {
				var row = document.createElement("div");
				row.className = "row";
				row.style.float = "left";
				row.style.border = "1px solid #000"
				row.style.width = "8px";
				row.style.height = "8px"
				grid.appendChild(row);
			}
			console.log("CREATING GRID AGAIN!")
		},
		createBoard: function() {
				var canvas = document.getElementById("canvas");
				context = canvas.getContext("2d");
			},
		foodLocation: ["", ""],
		generateFoodLocation: function() {
			this.foodLocation[0] = (Math.floor(Math.random() * 50) * 10);
			this.foodLocation[1] = (Math.floor(Math.random() * 50) * 10);
		},
		generateFood: function() {

			context.beginPath();
			context.fillStyle = "#fff919";
			context.arc(this.foodLocation[0], this.foodLocation[1], 5, 0.2*Math.PI, false);
			context.fill();
		},
		prepareGame: function() {
			model.createGrid();
			model.createBoard();
			model.generateFoodLocation();
		},
		runGame: function() {
			model.frames++;

			if (model.frames % 10 === 0) {
				snake.clearSnake();
				model.generateFood();
				snake.updateSnake(input);

			}

		window.requestAnimationFrame(model.runGame);
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

				display.displayMessage("Your snake has hit itself! It's all over!!!");
				}
			}
		},
		checkWalls: function(currentLocation) {
			if (currentLocation[0]  <= 0 || currentLocation[1]  <= 0
				|| currentLocation[0] > 490 || currentLocation[1] > 490) {
				controller.gameOver = true;
				display.displayMessage("Your snake has hit a wall! Game over!!!");
			}
		}
	};

	var input = snake.snakeInitialDirection;

	document.addEventListener("keydown", function(e){
		if (!controller.gameOver) {
			if (e.keyCode === 37 ||e.keyCode === 38 ||e.keyCode === 39 ||e.keyCode === 40) {
				input = e.keyCode;
			}
		} else {
			input = null;
		}
	});

	model.prepareGame();

model.runGame();
	if (!controller.gameOver) {

		window.requestAnimationFrame(model.runGame);
	}

});



