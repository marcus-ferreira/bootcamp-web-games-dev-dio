class Player {
	constructor() {
		this.x = 40;
		this.y = canvas.height - 60;
		this.width = 60;
		this.height = 60;
		this.sprite = new Image();
		this.sprite.src = '../art/dino.png';
		this.vSpeed = 0;
		this.jumpForce = 16;
		this.isJumping = false;
	};

	draw() {
		ctx.drawImage(this.sprite, this.x, this.y);
	};

	jump() {
		this.isJumping = true;
		this.vSpeed -= this.jumpForce;
	};
}


class Cactus {
	constructor() {
		this.x = canvas.width;
		this.y = canvas.height - 60;
		this.width = 60;
		this.height = 60;
		this.sprite = new Image();
		this.sprite.src = '../art/cactus.png';
		this.speed = 8;
	};

	draw() {
		ctx.drawImage(this.sprite, this.x, this.y);
	};

	move() {
		this.x -= this.speed;
	};
}


class Background {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 525;
		this.height = 200;
		this.sprite = new Image();
		this.sprite.src = '../art/background.png';
		this.speed = 4;
	};

	draw() {
		ctx.drawImage(this.sprite, this.x, 0, canvas.width, canvas.height);
		ctx.drawImage(this.sprite, this.x + canvas.width, 0, canvas.width, canvas.height);
	};

	move() {
		if (this.x <= -canvas.width) {
			this.x = 0;
		} else {
			this.x -= this.speed;
		}
	};
}


// Game settings
const body = document.querySelector('body');
body.style.backgroundColor = 'black';

const canvas = document.querySelector('canvas');
canvas.style.backgroundColor = 'white';
canvas.width = 16 * 55;
canvas.height = 9 * 55;

const ctx = canvas.getContext('2d');
const gravity = 0.8;
const player = new Player();
const background = new Background();
const cacti = [];
const keys = {};

addEventListener('keydown', event => { keys[event.key] = true; });
addEventListener('keyup', event => { keys[event.key] = false; })


// Variables
let score = 0;
let time = 0;
let gameState = 'title';


// Initialize game
init();


// Initialize game
function init() {

	// Restart variables
	score = 0;
	time = 0;
	gameState = 'title';

	// Play title screen
	titleScreen();
}


// Draw title screen
function titleScreen() {

	// Draw title and instructions
	ctx.textAlign = 'center';
	ctx.font = '60px Arial';
	ctx.fillText('DINO RUN', canvas.width / 2, canvas.height / 2);
	ctx.font = '30px Arial';
	ctx.fillText('Press space to start', canvas.width / 2, canvas.height / 2 + 60);

	// Start game
	let startgame = setInterval(() => {
		if (keys[' ']) {
			gameState = 'play';
			gameLoop();
			clearInterval(startgame);
		}
	}, 1000 / 60);
}


// Game loop
function gameLoop() {
	requestAnimationFrame(gameLoop);

	// Increments timer
	time++;

	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw sprites
	background.draw();
	player.draw();

	// Draw score
	score = parseInt(time / 10);
	ctx.font = "30px Arial";
	ctx.textAlign = 'left';
	ctx.fillText(`Score: ${score}`, 10, 30);

	// Move background
	background.move();

	// Create cactus on random time
	if (time % 10 == 0) {
		createCactus();
	}

	// Draw and move cactus
	for (let i = 0; i < cacti.length; i++) {
		const cactus = cacti[i];

		if (cactus.x <= -60) {
			cacti.splice(cacti[i]);
		} else {
			cactus.draw();
			cactus.move();
		}

		console.log(cacti);
	}

	// Check collision with cactus
	// if (isColliding(player, cactus)) {
	// gameOver();
	// }

	// Player jump
	if (keys[' '] && !player.isJumping) {
		player.jump();
	}

	if (player.isJumping) {
		player.vSpeed += gravity;
		player.y += player.vSpeed;

		// Check floor collision
		if (player.y >= canvas.height - player.height) {
			player.isJumping = false;
			player.y = canvas.height - player.height;
			player.vSpeed = 0;
		}
	}
}

// Create cactus
function createCactus() {
	const cactus = new Cactus();
	cacti.push(cactus);
	return cactus;
}

// Check collision with cactus
function isColliding(player, cactus) {
	return player.x + player.width >= cactus.x && player.x <= cactus.x + cactus.width && player.y + player.height >= cactus.y;
}


// Game over
function gameOver() {
	gameState = 'gameOver';

	// Draw game over text
	ctx.textAlign = 'center';
	ctx.font = '60px Arial';
	ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
	ctx.font = '30px Arial';
	ctx.fillText(`Press space to replay`, canvas.width / 2, canvas.height / 2 + 60);
}
