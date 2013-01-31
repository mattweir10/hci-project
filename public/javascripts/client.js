(function(window, $, undefined) {
	$(function() {
		$('#start').on('click', function(event) {
			startGame();
		});

		init();
	});

	var canvas, stage, target;

	function init() {
		canvas = document.getElementById('game');
		stage = new createjs.Stage(canvas);

		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true;

		var image = new Image();
		image.src = '/images/target.jpg';
		image.onload = handleImageLoad;

		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);
	}

	function handleImageLoad(event) {
		var image = event.target;
		var container = new createjs.Container();
		stage.addChild(container);

		target = new Target(image, canvas);
		container.addChild(target);

		target.onPress = function(e) {
			$('#stats').html('Stats: X=' + e.stageX + ', Y=' + e.stageY);
			target.clicked = true;
			target.mouseX = e.stageX;
			target.mouseY = e.stageY;
		};
	}

	function startGame() {
		var targetCount = 0;
		var scores = [];

		createjs.Ticker.addListener(stage);
		target.randomizeLocation();

		stage.tick = function() {
			if (target.clicked) {
				target.clicked = false;
				scores.push({ x: target.mouseX, y: target.mouseY });

				targetCount++;
				target.randomizeLocation();
			}

			if (targetCount >= 5) {
				$('p#message').html('Game Over!').show();
				endGame(scores);
			}

			this.update();
		};
	}

	function endGame(scores) {
		$.post('/api/scores', { scores: scores }, function(data) {
			console.log(data);
			$('p#message').html('Saved!').show().fadeOut(2000);
		});

		createjs.Ticker.removeListener(stage);
	}

})(window, jQuery);
