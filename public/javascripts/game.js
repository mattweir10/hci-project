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

      this.finishedLoading = false;
      this.timerId = 0;

      this.targetCount = 0;
      this.targetLocations = [];

      this.elapsed = 0;
      this.targetElapsed = [];

      this.finished = false;

      this.instructions = [];
      this.timerRunning = false;

      var font = '14px "Lucida Grande", Helvetica, Arial, sans-serif';
      var count = new createjs.Text('5', font);
      count.x = count.y = 10;
      this.container.addChild(count);
      this.countText = count;

      var image = new Image();
      image.src = '/images/target.jpg';

      var game = this;
      image.onload = function(event) {
        var image = event.target;
        game.target = new Target(image, game.canvas);
        game.finishedLoading = true;
      };

      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(60);

      if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(this.stage);
      }
    }

    Game.prototype.setup = function() {
      $('span#seconds').html('0.000');

      this.container.addChild(this.target);
      createjs.Ticker.addListener(this.stage);

      this.target.randomizeLocation();
    };

    Game.prototype.startTimer = function() {
      // run timer every 10ms
      var game = this
        , start = Date.now();

      this.timerId = window.setInterval(function() {
        game.elapsed = Date.now() - start;
        $('span#seconds').html((game.elapsed / 1000).toFixed(3));
      }, 10);
    };

    Game.prototype.clickGameTick = function() {
      var count = (this.targetCount > 0) ? (5 - this.targetCount + 1) : 'Practice';
      this.countText.text = count;

      if (this.target.clicked) {
        this.target.clicked = false;
           
        if (! this.timerRunning) {
          this.startTimer();
          this.timerRunning = true;
        }

        this.targetElapsed.push({
          targetTime: this.elapsed
        });

        this.targetLocations.push({
          click: { x: this.target.mouseX, y: this.target.mouseY },
          target: this.target.getCenter()
        });

        this.targetCount++;
        this.target.randomizeLocation();
      }

      if (this.targetCount > 5) {
        $('p#message').html('Game Over!').show().fadeOut(2000);
        window.clearInterval(this.timerId); // stop timer
        this.end();
      }
    };

    Game.prototype.end = function() {
      this.container.removeAllChildren();
      createjs.Ticker.removeListener(this.stage);
      createjs.Touch.disable(this.stage);

      this.finished = true;
    };

    Game.prototype.calculateScore = function() {
      // TODO: finish score system
      var maxPixels = Math.floor(Math.PI * Math.pow(this.target.getWidth() / 2, 2));
      var accuracy = 0;
      this.targetLocations.forEach(function(loc, index) {
        if (index > 0) {
          var xOff = Math.abs(loc.click.x - loc.target.x);
          var yOff = Math.abs(loc.click.y - loc.target.y);
          accuracy += (maxPixels - xOff - yOff) / maxPixels;
        }
      });

      accuracy /= 5;
      
      var timeScore = 0;
      var prevTime = 0;
      this.targetElapsed.forEach(function(loc, index) {
        if (index > 0) {
          var timeElapsed = loc.targetTime;
          var timeElapsedTarget = timeElapsed - prevTime;
          if (timeElapsedTarget < 1000) {
            timeScore += 20000;
          } else if (timeElapsedTarget < 1500) {
            timeScore += 16000;
          } else if (timeElapsedTarget < 2000) {
            timeScore += 12000;
          } else if (timeElapsedTarget < 2500) {
            timeScore += 8000;
          } else if (timeElapsedTarget < 3000) {
            timeScore += 4000;
          } else {
            // No points
          }
          prevTime = timeElapsed;
        }
      });
      
      var score = Math.round(accuracy * 100000) + timeScore;
      return score;
    };

    Game.prototype.getSaveGameData = function() {
      return {
        locations: this.targetLocations,
        gameType: this.gameType,
        completionTime: this.elapsed
      };
    };

    Game.prototype.gameOver = function(score) {
      this.container.removeAllChildren();
      var font = '24px "Lucida Grande", Helvetica, Arial, sans-serif';
      var gameOver = new createjs.Text('Score: ' + score, font);
      gameOver.x = (this.canvas.width / 2) - (gameOver.getMeasuredWidth() / 2);
      gameOver.y = (this.canvas.height / 2) - (gameOver.getMeasuredHeight() / 2);
      this.container.addChild(gameOver);
      this.stage.update();
      $('#start').removeAttr('disabled');
    };

    Game.prototype.displayInstructions = function() {
      $('ul#instructions').html('');
      this.instructions.forEach(function(item) {
        $('ul#instructions').append('<li>' + item + '</li>')
      });
    };

    return Game;
  }
);
