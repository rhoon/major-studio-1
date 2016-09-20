var startYear = 1976;
var endYear = 2015;
var africanCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic (CAR)", "Chad", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Cote d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"];

var chartWidth = 100;
var allChartWidth = chartWidth * africanCountries.length;

var leftPad = 50;

function setup() {
    
    createCanvas(allChartWidth, windowHeight);
    //loadTable("worldbank_GINIbyCountry_AfricaOnly.csv", "csv", "header", showWBData);
    loadTable("wiid.csv", "csv", "header", showWIIDData);
    loadTable("pts.csv", "csv", "header", showPTSData);

}

function labels(color) {
    
    for (var c=0; c<africanCountries.length; c++) {
        fill(color);
        textAlign(CENTER);
        text(africanCountries[c], c*chartWidth, 10, chartWidth-10);
    }
    
}

function bars(x, y, val, color) {
            
            fill(color);
            noStroke();
            rect(x, y, val, 15);
            
}

function showWIIDData(data) {
    
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    var lastCountry = data.getString(0, 0);
    var newCountry = data.getString(0, 0);
    
    var newYear = parseFloat(data.getString(0, 1));
    var lastYear = newYear;
    
    var x = 0;
    var y = 20;
    
    var val;
    
    fill(212, 95, 95);
    text(lastCountry, x, y-10);
    
    // start looping through rows
    for (var row=0; row<count; row++) {
        
        //set thisCountry and thisYear to current row
        newCountry = data.getString(row, 0);
        newYear = parseFloat(data.getString(row, 1));
        
        
        for (var i=0; i<africanCountries.length; i++) {
            if (newCountry == africanCountries[i]) {
                x = chartWidth*i+leftPad;
            }
        }
        
        //check if the year is within the range to display
        if (newYear >= startYear && newYear <= endYear) {
            
            //extrapolate data for missing years
            if (newYear != lastYear && newYear != lastYear+1) {
                
                //set lastYear to startYear if necessary
                if (lastYear < startYear) {
                    lastYear = startYear;
                } 
                
                //find the number of years we need to infer data for
                var yearDiff = newYear - lastYear;
                console.log(newCountry);
                console.log('running YEARDIFF because newYear =' + newYear + 'and lastYear =' + lastYear);
                
                
                //set y value and draw charts
                for (var i = 1; i<yearDiff; i++) {
                    y = ((lastYear+i-startYear) * 15) + 20;
                    bars(x-val, y, val, 'pink');
                    //console.log('running YEARDIFF=' + yearDiff + ' y= ' + y + ' x= ' + x);
                }
                
            }
            
            // value needs to be parameterized
            val = data.getString(row, 4);
            val = parseFloat(val);
            val = map(val, 0, 100, 0, chartWidth/2);
            
            //y is equal to the current year minus the start year
            y = ((newYear - startYear) * 15) + 20;
            
            // draw rectangle
            bars(x-val, y, val, 'red');
            
            //text(newCountry + ' ' + x + ' ' + y, x, y);
        
        }
        
        lastCountry = newCountry;
        lastYear = newYear;
        
    } // end loop
    
    //draw labels
    labels(0);
    
    
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
            x += chartWidth;
            y = 20;
        }
        
        val = data.getString(row, 5);
        val = parseFloat(val);
        val = map(val, 0, 5, 0, chartWidth/2);
        
        //hashLine(x, y, width, y);
        fill(100,100,100);
        noStroke();
        rect(x + leftPad, y, val, 15);
        
        //update variables
        y+=15;
        newCountry = thisCountry;
        
    }
}

function hashLine(x, y, width) {
    
    stroke(51,51,51);
    line(x, y, width, y);
    
    
}