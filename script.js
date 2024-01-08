let canvas, ctx;
const w = 800;
const h = 600;
const balls = [];
let ballCount = 5;
let maxSpeed = 3;
let minSize = 10;
let maxSize = 30;
let playerSize = 20;
let level = 1;
let playerX = w / 2 - playerSize / 2;
let playerY = h / 2 - playerSize / 2;
let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;

window.onload = function () {
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');

    const startButton = document.querySelector("#startButton");
    const stopButton = document.querySelector("#stopButton");
    const ballCountInput = document.querySelector("#ballCount");
    const maxSpeedInput = document.querySelector("#maxSpeed");
    const minSizeInput = document.querySelector("#minSize");
    const maxSizeInput = document.querySelector("#maxSize");
    const playerSizeInput = document.querySelector("#playerSize");

    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    ballCountInput.addEventListener('input', updateBallCount);
    maxSpeedInput.addEventListener('input', updateMaxSpeed);
    minSizeInput.addEventListener('input', updateMinSize);
    maxSizeInput.addEventListener('input', updateMaxSize);
    playerSizeInput.addEventListener('input', updatePlayerSize);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            leftKey = true;
        } else if (event.key === 'ArrowRight') {
            rightKey = true;
        } else if (event.key === 'ArrowUp') {
            upKey = true;
        } else if (event.key === 'ArrowDown') {
            downKey = true;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft') {
            leftKey = false;
        } else if (event.key === 'ArrowRight') {
            rightKey = false;
        } else if (event.key === 'ArrowUp') {
            upKey = false;
        } else if (event.key === 'ArrowDown') {
            downKey = false;
        }
    }

    function startGame() {
        level = 1;
        createBalls();
        mainLoop();
        startButton.disabled = true;
        stopButton.disabled = false;
    }

    function stopGame() {
        balls.length = 0;
        ctx.clearRect(0, 0, w, h);
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    function updateBallCount() {
        ballCount = parseInt(ballCountInput.value);
        createBalls();
    }

    function updateMaxSpeed() {
        maxSpeed = parseInt(maxSpeedInput.value);
        updateBallsSpeed();
    }

    function updateMinSize() {
        minSize = parseInt(minSizeInput.value);
        createBalls();
    }

    function updateMaxSize() {
        maxSize = parseInt(maxSizeInput.value);
        createBalls();
    }

    function updatePlayerSize() {
        playerSize = parseInt(playerSizeInput.value);
    }

    function createBalls() {
        balls.length = 0;
        for (let i = 0; i < ballCount; i++) {
            const ball = {
                x: Math.random() * (w - 2 * maxSize) + maxSize,
                y: Math.random() * (h - 2 * maxSize) + maxSize,
                radius: Math.random() * (maxSize - minSize) + minSize,
                color: 'green',
                speedX: Math.random() * maxSpeed * 2 - maxSpeed,
                speedY: Math.random() * maxSpeed * 2 - maxSpeed
            };
            balls.push(ball);
        }
    }

    function updateBallsSpeed() {
        balls.forEach(ball => {
            ball.speedX = Math.random() * maxSpeed * 2 - maxSpeed;
            ball.speedY = Math.random() * maxSpeed * 2 - maxSpeed;
        });
    }

    function moveBalls() {
        balls.forEach(ball => {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
        });
    }

    function testCollisionBallsWithWalls() {
        balls.forEach(ball => {
            if ((ball.x + ball.radius) > w || (ball.x - ball.radius) < 0) {
                ball.speedX = -ball.speedX;
            }
            if ((ball.y + ball.radius) > h || (ball.y - ball.radius) < 0) {
                ball.speedY = -ball.speedY;
            }
        });
    }

    function testCollisionBallsWithPlayer() {
        balls.forEach((ball, index) => {
            const dx = ball.x - (playerX + playerSize / 2);
            const dy = ball.y - (playerY + playerSize / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < ball.radius + playerSize / 2) {
                balls.splice(index, 1);
            }
        });
    }

    function drawBalls() {
        balls.forEach(ball => {
            drawFilledCircle(ball);
        });
    }

    function drawFilledRectangle(rect) {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    function drawFilledCircle(circle) {
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawLevel() {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Level: ' + level, 10, 25);
    }

    function drawPlayer() {
        ctx.fillStyle = 'red';
        ctx.fillRect(playerX, playerY, playerSize, playerSize);
    }

    function updatePlayerPosition() {
        if (leftKey && playerX > 0) {
            playerX -= 5;
        }
        if (rightKey && playerX < (w - playerSize)) {
            playerX += 5;
        }
        if (upKey && playerY > 0) {
            playerY -= 5;
        }
        if (downKey && playerY < (h - playerSize)) {
            playerY += 5;
        }
    }

    function mainLoop() {
        ctx.clearRect(0, 0, w, h);
        drawFilledRectangle({
            x: 0,
            y: 0,
            width: w,
            height: h,
            color: '#f2f2f2'
        });
        drawPlayer();
        drawLevel();
        drawBalls();
        moveBalls();
        testCollisionBallsWithWalls();
        testCollisionBallsWithPlayer();
        if (balls.length === 0) {
            level++;
            createBalls();
        }
        updatePlayerPosition();
        requestAnimationFrame(mainLoop);
    }

    mainLoop();
};