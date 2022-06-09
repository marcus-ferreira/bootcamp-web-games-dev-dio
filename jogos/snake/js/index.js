const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;

let box = 32;
let snake = [
	{
		x: 8 * box,
		y: 8 * box
	}
];
let direction = [1, 0];
let food = {
	x: Math.floor(Math.random() * 16) * box,
	y: Math.floor(Math.random() * 16) * box
}

function createBackground() {
	ctx.fillStyle = "lightgreen";
	ctx.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake() {
	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = "green";
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}
}

function drawFood() {
	ctx.fillStyle = "red";
	ctx.fillRect(food.x, food.y, box, box);
}

document.addEventListener('keydown', update);

function update(event) {
	if (event.code === "ArrowUp" && direction[1] !== 1) { direction = [0, -1] };
	if (event.code === "ArrowDown" && direction[1] !== -1) { direction = [0, 1] };
	if (event.code === "ArrowLeft" && direction[0] !== 1) { direction = [-1, 0] };
	if (event.code === "ArrowRight" && direction[0] !== -1) { direction = [1, 0] };
}

function startGame() {
	if (snake[0].x > 15 * box) { snake[0].x = 0 };
	if (snake[0].x < 0 * box) { snake[0].x = 15 * box };
	if (snake[0].y > 15 * box) { snake[0].y = 0 };
	if (snake[0].y < 0 * box) { snake[0].y = 15 * box };

	for (let i = 1; i < snake.length; i++) {
		if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
			clearInterval(game);
			alert("Game Over!");
		}
	}

	createBackground();
	createSnake();
	drawFood();

	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	snakeX += box * direction[0];
	snakeY += box * direction[1];

	if (snakeX !== food.x || snakeY !== food.y) {
		snake.pop();
	} else {
		food.x = Math.floor(Math.random() * 16) * box;
		food.y = Math.floor(Math.random() * 16) * box;
	}

	
	let newHead = {
		x: snakeX,
		y: snakeY
	}

	snake.unshift(newHead);

}

let game = setInterval(startGame, 100);
