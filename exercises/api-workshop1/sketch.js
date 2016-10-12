var data;

function preload() {
    data = loadJSON("dogs.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
}

function draw() {
    background(0);
    for(var i = 0; i<data.dogs.length; i++) {
        fill(data.dogs[i].r, data.dogs[i].g, data.dogs[i].b);
        text(data.dogs[i].breed, width/2, height/(data.dogs.length));
    }
}