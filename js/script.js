var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


//zmienne określające położenie piłki
var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 2;
var dy = -2;
var ballRadius = 5;
var paddleHeight = 10;
var paddleWidth = 70;
var paddleX = (canvas.width - paddleWidth) / 2; //położenie platformy
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 40;
var brickHeight = 10;
var brickPadding = 5;
var brickOffsetTop = 20;
var brickOffsetLeft = 20;
var score = 0;
var lives = 3;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1 //status:1 lub 0 oznacza, że piłka dotknęła/ nie dotknęła klocka i że chcemy / nie chcemy go na ekranie
        }
    }
}


//funkcja rysująca klocki
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "blue";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// uruchamianie funkcji keyDownHandler / keyUpHandler
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}


//funkcja rysująca piłkę
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //zamiast sztywnych wartości wpisujemy zmienne x i y
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

//funkcja rysująca platformę
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

//wykrywanie kolizji
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) { //jeśli współrzędne brick znajdują się we współrzednych środka piłki to zmień kierunek ruchu piłki na odwrotny
                    dy = -dy;
                    b.status = 0; //zmień status na 0 żeby klocek nie był rysowany kolejny raz
                    score++;
                    if (score == brickColumnCount * brickRowCount) {
                        alert("You Win!! Congratulations!!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "12px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Score: " + score, 8, 15);
}

function drawLives() {
    ctx.font = "12px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 15);
}

//funkcja rysująca piłkę w kolejnych miejscach i czyszcząca canvas przed każdym kolejnym wykonaniem
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // funkcja czyszcząca cały prostokąt przed narysowaniem kolejnej piłki (eliminuje ślad)
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetection();
    //jeśli pozycja piłki po zmianie jest większa niż wartość wysokości canvas LUB mniejsza od 0 to zmień kierunek generowania piłki
    //przez zmianę wartości zmiennej dy na minus
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + canvas.width) { //jeśli x, czyli pozycja piłki w osi x jest w tym przedziale co lewa i prawa krawędź 
            dy = -dy; //platformy, to zmień kierunek generowania piłki
        } else {
            lives--;
            if (!lives) { //  jeśli wyrażenie w nawiasie jest prawdziwe to uruchom alert game over (prawdziwe jest tylko wtedy gdy ma wartość 0)
                alert("GAME OVER");
                document.location.reload();
            } else { //jeśli są jeszcze lives to resetujemy piłkę, kierunek itd.
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) { // e w nawiasie to parametr, który przechowuje info dot. ruchu kursora z linii poniżej
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

draw();
