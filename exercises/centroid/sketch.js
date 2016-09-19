// global variables to keep track of mouse positions
var x = [];
var y = [];
var cX; // centroid
var cY; // centroid
var a; // area of the polygon

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(245);
    line(0, 0, mouseX, 100);
    fill(0, 80);
    rect(mouseX-5, mouseY-5, 50, 50, 5);
    
    // draw shape
    beginShape();
    for(var i = 0; i<x.length; i++) {
        vertex(x[i], y[i]);
        fill(0);
        text(i, x[i] + moveText(i, x, y), y[i] + moveText(i, x, y));
    }
    fill(200, 50);
    endShape(CLOSE);
    
    // reset variables
    cX = 0;
    cY = 0;
    a = 0;

    //centroid formula summations
    for(var i = 0; i<x.length-1; i++) {
        // enumerate
        cX += (x[i] + x[i+1]) * (x[i] * y[i+1] - x[i+1] * y[i]);
        cY += (y[i] + y[i+1]) * (x[i] * y[i+1] - x[i+1] * y[i]);
        a += (x[i] * y[i+1] - x[i+1] * y[i]);
        
    }
    // last math on centroid formula
    a = 0.5 * a;
    cX = cX / (6*a);
    cY = cY / (6*a);
    // place circle at centroid
    fill(0);
    ellipse(cX, cY, 10, 10);
    
}

function mouseReleased() {
    if (x.length < 10 ) {
        x.push(mouseX);
        y.push(mouseY);
    }
}

function moveText(i, x, y) {
    if (x[i] < x[i+1] && y[i] < y[i+1]) {
        return 10;
    } else { 
        return -10;
    }
}