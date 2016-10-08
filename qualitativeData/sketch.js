var words = [];

function setup() {
    
    createCanvas(windowWidth, windowHeight);
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
    
    //-----------calculate positions
    //build an array of counts to use the index as a multiplier on row height
    var counts = [];
    for (i in words) {
        counts.push(words[i].count);
    }
    
    counts.sort(function(a, b) {
        return b - a;
    });
    
    for (var i = 0; i < counts.length; i++) {
        if (counts[i] == counts[i+1]) {
            counts.splice(i+1, 1);
            console.log('deleting ' + counts[i+1]);
            i--;
        }
    }
    
    var margin;
    
    console.log(counts);
    
    
}
    
    
// data is structured
// next steps - calculate positions
// use frequecy to calculate x, y position

// the highest count is y = margin, next highest count, y = margin + row * 1; next highest count, y = margin + row * 2 etc
// build an array of counts, in order? array length reveals height of the thing
// 


// assign those to data objects

// draw lines
