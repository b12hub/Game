let currentLevel = 1;
const MAX_TIME = 60;
let timerInterval;

const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
    "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
    "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜",
    "🌸", "🍒", "🍓", "🌼", "🌷", "🌹", "🍑", "🍭",
    "🐱", "🐶", "🐰", "🐻", "🦊", "🐼", "🐸", "🦄",
    "💎", "🎀", "✨", "🌙", "🔥", "⚡", "🍩", "🍕"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let totalCards = 0;

const flipSound = document.getElementById('flip-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');


function startTimer() {
    let timeLeft = MAX_TIME;
    document.getElementById("timer-display").textContent = `Time: ${timeLeft}s`;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-display").textContent = `Time: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            loseLevel();
        }
    }, 1000);
}

function loseLevel() {

    loseSound.currentTime = 0;
    loseSound.play().catch(() => {});

    // Short delay before alert so the sound can kick in
    setTimeout(() => {
        alert(` Time's up!\n You lost Level ${currentLevel} 😓\n Try your best🫡`);
        resetGame();
        // Restart the same level
        setUpBoard(Math.ceil(Math.sqrt(totalCards)));
        startTimer();
    }, 500);
}

function startGame() {
    const boardSize = currentLevel + 1;
    let width = boardSize, height = boardSize;
    if ((width * height) % 2 !== 0) height = boardSize + 1;

    totalCards = width * height;
    document.getElementById("level-display").textContent = `Level ${currentLevel} (${width}x${height})`;

    resetGame();
    setUpBoard(width, height);
    startTimer();
}

function setUpBoard(width) {
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

    const numberOfPairs = Math.floor(totalCards / 2);
    const selectedEmojis = shuffle(emojis).slice(0, numberOfPairs);
    const gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);

    if (gameEmojis.length < totalCards) gameEmojis.push('');

    gameEmojis.forEach((emoji) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;

        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        const front = document.createElement("div");
        front.classList.add("card-front");

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.textContent = emoji;

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

    card.classList.add("flipped");
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unFlipCards();
}

function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    // Fade-out and removal sequence:
    setTimeout(() => {
        firstCard.style.opacity = "0";
        secondCard.style.opacity = "0";

        setTimeout(() => {
            firstCard.remove();
            secondCard.remove();
            resetTurn();
            // If board is empty, level is won
            if (document.querySelectorAll(".card").length === 0) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    winSound.play().catch(() => {});
                    setTimeout(() => {
                        alert(`You won Level ${currentLevel} 🏆\nKeep slaying, emoji queen 😎`);
                        nextLevel();
                    }, 500);
                }, 300);
            }
        }, 500);
    }, 500);
}

function unFlipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
    }, 650);
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function resetGame() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    resetTurn();
    clearInterval(timerInterval);
}

function nextLevel() {
    if (currentLevel < 7) {
        currentLevel++;
        startGame();
    } else {
        alert("🎉 Game complete! You're a memory master.");
        currentLevel = 1;
        startGame();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById("start").addEventListener("click", startGame);
