//RiTa API Demo 
//Oct 13 2016

var rs, input, pos;

function setup() {
    
    noCanvas();
    input = createInput(); // making an inpute
    input.changed(rita);
    
}

function rita() {
    
    var str = input.value(); //gets content out
    rs = RiString(str);
    var words = rs.words();
    var pos = rs.pos();
    
    for (var i = 0; i<words.length; i++) {
        var span = createSpan(words[i]); //createElement(span, text)
        if (pos[i] == 'nn') { //if word is a noun
            span.style('background', 'yellow');
            
        }
    }
    
}