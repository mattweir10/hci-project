
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
  if (req.xhr) {
    res.render('game-partial', { page: 'game' });
  } else {
    res.render('game', { page: 'game' });
  }
};
