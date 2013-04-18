define(
  [
    'jquery',
    'game',
    'target'
  ], 
  function($, Game, Target) {
    DragGame.prototype = Object.create(Game.prototype); // inherit from Game

    function DragGame() {
      Game.call(this); // call super constructor

      this.dragTarget = new Target('/images/target.jpg', this.canvas);
      this.dragTarget.alpha = 0.3;

      this.instructions = [
        "Drag each target onto the grayed-out target",
        "You will drag five targets to their designated areas",
        "Scoring will start after you complete the first drag-and-drop"
      ];
    }

    DragGame.prototype.start = function() {
      this.container.addChild(this.dragTarget);
      Game.prototype.setup.call(this);

      this.newTargetLocations();

      var game = this;
      this.target.addEventListener('mousedown', function(e) {
        var offset = {
          x: e.target.x - e.stageX,
          y: e.target.y - e.stageY
        };

        e.addEventListener('mousemove', function(ev) {
          ev.target.x = ev.stageX + offset.x;
          ev.target.y = ev.stageY + offset.y;
        });

        e.addEventListener('mouseup', function(ev) {
          if (! game.timerRunning) {
            game.startTimer();
            game.timerRunning = true;
          }

          game.targetLocations.push({
            click: { x: game.target.x, y: game.target.y },
            target: { x: game.dragTarget.x, y: game.dragTarget.y }
          });

          game.targetCount++;
          game.newTargetLocations();
        })
      });

      this.stage.tick = function() {
        var count = (game.targetCount > 0) ? (5 - game.targetCount + 1) : 'Practice';
        game.countText.text = count;

        if (game.targetCount > 5) {
          window.clearInterval(game.timerId);
          game.end();
        }

        this.update();
      };
    };

    DragGame.prototype.newTargetLocations = function() {
      var target = this.target
        , dragTarget = this.dragTarget;

      target.visible = false;
      dragTarget.visible = false;

      do {
        target.randomizeLocation();
        dragTarget.randomizeLocation();
      } while (target.hasIntersection(dragTarget));

      target.visible = true;
      dragTarget.visible = true;
    };

    DragGame.prototype.calculateScore = function() {
      // TODO: new score system
      var score = 50000;
      return score;
    };

    return DragGame;
  }
);
