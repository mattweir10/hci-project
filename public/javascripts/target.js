/*
  Target Class
  Inherits from createjs.Bitmap class
  (http://www.createjs.com/Docs/EaselJS/Bitmap.html)
 */
define(
  [
    'easeljs'
  ],
  function() {
    /*
      Class constructor
    */
    function Target(image, canvas) {
      createjs.Bitmap.call(this, image); // call super constructor

      // instance variables
      this.canvas = canvas;
      this.clicked = false;
      this.mouseX = 0;
      this.mouseY = 0;
    }

    /*
      Inherit from createjs.Bitmap class
    */
    Target.prototype = Object.create(createjs.Bitmap.prototype);

    Target.prototype.randomizeLocation = function() {
      var width = (this.canvas.width || 640) - this.image.width,
        height = (this.canvas.height || 480) - this.image.height;

      this.x = Math.round(Math.random() * width);
      this.y = Math.round(Math.random() * height);
      if (Math.random() > 0.5) {
        xRebound = 1;
      } else {
        xRebound = -1;
      }
      if (Math.random() > 0.5) {
        yRebound = 1;
      } else {
        yRebound = -1;
      }
    };

    Target.prototype.onPress = function(e) {
      this.clicked = true;
      this.mouseX = e.stageX;
      this.mouseY = e.stageY;
    };

    /*
     * Moves target image across canvas
     * If an edge is it, the image will rebound and continue moving
     */
    Target.prototype.moveTarget = function() {
      if (this.x >= this.canvas.width - this.image.width) {
        xRebound = -1;
      } else if (this.x <= 0) {
        xRebound = 1;
      }
      if (this.y >= this.canvas.height - this.image.height) {
        yRebound = -1;
      } else if (this.y <= 0) {
        yRebound = 1;
      }
      this.x += 6 * xRebound;
      this.y += 6 * yRebound;
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

    Target.prototype.hasIntersection = function(that) {
      var thisCenter = this.getCenter()
        , thatCenter = that.getCenter()
        , combinedWidth = (this.getWidth() / 2) + (that.getWidth() / 2)
        , combinedHeight = (this.getHeight() / 2) + (that.getHeight() / 2);

      var dx = Math.abs(thisCenter.x - thatCenter.x) - combinedWidth
        , dy = Math.abs(thisCenter.y - thatCenter.y) - combinedHeight;

      return dx < 0 && dy < 0;
    };

    return Target;
  }
);  
