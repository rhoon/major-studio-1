var fs = require('fs');
var async = require('async');
var d3 = require('d3');

// per http://learnjsdata.com/node.html - D3 relies on XMLHttpRequest API (not included in node) so use fs
fs.readFile("data/pitf.tsv", "utf8", function(error, data) {
    data = d3.tsvParse(data);
    // console.log(JSON.stringify(data));
    
    for (var event in data) {
        
        if (data[event].country != undefined) {
        
        console.log('country: '+data[event].country+' start: '+data[event].began+' ended: '+data[event].ended);
        
        //Parse years
        data[event].began = parseYear(data[event].began);
        data[event].ended = parseYear(data[event].ended);
        //Calc and add Duration. Using 2017 to calculate duration of currently ongoing conflicts.
        var endYear = data[event].ended;
        if (endYear == 'ONGOING') {
            endYear = 2017;
        }
        data[event].duration = endYear - data[event].began;
        console.log('country: '+data[event].country+' start: '+data[event].began+' ended: '+data[event].ended+' duration: '+data[event].duration);

        // data[event].duration
        
        // get rid of junk
        } else {
            data.splice(event, 1);
        }
    }
    
    
    fs.writeFile('pitf-mod1.json', JSON.stringify(data), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
    
});


function parseYear(yearString) {
    
    if (yearString != '-') {
        var month = yearString.split('/')[0];
        var year = yearString.split('/')[1];
        month = (parseFloat(month)-1)/12;
        
        return parseFloat(year)+month;
    } else {
        return 'ONGOING';
    }
        
}