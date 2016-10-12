function setup() {
    
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    
}

function draw() {
    
  background(255);
  noFill();
  
  push();
  translate(100, 100);
  rotate(radians(mouseX)); //radians converts from degrees to radians
  rect(0, 0, 100, 100);
  
  push();
  rotate(radians(mouseY));
  rect(0, 0, 100, 100);
  pop();
  
  pop();
  
  translate(300, 100);
  rotate(radians(mouseY));
  rect(0, 0, 100, 100);
  push();
  rotate(radians(mouseX));
  rect(0, 0, 100, 100);
  pop();
  
}