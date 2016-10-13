var words = [];
var margin = 100;
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
    
    if (population <= 15) {
        this.maxCol = population+1;
        this.maxSubRow = 0;
    } else {
        this.maxCol = 10;
        this.maxSubRow = Math.ceil(population/10);
    }
    
    this.rowHeight = 40; //+(20*this.maxSubRow); this doesn't work
    this.colWidth = (width-margin)/this.maxCol;
    
}

function setup() {
    
    createCanvas(windowWidth, 5000);
    background(220);
    loadTable("pitf.tsv", "tsv", "header", callback);
    
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
                words[word].drawText = function () {
                    textAlign(CENTER);
                    text(this.value+' | '+this.count, this.xpos, this.ypos); // this.value
                }
                
                words[word].drawLine = function () {
                    for (nxt in this.nextStr) {
                        if (words[nxt] != undefined) { //dealing with junk in nextString array
                            stroke(250,250,250,50)
                            line(words[nxt].xpos, words[nxt].ypos, this.xpos, this.ypos);
                        }
                    }
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
    
    for (word in words) {
        
        //find row multiplier & columns. 38 is the 'length' of population
        var group = groups.length;
        for (var i = 0; i < groups.length; i++) {
            if (words[word].count == groups[i].count) { 
                group = i;
                break; 
            }
        }
        
        //assign y position
        words[word].ypos = (group * groups[group].rowHeight) + margin; // + subRow*subRowHeight
        
        // assign x position
        words[word].xpos = (groups[group].col*groups[group].colWidth);
        
        // start next column
        groups[group].col += 1;
        groups[group].subRow += 1;
        
    }
    
    for (word in words) {
            words[word].drawLine();
            words[word].drawText();
    }
    
    
        
    
} // end callback
    
    //use mouseX/Y dist to posx/posy to detect mouse over