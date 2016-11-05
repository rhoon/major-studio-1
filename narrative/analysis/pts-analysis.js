// PTS Analysis reads the Political Terror Scale data
// averages the three scores (mean)
// and writes a new file, pts-mod1.json

// DATA STRUCTURE (pts-mod1.json):
// { country: 'Zimbabwe', year: '2006', ptsAvg: 4 } should use country and year as index value for easy lookup

// TO ADD: 
// improving / decline data (per country)

var fs = require('fs');
var async = require('async');
var d3 = require('d3');

function pushNum(isNum, toArray) {
    if (!isNaN(parseFloat(isNum))) {
        toArray.push(parseFloat(isNum));
    }
}

function Country(fullName) {
    this.years = {};
    this.name = fullName;
}

function Year(ptsAvg) {
    this.ptsAvg = ptsAvg;
}

var countries = {};

fs.readFile("data/pts.csv", "utf8", function(error, data) {
    data = d3.csvParse(data);
    
    //get rid of 'columns' array
    delete data['columns'];
    
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
        console.log('ptsArr: '+ptsArr);
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
        
        // restructure data - index by country and then by year
        var country = data[datum].country;
        if (datum == 0) {
            console.log('making new country: '+country);
            //if it's a new country, add an object
            countries[country] = new Country(data[datum].country);
            //nest year objects in country, using year as index
            countries[country].years[year] = new Year(ptsAvg);
        }
        
        if (datum != 0) { // will need to handle first case
            var prev = datum-1;
            
            var year = data[datum].year;
            
            if (country != data[prev].country) {
                console.log('making new country: '+country);
                //if it's a new country, add an object
                countries[country] = new Country(data[datum].country);
                //nest year objects in country, using year as index
                countries[country].years[year] = new Year(ptsAvg);
            } else {
                console.log('adding to '+country);
                countries[country].years[year] = new Year(ptsAvg);
            }
            
        }
        
    }
    
    console.log(JSON.stringify(countries));
    // console.log(data);
    
    //fallback data structure
    fs.writeFile('pts-mod1.json', JSON.stringify(data), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
    
    //better data structure
    fs.writeFile('pts-mod2.json', JSON.stringify(countries), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
    
    
});