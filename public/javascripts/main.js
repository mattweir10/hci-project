requirejs.config({
  shim: {
    easeljs: {
      exports: 'createjs'
    }
  },
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min',
    easeljs: '//code.createjs.com/easeljs-0.6.0.min'
  }
});

require(['jquery', 'gameManager'], function($, GameManager) {
  $(function() {
    var setUpGame = function() {
      $('#start').on('click', function(event) {
        var gameManager = new GameManager();
        if (gameManager) {
          $('#start').attr('disabled', 'disabled');
        }
      });
    };

    $('#game-link').on('click', function(event) {
      $.get('/game', {}, function(response) {
        $('.active').removeClass('active');
        $('#main').html(response);
        $('#game-link').parent().addClass('active');
        $('#start').removeAttr('disabled');
        setUpGame();
      });

      return false;
    });

    setUpGame();
  });
});
