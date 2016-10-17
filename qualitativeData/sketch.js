var words = [];
var margin = 100;
var rowHeight = 20;
var groups = [];
var maxWordsInRow = 10;
var subRowHeight = 12;
var height;
var calcCount = 0;
var hover = false;

function hashMap(hash, word) {
    
        if (hash[word] >= 1) { 
            hash[word] += 1; 
        } else {
            hash[word] = 1; 
        }
    
}

function yposCalc(row) {
        calcCount += 1;
        console.log(calcCount);
    	var height = 0;
    	// calculate the height of every group before this group
    	for (var i = 0; i<row; i++) {
    		height += (rowHeight + groups[i].maxSubRow * subRowHeight);
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
        
        this.maxCol = 10;
        this.maxSubRow = Math.ceil(population/maxWordsInRow+.5);
        
        this.colWidth = (width-margin)/this.maxCol;
    
}

function setup() {
    createCanvas(windowWidth, 3000);
    loadTable("pitf.tsv", "tsv", "header", callback);
    
}

function callback(data) {
    
    var count = data.getRowCount();
    
    for (var i = 0; i < count; i++) {
        //break up description
        var description = data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};1234567890/'"]/g, ' ').trim().split(' ');
        // var description = RiTa.tokenize(data.getString(i,4).replace(/[.,?!@#$%^&*()_~{};1234567890/'"]/g, ' '));
        
        
        //clean out the blanks
        for (var j in description) { 
            var word = description[j];
            
            if (word==''||word==undefined||word==' '||word=='if'||word=='and'||word=='in'||word=='or'||word=='the'||word=='for'||word=='of'||word=='a'||word=='to'||word=='by'||word=='-'||word=='s'||word=='a'||word=='as'||word=='on'||word=='an'||word=='are') { 
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
                words[word].drawText = function (faded) {
                    textAlign(LEFT);
                    textSize(9);
                    textStyle(BOLD);
                    if (faded) { fill(200); } else { fill(0); }
                    text(this.value, this.xpos, this.ypos); // this.value
                }
                
                words[word].drawLine = function (faded) {
                    for (nxt in this.nextStr) {
                        if (words[nxt] != undefined) { //dealing with junk in nextString array
                        if (faded) {stroke(200,200,200,10); } else { stroke(200,200,200,50); }
                            line(words[nxt].xpos, words[nxt].ypos, this.xpos, this.ypos);
                        }
                    }
                }
                
                words[word].highlight = function () {
                    fill(255, 200);
                    rect(0, 0, width, height);
                    fill(0,0,0);
                    //write Text
                    text(this.value, this.xpos, this.ypos);
                    textSize(10);
                    textStyle(NORMAL);
                    text('Count: '+ this.count, this.xpos, this.ypos+20);
                    
                    var i = 0;
                    for (country in this.country) {
                        i++;
                        console.log();
                        text(country, this.xpos, this.ypos+(30+subRowHeight*i)); 
                    }
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
        //add group to front of array groups
        groups.unshift(group); 
    }
    
    console.log(groups);
    // ------calculate positions
    
    for (word in words) {
        
        if (word != '_arrayContains') { //solving for error
            //find row multiplier & columns. 38 is the 'length' of population
            var group = groups.length;
            for (var i = 0; i < groups.length; i++) {
                if (words[word].count == groups[i].count) { 
                    group = i;
                    break; 
                }
            }
            console.log(word);
            //assign y position
            words[word].ypos = yposCalc(group);
            
            // assign x position
            words[word].xpos = (groups[group].col*groups[group].colWidth);
        
        
            // start next column
            groups[group].col += 1;
            if (groups[group].col == maxWordsInRow) {
                groups[group].col = 1;
                groups[group].subRow++;
            }
        }
    }
    
    drawChart();
    
    
} // end callback
    
//use mouseX/Y dist to posx/posy to detect mouse over
    
function draw() {
    // --------- defaulting to mousePressed for functionality, draw()-based hovers are too heavy on CPU
}   

function drawChart() {
    background(255);
    
    for (word in words) {
        if (word != '_arrayContains') {
            words[word].drawLine();
        }
    }
    
    for (word in words) {
        if (word != '_arrayContains') {
            words[word].drawText();
        }
    }
    
    // if (exception != null) {
    //     words[exception].highlight();
    // }

}

function mouseClicked() {
    for (word in words) {
        var distance = dist(mouseX, mouseY, words[word].xpos, words[word].ypos);
        // drawChart(); 
        if (distance < 10) {
            words[word].highlight();
        } //else {
         
        // }
    }
}