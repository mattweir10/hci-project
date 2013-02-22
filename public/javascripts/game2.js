/*
  game2.js
  Game2 class
*/
define(
  [
    'jquery',
    'target',
    'easeljs'
  ],
  function($, Target) {
    function Game2() {   
      this.canvas = document.getElementById('game2');
      this.container = new createjs.Container();
      this.stage = new createjs.Stage(this.canvas);

      this.stage.enableMouseOver(10);
      this.stage.mouseMoveOutside = true;
      this.stage.addChild(this.container);

      var image = new Image();
      image.src = '/images/target.jpg';

      var stage = this.stage;
      var game2 = this;

      image.onload = function(event) {
        var image = event.target;
        game2.target = new Target(image, game2.canvas);
      };

      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(60);
    }

    Game2.prototype.start = function() {
      var targetCount = 0,
        locations = [],
        game2 = this;

      this.container.removeAllChildren();
      this.container.addChild(game2.target);

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
        if (game2.target.clicked) {
          game2.target.clicked = false;
          locations.push({
            click: { x: game.target.mouseX, y: game2.target.mouseY },
            target: game2.target.getCenter()
          });

          targetCount++;
          game2.target.randomizeLocation();
        }

        if (targetCount >= 5) {
          $('p#message').html('Game Over!').show().fadeOut(2000);
          window.clearInterval(intervalId); // stop timer
          game2.end(locations, elapsed);
        }

        game2.target.moveTarget();

        this.update();
      };
    };

    Game2.prototype.end = function(locations, elapsed) {
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

    return Game2;
  }
);
