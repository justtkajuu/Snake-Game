const borad = document.querySelector('.board');
const startBtn = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartBtn = document.querySelector('.btn-restart');
const highscoreDisplay = document.querySelector('#high-score');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const pauseBtn = document.querySelector('.btn-pause');
let isPaused = false;



const blockheight = 50;
const blockwidth = 50;
let highScore = localStorage.getItem('highScore') ||0;
let score = 0;
let time = `00-00`;

highscoreDisplay.innerText = highScore;

const cols = Math.floor(borad.clientWidth / blockwidth);
const rows = Math.floor(borad.clientHeight / blockheight);

let blocks = [];
let snake = [
    {x:1,y:3}
];
let direction= 'right';
let intervalId = null
let timerIntervalId = null;
let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};


for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div');
        block.classList.add('block');
        borad.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1};  
    }
    else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1};  
    }
    else if(direction === 'up'){
        head = {x: snake[0].x - 1, y: snake[0].y};  
    }
    else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y};  
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    // Wall Collision Logic

    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
       
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // Food Consume Logic
    if(head.x === food.x &&  head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snake.unshift(head);
        score += 10;
        scoreDisplay.innerText = score;
        if(score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore.toString());
        }
    }
    
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });
}

// intervalId = setInterval(() => {
//     render();
// }, 300);

startBtn.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render();
    }, 300);
    timerIntervalId = setInterval(() => {
        let [mins, secs] = time.split('-').map(Number);

        if(secs === 59){
            mins += 1;
            secs = 0;
        }else{
            secs += 1;
        }
        time = `${mins}-${secs}`;
        timeDisplay.innerText = time;
    }, 1000);
})

pauseBtn.addEventListener("click", () => {
    if (!isPaused) {
        // Pause Game
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        pauseBtn.textContent = "Resume";
        isPaused = true;
    } else {
        // Resume Game
        pauseBtn.textContent = "Pause";
        isPaused = false;

        intervalId = setInterval(() => {
            render();
        }, 300);

        timerIntervalId = setInterval(() => {
            let [mins, secs] = time.split('-').map(Number);

            if (secs === 59) {
                mins += 1;
                secs = 0;
            } else {
                secs += 1;
            }
            time = `${mins}-${secs}`;
            timeDisplay.innerText = time;
        }, 1000);
    }
});


restartBtn.addEventListener("click",restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove('food');

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    score = 0;
    time = `00-00`;

    scoreDisplay.innerText = score;
    timeDisplay.innerText = time;
    highscoreDisplay.innerText = highScore;

    modal.style.display = "none";
    direction= 'down';
    snake = [
        {x:1,y:3}
    ];
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
    intervalId = setInterval(() => {
        render();
    }, 300);
}

addEventListener("keydown", (e) => {
    if (isPaused) return;

    if(e.key === "ArrowUp"){
        direction = "up";
    }else if(e.key === "ArrowDown"){
        direction = "down";
    }else if(e.key === "ArrowLeft"){
        direction = "left";
    }else if(e.key === "ArrowRight"){
        direction = "right";
    }   
})