document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");
    const restartButton = document.getElementById("restart");

    // Set canvas size based on screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const tileSize = 20;
    canvas.width = screenWidth - (screenWidth % tileSize);
    canvas.height = screenHeight - (screenHeight % tileSize);

    const gridWidth = canvas.width / tileSize;
    const gridHeight = canvas.height / tileSize;

    const snake = {
        body: [{ x: 10, y: 10 }],
        direction: "right"
    };

    let food = createFood();

    let score = 0;
    let gameLoop;

    function createFood() {
        return {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
    }

    function drawSnake() {
        snake.body.forEach(segment => {
            ctx.fillStyle = "#000";
            ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = "#f00";
        ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
    }

    function moveSnake() {
        const head = { x: snake.body[0].x, y: snake.body[0].y };

        switch (snake.direction) {
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
            case "left":
                head.x -= 1;
                break;
            case "right":
                head.x += 1;
                break;
        }

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = "Score: " + score;
            food = createFood();
        } else {
            snake.body.pop();
        }

        // Check if snake collides with walls or itself
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight || isSnakeCollision(head)) {
            gameOver();
            return;
        }

        snake.body.unshift(head);
    }

    function isSnakeCollision(head) {
        return snake.body.slice(1).some(segment => {
            return segment.x === head.x && segment.y === head.y;
        });
    }

    function gameOver() {
        clearInterval(gameLoop);
        alert("Game Over! Your score: " + score);
        resetGame();
    }

    function resetGame() {
        score = 0;
        scoreDisplay.textContent = "Score: 0";
        snake.body = [{ x: 10, y: 10 }];
        snake.direction = "right";
        food = createFood();
        gameLoop = setInterval(gameTick, 150); // Adjust speed here (milliseconds)
    }

    function gameTick() {
        moveSnake();
        draw();
    }

    document.addEventListener("keydown", function(event) {
        const key = event.key;
        if (key === "ArrowUp" && snake.direction !== "down") {
            snake.direction = "up";
        } else if (key === "ArrowDown" && snake.direction !== "up") {
            snake.direction = "down";
        } else if (key === "ArrowLeft" && snake.direction !== "right") {
            snake.direction = "left";
        } else if (key === "ArrowRight" && snake.direction !== "left") {
            snake.direction = "right";
        }
    });

    restartButton.addEventListener("click", function() {
        resetGame();
    });

    resetGame();
});
