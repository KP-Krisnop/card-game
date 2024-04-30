const roundNumber = document.querySelector('#round-number');
const continueButton = document.querySelector('#continue-button');
const playerNamesDisplay = document.querySelectorAll('#player-name');
const scoresDisplay = document.querySelectorAll('#score');
const scoreChangesDisplay = document.querySelectorAll('#score-change');
const scoreInputs = document.querySelectorAll('#score-input');

const haeder = document.querySelector('#header');
const section = document.querySelector('#section');

let gameState = false;

let playerNames = [];
let playerScores = [[0], [0], [0], [0]];
let scoreChanges = [];
let round = 1;

continueButton.addEventListener('click', () => {
  if (!emptyInput(scoreInputs) && gameState) {
    scoreInputs.forEach((scoreInput, index) => {
      playerScores[index].push(Number(scoreInput.value));
      scoreChanges[index] = Number(scoreInput.value);
      scoreInput.value = '';
    });

    console.log(playerScores);
    displayScore(playerScores);
    displayScoreChange(scoreChanges);
    displayRound(round);
    updateParam(scoreChanges, playerScores);
    round++;
  } else if (!gameState) {
    showError(0);
  } else if (emptyInput(scoreInputs)) {
    showError(4);
  }
});

function displayScore(scores) {
  scores.forEach((score, index) => {
    scoresDisplay[index].innerText = sumArray(score);
  });
}

function displayScoreChange(scores) {
  scores.forEach((score, index) => {
    scoreChangesDisplay[index].innerText = score;
  });
}

function displayRound(currentRound) {
  roundNumber.innerText = 'Round ' + (currentRound + 1);
}

function displayValuedItem(items) {
  items.forEach((item) => {
    item.classList.toggle('valued');
  });
}

function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function emptyInput(inputs) {
  for (const input of inputs) {
    if (input.value === '') {
      return true;
    }
  }
  return false;
}
