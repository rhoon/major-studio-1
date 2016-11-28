// V2 COMBINATOR input:
// • the sorted and updated WIID data
// • the regions for each country
// • the consolidated pts+pitf.json data file

// V2 COMBINATOR updates:
// • imputes gini data from last known observation

// V2 COMBINATOR output:
// • consolidated pts, pitf, wiid + regional data file organized by country

var fs = require('fs');
var async = require('async');
var d3 = require('d3');

var wiid = JSON.parse(fs.readFileSync('wiid.json', 'utf8'));
var primary = JSON.parse(fs.readFileSync('pts+pitf.json', 'utf8'));



fs.readFile("data/au-countries.csv", "utf8", function(error, data) { 
    // from http://learnjsdata.com/node.html
    var regions = d3.csvParse(data);
    
    // match regions to countries in primary dataset
    for (var pCountry in primary) {
        for (var rCountry in regions) {
            if (primary[pCountry].name == regions[rCountry].country) {
                primary[pCountry].region = regions[rCountry].region;
                // console.log('MATCH: '+primary[pCountry].name + ' ' + primary[pCountry].region);
                break;
            } else if (primary[pCountry].name == 'Morocco') {
                primary[pCountry].region = 'African Union Non-Member';
                // console.log('Morocco');
                break;
            }
        }
    }
    
    // add wiid data to primary dataset
    for (var wCountry in wiid) {
        
        // set country code for easy access to primary data set
        var countryCodes = wiid[wCountry].country.split(' ');
        var countryCode = countryCodes[0].replace(',','')+countryCodes[1];
        countryCode = countryCode.toLowerCase().replace('undefined','');
        // exception for naming inconsistancy
        if (countryCode == 'tanzania') { countryCode = 'tanzaniaunited' };
        
        // interpolator could go here...
        
        var year = parseFloat(wiid[wCountry].year);
        
        if (year >= 1976) {
        primary[countryCode].years[year].giniAvg = wiid[wCountry].giniAvg;
        }
        
    } //end wiid loop

    for (var country in primary) {
        for (var year = 1976; year < 2016; year++) {
            
            var nextYear, hasGiniNext, thisGini;
            
            //handle initial case
            if (primary[country].years[year].hasOwnProperty('giniAvg')) {
                thisGini = primary[country].years[year].giniAvg;
            } else {
                thisGini = 0;
                primary[country].years[year].giniAvg = thisGini;
                primary[country].years[year].giniEst = false;
            }
            
            if (year != 2015) {
                //if it's not the last year in the set, find next year object
                nextYear = parseInt(year)+1;
                hasGiniNext = primary[country].years[nextYear].hasOwnProperty('giniAvg');
                
                
                //if the next year does not have a gini, give it this year's gini
                if (!hasGiniNext) {
                    primary[country].years[nextYear].giniAvg = thisGini;
                    primary[country].years[nextYear].giniEst = true;
                } else {
                    primary[country].years[nextYear].giniEst = false;
                }
                console.log(primary[country].years[nextYear]);
            } 

        } // end year loop
    } // end country loop
    
    
    fs.writeFile('v2-consolidated.json', JSON.stringify(primary), function(err) {
        if (err) {throw err;}
        console.log("consolidated written");
    });
    
}); // end fs.readFile au-countries.csv 