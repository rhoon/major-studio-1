//mirror canvases

var c1 = function(p) {
    
    p.setup = function() {
        p.createCanvas(400, 300);
    }
    
    p.draw = function() {
        // p.background(128, 0, 0);
        p.ellipse(canvas2.mouseX, canvas2.mouseY, 30, 30);
    }
}

var c2 = function(p) {
    
   p.setup = function() {
        p.createCanvas(400, 300);
    }
    
    p.draw = function() {
        // p.background(200, 200, 200);
        p.ellipse(canvas2.mouseX, canvas2.mouseY, 30, 30);
    }
    
    p.mousePressed = function() {
        p.rect(canvas1.mouseX, canvas2.mouseY, 50, 50);
        console.log('mousePressed');
    }
    
}

var canvas1 = new p5(c1);
var canvas2 = new p5(c2);