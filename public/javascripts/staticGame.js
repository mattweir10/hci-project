define(
  [
    'game'
  ],
  function(Game) {
    StaticGame.prototype = Object.create(Game.prototype);

    function StaticGame() {
      Game.call(this);
    }

    StaticGame.prototype.start = function() {
      Game.prototype.setup.call(this);

      var game = this;
      this.stage.tick = function() {
        Game.prototype.clickGameTick.call(game);
        this.update();
      };
    };

    return StaticGame;
  }
);
