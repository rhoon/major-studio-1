var startYear = 1976;
var endYear = 2015;
var africanCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic (CAR)", "Chad", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Cote d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"];

var chartWidth = 150;
var barWidth = 80;
var allChartWidth = chartWidth * africanCountries.length +50;

var leftPad = 100;
var topMargin = 120;


function setup() {
    


    createCanvas(allChartWidth, windowHeight);
    //loadTable("worldbank_GINIbyCountry_AfricaOnly.csv", "csv", "header", showWBData);
    loadTable("wiid.csv", "csv", "header", showWIIDData);
    loadTable("pts.csv", "csv", "header", showPTSData);
    background(244, 223, 212);

}

function labels(color) {
    
    //header
    textStyle(BOLD);
    textSize(32);
    textLeading(30);
    text("Political Violence & Income Inequality in Africa", 25, 40, 500);
    
    //use the array to establish position
    for (var c=0; c<africanCountries.length; c++) {
        
        var x = c*chartWidth;
        
        if (c == 4) {
            //key container box
            noFill();
            stroke(0);
            rect(x+25, 20, chartWidth*2-20, (topMargin*.6)-20);
            //key elements
            textStyle(BOLD);
            textSize(10);
            noStroke();
            fill(0);
            text("GINI Score", x+35, topMargin/2-20);
            text("Political Terror Scale", x+chartWidth+25, topMargin/2-20);
            fill(70, 68, 67); //giniColor
            rect(x+35, (topMargin-20)/2, 10, 10);
            fill(240, 97, 60); //ptsColor
            rect(x+chartWidth+25, (topMargin-20)/2, 10, 10);
        }
        
        //country labels
        fill(color);
        textAlign(LEFT);
        noStroke();
        textStyle(BOLD);
        textSize(10);
        text(africanCountries[c], x+25, topMargin-20, chartWidth-25);
        
        //draw set of horizontal lines
        for (var year = 0; year < (endYear-startYear+1); year++) {
            
            var y = (year*15)+topMargin;
            
            stroke(0, 0, 0);
            line(x+25, y, x+30, y);
            //year label
            if (c%4==0 && (year+startYear)%5==0) { 
                noStroke();
                textSize(8);
                text(startYear+year, x+30, y+10)
            }
        }
        
        //draw vertical lines
        stroke(0, 0, 0);
        line(x+25, topMargin, x+25, topMargin+((endYear-startYear+1)*15));
        stroke(244, 223, 212);
        line(x+100, topMargin, x+100, topMargin+((endYear-startYear+1)*15));
    }
    
    
}

function bars(x, y, val, color) {
            
            fill(color);
            noStroke();
            rect(x, y, val, 15);
            
}

function extrapolator(newYear, lastYear, x, y, val, color) {

        //set lastYear to startYear if necessary
        if (lastYear < startYear) {
            lastYear = startYear;
        } 
                
        //find the number of years we need to infer data for
        var yearDiff = newYear - lastYear;

        //set y value and draw charts
        for (var i = 1; i<yearDiff; i++) {
            y = ((lastYear+i-startYear) * 15) + 20;
             bars(x-val, y, val, color);
        }
                
}

function extrapolatorFade(newYear, lastYear, x, y, val, color) {
    
    // case that the last year read is before the years we're charting
    if (lastYear < startYear) {
        lastYear = startYear;
    }
    
    //init y
    y = ((lastYear-startYear) * 15) + topMargin;
    
    var yearDiff = (newYear - lastYear)*15;
    
    for (var i = 0; i<yearDiff; i++) {
        
        var opacity = map(i, yearDiff, 0, 0, 255);
        stroke(70, 68, 67, opacity);
        line(x-val, y+i, x, y+i);
    }
    
}

function showWIIDData(data) {
    
    var giniColor = color(70, 68, 67);
    
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    var lastCountry = data.getString(0, 0);
    var newCountry = data.getString(0, 0);
    
    var newYear = parseFloat(data.getString(0, 1));
    var lastYear = newYear;
    
    var x = 0;
    var y = topMargin;
    
    var val;
    
    
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
            
            // value needs to be parameterized
            val = data.getString(row, 4);
            val = parseFloat(val);
            val = map(val, 0, 100, 0, barWidth/2);
            
            //y is equal to the current year minus the start year
            y = ((newYear - startYear) * 15) + topMargin;
            
            //extrapolate data for missing years
            if (newYear != lastYear && newYear != lastYear+1) {
                extrapolatorFade(newYear, lastYear, x, y, val, giniColor);
            }
            
            // extrapolate data for the last year
            if (newCountry != africanCountries[africanCountries.length-1] && newCountry != data.getString(row+1, 0)) {
                extrapolatorFade(endYear+1, lastYear, x, y, val, giniColor);
            }
            
            // draw rectangle
            bars(x-val, y, val, giniColor);
        }
        
        //update lastCountry / lastYear for conditionals
        lastCountry = newCountry;
        lastYear = newYear;
        
    } // end loop
}

function showPTSData(data) {

    var ptsColor = color(240, 97, 60);
    
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    var thisCountry = data.getString(0, 0);
    var newCountry = data.getString(0, 0);
    
    var x = 0;
    var y = topMargin;
    
    
    //start looping through rows
    for (var row=0; row<count; row++) {
        
        //set thisCountry to correct row
        thisCountry = data.getString(row, 0);
        
        // if it's a new country, start new chart 
        if (thisCountry != newCountry) {
            x += chartWidth;
            y = topMargin;
        }
        
        
        
        val = data.getString(row, 5);
        val = parseFloat(val);
        val = map(val, 0, 5, 0, barWidth/2);
        
        //hashLine(x, y, width, y);
        fill(ptsColor, 100);
        noStroke();
        rect(x + leftPad, y, val, 15);
        
        //update variables
        y+=15;
        newCountry = thisCountry;
        
    }
    
    //draw labels
    labels(0);
}
