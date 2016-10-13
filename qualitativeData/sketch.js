var words = [];
var margin = 20;
var rowHeight = 40;
var groups = [];

function hashMap(hash, word) {
    
    if (hash[word] >= 1) { 
        hash[word] += 1; 
    } else {
        hash[word] = 1; 
    }
    
}

function Group(count, population) {
    
    //row is the groups[i]
    this.count = count;
    this.population = population;
    this.col = 1;
    this.subRow = 0;
    
    if (population <= 10) {
        this.maxCol = population;
        this.maxSubRow = 0;
    } else {
        this.maxCol = 10;
        this.maxSubRow = Math.ceil(population/10);
    }
    
    this.rowHeight = 40+(20*this.maxSubRow);
    this.colWidth = width/this.maxCol;
    
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
                words[word].value = word;
                words[word].country = [];
                words[word].conflict = [];
                words[word].nextStr = [];
                
                // declare functions
                words[word].viz = function () {
                    textAlign(CENTER);
                    text(this.value, this.xpos, this.ypos);
                }
                
                // make hashes
                hashMap(words[word].country, data.getString(i, 0)); // countries
                hashMap(words[word].conflict, data.getString(i, 1)); // conflict
                hashMap(words[word].nextStr, description[j+1]); // next words
                
            }
            // could also get date data here

        } // end loop j
            
    } // end loop i


    //build an array 'population' to use the index as a multiplier on row height
    var population = [];
    for (word in words) {
        hashMap(population, words[word].count);
    }

    for (count in population) {
        var group = new Group(count, population[count]);
        groups.push(group);
    }
    // ------calculate positions
    
    console.log(groups);
    
    for (word in words) {
        
        //find row multiplier & columns. 38 is the 'length' of population
        var row = groups.length;
        for (var i = 0; i < groups.length; i++) {
            if (words[word].count == groups[i].count) { 
                row = i;
                break; 
            }
        }
        
        //assign y position
        words[word].ypos = (row * rowHeight) + margin; // + subRow*subRowHeight
        
        // assign x position
        words[word].xpos = (groups[row].col*groups[row].colWidth);

        //-----------------------------------------start drawin'
        words[word].viz();
        
        
        // start next column
        groups[row].col += 1;
        
    }
        
    
} // end callback
    
    