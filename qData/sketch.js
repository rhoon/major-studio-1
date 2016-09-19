var startYear = 1976;
var endYear = 2015;
var africanCountries = ["Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic (CAR)", "Chad", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Cote d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"];

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
        
        //if new country, start new chart
        if (newCountry != lastCountry) {
            x += 100;
            y = 20;
            text(newCountry, x, y, 100);
        }

        //check if the year is within the range to display
        if (newYear >= startYear  && newYear <= endYear) {
        
            //y is equal to the current year minus the start year
            y = ((newYear - startYear) * 15) + 20;
            
            // value needs to be parameterized
            val = data.getString(row, 4);
            val = parseFloat(val);
            val = map(val, 0, 100, 0, 50);
            
            // draw rectangle (translate and fill need to be parameterized)
            fill(212,95,95);
            noStroke();
            rect(x, y, val, 15);
            //text(newCountry, x, y);
        
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
        fill(51,51,51, 50);
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