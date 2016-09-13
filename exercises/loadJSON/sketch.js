

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    var url = "colors.json"
    loadJSON(url, showData);
    textAlign(CENTER);
    
}

function showData(data) {
    textAlign(CENTER);
    fill(data.yellow);
    text(data.yellow, width/2, height/2);

    
}