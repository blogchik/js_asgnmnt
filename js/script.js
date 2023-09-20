const apiUrl = 'https://restcountries.com/v3.1/all';

const numLevels = 10;
let currentLevel = 1;
let score = 0;
let countriesData = [];

let LevelCounter = document.getElementById("counter");
let LevelProgress = document.getElementById("progress-bar");
let LevelProgress_Width = 10;
let Question = document.getElementById("question");
let Response = document.getElementById("response");
let TimerProgress = document.getElementById("timer-progress");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        countriesData = data;
        startGame();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame(){

    const optionsContainer = document.getElementById('options');
    const header = document.getElementById('header');
    header.classList.add("shown");
    const options = [];

    LevelCounter.innerText = `Question ${currentLevel} / ${numLevels}`;
    LevelProgress.style.width=`${LevelProgress_Width}%`;

    const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
    const correctCapital = randomCountry.capital;

    const otherCapitals = [];
    while (otherCapitals.length < 3) {
        const randomCapital = countriesData[Math.floor(Math.random() * countriesData.length)].capital;
        if (!otherCapitals.includes(randomCapital) && randomCapital !== correctCapital) {
            otherCapitals.push(randomCapital);
        }
    }

    options.push(correctCapital, ...otherCapitals);
    shuffleArray(options);

    Question.innerText = `What is the capital of ${randomCountry.name.common}?`;
    optionsContainer.innerHTML = '';
    
    options.forEach((option) => {
        const button = document.createElement('button');
        button.classList.add("answer");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, correctCapital);
        optionsContainer.appendChild(button);
    });

}

function nextQuestion(){

    currentLevel++;
    LevelProgress_Width = currentLevel * 10;

    const optionsContainer = document.getElementById('options');
    const options = [];

    document.getElementById("response").classList.remove("wrong");
    document.getElementById("response").classList.remove("correct");

    document.getElementById("answers").innerText = `Answers:`;

    LevelCounter.innerText = `Question ${currentLevel} / ${numLevels}`;
    LevelProgress.style.width=`${LevelProgress_Width}%`;

    const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
    const correctCapital = randomCountry.capital;

    const otherCapitals = [];
    while (otherCapitals.length < 3) {
        const randomCapital = countriesData[Math.floor(Math.random() * countriesData.length)].capital;
        if (!otherCapitals.includes(randomCapital) && randomCapital !== correctCapital) {
            otherCapitals.push(randomCapital);
        }
    }

    options.push(correctCapital, ...otherCapitals);
    shuffleArray(options);

    Question.innerText = `What is the capital of ${randomCountry.name.common}?`;
    optionsContainer.innerHTML = '';
    
    options.forEach((option) => {
        const button = document.createElement('button');
        button.classList.add("answer");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, correctCapital);
        optionsContainer.appendChild(button);
    });

    restartTimer();

}

function checkAnswer(selectedOption, correctCapital) {

    const buttons = document.querySelectorAll(".answer"); 
    const resultElement = document.getElementById('response');
    
    document.getElementById('answers').innerText = `Correct answer: ${correctCapital}`;

    buttons.forEach((button) => {

        button.disabled = true;
        button.classList.add('not-answered');

        if(button.innerText == selectedOption){

            button.classList.add('answered');

        }
    
    });

    if (selectedOption === correctCapital) {

        resultElement.classList.remove("wrong");
        resultElement.classList.add("correct");
        resultElement.innerText = 'Correct!';
        score++;
    
    } else {
    
        resultElement.classList.remove("correct");
        resultElement.classList.add("wrong");
        resultElement.innerText = 'Wrong!';
    
    }

    if(currentLevel == 10){

        sleep(2000).then(() => { finishQuestions(); });

    }else{

        sleep(2000).then(() => { nextQuestion(); });

    }

}

function finishQuestions() {

    const answers_block = document.getElementById("answers-block");
    const questions_block = document.getElementById("questions-block");
    const results_block = document.getElementById("results-block");
    const header = document.getElementById("header");
    const result_score = document.getElementById("result_score");
    const result_text = document.getElementById("result_text");

    let randResultText;

    if (score == 10) {
        randResultText = `You are a genius`;
    } else if (score >= 5) {
        randResultText = `You can do better`;
    } else if (score >= 1) {
        randResultText = `Try harder next time`;
    } else if(score <= 0){
        randResultText = `Try harder next time`;
    }

    result_text.innerText = `${randResultText}`;
    result_score.innerText = `Your score: ${score}`;

    header.classList.remove("shown");
    questions_block.classList.remove("shown");
    answers_block.classList.remove("shown");
    results_block.classList.add("shown");

}

let timer_second = 0;
let timer_length = 0;
let timerr = null;
const maxTimer = 15;

function timer() {
    timer_second++;
    if (timer_second <= maxTimer) {
        timer_length = (timer_second / maxTimer) * 100;
        TimerProgress.style.width = `${timer_length}%`;
    } else {
        clearInterval(timerr);

        if(currentLevel == 10){

            finishQuestions();
    
        }else{
    
            nextQuestion();
    
        }
    
    }
}

function restartTimer() {
    clearInterval(timerr)
    timer_second = 0;
    TimerProgress.style.width = '0%';

    timerr = setInterval(timer, 1000);
}

restartTimer();

window.onload = fetchData;
startGame();
console.clear();