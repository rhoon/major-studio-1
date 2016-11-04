var fs = require('fs');
var async = require('async');
var d3 = require('d3');

function pushNum(isNum, toArray) {
    if (!isNaN(parseFloat(isNum))) {
        toArray.push(parseFloat(isNum));
    }
}

fs.readFile("data/pts.csv", "utf8", function(error, data) {
    data = d3.csvParse(data);
    
    for (var datum in data) {
        //remove country_OLD
        delete data[datum].Country_OLD;
        
        //average PTS scores into single PTS score and consolidate
        var ptsArr = [];
        var ptsAvg = 0;
        // calc average
        pushNum(data[datum].ptsa, ptsArr);
        pushNum(data[datum].ptsh, ptsArr);
        pushNum(data[datum].ptss, ptsArr);
        var sum = ptsArr.reduce(function(a, b) { //thanks, MDN
          return a + b;
        }, 0);
        if (sum != 0) { //stop bad math
            ptsAvg = sum/ptsArr.length;
        } else if (ptsArr.length == 0) { //no data != 0;
            ptsAvg = 'NA';
        }
        data[datum].ptsAvg = ptsAvg;
        delete data[datum].ptsa;
        delete data[datum].ptsh;
        delete data[datum].ptss;
        
        console.log(data[datum]);
         
        //combine years into array
        // var years = []
        
        // if (isNaN(parseFloat(datum)) != true) {
        //     var nextDatum = parseFloat(datum)+1;
        //     console.log('this '+datum);
        //     console.log('nxt '+nextDatum);
            
        //     if (data[nextDatum].country == data[datum].country) {
                
        //     }
        // }
        
    }
    
    // console.log(JSON.stringify(data));

    
});