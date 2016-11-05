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

//Global storage
var countries = {};
var countriesMeta = [];

function pushNum(isNum, toArray) {
    if (!isNaN(parseFloat(isNum))) {
        toArray.push(parseFloat(isNum));
    }
}

function calcAvg(itemsToAvg) {
    
    //itemsToAvg is an array of datapoints
    var sum = itemsToAvg.reduce(function(a, b) { // <- MDN
          return a + b;
    }, 0);
    
    //if there is data
    if (sum != 0) { 
        var avg = (sum/itemsToAvg.length).toFixed(2);
    //handle no data
    } else if (itemsToAvg.length == 0) { 
        var avg = 'NA';
    }
        
    return avg;
}

function Country(fullName) {
    this.years = {};
    this.name = fullName;
}

function Year(ptsAvg) {
    this.ptsAvg = ptsAvg;
}

fs.readFile("data/pts.csv", "utf8", function(error, data) {
    data = d3.csvParse(data);
    
    //get rid of 'columns' array
    delete data['columns'];
    
    for (var datum in data) {
        //remove country_OLD
        delete data[datum].Country_OLD;
        
        //average PTS scores into single PTS score and consolidate
        var ptsArr = [];
        // calc average
        pushNum(data[datum].ptsa, ptsArr);
        pushNum(data[datum].ptsh, ptsArr);
        pushNum(data[datum].ptss, ptsArr);
        var ptsAvg = calcAvg(ptsArr);
        // remove old data
        data[datum].ptsAvg = ptsAvg;
        delete data[datum].ptsa;
        delete data[datum].ptsh;
        delete data[datum].ptss;
        
        // restructure data - index by country and then by year
        var countryCode = data[datum].country.slice(0,3).toUpperCase();
        
        console.log(countryCode);
        var country = data[datum].country;
        if (datum == 0) {
            //new country? add Country()
            countries[countryCode] = new Country(data[datum].country);
            //nest years
            countries[countryCode].years[year] = new Year(ptsAvg);
        }
        
        if (datum != 0) { // will need to handle first case
            var prev = datum-1;
            
            var year = data[datum].year;
            
            if (country != data[prev].country) {
                //new country? add Country()
                countries[countryCode] = new Country(data[datum].country);
                //nest years
                countries[countryCode].years[year] = new Year(ptsAvg);
            } else {
                countries[countryCode].years[year] = new Year(ptsAvg);
            }
            
        }
        
    }
    
    // console.log(JSON.stringify(countries));
    // console.log(data);
    
    //fallback data structure
    fs.writeFile('pts-mod1.json', JSON.stringify(data), function(err) {
        if (err) {throw err;}
        console.log("pts-mod1 written");
    });
    
    countryAvgs();
    
    //better data structure
    fs.writeFile('pts-mod2.json', JSON.stringify(countries), function(err) {
        if (err) {throw err;}
        console.log("pts-mod2 written");
    });
    
    //create a meta-data excel-friendly data object
    
    fs.writeFile('pts-meta.json', JSON.stringify(countriesMeta), function(err) {
        if (err) {throw err;}
        console.log("pts-meta written");
    });
    
});

//calculate overall averages for each country
function countryAvgs() {
    
    var i = 0;
    for (var country in countries) {
        //collect averages for the last five years, last ten years, and overall PTS
        var allPTS = [];
        for (var year in countries[country].years) {
            pushNum(countries[country].years[year].ptsAvg, allPTS);
        }
        
        // console.log(allPTS);
        //get averages
        countries[country].overallPTS = calcAvg(allPTS);
        countries[country].tenYearPTS = calcAvg(allPTS.splice(0, allPTS.length-10));
        countries[country].fiveYearPTS = calcAvg(allPTS.splice(0, allPTS.length-5));
        // console.log(country, countries[country].overallPTS, countries[country].tenYearPTS, countries[country].fiveYearPTS);
        
        
        // excel-friendly meta data (to help build narrative)
        countriesMeta[i] = new Object();
        countriesMeta[i].country = countries[country].name;
        countriesMeta[i].overallPTS = countries[country].overallPTS;
        countriesMeta[i].tenYearPTS = countries[country].tenYearPTS;
        countriesMeta[i].fiveYearPTS = countries[country].fiveYearPTS;
        i++;
        
    }
    
}



