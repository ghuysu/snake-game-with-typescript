var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
// button in game
var startBtn = $("#startBtn");
var levelBtn = $("#level");
var gameBoard = $("#gameBoard");
// canvas concept
var context = gameBoard.getContext("2d");
// score text
var scoreText = $("#scoreText");
// create unitSize for game
var unitSize = 25;
var Snake = /** @class */ (function () {
    function Snake() {
        this.color = "black";
        this.border = "grey";
        //set init shape
        this.shape = [{ x: unitSize * 3, y: 0 },
            { x: unitSize * 2, y: 0 },
            { x: unitSize, y: 0 },
            { x: 0, y: 0 }];
        //set init direction
        this.dx = unitSize;
        this.dy = 0;
        //set velocity
        this.getSpeed(levelBtn.value);
    }
    Snake.prototype.getSpeed = function (speed) {
        if (speed == 2)
            this.speed = 75;
        else if (speed == 3)
            this.speed = 50;
        else
            this.speed = 110;
    };
    Snake.prototype.drawSnake = function () {
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        this.shape.forEach(function (snakePart) {
            context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
            context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        });
    };
    Snake.prototype.changeDirection = function (event) {
        var keyPressed = event.keyCode;
        var left = 37;
        var right = 39;
        var up = 38;
        var down = 40;
        var goingUp = (this.dy == -unitSize);
        var goingDown = (this.dy == unitSize);
        var goingLeft = (this.dx == -unitSize);
        var goingRight = (this.dx == unitSize);
        if (levelBtn.value == 4) {
            switch (true) {
                case (keyPressed == left && !goingLeft):
                    {
                        this.dx = unitSize;
                        this.dy = 0;
                    }
                    break;
                case (keyPressed == up && !goingUp):
                    {
                        this.dx = 0;
                        this.dy = unitSize;
                    }
                    break;
                case (keyPressed == right && !goingRight):
                    {
                        this.dx = -unitSize;
                        this.dy = 0;
                    }
                    break;
                case (keyPressed == down && !goingDown):
                    {
                        this.dx = 0;
                        this.dy = -unitSize;
                    }
                    break;
            }
        }
        else {
            switch (true) {
                case (keyPressed == left && !goingRight):
                    {
                        this.dx = -unitSize;
                        this.dy = 0;
                    }
                    break;
                case (keyPressed == up && !goingDown):
                    {
                        this.dx = 0;
                        this.dy = -unitSize;
                    }
                    break;
                case (keyPressed == right && !goingLeft):
                    {
                        this.dx = unitSize;
                        this.dy = 0;
                    }
                    break;
                case (keyPressed == down && !goingUp):
                    {
                        this.dx = 0;
                        this.dy = unitSize;
                    }
                    break;
            }
        }
    };
    Snake.prototype.moveSnake = function () {
        var head = { x: this.shape[0].x + this.dx,
            y: this.shape[0].y + this.dy };
        this.shape.unshift(head);
        this.shape.pop();
    };
    return Snake;
}());
var Food = /** @class */ (function () {
    function Food() {
        this.color = "red";
        this.x = 0;
        this.y = 0;
    }
    Food.prototype.createFood = function (gameHeigth, gameWidth, snake) {
        var _this = this;
        while (true) {
            this.x = Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize;
            this.y = Math.round((Math.random() * (gameHeigth - unitSize)) / unitSize) * unitSize;
            var isOccupied = snake.some(function (snakePart) { return snakePart.x === _this.x && snakePart.y === _this.y; });
            if (!isOccupied)
                break;
        }
    };
    Food.prototype.drawFood = function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, unitSize, unitSize);
    };
    return Food;
}());
var GameBoard = /** @class */ (function () {
    function GameBoard() {
        this.height = gameBoard.height;
        this.width = gameBoard.width;
        this.backgroundColor = "white";
        this.isRunning = false;
        this.score = 0;
        this.snake = new Snake();
        this.food = new Food();
    }
    GameBoard.prototype.clearBoard = function () {
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.height);
    };
    GameBoard.prototype.start = function () {
        this.isRunning = true;
        scoreText.textContent = this.score;
        this.food.createFood(this.height, this.width, this.snake.shape);
        this.food.drawFood();
        this.nextTick();
    };
    GameBoard.prototype.nextTick = function () {
        var _this = this;
        if (this.isRunning) {
            setTimeout(function () {
                _this.clearBoard();
                _this.food.drawFood();
                _this.snake.moveSnake();
                _this.snake.drawSnake();
                _this.checkGameOver();
                _this.checkEatenFood();
                _this.nextTick();
            }, this.snake.speed);
        }
        else {
            this.displayGameOver();
        }
    };
    GameBoard.prototype.checkGameOver = function () {
        var head = this.snake.shape[0];
        var isHitWall = head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height;
        var isHitSelf = this.snake.shape.slice(1).some(function (part) {
            return part.x === head.x && part.y === head.y;
        });
        if (isHitWall || isHitSelf) {
            this.isRunning = false;
        }
    };
    GameBoard.prototype.displayGameOver = function () {
        if (levelBtn.value == 4) {
            context.font = "40px MV Boli";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.fillText("GÀ CÒN CHƠI CHO KHÓ!", this.width / 2, this.height / 2);
        }
        else {
            context.font = "60px MV Boli";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.fillText("GAME OVER!", this.width / 2, this.height / 2);
        }
        this.isRunning = false;
        this.snake = new Snake();
        this.score = 0;
    };
    GameBoard.prototype.checkEatenFood = function () {
        var head = this.snake.shape[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 1;
            scoreText.textContent = this.score;
            this.food.createFood(this.height, this.width, this.snake.shape);
        }
    };
    return GameBoard;
}());
// set event
var gameboard = new GameBoard();
startBtn.addEventListener("click", function () { return gameboard.start(); });
window.addEventListener("keydown", function (event) { return gameboard.snake.changeDirection(event); });
