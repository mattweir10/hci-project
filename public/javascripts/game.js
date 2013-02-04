/*
	game.js
	Game class
*/
function Game() {		
	this.canvas = document.getElementById('game');
	this.container = new createjs.Container();
	this.stage = new createjs.Stage(this.canvas);

	this.stage.enableMouseOver(10);
	this.stage.mouseMoveOutside = true;
	this.stage.addChild(this.container);

	var image = new Image();
	image.src = '/images/target.jpg';

	var stage = this.stage;
	var game = this;

	image.onload = function(event) {
		var image = event.target;
		game.target = new Target(image, game.canvas);
	};

	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

Game.prototype.start = function() {
	var targetCount = 0,
		locations = [],
		game = this;

	this.container.removeAllChildren();
	this.container.addChild(game.target);

	createjs.Ticker.addListener(this.stage);
	this.target.randomizeLocation();

	var start = Date.now(),
		elapsed = 0;
	
	// run timer every 100ms
	var intervalId = window.setInterval(function() {
		elapsed = Date.now() - start;
	}, 100);

	this.stage.tick = function() {
		if (game.target.clicked) {
			game.target.clicked = false;
			locations.push({
				click: { x: game.target.mouseX, y: game.target.mouseY },
				target: game.target.getCenter()
			});

			targetCount++;
			game.target.randomizeLocation();
		}

		if (targetCount >= 5) {
			$('p#message').html('Game Over!').show().fadeOut(2000);
			window.clearInterval(intervalId); // stop timer
			game.end(locations, elapsed);
		}

		this.update();
	};
};

Game.prototype.end = function(locations, elapsed) {
	var saveData = {
		locations: locations,
		completionTime: elapsed
	};

	$.post('/api/scores', saveData, function(data) {
		console.log(data);
		$('p#message').append('<br>Saved!').show().fadeOut(2000);
	});

	this.container.removeChild(this.target);
	createjs.Ticker.removeListener(this.stage);

	var gameOver = new createjs.Text('Game Over!');
	gameOver.x = (this.canvas.width / 2) - (gameOver.getMeasuredWidth() / 2);
	gameOver.y = (this.canvas.height / 2) - (gameOver.getMeasuredHeight() / 2);
	this.container.addChild(gameOver);
};
