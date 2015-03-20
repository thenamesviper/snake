function preventArrowKeyDefault() {
	$(document).on("keydown", function(e) {
		if(e.which>36 && e.which<41){
			e.preventDefault();
		}
	});
}
function playGame() {
	board.render();
	var snake = new Snake();
	snake.start();	
}

var board = {
	square: "<div class = 'square'></div>",
	render: function() {
		for(i=0; i<1600; i++) {
			$("#main-board").append(this.square);
		}
	}
}
board.checkIfHorizontalWall = function(snake) {
	if( (snake.head%40===0 && snake.direction == "left") ||
		(snake.head%40==39) && snake.direction == "right" ) {
			gameOver();
		}	
}
function Snake() {
	this.head = [780], //778th .square child
	this.body = [], 
	this.direction = "right",
	this.speed = 125; //lower is faster
}
Snake.prototype.start = function() {
	this.arrowPresses();
	Food.displayFood();
	this.show();
}
Snake.prototype.show = function() {
		this.showHead();
		this.showBody();
		this.move();
}
Snake.prototype.showHead = function() {
	var $currentSquare = $(".square").eq(this.head);
	checkForFood(this,$currentSquare);
	$currentSquare.addClass("snake-head");
}
Snake.prototype.showBody = function() {
	var snakeLength = this.body.length;
	for(i=0;i<snakeLength;i++) {
		$(".square").eq(this.body[i]).addClass("snake-body");
	}
}
Snake.prototype.move = function() {
	var snake = this; //allows instance to be accessed in following anon function
	setTimeout(function() {		
			if(snake.body.length) {
				snake.moveBody();
			}
			snake.moveHead();
			snake.show();
	}, snake.speed);
}
//TODO: need to make sure turning around ends game when only two parts on board
Snake.prototype.moveHead = function() {
	this.changePosition(this.direction);
	//check if head runs into body part
	if( $(".square").eq(this.head).hasClass("snake-body") ) {
		gameOver();
	}
	//check if head has gone off screen vertically
	if( this.head<1 || this.head>1600){
		gameOver();
	}
	
}
Snake.prototype.changePosition = function(direction) {
	board.checkIfHorizontalWall(this);
	$(".square").eq(this.head).removeClass("snake-head");
	var change = {
		"right": 1,
		"left": -1,
		"up":	-40,
		"down":	40
	}
	this.head = +this.head + +change[direction];
}

//allow arrows to control movement
Snake.prototype.arrowPresses = function() {
	var snake = this;
	$(document).on("keydown", function(e) {
		var key = e.which;
		//target arrow keys
		if(key>36 && key<41) {
			snake.changeDirection(key);
		}
	});
}
Snake.prototype.changeDirection = function(key) {
	var directions = {
		37: "left",
		38: "up",
		39: "right",
		40: "down"
	}
	this.direction = directions[key];
}

Snake.prototype.addBody = function(spot) {
	this.body.push(spot)
	this.speed = this.speed * 0.98;
}
Snake.prototype.moveBody = function() {
	var lastItem = this.body[this.body.length-1]
	$(".square").eq(lastItem).removeClass("snake-body");
	this.body.pop();
	this.body.unshift(this.head);
}

var Food =  {
	//spot: upper-left:1, bottom-right:1600
	spot: 1,
	displayFood: function() {
		this.spot = Math.floor(Math.random()*1600+1);
		$foodSquare = $(".square").eq(this.spot);
		//make sure spot is not occupied by snake
		if($foodSquare.hasClass("snake") || $foodSquare.hasClass("snake-body")) {
			this.displayFood();
		}
		$foodSquare.addClass("food");
	},
	foundFood: function() {
		$(".square").eq(this.spot).removeClass("food");
		this.displayFood();
	}
}
function checkForFood(snake, square) {
	if(square.hasClass("food")) {
		snake.addBody(Food.spot);
		Food.foundFood();
	}
}
function gameOver() {
	alert("end");
}

$(document).ready(function() {
	preventArrowKeyDefault();
	playGame();
});