var wrds = [];
var margin = 100;
var rowHeight = 20;
var groups = [];
var maxwrdsInRow = 10;
var subRowHeight = 12;
var height;
var calcCount = 0;
var hover = false;

function hashMap(hash, wrd) {
    
        if (hash[wrd] >= 1) { 
            hash[wrd] += 1; 
        } else {
            hash[wrd] = 1; 
        }
    
}

function yposCalc(row) {
        calcCount += 1;
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
        this.maxSubRow = Math.ceil(population/maxwrdsInRow+.5);
        this.colWidth = (width-margin)/this.maxCol;
        this.xpos = this.colWidth*0.8;
        this.xposLine = this.colWidth*0.89;
        
        this.drawLabels = function() {
            //lines
            stroke(0,0,255);
            line(this.xposLine, this.yposLine, this.xposLine, this.ypos);
            
            //text
            fill(0,0,255);
            noStroke();
            textSize(10);
            textStyle(BOLD);
            textAlign(RIGHT);
            text(this.count, this.xpos, this.ypos);
        }
    
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
        
        var RegularTypeOf = typeof(description);
        console.log(RegularTypeOf);
        
        //clean out the blanks
        for (var j in description) { 
            var wrd = description[j];
            
            if (wrd==''||wrd==undefined||wrd==' '||wrd=='if'||wrd=='and'||wrd=='in'||wrd=='or'||wrd=='the'||wrd=='for'||wrd=='of'||wrd=='a'||wrd=='to'||wrd=='by'||wrd=='-'||wrd=='s'||wrd=='a'||wrd=='as'||wrd=='on'||wrd=='an'||wrd=='are') { 
                description.splice(j,1); 
            }
            
        } // end loop j
        
        // loop through broken up description and assign each wrd to an object
        for (var j = 0; j < description.length; j++) { 
            
            var wrd = description[j].trim();
            
            if (wrd in wrds && wrd != 'reduce' && wrd != "") { //there is some very weird bug associated with the wrd 'reduce'

                wrds[wrd].count += 1; 
                hashMap(wrds[wrd].country, data.getString(i, 0)); // countries
                hashMap(wrds[wrd].conflict, data.getString(i, 1)); // conflict
                hashMap(wrds[wrd].nextStr, description[j+1]); // next wrds
                
            } else  { 
                
                // initialize variables
                wrds[wrd] = new Object();
                wrds[wrd].count = 1; 
                wrds[wrd].value = wrd;
                wrds[wrd].country = [];
                wrds[wrd].conflict = [];
                wrds[wrd].nextStr = [];
                
                // declare functions
                wrds[wrd].drawText = function (faded) {
                    textAlign(LEFT);
                    textSize(9);
                    textStyle(BOLD);
                    if (faded) { fill(200); } else { fill(0); }
                    text(this.value, this.xpos, this.ypos); // this.value
                }
                
                wrds[wrd].drawLine = function (faded) {
                    for (nxt in this.nextStr) {
                        if (wrds[nxt] != undefined) { //dealing with junk in nextString array
                        if (faded) {stroke(200,200,200,10); } else { stroke(200,200,200,50); }
                            line(wrds[nxt].xpos, wrds[nxt].ypos, this.xpos, this.ypos);
                        }
                    }
                }
                
                wrds[wrd].highlight = function () {
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
                        text(country, this.xpos, this.ypos+(30+subRowHeight*i)); 
                    }
                    for (nxt in this.nextStr) {
                        if (wrds[nxt] != undefined) { //dealing with junk in nextString array
                            stroke(0,0,255,50);
                            line(wrds[nxt].xpos, wrds[nxt].ypos, this.xpos, this.ypos);
                        }
                    }
                }
                
                // make hashes
                hashMap(wrds[wrd].country, data.getString(i, 0)); // countries
                hashMap(wrds[wrd].conflict, data.getString(i, 1)); // conflict
                hashMap(wrds[wrd].nextStr, description[j+1]); // next wrds
                
            }
            // could also get date data here

        } // end loop j
            
    } // end loop i
    
    console.log(wrds);

    //build an arrays 'population' and 'groups' to use as index and labels
    var population = [];
    for (wrd in wrds) {
        if (wrd != '_arrayContains') {
            hashMap(population, wrds[wrd].count);
        }
    }

    for (count in population) {
        var group = new Group(count, population[count]);
        //add group to front of array groups
        groups.unshift(group); 
    }
    
    // calculate label and wrd positions
    
    for (wrd in wrds) {
        
        if (wrd != '_arrayContains') { //solving for error
            //find row multiplier & columns. 38 is the 'length' of population
            var group = groups.length;
            for (var i = 0; i < groups.length; i++) {
                //set index
                if (wrds[wrd].count == groups[i].count) { 
                    group = i;
                    break; 
                }
            }
            
            //assign y position
            wrds[wrd].ypos = yposCalc(group);
            groups[group].ypos = yposCalc(group);
            if (group!=0) { 
                groups[group].yposLine = (yposCalc(group-1))+25; 
            } else {
                groups[group].yposLine = yposCalc(group)-8;
            }
            
            // assign x position
            wrds[wrd].xpos = (groups[group].col*groups[group].colWidth);
        
            // start next column
            groups[group].col += 1;
            if (groups[group].col == maxwrdsInRow) {
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
    
    // LABELS
    
    for (group in groups) {
        groups[group].drawLabels();
    }
    
    var topLabelypos = groups[0].ypos-30;
    
    textSize(8);
    text("COUNT", groups[0].xpos, topLabelypos);
    fill(0);
    textAlign(RIGHT);
    text("wrd", groups[0].colWidth+25, topLabelypos);
    
    // DATA
    for (wrd in wrds) {
        if (wrd != '_arrayContains') {
            wrds[wrd].drawLine();
        }
    }
    
    for (wrd in wrds) {
        if (wrd != '_arrayContains') {
            wrds[wrd].drawText();
        }
    }
    
    // if (exception != null) {
    //     wrds[exception].highlight();
    // }

}

function mouseClicked() {
    for (wrd in wrds) {
        var distance = dist(mouseX, mouseY, wrds[wrd].xpos, wrds[wrd].ypos);
        // drawChart(); 
        if (distance < 10) {
            wrds[wrd].highlight();
        } //else {
         // redrawing chart causes browser to freeze
        // }
    }
}