var hash = [];
var sorted = [];
var textX = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadStrings('sotu.txt', callback); // data is passed into callback as argument
    
}

function callback(poem) {
    
    console.log(poem[0]); // 
    
    for(var i in poem) { //goes through all members of that array
        console.log(i+' : '+poem[i]);
    }
    
    for(var i in poem) { // for each item in poem
        var li = poem[i].split(' '); //split it at the space, make that array equal to li
        for (var k in li) { //for each item in li
            var clean = li[k].replace(/[.,-?!@#$%^&*()_~{}]/g, ''); // forward slash signifies look for these patterns, /g signifies globally
            // called 'regular expressions' https://regex101.com/
            // delete all these things
            
            if (hash[clean] >= 1) { // do we have the thing and is its value greater than one
                hash[clean] += 1; // okay add it to the count
            } else {
                hash[clean] = 1; // if we don't have thing, count this new instance of the thing
            }
            
        }
        
    }

    console.log('HASH __________________');
    for (i in hash) {
        console.log('word: ' + i + ' : ' + hash[i]);
    }
    console.log('HASH SORTED __________________');

    for (var key in hash) {
        sorted.push([key, hash[key]]);
    }
    
    sorted.sort(function(a, b) {
        a = a[1];
        b = b[1];
        
        return a < b ? 1 : ( a > b ? -1 : 0); // ? is if/then : is else
    });
    
    for(var i=0; i<sorted.length; i++) {
        console.log(sorted[i][0] + ' : ' + sorted[i][1]);
    }
    
    
}

function draw() {
    background(255);
    translate(textX, height/2);  //could also use push and po

    for(var i=0; i<sorted.length; i++) {
        var txtSize = sorted[i][1];
        textSize(txtSize);
        text(sorted[i][0], 0, 0);
        
        var txtWidth = textWidth(sorted[i][0]); // textWidth is p5 command that computes actual textWidth
        translate(txtWidth, 0);
    }
    
    if (mouseIsPressed){
        line(0, txtSize*.25, 0, -txtSize*.75);
    }
    
}

function mouseDragged() {
    textX += mouseX - pmouseX;
    
}