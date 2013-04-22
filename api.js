/*
  api.js
  API Controller
*/
(function() {
  var Score = require('./models/score.js');

  // return all scores
  exports.getScores = function(req, res) {
    return Score.find(function(err, scores) {
      if (!err) {
        return res.send(scores);
      } else {
        return console.log(err);
      }
    });
  };

  exports.getTopScores = function(req, res) {
    var cb = function(err, scores) {
      if (!err) {
        return res.send(scores);
      } else {
        return console.log(err);
      }
    };
    return Score.find({})
      .limit(10)
      .select('scoreName calculatedScore')
      .sort('-calculatedScore')
      .exec(cb);
  };

  // create a new score
  exports.createScore = function(req, res) {
    var score = new Score({
      games: req.body.games,
      scoreName: req.body.scoreName,
      calculatedScore: req.body.calculatedScore,
      completionTime: parseInt(req.body.completionTime),
      mouseType: req.body.mouseType,
      userAgent: req.headers['user-agent'],
      ipAddress: req.connection.remoteAddress
    });

    score.save(function(err) {
      if (err) return console.log(err);
      return console.log('score created');
    });

    return res.send(score);
  }
}());
