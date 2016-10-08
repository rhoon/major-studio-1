
var sorted = [];
var textX = 100;

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
    
    //now search for matches and combine
    // for ( var i = 0; i < words.length; i++ ) {
        
    //     for (var j = 0; j < words.length; j++) {
            
    //         //check if they match
    //         if (words[i].value)
    //         //combine matching cases
            
    //     }
        
        
    }

        
}
    
console.log(words);
