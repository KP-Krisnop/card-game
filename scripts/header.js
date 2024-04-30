const gameButton = document.querySelector('#game-button');
const gamePageOverlay = document.querySelectorAll('#game-page-overlay');
const newGamePage = document.querySelector('#new-game-page');
const playerInputs = document.querySelectorAll('#player-input');
const circle = document.querySelector('#circle');
const directionText = document.querySelector('#direction-text');
const randPlyBtn = document.querySelectorAll('#rand-ply-btn');
const playerRankNameDisplay = document.querySelectorAll('#player-rank-name');
const playerRankScoreDisplay = document.querySelectorAll('#player-rank-score');
const cardRanks = document.querySelectorAll('#card');
const startGameButton = document.querySelector('#start-button');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const exitButton = document.querySelector('#exit-button');

let currentPageIndex = 0;
let randomPlayerType = 'auto';
let selectedPlayer = [];
let playerRankData = [[], [], [], []];

let lastRandom;

let storedPlayerNames = JSON.parse(localStorage.getItem('playerNames'));
let storedMachineHolder = JSON.parse(localStorage.getItem('machineHolder'));

if (localStorage.getItem('playerNames') !== null) {
  storedPlayerNames.forEach((playerName, index) => {
    playerInputs[index].value = playerName;
  });
}

machineDirection = storedMachineHolder;

gameButton.addEventListener('click', () => {
  if (!gameState) {
    setTimeout(() => {
      section.style.display = 'none';
    }, 500);

    gamePageOverlay[0].style.display = 'block';
    setTimeout(() => {
      gamePageOverlay[0].classList.toggle('open');
    }, 0);
    newGamePage.classList.toggle('open');
    displayStartPage(currentPageIndex);
    playerInputs[0].focus();
    previousButton.innerText = 'Cancel';
    nextButton.innerText = 'Next';
  } else {
    gamePageOverlay[1].style.display = 'block';
    setTimeout(() => {
      gamePageOverlay[1].classList.toggle('open');
    }, 0);
    endGame();
  }
});

previousButton.addEventListener('click', () => {
  if (previousButton.innerText == 'Cancel') {
    setTimeout(() => {
      gamePageOverlay[0].style.display = 'none';
    }, 500);

    section.style.display = 'flex';
    gamePageOverlay[0].classList.toggle('open');
    newGamePage.classList.toggle('open');
  } else {
    currentPageIndex--;
    displayStartPage(currentPageIndex);
    if (currentPageIndex == 0) {
      previousButton.innerText = 'Cancel';
    }
  }
});

nextButton.addEventListener('click', () => {
  if (currentPageIndex == 0 && !emptyInput(playerInputs)) {
    currentPageIndex++;
    lockInput(playerInputs);
    displayStartPage(currentPageIndex);
    previousButton.innerText = 'Previous';
  } else if (currentPageIndex == 1 && selectedPlayer.length == 2) {
    currentPageIndex++;
    displayStartPage(currentPageIndex);
  } else if (currentPageIndex == 2 && machineDirection !== null) {
    currentPageIndex++;
    displayStartPage(currentPageIndex);
  } else if (currentPageIndex == 3) {
    gamePageOverlay[0].classList.toggle('open');
    newGamePage.classList.toggle('open');
    section.style.display = 'flex';
    startGame();
  } else if (currentPageIndex == 0 && emptyInput(playerInputs)) {
    showError(1);
  } else if (currentPageIndex == 1 && selectedPlayer.length !== 2) {
    showError(2);
  } else if (currentPageIndex == 2 && machineDirection == null) {
    showError(3);
  }
});

exitButton.addEventListener('click', () => {
  gamePageOverlay[1].classList.toggle('open');

  currentPageIndex = 0;
  randomPlayerType = 'auto';
  selectedPlayer = [];
  playerRankData = [[], [], [], []];
  playerNames = [];
  playerScores = [[0], [0], [0], [0]];
  scoreChanges = [];
  round = 0;

  resetDisplay();
});

function displayStartPage(pageIndex) {
  const inquiries = document.querySelectorAll('#inquiry');

  switch (pageIndex) {
    case 0:
      playerInputs.forEach((input) => {
        input.classList.remove('selected-0');
        input.classList.remove('selected-1');
        input.classList.remove('selected-2');
      });

      lockInput(playerInputs);

      inquiries.forEach((inquiry) => inquiry.classList.remove('active'));
      inquiries[pageIndex].classList.toggle('active');

      nextButton.innerText = 'Next';
      previousButton.innerText = 'Cancel';
      break;
    case 1:
      randomPlayerType = 'auto';

      inquiries.forEach((inquiry) => inquiry.classList.remove('active'));
      inquiries[pageIndex].classList.toggle('active');

      playerInputs.forEach((input) => {
        input.classList.remove('selected-0');
        input.classList.remove('selected-1');
        input.classList.remove('selected-2');
      });

      selectedPlayer.forEach((value, index) => {
        playerInputs[value].classList.add(`selected-${index}`);
      });

      nextButton.innerText = 'Next';
      previousButton.innerText = 'Previous';
      break;
    case 2:
      inquiries.forEach((inquiry) => inquiry.classList.remove('active'));
      inquiries[pageIndex].classList.toggle('active');

      if (machineDirection !== null) {
        playerInputs[machineDirection].classList.add('selected-2');
      }

      nextButton.innerText = 'Next';
      previousButton.innerText = 'Previous';
      break;
    case 3:
      inquiries.forEach((inquiry) => inquiry.classList.remove('active'));
      inquiries[pageIndex].classList.toggle('active');
      nextButton.innerText = 'Start';
      previousButton.innerText = 'Previous';
      break;
    default:
      directionText.textContent = `Hello World! Page ${currentPageIndex}`;
      circle.appendChild(directionText);
      break;
  }
}

randPlyBtn.forEach((button) => {
  button.addEventListener('click', () => {
    autoRandomizer();
    playerInputs.forEach((input) => {
      input.classList.remove('selected-0');
      input.classList.remove('selected-1');
    });

    selectedPlayer.forEach((value, index) => {
      playerInputs[value].classList.add(`selected-${index}`);
    });
  });
});

playerInputs.forEach((input, index) => {
  input.addEventListener('click', () => {
    if (currentPageIndex == 1) {
      if (selectedPlayer.includes(index)) {
        selectedPlayer = selectedPlayer.filter((number) => number !== index);
        // console.log('removed');
      } else if (
        selectedPlayer.length == 1 &&
        [-3, -1, 1, 3].includes(selectedPlayer[0] - index)
      ) {
        selectedPlayer.push(index);
        // console.log('added');
      } else if (selectedPlayer.length == 0) {
        selectedPlayer.push(index);
        // console.log('added');
      }

      playerInputs.forEach((input) => {
        input.classList.remove('selected-0');
        input.classList.remove('selected-1');
      });

      selectedPlayer.forEach((value, index) => {
        playerInputs[value].classList.add(`selected-${index}`);
      });

      // console.log(selectedPlayer);
    } else if (currentPageIndex == 2) {
      machineDirection = index;
      playerInputs.forEach((input) => {
        input.classList.remove('selected-2');
      });

      playerInputs[index].classList.add('selected-2');
      console.log(machineDirection);
    }
  });
});

function autoRandomizer() {
  let firstPlayer = Math.floor(Math.random() * 4);
  let direction = Math.random() < 0.5 ? -1 : 1;

  selectedPlayer[0] = firstPlayer;

  if (firstPlayer + direction < 0) {
    selectedPlayer[1] = 3;
  } else if (firstPlayer + direction > 3) {
    selectedPlayer[1] = 0;
  } else {
    selectedPlayer[1] = firstPlayer + direction;
  }

  console.log(selectedPlayer);
}

function lockInput(inputs) {
  if (currentPageIndex == 0) {
    inputs.forEach((input) => {
      input.readOnly = false;
    });
  } else {
    inputs.forEach((input) => {
      input.readOnly = true;
    });
  }
}

function startGame() {
  playerInputs.forEach((playerInputs, index) => {
    playerNames[index] = playerInputs.value;
    playerNamesDisplay[index].innerText = playerInputs.value;
    scoreInputs[index].placeholder = playerInputs.value;
    gameButton.innerText = 'End';
  });

  displayValuedItem(playerNamesDisplay);
  displayValuedItem(scoresDisplay);
  displayScore(playerScores);
  scoreInputs[0].focus();

  let direction;

  if (selectedPlayer[0] == 0) {
    direction = selectedPlayer[1] == 1 ? 1 : -1;
  } else if (selectedPlayer[0] == 3) {
    direction = selectedPlayer[1] == 0 ? 1 : -1;
  } else {
    direction = selectedPlayer[1] > selectedPlayer[0] ? 1 : -1;
  }

  turnInput.value = selectedPlayer[0];
  directionInput.value = direction;

  gameState = true;

  localStorage.setItem('playerNames', JSON.stringify(playerNames));
  localStorage.setItem('machineHolder', machineDirection);

  window.onbeforeunload = function (event) {
    event.returnValue = 'Your game will not be saved?';
  };
}

function endGame() {
  playerScores.forEach((playerScore, index) => {
    playerRankData[index][0] = sumArray(playerScore);
    playerRankData[index][1] = playerNames[index];
  });

  playerRankData = playerRankData.sort((a, b) => b[0] - a[0]);

  for (let i = 0; i < 4; i++) {
    const playerScore = playerRankScoreDisplay[i];
    const playerName = playerRankNameDisplay[i];
    playerScore.innerText = playerRankData[i][0];
    playerName.innerText = playerRankData[i][1];
  }

  let [highest, lowest] = findRange2D(playerRankData);
  let scoreRange = highest - lowest;

  cardRanks.forEach((cardRank, index) => {
    cardRank.style.height = `${
      ((playerRankData[index][0] - lowest) / scoreRange) * 70 + 20
    }%`;
  });

  gameState = false;

  window.onbeforeunload = null;
}

function resetDisplay() {
  scoresDisplay.forEach((display) => {
    display.innerText = '-';
  });

  scoreChangesDisplay.forEach((display) => {
    display.innerText = '-';
  });

  roundNumber.innerText = 'Round 1';
  gameButton.innerText = 'Start';

  playerNamesDisplay.forEach((display, index) => {
    display.innerText = `Player ${index + 1}`;
    scoreInputs[index].placeholder = `Player ${index + 1}`;
  });

  displayValuedItem(playerNamesDisplay);
  displayValuedItem(scoresDisplay);
}

function findRange2D(numbers) {
  // Initialize variables to track the lowest and highest numbers seen so far
  let lowest = numbers[0][0];
  let highest = numbers[0][0];

  // Loop through the array to find the lowest and highest numbers
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i][0] < lowest) {
      lowest = numbers[i][0];
    } else if (numbers[i][0] > highest) {
      highest = numbers[i][0];
    }
  }

  // Return the range (difference between highest and lowest)
  return [highest, lowest];
}
