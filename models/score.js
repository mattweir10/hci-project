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
		// array of (x, y) coordinates
	  clickLocations: [{
	    x: Number,
	    y: Number
	  }],
	  date: {
	  	type: Date,
	  	default: Date.now
	  }
	});

	// export our class as a module
	module.exports = mongoose.model('Score', scoreSchema);
}());
