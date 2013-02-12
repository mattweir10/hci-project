/*
	game.js
	Game class
*/
define(
	[
		'jquery',
		'target',
		'easeljs'
	],
	function($, Target) {
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
			
			// run timer every 10ms
			var intervalId = window.setInterval(function() {
				elapsed = Date.now() - start;
				$('span#seconds').html((elapsed / 1000).toFixed(3));
			}, 10);

			// this gets called 60 times per second (60 FPS)
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
			// start with max score (number of pixels in target * 5 targets)
			var maxScore =
				Math.floor(Math.PI * Math.pow(this.target.getWidth() / 2, 2)) * 5;
			var score = maxScore;
			
			locations.forEach(function(loc) {
				// subtract each pixel off center
				var xOff = Math.abs(loc.click.x - loc.target.x);
				var yOff = Math.abs(loc.click.y - loc.target.y);
				score -= xOff + yOff;
			});

			// subtract time in ms
			score -= elapsed;

			var saveData = {
				locations: locations,
				score: score,
				completionTime: elapsed
			};

			// send our data to the API to save
			$.post('/api/scores', saveData, function(data) {
				console.log(data);
				$('p#message').append('<br>Saved!').show().fadeOut(2000);
			});

			this.container.removeChild(this.target);
			createjs.Ticker.removeListener(this.stage);

			var font = '24px "Lucida Grande", Helvetica, Arial, sans-serif';
			var gameOver = new createjs.Text('Score: ' + score, font);
			gameOver.x = (this.canvas.width / 2) - (gameOver.getMeasuredWidth() / 2);
			gameOver.y = (this.canvas.height / 2) - (gameOver.getMeasuredHeight() / 2);
			this.container.addChild(gameOver);
		};

		return Game;
	}
);
