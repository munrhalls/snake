/*
components:
- moving snake
	- setting up the snake - a moving square
	- setting its direction
	- ending the game if it hits itself or board edge
	- enlarging the snake when it eats a food element

-	controlling the game with user input
	- starting the game on start button
	- changing direction on user input
	- pausing the game on user input
	- ending the game when the snake hits itself or board edge

FOOD
- generating food element at random location at the start of the game
- checking if the food element was eaten
	- IF NOT - leave it as is
	- IF YES - remove it, enlarge the snake and:
		- randomize new location
		- check if that location isn't occupied by the snake right now
		- check if it isn't the same as previous location
		- if both above are false, place food at that location, ELSE
		- randomize new location again and repeat the steps above

 and each time the snake its an element

*/

/*
- moving snake
	- setting up the snake - a moving square - requirements:
		- we need to create the square, then erase it, then re-create it at next location
		- we need square creation method
		- we need method to capture user input
		- we need method that modifies the coordinate modifying method accordingly to user input
		- we need a method that determines which coordinate needs to be modified based on user input - then returns it
		- we need a method that determines in what direction is that coordinate modified (ascending or descending) - then returns it
		- we need a method that takes these two inputs and creates variable with new coordinate
		- we need a method that inserts this new coordinate into the snake creating function
		- we need a method that iterates it
*/


/*
Objects:
model,
snake

 /*
 - make it pretty

 - implement game over conditions
 	- snake hitting itself
 	- snake hitting borders of the board

 - implement view
 	- score count
 	- high score
 	- start
 	- pause
 	- change difficiulty

 /*
	What's left
 */




document.addEventListener("DOMContentLoaded", function(event) {


	var snake = {
		snakeLength: 1,
		snakePositionX: 250,
		snakePositionY: 250,
		snakeInitialDirection: 39,
		createSnake: function(x, y) {
		  context.beginPath();
		 	context.arc(x, y, 5,0,2*Math.PI);
		 	context.fillStyle = "#01650c";
		 	context.fill();
 			},
		clearSnake: function(x, y) {
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

			for (var i = 0; i < this.snakeLength; i++) {
				this.snakeBlocks.push([]);
				this.snakeBlocks[i].push(this.snakePositionX, this.snakePositionY);
			}

			this.getSnakeDirection(input);
			this.snakeBlocks.pop();
			this.snakeBlocks.unshift([this.snakePositionX, this.snakePositionY]);

			for (var i = 0; i < this.snakeLength; i++) {
				this.createSnake(this.snakeBlocks[i][0], this.snakeBlocks[i][1], 10, 10);

			}
		}
	};

	var model = {
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

			if (snake.checkFood()) {
				snake.snakeLength++;
				model.generateFoodLocation();
			}
			context.beginPath();
			context.fillStyle = "#fff919";
			context.arc(this.foodLocation[0], this.foodLocation[1], 5, 0.2*Math.PI, false);
			context.fill();
		},
		runGame: function() {
			frames++;
			model.generateFood();
			if (frames % 10 === 0) {
				snake.clearSnake(snake.snakePositionX, snake.snakePositionY, 10, 10);
				snake.updateSnake(input);
			}

		window.requestAnimationFrame(model.runGame);
		}
	};

	model.createGrid();

	var frames = 0;
	var input = snake.snakeInitialDirection;

	document.addEventListener("keydown", function(e){
		if (e.keyCode === 37 ||e.keyCode === 38 ||e.keyCode === 39 ||e.keyCode === 40) {
			input = e.keyCode;
		} else {
			console.log("Not a snake move command.")
		}

	});

	model.createBoard();
	model.generateFoodLocation();
	model.runGame();

	window.requestAnimationFrame(model.runGame);

});



