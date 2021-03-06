var x = [];
var y = [];

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

    //finding center of centroid
    
    
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