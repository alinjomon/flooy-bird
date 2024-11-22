// Audio Files
let jumpSound = new Audio("./sounds/jump.mp3"); // Sound for jumping
let scoreSound = new Audio("./sounds/score.mp3"); // Sound for scoring
let gameOverSound = new Audio("./sounds/gameover.mp3"); // Sound for game over

// Board
let board;
let boardWidth = 400;
let boardHeight = 720;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
    endGame();
  }

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
      scoreSound.play(); // Play score sound when a point is scored
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
      endGame();
    }
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "white";
  context.font = "30px sans-serif";
  context.fillText(`SCORE: ${Math.floor(score)}`, 10, 40);
}

function placePipes() {
  if (gameOver) return;

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
    velocityY = -6;
    jumpSound.play(); // Play jump sound when the bird jumps

    if (gameOver) {
      resetGame();
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function endGame() {
  gameOverSound.play(); // Play game over sound when the game ends
  document.getElementById("gameOverMessage").style.display = "block";
  document.getElementById("finalScore").textContent = `Your Score: ${Math.floor(
    score
  )}`;
  if (score > highScore) {
    highScore = Math.floor(score);
  }
  document.getElementById("highScore").textContent = `High Score: ${highScore}`;
}

function resetGame() {
  gameOver = false;
  score = 0;
  pipeArray = [];
  bird.y = birdY;
  velocityY = 0;
  document.getElementById("gameOverMessage").style.display = "none";
}
