var words = [];
var margin = 20;
var rowHeight = 40;
var metaData = [];

//Word Object
function Word(value, nextStr, country, conflict) {
    
    this.value = value;
    this.count = 1;

    this.nextStr = [nextStr];
    this.country = [country];
    this.conflict = [conflict];
    
    //need to calculate position
    
    //write text and lines to screen
    this.viz = function() {
        textAlign(CENTER);
        text(this.value, this.xpos, this.ypos);
        
        //need lines
    }
    
    //mouseover function
    
}

function MetaDatum(count, population) {
    
    this.count = count; // this is the count of the words
    this.population = population; // this is the population of words that have this count
    this.col = 1; // adds a column for each word
    
}

function setup() {
    
    createCanvas(windowWidth, 5000);
    loadTable("pitf.tsv", "tsv", "header", callback);
    textAlign(LEFT);
    
}

function callback(data) {
    
    var count = data.getRowCount();
    
    for (var i = 0; i < count; i++) {
        
        //break up description
        var description = data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};1234567890/]/g, ' ').trim().toLowerCase().split(' ');
        
        //clean out the blanks
        for (var j in description) { 
            if (description[j]=="" || description[j]==undefined) { description.splice(j,1); }
        } // end loop j
        
        // loop through broken up description and assign each word to an object
        for (var j = 0; j < description.length; j++) { 
            
            var word = description[j];
            
            if (word in words) { 
                words[word].count += 1; 
                words[word].country.push(data.getString(i, 0));
                words[word].conflict.push(data.getString(i, 1));
                words[word].nextStr.push(description[j+1]);
                console.log('adding to: ' + word);
            } else {
                words[word] = new Object();
                words[word].count = 1; // nextStr, country, conflict
                words[word].country = [data.getString(i, 0)];
                words[word].conflict = [data.getString(i, 1)];
                words[word].nextStr = [description[j+1]];

                console.log('creating new instance of: ' + word);
            }
            // var word = new Word(description[j], description[j+1], data.getString(i,0), data.getString(i,1));
                
            // could also get date data here
            // words.push(description[j]);

        } // end loop j
            
    } // end loop i
    
    console.log(words);
    
    // // search for matches, count and combine
    // for ( var i = 0; i < words.length; i++ ) {

    //     for (var j = words.length-1; j >= 0; j--) {
            
    //         //check for matches
    //         if (words[i].value == words[j].value && i != j) {
                
    //             //combine words[j] to words[i]
    //             words[i].count += 1;
    //             words[i].nextStr.push(words[j].nextStr[0]);
    //             words[i].country.push(words[j].country[0]);
    //             words[i].conflict.push(words[j].conflict[0]);
                
    //             //delete entry
    //             words.splice(j, 1);

    //         }
    //     } // end loop j
    // } // end loop i
    
    // //---------------------------------------structure position dependencies
    // //build an array of counts to use the index as a multiplier on row height
    // // make this better
    // var counts = [];
    // for (i in words) {
    //     counts.push(words[i].count);
    // }
    
    // //sort largest to smallest
    // counts.sort(function(a, b) {
    //     return b - a;
    // });
    
    // var dups = 0;
    
    // for (var i = 0; i < counts.length; i++) { // for each thing in counts
        
    //     if (counts[i] == counts[i+1]) { // test to see if is equal to the next thing
    //         counts.splice(i+1, 1); //if it is, remove the next thing
    //         i--; 
    //         dups += 1; //add one to the population of words that have this count
    //     } else {
    //         //build new metaData object and push it
    //         console.log(counts[i], dups+1);
    //         var metaDatum = new MetaDatum(counts[i], dups+1);
    //         metaData.push(metaDatum);
    //         dups = 0;
    //     }
    // }

    // console.log(metaData);
    // // ------calculate positions
    
    // for (var i = 0; i < words.length; i++) {
        
    //     //find row multiplier & columns
    //     var row = 0;
    //     while ( words[i].count != metaData[row].count && row < metaData.length) {
    //         row++; 
    //     }
        
    //     //calc sub row
        
    //     //assign y position
    //     words[i].ypos = (row * rowHeight) + margin;

    //     var colWidth = (width)/(metaData[row].population+1);
        
    //     //assign x position
    //     words[i].xpos = (metaData[row].col*colWidth);
        
        
    //     //-----------------------------------------start drawin'
    //     // textToWrite = words[i].value + " | col: " + metaData[row].col + " | count: " + metaData[row].count;
    //     words[i].viz();
        
    //     // start next column
    //     metaData[row].col += 1;
        
    // }
        
    
} // end callback
    
    