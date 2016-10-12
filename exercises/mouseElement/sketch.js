var id;

function setup() {
    
    id = select('#kafka'); 
    //same as select in d3, delivers a single element
    //alternative: selectAll
    id.mousePressed(clickKafka); //listen for mousePressed(); event
    id.mouseReleased(releaseKafka); 
    
    //slider predefined by P5
    slider = createSlider(0, windowWidth, 128);
    slider.position(windowWidth/2, windowHeight/2);
    slider.changed(change);
    
    //processing automatically generates a canvas, so turn off
    noCanvas();
}

// no canvas, no function draw() {} !

function clickKafka() {
    console.log('click');
    id.style('color', 'orange');
    
}

function releaseKafka() {
    id.style('color', 'blue');
    id.style('font-size', '90px');
}

function change() {
    id.position(slider.value(), windowHeight/2);
}