define(
  [
    'jquery',
    'staticGame',
    'moveGame',
    'dragGame'
  ], 
  function($, StaticGame, MoveGame, DragGame) {
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
        this.saveData.scoreName = $('#name').val() || '';

        if ($('#mouse').is(':checked')) {
          this.saveData.mouseType = 'mouse';
        } else if ($('#trackpad').is(':checked')) {
          this.saveData.mouseType = 'trackpad';
        } else {
          this.saveData.mouseType = 'touch';
        }

        this.currentGame = new StaticGame();
        this.loadGame();
      } else if (this.gameNumber === 1) {
        this.currentGame = new MoveGame();
        this.loadGame();
      } else if (this.gameNumber === 2) {
        this.currentGame = new DragGame();
        this.loadGame();
      } else {
        var saveData = this.saveData;
        saveData.calculatedScore = this.combinedScore;

        $('#yourscore').html(saveData.calculatedScore);
        if (!saveData.scoreName || saveData.scoreName.length <= 0) {
          $('#yourscore').append(' <small>not eligible for high score</small>');
        }

        // send our data to the API to save
        $.post('/api/scores', saveData, function(data) {
          console.log(data);
          dataId = data['_id'];

          $.get('/api/scores/top', function(data) {
            data.forEach(function(score) {
              if (score.scoreName && score.scoreName.length > 0) {
                var newHtml = '';
                if (dataId === score['_id']) {
                  newHtml += '<tr class="info">';
                } else {
                  newHtml += '<tr>';
                }
                newHtml += '<td>' + score.scoreName + '</td>';
                newHtml += '<td>' + score.calculatedScore + '</td>';
                newHtml += '</tr>';
                $('#scores').append(newHtml);
              }
            });

            $('#game-container').hide();
            $('#score-container').show();
          });
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
