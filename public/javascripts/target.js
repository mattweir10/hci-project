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

	this.x = Math.random() * width;
	this.y = Math.random() * height;
};
