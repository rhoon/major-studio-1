

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    loadTable("worldbank_GINIbyCountry_AfricaOnly.csv", "csv", "header", showData);
    
}

function showData(data) {
    var count = data.getRowCount();
    var rowHeight = (height/count);
    
    for (var i=0; i<count; i++) {
        var country = data.getString(i, 0);
        var year = [];
        for(var j=4; j<31; j++) {
            year.push(data.getString(i, j));
        }
        
        console.log(year);
        
        fill(0);
        text(country + yearReader(year), 50, rowHeight*(i+1));
        
    }
}

function yearReader(year) {
    for (var i=0; i<year.length; i++) {
        return year[i] + ' - ';
    }
}