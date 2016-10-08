var words = [];
var margin = 20;
var rowHeight = 40;
var metaData = [];

function setup() {
    
    createCanvas(windowWidth, 5000);
    loadTable("pitf.tsv", "tsv", "header", callback);
    textAlign(LEFT);
    
}

function callback(data) {
    
    var count = data.getRowCount();
    
    
    for (var i = 0; i < count; i++) {
        
        //break up description
        var description = data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};]/g, ' ').trim().toLowerCase().split(' ');
        
        //clean out the blanks
        for (var j in description) { 
            if (description[j]=="" || description[j]==undefined) { description.splice(j,1); }
        } // end loop j
        
        // loop through broken up description and assign each word to an object
        for (var j = 0; j < description.length; j++) { 
            
            var word = new Object();
                    
                word.value = description[j];
                word.count = 1;
                //initialize these as arrays so they can be added to later
                word.nextStr = [description[j+1]];
                word.country = [data.getString(i,0)];
                word.conflict = [data.getString(i,1)];
                
                // could also get date data here
                words.push(word);

        } // end loop j
            
    } // end loop i
    
    // search for matches, count and combine
    for ( var i = 0; i < words.length; i++ ) {

        for (var j = words.length-1; j >= 0; j--) {
            
            //check for matches
            if (words[i].value == words[j].value && i != j) {
                
                //combine words[j] to words[i]
                words[i].count += 1;
                words[i].nextStr.push(words[j].nextStr[0]);
                words[i].country.push(words[j].country[0]);
                words[i].conflict.push(words[j].conflict[0]);
                
                //delete entry
                words.splice(j, 1);

            }
        } // end loop j
    } // end loop i
    
    //--------------------------------------------structure position dependencies
    //build an array of counts to use the index as a multiplier on row height
    var counts = [];
    for (i in words) {
        counts.push(words[i].count);
    }
    
    //sort largest to smallest
    counts.sort(function(a, b) {
        return b - a;
    });
    
    var dups = 0;
    
    for (var i = 0; i < counts.length; i++) { // for each thing in counts
        
        
        if (counts[i] == counts[i+1]) { // test to see if is equal to the next thing
            counts.splice(i+1, 1); //if it is, remove the next thing
            i--; 
            dups += 1; //add one to the population of words that have this count
        } else {
            
            //build new metaData object and push it
            var metaDatum = new Object();
            metaDatum.count = counts[i]; // this is the count of the words
            metaDatum.pop = dups+1; // this is the population of words that have this count
            metaDatum.col = 1; // this will be used later in pos calc
            metaData.push(metaDatum);
            
            dups = 0;
        }
    }

    console.log(metaData);
    // ------calculate positions
    
    for (var i = 0; i < words.length; i++) {
        
        //find row multiplier & columns
        var row = 0;
        while ( words[i].count != metaData[row].count && row < metaData.length) {
            row++; 
        }
        
        //assign y position
        words[i].ypos = (row * rowHeight) + margin;

        var colWidth = (width)/(metaData[row].pop+1);        
        //assign x position
        words[i].xpos = (metaData[row].col*colWidth);
        
        
        //start drawin'
        textToWrite = words[i].value + " | col: " + metaData[row].col + " | count: " + metaData[row].count;
        
        textAlign(CENTER);
        text(textToWrite, words[i].xpos, words[i].ypos);
        
        // start next column
        metaData[row].col += 1;
        
    }
        
    
} // end callback
    
    
// data is structured
// next steps - calculate positions
// use frequecy to calculate x, y position

// the highest count is y = margin, next highest count, y = margin + row * 1; next highest count, y = margin + row * 2 etc
// build an array of counts, in order? array length reveals height of the thing
// 


// assign those to data objects

// draw lines
