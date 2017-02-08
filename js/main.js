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
		createSnake: function(x, y, sizeX, sizeY) {
			context.fillStyle = "#fff";
		 	context.fillRect(250 + x, 250 + y, 10 + sizeX, 10 + sizeY);
		},
		clearSnake: function(x, y, size) {
			context.clearRect(250 + x, 250 + y, 10 , 10);
		},
		trackSnake: function() {


		},
		checkFood: function(x, y, food) {
			console.log(food[0], food[1])
			console.log(250 + x, 250 + y)

			if (250 + x === food[0] && 250 + y === food[1]) {
				alert(" ");
			}
		},
		updateSnake: function() {
			frames++
			if (frames % 8 === 0) {
				if (input === 37) {
					snake.clearSnake(x, y);
					x -= 10;
					snake.createSnake(x, y);
				}
				else if (input === 38) {
					snake.clearSnake(x, y);
					y -= 10;
					snake.createSnake(x, y);
				}
				else if (input === 39) {
					snake.clearSnake(x, y);
					x += 10;
					snake.createSnake(x, y);
				}
				else if(input === 40) {
					snake.clearSnake(x, y);
					y += 10;
					snake.createSnake(x, y);
				}
			}
		}
	};


	var model = {
		createBoard: function() {
				var canvas = document.getElementById("canvas");
					context = canvas.getContext("2d");
				  context.fillStyle = "#fff";
				  return context;
			},
		foodLocation: ["", ""],
		generateFoodLocation: function() {
			this.foodLocation[0] = (Math.floor(Math.random() * 50) * 10);
			this.foodLocation[1] = (Math.floor(Math.random() * 50) * 10);
		},
		generateFood: function() {

			if (this.foodLocation[0] === 250 + x && this.foodLocation[1] === 250 + y)  {
				model.generateFoodLocation();
			}

			context.fillStyle = "#f9ff9f";
			context.fillRect(this.foodLocation[0], this.foodLocation[1], 10, 10);

		},
		runGame: function() {
			model.createBoard();
			model.generateFood();
			snake.updateSnake();

		window.requestAnimationFrame(model.runGame);
		}

	}

	document.addEventListener("keydown", function(e){
		input = e.keyCode;
	});

	var input = 39;
	var x = 0;
	var y = 0;
	var frames = 0;

	model.generateFoodLocation();
	model.runGame();



	window.requestAnimationFrame(model.runGame);

});



