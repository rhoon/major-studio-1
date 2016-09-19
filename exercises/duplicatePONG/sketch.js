var x = [];
var y = [];

var xSpeed = [];
var ySpeed = [];

var paddleWidth = 200;
var score = 0;


function setup() {
    createCanvas(400, 600);
    rectMode(CENTER);
    textAlign(CENTER);
    for(var i=0; i < 10; i++) {
        x[i] = random(width);
        y[i] = random(height);
        
        xSpeed[i] = random(-2, 2);
        ySpeed[i] = random(-2, 2);
    
    }
}

function draw() {
    background(0);
    
    fill(255);
    
    for(var i=0; i < 10; i++) {
        
        
        x[i] += xSpeed[i];
        y[i] += ySpeed[i];
        
        if (y[i] < 0) {
            ySpeed[i] *= -1; // change upward direction
        } 
        
        if (x[i] < 0) {
            xSpeed[i] *= -1;
        }
        
        if (x[i] > width) {
            xSpeed[i] *= -1;
        }
        
        ellipse(x[i], y[i], 10, 10);
        
        if (y[i] > height - 55 && abs(x[i] - mouseX) < paddleWidth/2) {
            ySpeed[i] *= -1;
        }
        
        
    }

    // paddle
    rect(mouseX, height-50, paddleWidth, 15, 10);
    
    fill(0);
    textSize(8);
    text(score, width/2, height-45);
    
    //add score
    //make it harder by making it faster
    // clean up bugs
    
}