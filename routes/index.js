
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { page: 'home' });
};

/*
 * GET game page
 */
exports.game = function(req, res) {
	if (!req.body.ajax) {
		res.render('game', { page: 'game' });
	} else {
		res.render('game', { page: 'game', layout: false });
	}
};
