// Game variables
let wordLength = 5;
let currentWord = "";
let guessedRows = [];
let activeRow = 0;

// DOM elements
const board = document.getElementById("game-board");
const status = document.getElementById("status");
const wordLengthSelect = document.getElementById("word-length");
const newWordBtn = document.getElementById("new-word");
const hintBtn = document.getElementById("hint-btn");
const suggestBtn = document.getElementById("suggest-btn");
const themeToggle = document.getElementById("theme-toggle");

// Word list (expandable)
const words = ["APPLE", "BANANA", "CHERRY", "ORANGE", "PEACH", "MANGO", "LEMON", "GRAPE", "BERRY"];

// Initialize the game
function initGame() {
    wordLength = parseInt(wordLengthSelect.value);
    currentWord = generateWord(wordLength);
    guessedRows = Array(6).fill("").map(() => Array(wordLength).fill(""));
    activeRow = 0;
    status.textContent = "";
    createGrid();
}

// Generate a word
function generateWord(length) {
    const filteredWords = words.filter((word) => word.length === length);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

// Create the game board
function createGrid() {
    board.innerHTML = "";
    guessedRows.forEach((_, i) => {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        board.appendChild(row);
    });
}

// Update the grid
function updateGrid() {
    const rows = document.querySelectorAll(".row");
    guessedRows.forEach((row, i) => {
        row.forEach((letter, j) => {
            const tile = rows[i].children[j];
            tile.textContent = letter;
            if (activeRow > i) {
                if (letter === currentWord[j]) {
                    tile.classList.add("correct");
                } else if (currentWord.includes(letter)) {
                    tile.classList.add("present");
                } else {
                    tile.classList.add("absent");
                }
            }
        });
    });
}

// Handle input
function handleInput(e) {
    const key = e.key.toUpperCase();
    if (key === "ENTER") {
        submitGuess();
    } else if (key === "BACKSPACE") {
        deleteChar();
    } else if (/^[A-Z]$/.test(key)) {
        addChar(key);
    }
}

// Add character
function addChar(char) {
    const currentRow = guessedRows[activeRow];
    const emptyIndex = currentRow.indexOf("");
    if (emptyIndex !== -1) {
        currentRow[emptyIndex] = char;
        updateGrid();
    }
}

// Delete character
function deleteChar() {
  const currentRow = guessedRows[activeRow];
  // Find the rightmost filled character
  const filledIndex = currentRow.findLastIndex((letter) => letter !== "");
  if (filledIndex !== -1) {
      currentRow[filledIndex] = ""; // Clear the character
      updateGrid(); // Update the grid to reflect changes
  }
}


// Submit guess
function submitGuess() {
    const guess = guessedRows[activeRow].join("");
    if (guess.length < wordLength) {
        status.textContent = "Not enough letters!";
        return;
    }
    if (guess === currentWord) {
        status.textContent = "You guessed it! 🎉";
    } else if (activeRow < 5) {
        activeRow++;
        status.textContent = "";
    } else {
        status.textContent = `Game over! The word was ${currentWord}.`;
    }
    updateGrid();
}

// Event listeners
document.addEventListener("keydown", handleInput);
newWordBtn.addEventListener("click", initGame);
hintBtn.addEventListener("click", () => alert(`Hint: The first letter is "${currentWord[0]}"`));
suggestBtn.addEventListener("click", () => alert(`Try guessing: ${generateWord(wordLength)}`));
themeToggle.addEventListener("click", () => document.body.classList.toggle("dark-mode"));

// Start the game
initGame();
