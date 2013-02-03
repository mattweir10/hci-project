/*
game.js
Game class
*/
function Game() {		
	this.canvas = document.getElementById('game');
	this.stage = new createjs.Stage(this.canvas);

	this.stage.enableMouseOver(10);
	this.stage.mouseMoveOutside = true;

	var image = new Image();
	image.src = '/images/target.jpg';

	var stage = this.stage;
	var game = this;
	image.onload = function(event) {
		var image = event.target;
		console.log(event);
		console.log(stage);
		var container = new createjs.Container();
		stage.addChild(container);

		game.target = new Target(image, game.canvas);
		container.addChild(game.target);
	};

	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

Game.prototype.start = function() {
	var targetCount = 0;
	var scores = [];
	var target = this.target;
	var game = this;

	createjs.Ticker.addListener(this.stage);
	target.randomizeLocation();

	this.stage.tick = function() {
		if (target.clicked) {
			target.clicked = false;
			scores.push({ x: target.mouseX, y: target.mouseY });

			targetCount++;
			target.randomizeLocation();
		}

		if (targetCount >= 5) {
			$('p#message').html('Game Over!').show().fadeOut(2000);
			game.end(scores);
		}

		this.update();
	};
};

Game.prototype.end = function(scores) {
	$.post('/api/scores', { scores: scores }, function(data) {
		console.log(data);
		$('p#message').append('Saved!').show().fadeOut(2000);
	});

	createjs.Ticker.removeListener(this.stage);
};
