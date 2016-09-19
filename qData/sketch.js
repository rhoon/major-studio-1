var startYear = 1976;
var endYear = 2015;

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    //loadTable("worldbank_GINIbyCountry_AfricaOnly.csv", "csv", "header", showWBData);
    loadTable("wiid.csv", "csv", "header", showWIIDData);
    loadTable("pts.csv", "csv", "header", showPTSData);
    
}



function showWIIDData(data) {
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    var lastCountry = data.getString(0, 0);
    var newCountry = data.getString(0, 0);
    
    var lastYear = parseFloat(data.getString(0, 1));
    var newYear = parseFloat(data.getString(0, 1));
    
    var x = 0;
    var y = 20;
    
    fill(212, 95, 95);
    text(lastCountry, x, y-10);
    
    // start looping through rows
    for (var row=0; row<count; row++) {
        
        //set thisCountry and thisYear to current row
        newCountry = data.getString(row, 0);
        newYear = parseFloat(data.getString(row, 1));

        //check if the year is within the range to display
        if (newYear >= startYear  && newYear <= endYear) {
        
            //if new country, start new chart
            if (newCountry != lastCountry) {
                x += 100;
                y = 20;
                text(lastCountry, x, y-10, 100);
            }
            
            //increment y if the new year is not equal to the last year
            if (newYear != lastYear) {
                y += (newYear - lastYear) * 15;
            } 
            
            // value needs to be parameterized
            val = data.getString(row, 4);
            val = parseFloat(val);
            val = map(val, 0, 100, 0, 50);
            
            // draw rectangle (translate and fill need to be parameterized)
            fill(212,95,95);
            rect(x, y, val, 15);
            text(newYear + ' | ' + lastYear, x, y);
        
        }
        
        lastCountry = newCountry;
        lastYear = newYear;
        
    }

    
}

function showPTSData(data) {
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    var thisCountry = data.getString(0, 0);
    var newCountry = data.getString(0, 0);
    
    var x = 0;
    var y = 20;
    
    text(thisCountry, x, y-10);
    
    //start looping through rows
    for (var row=0; row<count; row++) {
        
        //set thisCountry to correct row
        thisCountry = data.getString(row, 0);
        
        // if it's a new country, start new chart 
        if (thisCountry != newCountry) {
            x += 100;
            y = 20;
            text(thisCountry, x, y-10, 100);
        }
        
        val = data.getString(row, 5);
        val = parseFloat(val);
        val = map(val, 0, 5, 0, 50);
        
        hashLine(x, y, width, y);
        fill(51,51,51, 30);
        noStroke();
        rect(x, y, val, 15);
        
        //update variables
        y+=15;
        newCountry = thisCountry;
        
    }
}

function hashLine(x, y, width) {
    stroke(51,51,51);
    line(x, y, width, y);
}