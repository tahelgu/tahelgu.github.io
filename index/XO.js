const board = document.getElementById("board");
const resetButton = document.getElementById("reset");
const startButton = document.getElementById("startGame");
const updateNamesButton = document.getElementById("updateNames");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const turnInfo = document.getElementById("turnInfo");
const player1NameDisplay = document.getElementById("player1Name");
const player2NameDisplay = document.getElementById("player2Name");
const player1WinsDisplay = document.getElementById("player1Wins");
const player2WinsDisplay = document.getElementById("player2Wins");
const scoreboard = document.getElementById("scoreboard");
let players = {};
let currentPlayer;
let gameBoard;
let gameOver = false;
let player1Wins = 0;
let player2Wins = 0;

function createBoard() {
    board.innerHTML = "";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", () => handleClick(i, cell));
        board.appendChild(cell);
    }
}


function startGame() {
    players.X = player1Input.value || "Player 1";
    players.O = player2Input.value || "Player 2";
    player1NameDisplay.textContent = players.X;
    player2NameDisplay.textContent = players.O;
    player1Wins = 0;
    player2Wins = 0;
    updateScoreboard();
    currentPlayer = Math.random() < 0.5 ? "X" : "O";

    board.style.display = "grid";
    resetButton.style.display = "block";
    updateNamesButton.style.display = "block";
    startButton.style.display = "none";
    scoreboard.style.display = "block";

    createBoard();
}

function updateNames() {
    players.X = player1Input.value || "Player 1";
    players.O = player2Input.value || "Player 2";
    player1NameDisplay.textContent = players.X;
    player2NameDisplay.textContent = players.O;
    player1Wins = 0;
    player2Wins = 0;
    updateScoreboard();
    startGame();
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;
    createBoard();
}
function updateTurnInfo() {
    turnInfo.innerHTML = `<span>${players[currentPlayer]}'s Turn (${currentPlayer})</span>`;
}
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            document.querySelectorAll(".cell")[a].classList.add("winning-cell");
            document.querySelectorAll(".cell")[b].classList.add("winning-cell");
            document.querySelectorAll(".cell")[c].classList.add("winning-cell");
            return true;
        }
    }
    return false;
}

function handleClick(index, cell) {
    if (gameBoard[index] || gameOver) return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWinner()) {
        turnInfo.textContent = `${players[currentPlayer]} Wins! 🎉`;
        document.body.classList.add("win-effect"); // ⚡ אפקט זוהר למסך
        gameOver = true;
        currentPlayer === "X" ? player1Wins++ : player2Wins++;
        updateScoreboard();
        return;
    }

    if (!gameBoard.includes("")) {
        turnInfo.textContent = "It's a Draw! 🤝";
        document.body.classList.add("win-effect"); // ⚡ אפקט זוהר למסך
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;
}

function checkWinner() {
    const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return winPatterns.some(pattern => gameBoard[pattern[0]] && gameBoard[pattern[0]] === gameBoard[pattern[1]] && gameBoard[pattern[0]] === gameBoard[pattern[2]]);
}

function updateScoreboard() {
    player1WinsDisplay.textContent = player1Wins;
    player2WinsDisplay.textContent = player2Wins;
}

resetButton.addEventListener("click", resetGame);
startButton.addEventListener("click", startGame);
updateNamesButton.addEventListener("click", updateNames);
