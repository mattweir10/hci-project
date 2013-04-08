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
          game.targetLocations.push({
            target: { x: game.target.x, y: game.target.y },
            goal: { x: game.dragTarget.x, y: game.dragTarget.y }
          });

          game.targetCount++;
          game.newTargetLocations();
        })
      });

      this.stage.tick = function() {
        if (game.targetCount > 4) {
          game.targetCount = 0;
          window.clearInterval(game.timerId);
          // TODO: send to server
          console.log(game.targetLocations);
        }

        this.update();
      };
    }

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
    }

    return DragGame;
  }
);
