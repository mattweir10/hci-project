define(
  [
    'game'
  ],
  function(Game) {
    MoveGame.prototype = Object.create(Game.prototype);

    function MoveGame() {
      Game.call(this);
    }

    MoveGame.prototype.start = function() {
      Game.prototype.setup.call(this);

      var game = this;
      this.stage.tick = function() {
        Game.prototype.clickGameTick.call(game);
        game.target.move();
        this.update();
      };
    };

    return MoveGame;
  }
);
