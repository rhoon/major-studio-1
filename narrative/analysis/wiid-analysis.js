// WIID analysis looks at the Wiid data
// combines and averages by any time there are different scores for a single year

// DATA STRUCTURE (filename):
// 

var fs = require('fs');
var async = require('async');
var d3 = require('d3');

var pts = JSON.parse(fs.readFileSync('pts-mod2.json', 'utf8'));


fs.readFile("data/wiid.csv", "utf8", function(error, wiid) {
    wiid = d3.csvParse(wiid);
    
    for (var item in wiid) {
        
        var ginis = [];
        ginis.push(parseFloat(wiid[item].Gini));
        //need to handle multiple gini scores for single year. this gets them and averages them.
        var nxt = parseFloat(item)+1;
        
        if (nxt < wiid.length) {
            // check for overlap
            if (wiid[item].Country == wiid[nxt].Country && wiid[item].Year == wiid[nxt].Year) {
                // push the next gini to the ginis array (to calc average)
                ginis.push(parseFloat(wiid[nxt].Gini));
                // delete next item
                wiid.splice(nxt, 0);
                // stay with the current item and check for another match
                item = item-1;
            } else {
                
                //average gini
                var sum = ginis.reduce(function(a, b) { //thanks, MDN
                  return a + b;
                }, 0);
                if (sum != 0) {                         //stop bad math
                    var giniAvg = sum/ginis.length;
                } else if (ginis.length == 0) {         //no data != 0;
                    var giniAvg = 'NA';
                }
                // console.log('country: '+wiid[item].Country+' year: '+wiid[item].Year+' gini: '+giniAvg);
                
                //add it to pts object
                var thisYear = JSON.stringify(wiid[item].Year);
                var thisCountry = JSON.stringify(wiid[item].Country);
                
                console.log('wiid '+thisCountry);
                console.log(pts[thisCountry]);
                console.log(pts[thisCountry].years[thisYear]);
                
                // pts[wiid[item].Country].year[wiid[item].Year].giniAvg = giniAvg;

            }
        }
        
        
    }
    
    // console.log(wiid);
});