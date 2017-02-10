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



 */

document.addEventListener("DOMContentLoaded", function(event) {

	var snake = {
		createSnake: function(x, y) {
			context.fillStyle = "#fff";
		 	context.fillRect(x, y, 10, 10);
 			},
		clearSnake: function() {
			context.clearRect(0, 0, 500 , 500);
		},
		snakeBlocks: [],
		checkFood: function(x, y) {
			if (x === model.foodLocation[0] && y === model.foodLocation[1]) {
					return true;
			} else {
				return false;
			}
		},
		getSnakeDirection: function(input) {
			if (input === 37) {
				x -= 10;
			} else if(input === 38) {
				y -= 10;
			} else if(input === 39) {
				x += 10
			} else if (input === 40) {
				y += 10;
			} else
				return null;
		},
		updateSnake: function(input) {

			var snakeLength = 10;

			for (var i = 0; i <                                                         snakeLength; i++) {

				this.snakeBlocks.push([]);
				this.snakeBlocks[i].push(x, y);
			}

			this.getSnakeDirection(input);
			snake.snakeBlocks.pop();
			snake.snakeBlocks.unshift([x, y]);


			for (var i = 0; i < snakeLength; i++) {
				snake.createSnake(this.snakeBlocks[i][0], this.snakeBlocks[i][1], 10, 10);

				console.log(this.snakeBlocks[i][0]);
			}

		}
	}


	var model = {
		createBoard: function() {
				var canvas = document.getElementById("canvas");
					context = canvas.getContext("2d");
				  context.fillStyle = "#fff";
				  return context;
			},
		gridRows: [""],
		gridCols: [""],
		generateGrid: function() {

			for (var i = 0; i <= 490; i += 10) {
				this.gridRows.push(i);
			}
		},
		foodLocation: ["", ""],
		generateFoodLocation: function() {
			this.foodLocation[0] = (Math.floor(Math.random() * 50) * 10);
			this.foodLocation[1] = (Math.floor(Math.random() * 50) * 10);
		},
		generateFood: function() {

			if (snake.checkFood(x, y)) {
				model.generateFoodLocation();
			}

			context.fillStyle = "#f9ff9f";
			context.fillRect(this.foodLocation[0], this.foodLocation[1], 10, 10);

		},
		runGame: function() {
			frames++;

			model.generateFood();
			if (frames % 10 === 0) {
				snake.clearSnake();
				snake.updateSnake(input);
			}

		window.requestAnimationFrame(model.runGame);
		}

	}



	var input = 39;
	var x = 250;
	var y = 250;
	var frames = 0;

	document.addEventListener("keydown", function(e){
		input = e.keyCode;
	});

	model.createBoard();
	model.generateFoodLocation();
	model.runGame();




	window.requestAnimationFrame(model.runGame);

});



