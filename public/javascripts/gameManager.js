define(
  [
    'staticGame',
    'moveGame',
    'dragGame'
  ], 
  function(StaticGame, MoveGame, DragGame) {
    function GameManager() {
      this.saveData = {
        games: [],
      };

      this.combinedScore = 0;

      this.gameNumber = -1;
      this.nextGame();

      var self = this;
      var intId = window.setInterval(function() {
        if (self.currentGame) {
          if (self.currentGame.finished) {
            self.saveData.games.push(self.currentGame.getSaveGameData());
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
        // this.currentGame.gameOver(this.combinedScore);
        
        var saveData = this.saveData;
        saveData.calculatedScore = this.combinedScore;

        // send our data to the API to save
        $.post('/api/scores', saveData, function(data) {
          console.log(data);
          $('p#message').append('<br>Saved!').show().fadeOut(2000);
        });
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
