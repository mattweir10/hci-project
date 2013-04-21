/*
  score.js
  Score model
 */
(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  /*
    scoreSchema
    Mapping to score collection
    http://mongoosejs.com/docs/guide.html
   */
  var scoreSchema = new Schema({
    // array of objects which includes click and target data
    games: [{
      locations: [{
        click: {
          x: Number,
          y: Number
        },
        target: {
          x: Number,
          y: Number
        }
      }],
      gameType: String,
      completionTime: Number
    }],
    calculatedScore: Number,
    userAgent: String,
    ipAddress: String,
    date: {
      type: Date,
      default: Date.now
    }
  });

  // export our class as a module
  module.exports = mongoose.model('Score', scoreSchema);
}());
