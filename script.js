const apiKey = 'SKaXVyRHa89HbrE5ys+EJw==5VquQ2fTVczD1WmU'; 
const apiURL = 'https://api.api-ninjas.com/v1/randomword';

const levels = {
    easy: 8,
    medium: 4,
    hard: 2
};
let currentLevel = levels.easy;
let timeCount = currentLevel + 1, scoreCount = 0, isPlaying, wordDisplayed;

let currentWord  = document.querySelector('#current-word'),
    inputWord = document.querySelector('#input-word'),
    time = document.querySelector('#seconds'),
    timeLeft = document.querySelector('#time-left'),
    score = document.querySelector('#score'),
    message = document.querySelector('#message'),
    difficultyLevel = document.querySelector('#difficulty'),
    highScore = document.querySelector('#high-score');

window.addEventListener('load', init);
inputWord.addEventListener('input', startMatch);
difficultyLevel.addEventListener('change', changeLevel);

function init() { 
    time.textContent = currentLevel;
    showWord();
    setInterval(countdown, 1000);
    setInterval(checkStatus, 100);
    loadHighScore();
}

function showWord() {
    fetch(apiURL, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey
        },
        contentType: 'application/json'
    })
    .then(response => response.json())
    .then(result => {
        wordDisplayed = result.word;
        currentWord.textContent = wordDisplayed;
    })
    .catch(error => {
        console.error('Error: ', error);
        message.textContent = 'Error fetching word. Please try again.';
        message.className = 'mt-3 text-danger';
    });
}

function countdown() {
    if (timeCount > 0) {
        timeCount--;   
        timeLeft.textContent = timeCount;
    } else if(timeCount === 0) {
        isPlaying = false;
    }
}

function checkStatus() {
    if (!isPlaying && timeCount === 0) {
        message.textContent = 'Time Up!!';
        scoreCount = 0;
        message.className = 'mt-3 text-danger';
    }
}

function startMatch() {
    if (this.value === wordDisplayed) {
        isPlaying = true;
        message.textContent = 'Correct!!';
        message.className = 'mt-3 text-success';
        this.value = '';
        scoreCount++;
        score.textContent = scoreCount;
        timeCount = currentLevel + 1; 
        showWord();
        updateHighScore();
    }
}

function changeLevel() {
    let level = this.options[this.selectedIndex].value.toLowerCase();
    if (level in levels) {
        inputWord.focus();
        scoreCount = 0;
        message.textContent = '';
        isPlaying = true;
        currentLevel = levels[level];
        time.textContent = currentLevel;
        timeCount = currentLevel + 1;
        startMatch();
    }
}

function loadHighScore() {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore !== null) {
        highScore.textContent = storedHighScore;
    }
}

function updateHighScore() {
    const currentHighScore = parseInt(highScore.textContent);
    if (scoreCount > currentHighScore) {
        highScore.textContent = scoreCount;
        localStorage.setItem('highScore', scoreCount);
    }
}
