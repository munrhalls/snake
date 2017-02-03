/*
components:
- moving snake
	- setting up the snake - a moving square
	- setting its direction
	- ending the game if it hits itself or board edge
	- enlarging the snake when it eats a food element

- generating food element at random location at the start of the game and each time the snake its an element

-	controlling the game with user input
	- starting the game on start button
	- changing direction on user input
	- pausing the game on user input
	- ending the game when the snake hits itself or board edge
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

	var snake = {
		setDirection: function(direction) {
		},
		createSnake: function(x, y) {
			var canvas = document.getElementById("canvas");
			context = canvas.getContext("2d");
		  context.fillStyle = "#fff";
		  context.fillRect(x, y, 10, 10);
		},
		moveSnake: function(direction) {
				x = 250;
				y = 250;
				var canvas = document.getElementById("canvas");
				context = canvas.getContext("2d");
			  context.fillStyle = "#fff";

			setInterval(function() {
				context.fillRect(x, y, 10, 10);
				context.clearRect(x - 10, y, 10, 10);
				x += 10;
				console.log(x)
			}, 1000, direction)
		}
	};

	var controller = {
		parseInput: function(input) {
			switch (input + "") {
				case "37":
					return "left";
					break;
				case "38":
					return "up";
					break;
				case "39":
					return "right";
					break;
				case "40":
					return "down";
					break;
				default:
					return "right";
					break;
			}
		},
		processInput: function(input) {
			var direction = controller.parseInput(input);
			snake.moveSnake(direction);
			console.log(direction)
		}
	};

document.addEventListener("DOMContentLoaded", function(event) {
			var input;
			snake.moveSnake(input);
			document.addEventListener("keydown", function(e){
				input = e.keyCode;
				console.log(input)
				snake.moveSnake(input);

		});
});



