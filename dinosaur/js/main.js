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

// Game settings
const body = document.querySelector('body');
body.style.overflow = 'hidden';
body.style.backgroundColor = 'black';

const canvas = document.querySelector('canvas');
canvas.style.backgroundColor = 'white';
canvas.width = 16 * 55;
canvas.height = 9 * 55;
const canvasAspectRatio = canvas.width / canvas.height;

const ctx = canvas.getContext('2d');
const gravity = 0.8;

// Variables
let keys = {" ": false};
let cacti = [];
let cactusSpawnTime = 100;
let score = 0;
let highscore = 0;
let time = 0;
let gameState = 'title';

const player = {
	x: 40,
	y: canvas.height - 60,
	width: 60,
	height: 60,
	sprite: new Image(),
	vSpeed: 0,
	jumpForce: 16,
	isJumping: false,

	draw() {
		ctx.drawImage(this.sprite, this.x, this.y);
	},

	jump() {
		this.isJumping = true;
		this.vSpeed -= this.jumpForce;
	},
};

const background = {
	x: 0,
	y: 0,
	width: 525,
	height: 200,
	sprite: new Image(),
	speed: 4,

	draw() {
		ctx.drawImage(this.sprite, this.x, 0, canvas.width, canvas.height);
		ctx.drawImage(this.sprite, this.x + canvas.width, 0, canvas.width, canvas.height);
	},

	move() {
		if (this.x <= -canvas.width) {
			this.x = 0;
		} else {
			this.x -= this.speed;
		}
	},
}

window.onload = () => {
	player.sprite.src = '../art/dino.png';
	background.sprite.src = '../art/background.png';
};

addEventListener('keydown', event => { 
	if (event.key in keys) {
		keys[event.key] = true;
	}
});
addEventListener('keyup', event => { 
	if (event.key in keys) {
		keys[event.key] = false;
	}
});

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
			init();
			clearInterval(startgame);
		}
	}, 1000 / 60);
}

// Initialize game
function init() {
	player.y = canvas.height - 60;
	player.vSpeed = 0;
	player.isJumping = false;
	background.x = 0;
	cacti = [];
	cactusSpawnTime = 100;
	score = 0;
	time = 0;
	gameState = 'play';
	if (window.localStorage.getItem('highscore')) {
		highscore = window.localStorage.getItem('highscore');
	} else {
		highscore = 0;
	}
	gameLoop();
}

// Game loop
function gameLoop() {
	if (gameState === 'play') {
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

		// Draw highscore
		if (score > highscore) {
			highscore = score;
		}
		ctx.textAlign = 'right';
		ctx.fillText(`Highscore: ${highscore}`, canvas.width - 10, 30);


		// Move background
		background.move();

		// Create cactus on random time
		if (time % cactusSpawnTime === 0) {
			let random = Math.floor(Math.random() * 3);
			if (random === 0) {
				cacti.push(new Cactus());
			}
			console.log(random);
		}

		// Decrease cactus spawn time
		if (time % 100 === 0) {
			cactusSpawnTime--;
		}
	
		// Draw and move cactus
		cacti.forEach(cactus => {
			if (cactus.x <= -60) {
				cacti.splice(cactus, 1);
			} else {
				cactus.draw();
				cactus.move();

				// Check collision with cactus
				if (isColliding(player, cactus)) {
					gameOver();
				}
			}
		});

		requestAnimationFrame(gameLoop);
	} else {
		cancelAnimationFrame(gameLoop);
	}

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

// Check collision with cactus
function isColliding(obj1, obj2) {
	return obj1.x + obj1.width >= obj2.x &&
		obj1.x <= obj2.x + obj2.width &&
		obj1.y + obj1.height >= obj2.y;
}

// Game over
function gameOver() {
	gameState = 'gameOver';

	// Save highscore
	window.localStorage.setItem('highscore', highscore);

	// Draw game over text
	ctx.textAlign = 'center';
	ctx.font = '60px Arial';
	ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
	ctx.font = '30px Arial';
	ctx.fillText(`Press space to replay`, canvas.width / 2, canvas.height / 2 + 60);

	// Start game
	let startgame = setInterval(() => {
		if (keys[' ']) {
			gameState = 'play';
			init();
			clearInterval(startgame);
		}
	}, 1000 / 60);
}

// Initialize game
titleScreen();
