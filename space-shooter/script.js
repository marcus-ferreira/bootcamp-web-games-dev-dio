const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const enemiesImg = ["assets/art/enemy1.png", "assets/art/enemy2.png", "assets/art/enemy3.png"];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let enemyInterval;


function flyShip(event) {
	if (event.key === "ArrowUp" || event.key === "w") {
		event.preventDefault();
		moveUp();
	} else if (event.key === "ArrowDown" || event.key === "s") {
		event.preventDefault();
		moveDown();
	} else if (event.key === " ") {
		event.preventDefault();
		fireLaser();
	}
}

function moveUp() {
	let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

	if (topPosition === '0px') {
		return;
	} else {
		let position = parseInt(topPosition);
		position -= 50;
		yourShip.style.top = `${position}px`;
	}
}

function moveDown() {
	let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

	if (topPosition === '500px') {
		return;
	} else {
		let position = parseInt(topPosition);
		position += 50;
		yourShip.style.top = `${position}px`;
	}
}

function fireLaser() {
	let laser = createLaserElement();
	playArea.appendChild(laser);
	moveLaser(laser);
}

function createLaserElement() {
	let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
	let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
	let newLaser = document.createElement('img');
	newLaser.src = 'assets/art/shoot.png';
	newLaser.classList.add('laser');
	newLaser.style.left = `${xPosition}px`;
	newLaser.style.top = `${yPosition - 10}px`;
	return newLaser;
}

function moveLaser(laser) {
	let laserInterval = setInterval(() => {
		let xPosition = parseInt(laser.style.left);
		let enemies = document.querySelectorAll('.enemy');

		enemies.forEach(enemy => {
			if (checkLaserCollision(laser, enemy)) {
				enemy.src = 'assets/art/explosion.png';
				enemy.classList.remove('enemy');
				enemy.classList.add('dead-enemy');
				laser.remove();
				clearInterval(laserInterval);
			}
		});


		if (xPosition > 700) {
			laser.remove();
		} else {
			laser.style.left = `${xPosition + 8}px`;
		}
	}, 10);
}

function createEnemies() {
	let newEnemy = document.createElement('img');
	newEnemy.src = enemiesImg[Math.floor(Math.random() * enemiesImg.length)];
	newEnemy.classList.add('enemy');
	newEnemy.classList.add('enemy-transition');
	newEnemy.style.left = "650px";
	newEnemy.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
	playArea.appendChild(newEnemy);
	moveEnemy(newEnemy);
}

function moveEnemy(enemy) {
	let moveEnemyInterval = setInterval(() => {
		let xPosition = parseInt(enemy.style.left);

		if (xPosition <= 50) {
			if (Array.from(enemy.classList).includes('dead-enemy')) {
				enemy.remove();
			} else {
				// gameOver();
			}
		} else {
			enemy.style.left = `${xPosition - 4}px`;
		}
	}, 10);
}

function checkLaserCollision(laser, enemy) {
	let laserTop = parseInt(laser.style.top);
	let laserLeft = parseInt(laser.style.left);
	let laserBottom = laserTop - 20;
	let enemyTop = parseInt(enemy.style.top);
	let enemyLeft = parseInt(enemy.style.left);
	let enemyBottom = enemyTop - 30;

	if (laserLeft != 340 && laserLeft + 40 >= enemyLeft) {
		if (laserTop <= enemyTop && laserTop >= enemyBottom) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

startButton.addEventListener('click', playGame);

function playGame() {
	startButton.style.display = 'none';
	instructionsText.style.display = 'none';
	window.addEventListener('keydown', flyShip);
	enemyInterval = setInterval(createEnemies, 2000);
}

function gameOver() {
	window.removeEventListener('keydown', flyShip);
	clearInterval(enemyInterval);
	let enemies = document.querySelectorAll('.enemy');
	enemies.forEach(enemy => {
		enemy.remove();
	});
	let lasers = document.querySelectorAll('.laser');
	lasers.forEach(laser => {
		laser.remove();
	});
	setTimeout(() => {
		alert('Game Over');
		yourShip.style.top = '250px';
		startButton.style.display = 'block';
		instructionsText.style.display = 'block';
	}, 1000);
}