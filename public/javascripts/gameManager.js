define(
	[
		'staticGame',
		'moveGame',
		'dragGame'
	], 
	function(StaticGame, MoveGame, DragGame) {
		function GameManager() {
			this.combinedScore = 0;

			this.gameNumber = -1;
			this.nextGame();

			var self = this;
			var intId = window.setInterval(function() {
				if (self.currentGame) {
					if (self.currentGame.finished) {
						self.nextGame();
					}
				}

				if (self.gameNumber > 2) {
					window.clearInterval(intId);
				}
			}, 20);
		}

		GameManager.prototype.nextGame = function() {
			this.gameNumber++;

			if (this.gameNumber > 0) {
				this.combinedScore += this.currentGame.calculateScore();
			}

			if (this.gameNumber === 0) {
				this.currentGame = new StaticGame();
				this.loadGame();
			} else if (this.gameNumber === 1) {
				this.currentGame = new MoveGame();
				this.loadGame();
			} else if (this.gameNumber === 2) {
				this.currentGame = new DragGame();
				this.loadGame();
			} else {
				this.currentGame.gameOver(this.combinedScore);
			}
		}

		GameManager.prototype.loadGame = function() {
			var currentGame = this.currentGame;
			var intId = window.setInterval(function() {
				if (currentGame.finishedLoading) {
					window.clearInterval(intId);
					currentGame.start();
				}
			}, 50);
		}

		return GameManager;
	}
);
