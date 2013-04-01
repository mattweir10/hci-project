requirejs.config({
  shim: {
    easeljs: {
      exports: 'createjs'
    }
  },
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min',
    easeljs: '//code.createjs.com/easeljs-0.5.0.min'
  }
});

require(['jquery', 'game'], function($, Game) {
  $(function() {
    var setUpGame = function() {
      $('#start').on('click', function(event) {
        var game = new Game();
        var intId = window.setInterval(function() {
          if (game.finishedLoading) {
            window.clearInterval(intId);
            game.start();
          }
        }, 50);
      });
    };

    $('#game-link').on('click', function(event) {
      $.get('/game', {}, function(response) {
        $('.active').removeClass('active');
        $('#main').html(response);
        $('#game-link').parent().addClass('active');
        setUpGame();
      });

      return false;
    });

    setUpGame();
  });
});
