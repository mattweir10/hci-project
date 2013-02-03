(function(window, $, undefined) {
	$(function() {
		var game = new Game();

		$('#start').on('click', function(event) {
			game.start();
		});
	});
})(window, jQuery);
