/**
 * Target Class
 * Inherits from createjs.Bitmap class
 */

/**
 * Class constructor
 */
function Target(image, canvas) {
	createjs.Bitmap.call(this, image); // call super constructor

	// instance variables
	this.canvas = canvas;
	this.clicked = false;
	this.mouseX = 0;
	this.mouseY = 0;
}

/**
 * Inherit from createjs.Bitmap class
 */
Target.prototype = Object.create(createjs.Bitmap.prototype);

Target.prototype.randomizeLocation = function() {
	var width = (this.canvas.width || 640) - this.image.width,
		height = (this.canvas.height || 480) - this.image.height;

	this.x = Math.round(Math.random() * width);
	this.y = Math.round(Math.random() * height);
};

Target.prototype.onPress = function(e) {
	$('#stats').html('Stats: X=' + e.stageX + ', Y=' + e.stageY);
	this.clicked = true;
	this.mouseX = e.stageX;
	this.mouseY = e.stageY;
};

Target.prototype.getWidth = function() {
	return this.image.width;
};

Target.prototype.getHeight = function() {
	return this.image.height;
};

Target.prototype.getCenter = function() {
	return {
		x: this.x + this.getWidth() / 2,
		y: this.y + this.getHeight() / 2
	};
};
