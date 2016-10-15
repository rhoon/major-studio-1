var words = [];
var margin = 100;
var rowHeight = 50;
var groups = [];
var maxWordsInRow = 10;
var subRowHeight = 10;
var height;

function hashMap(hash, word) {
    
    if (hash[word] >= 1) { 
        hash[word] += 1; 
    } else {
        hash[word] = 1; 
    }
    
}

function yposCalc(row) {
    	var height = 0;
    	// calculate the height of every group before this group
    	for (var i = 0; i<row; i++) {
    		height += (40 + groups[i].maxSubRow * subRowHeight);
    	}
    	// add the other stuff
    	return height + (groups[row].subRow * subRowHeight) + margin;
}

function Group(count, population) {
    
    //row is the groups[i]
    this.count = count;
    this.population = population;
    this.col = 1;
    this.subRow = 0;
    
    if (population <= maxWordsInRow) {
        this.maxCol = population+1;
        this.maxSubRow = 0;
    } else {
        this.maxCol = 10;
        this.maxSubRow = Math.ceil(population/maxWordsInRow);
    }
    
    this.rowHeight = 50; // + (this.maxSubRow * subRowHeight);
    this.colWidth = (width-margin)/this.maxCol;
    
}

function setup() {
    
    createCanvas(1024, 3000);
    background(255);
    loadTable("pitf.tsv", "tsv", "header", callback);
    
}

function callback(data) {
    
    var count = data.getRowCount();
    
    for (var i = 0; i < count; i++) {
        //break up description
        var description = data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};1234567890/'"]/g, ' ').trim().split(' ');
        // var description = RiTa.tokenize(data.getString(i,4));
        
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
                    textAlign(LEFT);
                    textSize(8);
                    textStyle(BOLD);
                    text(this.value+' | '+this.count, this.xpos, this.ypos); // this.value
                }
                
                words[word].drawLine = function () {
                    for (nxt in this.nextStr) {
                        if (words[nxt] != undefined) { //dealing with junk in nextString array
                            stroke(200,200,200,50)
                            line(words[nxt].xpos, words[nxt].ypos, this.xpos, this.ypos);
                        }
                    }
                }
                
                words[word].highlight = function () {
                    fill(0,0,255);
                    text(this.value+' | '+this.count, this.xpos, this.ypos); // this.value
                    for (nxt in this.nextStr) {
                        if (words[nxt] != undefined) { //dealing with junk in nextString array
                            stroke(0,0,255,50);
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
        groups.unshift(group);
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
            console.log(word);
            // words[word].ypos = (group * rowHeight) + (groups[group].subRow * subRowHeight) + margin; // old ypos
            words[word].ypos = yposCalc(group);
            
            // assign x position
            words[word].xpos = (groups[group].col*groups[group].colWidth);
        
        
            // start next column
        
            groups[group].col += 1;
            if (groups[group].col == maxWordsInRow) {
                groups[group].col = 1;
                groups[group].subRow++;
            }
            
            // draw lines
            words[word].drawLine();

    }
    
    for (word in words) {
        words[word].drawText();

    }
    
    
} // end callback
    
//use mouseX/Y dist to posx/posy to detect mouse over
    
function draw() {
    
    words[government].highlight();
}   