//adds a 'duration' and 'countryCode' to pitf data

var fs = require('fs');
var async = require('async');
var d3 = require('d3');

var pts = JSON.parse(fs.readFileSync('pts-nested.json', 'utf8'));

fs.readFile("data/pitf.tsv", "utf8", function(error, data) { // from http://learnjsdata.com/node.html
    data = d3.tsvParse(data);
    
    for (var event in data) {
        
        if (data[event].country != undefined) {
        
            //Parse years
            data[event].began = parseYear(data[event].began);
            data[event].ended = parseYear(data[event].ended);
            
            //Calc and add Duration. Using 2017 to calculate duration of currently ongoing conflicts.
            var endYear = data[event].ended;
            if (endYear == 'ONGOING') {
                endYear = 2017;
            }
            
            var countryCodes = data[event].country.split(' ');
            var countryCode = countryCodes[0].replace(',','')+countryCodes[1];
            countryCode = countryCode.toLowerCase().replace('undefined','');
            
            data[event].duration = endYear - data[event].began;
            data[event].duration = data[event].duration.toFixed(2);
            data[event].countryCode = countryCode;
            
            var began = Math.floor(data[event].began);
            
            //construct pitf object
            if (began > 1976) {
                var pitf = new Object()
                pitf.duration = data[event].duration;
                pitf.began = data[event].began;
                pitf.ended = data[event].ended;
                pitf.conflictType = data[event].conflictType;
                pitf.eventDescription = data[event].eventDescription;
            }
            //push to pts
                pts[countryCode].pitf.push(pitf);
            
        // get rid of junk
        } else {
            data.splice(event, 1);
        }
    }
    
    fs.writeFile('pitf-mod1.json', JSON.stringify(data), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
    
    fs.writeFile('pts+pitf.json', JSON.stringify(pts), function(err) {
        if (err) {throw err;}
        console.log("pts+wiid written");
    });
    
});

function parseYear(yearString) {
    
    if (yearString != '-') {
        
        var month = yearString.split('/')[0];
        var year = yearString.split('/')[1];
        month = (parseFloat(month)-1)/12;
        var yearDec = parseFloat(year)+month
        return yearDec.toFixed(2);
        
    } else {
        
        return 'ONGOING';
    }
        
}