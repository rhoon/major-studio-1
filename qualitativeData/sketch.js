var words = [];
var margin = 20;
var rowHeight = 40;
var population = [];

function hashMap(hash, word) {
    
    if (hash[word] >= 1) { 
        hash[word] += 1; 
    } else {
        hash[word] = 1; 
    }
    
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
        var description = data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};1234567890/'"]/g, ' ').toLowerCase().trim().split(' ');
        
        //clean out the blanks
        for (var j in description) { 
            var word = description[j];
            
            if (word=='' || word==undefined || word==' ' || word=='  ') { 
                description.splice(j,1); 
            }
            
        } // end loop j
        
        // loop through broken up description and assign each word to an object
        for (var j = 0; j < description.length; j++) { 
            
            var word = description[j].trim();
            
            if (word in words && word != 'reduce' && word != "") { //there is some very weird bug associated with the word 'reduce'

                words[word].count += 1; 
                hashMap(words[word].country, data.getString(i, 0)); // countries
                hashMap(words[word].conflict, data.getString(i, 1)); // conflict
                hashMap(words[word].nextStr, description[j+1]); // next words
                
            } else  { 
                
                // initialize variables
                words[word] = new Object();
                words[word].count = 1; 
                words[word].country = [];
                words[word].conflict = [];
                words[word].nextStr = [];
                
                // make hashes
                hashMap(words[word].country, data.getString(i, 0)); // countries
                hashMap(words[word].conflict, data.getString(i, 1)); // conflict
                hashMap(words[word].nextStr, description[j+1]); // next words
                
                words[word].viz = function() {
                    textAlign(CENTER);
                    text(this.value, this.xpos, this.ypos);
                    //need lines
                    
                }
            }
            // could also get date data here

        } // end loop j
            
    } // end loop i


    //build an array 'population' to use the index as a multiplier on row height

    for (word in words) {
        hashMap(population, words[word].count);
    }
    
    var row = 0;
    for (count in population) {
        row++;
        console.log(count);
        console.log(population[count]);
    }

    console.log(population); //changed 'counts' to population, bc that's what we're doing


    // ------calculate positions
    
    for (word in words) {
        
        //find row multiplier & columns
        var row = 38;
        for (count in population) {
            row--;
            if (words[word].count == count) { break; }
        }
        console.log('ROW= ' + row);
        
    //     //calc sub row
        
        //assign y position
        words[word].ypos = (row * rowHeight) + margin;
        
        console.log(words[word].ypos)

    //     var colWidth = (width)/(metaData[row].population+1);
        
    //     //assign x position
    //     words[i].xpos = (metaData[row].col*colWidth);
        
        
    //     //-----------------------------------------start drawin'
    //     // textToWrite = words[i].value + " | col: " + metaData[row].col + " | count: " + metaData[row].count;
    //     words[i].viz();
        
    //     // start next column
    //     metaData[row].col += 1;
        
    }
        
    
} // end callback
    
    