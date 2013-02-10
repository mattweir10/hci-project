requirejs.config({
	shim: {
		easeljs: {
			exports: 'createjs'
		}
	},
	paths: {
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min',
		easeljs: 'http://code.createjs.com/easeljs-0.5.0.min'
	}
});

require(['jquery', 'game'], function($, Game) {
	var game = new Game();

	$('#start').on('click', function(event) {
		game.start();
	});
});
