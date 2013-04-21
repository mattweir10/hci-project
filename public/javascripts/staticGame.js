define(
  [
    'game'
  ],
  function(Game) {
    StaticGame.prototype = Object.create(Game.prototype);

    function StaticGame() {
      Game.call(this);
      this.instructions = [
        "Click each target as close to the center as possible and as fast as you can",
        "You will click five targets for this game",
        "Scoring will start after you click the first target"
      ];
      this.gameType = 'static';
    }

    StaticGame.prototype.start = function() {
      this.displayInstructions();
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
