const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// button in game
const startBtn = $("#startBtn");
const levelBtn = $("#level");

const gameBoard = $("#gameBoard");
// canvas concept
const context = gameBoard.getContext("2d");
// score text
const scoreText = $("#scoreText");
// create unitSize for game
const unitSize = 25;

class Snake
{
    private dx: number
    private dy: number
    public shape: {x: number, y: number}[]
    public speed: number
    private color: string = "black"
    private border: string = "grey"

    constructor()
    {
        //set init shape
        this.shape = [{x: unitSize*3, y: 0},
                      {x: unitSize*2, y: 0},
                      {x: unitSize,   y: 0},
                      {x: 0,               y: 0}]

        //set init direction
        this.dx = unitSize
        this.dy = 0

        //set velocity
        this.getSpeed(levelBtn.value)
    }

    getSpeed(speed: number)
    {
        if(speed == 2)
            this.speed = 75
        else if(speed == 3)
            this.speed = 50
        else
            this.speed = 110
    }

    drawSnake()
    {
        context.fillStyle = this.color
        context.strokeStyle = this.border
        this.shape.forEach(snakePart =>
            {
                context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize)
                context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize)
            })
    }

    changeDirection(event)
    {
        const keyPressed = event.keyCode
        const left = 37
        const right = 39
        const up = 38
        const down = 40

        const goingUp = (this.dy == -unitSize)
        const goingDown = (this.dy == unitSize)
        const goingLeft = (this.dx == -unitSize)
        const goingRight = (this.dx == unitSize)

        if(levelBtn.value == 4)
        {
            switch(true)
            {
                case (keyPressed == left && !goingLeft):
                    {
                        this.dx = unitSize
                        this.dy = 0
                    }
                    break;
                case (keyPressed == up && !goingUp):
                    {
                        this.dx = 0
                        this.dy = unitSize
                    }
                    break;
                case (keyPressed == right && !goingRight):
                {
                    this.dx = -unitSize
                    this.dy = 0
                }
                    break;
                case (keyPressed == down && !goingDown):
                {
                    this.dx = 0
                    this.dy = -unitSize
                }
                break;
            }
        }
        else
        {
            switch(true)
            {
                case (keyPressed == left && !goingRight):
                    {
                        this.dx = -unitSize
                        this.dy = 0
                    }
                    break;
                case (keyPressed == up && !goingDown):
                    {
                        this.dx = 0
                        this.dy = -unitSize
                    }
                    break;
                case (keyPressed == right && !goingLeft):
                {
                    this.dx = unitSize
                    this.dy = 0
                }
                    break;
                case (keyPressed == down && !goingUp):
                {
                    this.dx = 0
                    this.dy = unitSize
                }
                break;
            }
        }
    }

    moveSnake()
    {
        const head = {x: this.shape[0].x + this.dx,
                      y: this.shape[0].y + this.dy};

        this.shape.unshift(head);
        this.shape.pop();
    }
}

class Food {
    public x: number
    public y: number
    private color: string = "red"

    constructor()
    {
        this.x = 0;
        this.y = 0;
    }

    createFood(gameHeigth, gameWidth, snake)
    {
        while (true)
        {
        this.x = Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize;
        this.y = Math.round((Math.random() * (gameHeigth - unitSize)) / unitSize) * unitSize;
        let isOccupied = snake.some((snakePart) => snakePart.x === this.x && snakePart.y === this.y);
        if (!isOccupied) break;
        }
    }

    drawFood()
    {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, unitSize, unitSize);
    }
}

class GameBoard {
    private height: number = gameBoard.height
    private width: number = gameBoard.width
    private backgroundColor: string = "white"
    private score: number
    private isRunning: boolean = false
    public snake: Snake
    public food: Food

    constructor()
    {
        this.score = 0;
        this.snake = new Snake();
        this.food = new Food();
    }

    clearBoard()
    {
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.height);
    }

    start()
    {
        this.isRunning = true;
        scoreText.textContent = this.score;
        this.food.createFood(this.height, this.width, this.snake.shape);
        this.food.drawFood();
        this.nextTick();
    }

    nextTick()
    {
        if (this.isRunning)
        {
            setTimeout(() => {
                this.clearBoard();
                this.food.drawFood();
                this.snake.moveSnake();
                this.snake.drawSnake();
                this.checkGameOver();
                this.checkEatenFood();
                this.nextTick();
            }, this.snake.speed);
        }
        else 
        {
            this.displayGameOver();
        }
    }

    checkGameOver()
    {
        const head = this.snake.shape[0];
        const isHitWall = head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height;
        const isHitSelf = this.snake.shape.slice(1).some((part) => 
        {
            return part.x === head.x && part.y === head.y;
        });

        if (isHitWall || isHitSelf)
        {
            this.isRunning = false;
        }
    }

    displayGameOver()
    {
        if (levelBtn.value == 4)
        {
            context.font = "40px MV Boli";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.fillText(
                "GÀ CÒN CHƠI CHO KHÓ!",
                this.width / 2,
                this.height / 2);
        } 
        else
        {
            context.font = "60px MV Boli";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.fillText("GAME OVER!", this.width / 2, this.height / 2);
        }

        this.isRunning = false;
        this.snake = new Snake();
        this.score = 0;
    }

    checkEatenFood()
    {
        const head = this.snake.shape[0];
        if (head.x === this.food.x && head.y === this.food.y)
        {
            this.score += 1;
            scoreText.textContent = this.score;
            this.food.createFood(this.height, this.width, this.snake.shape);
        }
    }
}

// set event
const gameboard = new GameBoard();
startBtn.addEventListener("click", () => gameboard.start());
window.addEventListener("keydown", (event) => gameboard.snake.changeDirection(event));
