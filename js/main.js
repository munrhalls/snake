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


var model = {
	createBoard: function() {
			var canvas = document.getElementById("canvas");
				context = canvas.getContext("2d");
			  context.fillStyle = "#fff";
			  return context;
		}
}




	var snake = {

		createSnake: function(input, x, y) {
				var context = model.createBoard();
			  context.clearRect(0, 0, 500, 500)
			 	context.fillRect(250 + x, 250 + y, 10, 10);
		}
	};

document.addEventListener("DOMContentLoaded", function(event) {
			var input = 39;
			var x = 0;
			var y = 0;

			document.addEventListener("keydown", function(e){
				input = e.keyCode;
			});

			setInterval(function() {
				if (input === 37) {
					x -= 10;
				}
				else if (input === 38) {
					y -= 10;
				}
				else if (input === 39) {
					x += 10;
				}
				else if(input === 40) {
					y += 10;
				} else {
					x += 10;
				}
				snake.createSnake(input, x, y);
			}, 400, input, x, y);

});



