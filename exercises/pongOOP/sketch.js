

var paddleWidth = 200;
var score = 0;

var pongBalls = [];

//capital letter is syntax for a template of an object
function PongBall(myX, myY) {
    this.x = myX;
    this.y = myY;
    this.speedX = random(-10,10);
    this.speedY = random(-10,10);
    
    console.log(this.x + ' | ' + this.y);
    
    this.display = function() {
        push(); //push / pop is like grouping elements together
        translate(this.x, this.y);
        ellipse(0, 0, 15, 15);
        pop();
    }
    
    this.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0) {
            this.speedX *= -1; // change upward direction
        } 
        
        if (this.y < 0) {
            this.speedY *= -1;
        }
        
        if (this.x > width) {
            this.speedX *= -1;
        }
    }
}

function setup() {
    createCanvas(400, 600);
    rectMode(CENTER);
    textAlign(CENTER);
    
    for(var i=0; i < 10; i++) {
        
        // new to make new instance
        pongBalls.push(new PongBall(random(30, width-30), random(30, height-30)));
        
    
    }
}

function draw() {
    // background(0);
    
    
    for(var i = 0; i<pongBalls.length; i++) {
        pongBalls[i].update();
        pongBalls[i].display();
    }
//     fill(255);
    
//     for(var i=0; i < 10; i++) {
        
        
        
//         ellipse(x[i], y[i], 10, 10);
        
//         if (y[i] > height - 55 && abs(x[i] - mouseX) < paddleWidth/2) {
//             ySpeed[i] *= -1;
//         }
        
        
//     }

    // // paddle
    // rect(mouseX, height-50, paddleWidth, 15, 10);
    
    // fill(0);
    // textSize(8);
    // text(score, width/2, height-45);
    
    // //add score
    // //make it harder by making it faster
    // // clean up bugs
    
}