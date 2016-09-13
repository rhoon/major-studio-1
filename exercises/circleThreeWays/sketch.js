function setup() {
  createCanvas(200, 200);
}

function draw() {
  var r1 = random(255);
  var r2 = random(255);
  var r3 = random(255);
  
  fill(r1, r2, r3);
  noStroke();
  ellipse(100, 100, 200, 200);
}