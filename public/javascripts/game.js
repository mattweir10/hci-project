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

      this.finished = false;

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
      this.container.addChild(this.target);
      createjs.Ticker.addListener(this.stage);

      this.target.randomizeLocation();

      // run timer every 10ms
      var game = this
        , start = Date.now();

      this.timerId = window.setInterval(function() {
        game.elapsed = Date.now() - start;
        $('span#seconds').html((game.elapsed / 1000).toFixed(3));
      }, 10);
    };

    Game.prototype.clickGameTick = function() {
      if (this.target.clicked) {
        this.target.clicked = false;
        this.targetLocations.push({
          click: { x: this.target.mouseX, y: this.target.mouseY },
          target: this.target.getCenter()
        });

        this.targetCount++;
        this.target.randomizeLocation();
      }

      if (this.targetCount >= 5) {
        $('p#message').html('Game Over!').show().fadeOut(2000);
        window.clearInterval(this.timerId); // stop timer
        this.end();
      }
    };

    Game.prototype.end = function() {
      this.saveGameData();

      this.container.removeAllChildren();
      createjs.Ticker.removeListener(this.stage);
      createjs.Touch.disable(this.stage);

      this.finished = true;
    };

    Game.prototype.calculateScore = function() {
      /*
      // start with max score (number of pixels in target * 5 targets)
      var maxScore =
        Math.floor(Math.PI * Math.pow(this.target.getWidth() / 2, 2)) * 5;
      var score = maxScore;
      
      this.targetLocations.forEach(function(loc) {
        // subtract each pixel off center
        var xOff = Math.abs(loc.click.x - loc.target.x);
        var yOff = Math.abs(loc.click.y - loc.target.y);
        score -= xOff + yOff;
      });

      // subtract time in ms
      score -= this.elapsed;
      */

      // TODO: new score system

      var score = 10000;
      return score;
    };

    Game.prototype.saveGameData = function() {
      var saveData = {
        locations: this.targetLocations,
        score: this.calculateScore(),
        completionTime: this.elapsed
      };

      // send our data to the API to save
      $.post('/api/scores', saveData, function(data) {
        console.log(data);
        $('p#message').append('<br>Saved!').show().fadeOut(2000);
      });
    };

    Game.prototype.gameOver = function(score) {
      this.container.removeAllChildren();
      var font = '24px "Lucida Grande", Helvetica, Arial, sans-serif';
      var gameOver = new createjs.Text('Score: ' + score, font);
      gameOver.x = (this.canvas.width / 2) - (gameOver.getMeasuredWidth() / 2);
      gameOver.y = (this.canvas.height / 2) - (gameOver.getMeasuredHeight() / 2);
      this.container.addChild(gameOver);
      this.stage.update();
    };

    return Game;
  }
);
