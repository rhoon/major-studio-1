var c = [];

function setup() {
  loadTable("LaborInNonAgricultSector.tsv", "tsv", "header", showData);
}

function showData(data) {
  
  var count = data.getRowCount();
  console.log('count: '+count);
  
  var maxCol = (2014-1990)+3;
  
  //init at opposite ends of the spectrum
  var min = 100;  
  var max = 0;
  
  for (var row = 0; row < count; row++) {
    for (var col = 3; col < maxCol; col++) {
      var val = parseFloat(data.getString(row, col));
      if (val < min) { min = val; }
      if (val > max) { max = val; }
    } // end col loop
  } // end row loop
  
  console.log('MINIMUM: '+min);
  console.log('MAXIMUM: '+max);
  
  var width = 400;
  var height = 300;
  
  for (var row = 0; row < count; row++) {

    //canvas c1
    c[row] = function(p) {
        
      p.setup = function() {
        //draws container
        p.createCanvas(width, height);
        p.rect(0, 0, width-1, height-1);
        p.text(data.getString(row, 0), 10, 20);
        // draws data
        p.beginShape();
        for (var col = 3; col < maxCol; col++) {
          var val = parseFloat(data.getString(row, col));
          // map value in value range to graphic coordinates
          noFill();
          p.vertex(map(col, 3, 25, width, 0), map(val, min, max, height, 0));
          fill(0);
          p.ellipse(map(col, 3, 25, width, 0), map(val, min, max, height, 0), 5, 5);
        }
        p.endShape();
        
      }
    
    }; // end graph
    
    //start canvases
    var canvas1 = new p5(c[row]);
    
  } // end row loop
  
}

// canvas c1
// var c1 = function(p) {

//   p.setup = function() {
//     p.createCanvas(400, 300);
//   }

//   p.draw = function() {
//     p.background (128, 0, 0);
//     // p.ellipse(canvas2.mouseX, canvas2.mouseY, 30, 30);
//   }
  
// };

// // start canvases
// var canvas1 = new p5(c1);