const cards = document.querySelectorAll(".card");
let hasFlippedCard = false;
let firstCard, secondCard;
let boardLocked = false;

function flipCard() {
  if (!boardLocked && this != firstCard) {
    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
    } else {
      secondCard = this;
      hasFlippedCard = false;
      checkForMatch();
    }
  }
}

function checkForMatch() {
  if (firstCard.dataset.card === secondCard.dataset.card) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

	resetBoard();
}

function unflipCards() {
  boardLocked = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

		resetBoard();
  }, 1500);
}

function resetBoard() {
	hasFlippedCard = false;
	boardLocked = false;
	firstCard = null;
	secondCard = null;
}

function shuffleCards() {
	cards.forEach((card) => {
		let randomPosition = Math.floor(Math.random() * 12);
		card.style.order = randomPosition;
	});
}

shuffleCards();

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

