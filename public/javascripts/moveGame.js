define(
  [
    'game'
  ],
  function(Game) {
    MoveGame.prototype = Object.create(Game.prototype);

    function MoveGame() {
      Game.call(this);
      this.instructions = [
        "Click each moving target as close to the center as possible and as fast as you can",
        "You will click five targets for this game",
        "Scoring will start after you click the first target"
      ];
      this.gameType = 'move';
    }

    MoveGame.prototype.start = function() {
      this.displayInstructions();
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
