var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
var apiKey = "&c84b062082bf4e15b2cf67addc7f6d96";
var input;
var firstSearch = true;

function setup() {
    noCanvas();
    
    var button = select("#submit");
    button.mousePressed(searchArticles);
    input = select("#search");

    
}

function searchArticles() {
    var apiurl = url + input.value() + apiKey;
    loadJSON(apiurl, gotJSON);
}

function draw() {
}

function gotJSON(data){
    
    var articles = data.response.docs;
    if (firstSearch) {
        for (var i = 0; i<articles.length; i++) {
            //populate new stuff here
            
            rita('h1', articles[i].headline.main);
            createElement('br');
            rita('span', articles[i].snippet);
            createElement('br');
            createElement('br');
            createElement('br');
            
            // var h = createElement('h1', articles[i].headline.main); //uses P5's createElement function to make one headline per headline per article
            // h.id('heading'+i); // creates a custom id for each element
            // var p = createP(articles[i].snippet);
            // p.id('description'+i);
            
            // styleThis(h, p);
        }
        firstSearch = false;
    } //else{
    //     for (var i = 0; i<articles.length; i++) {
    //         //remove old stuff here
    //         var oldHeading = select('#heading'+[i]);
    //         oldHeading.remove();
    //         var oldP = select('#description'+[i]);
    //         oldP.remove();
            
    //         //populate new stuff here
    //         var h = createElement('h1', articles[i].headline.main); //uses P5's createElement function to make one headline per headline per article
    //         h.id('heading'+i); // creates a custom id for each element
    //         var p = createP(articles[i].snippet);
    //         p.id('description'+i);
    //     }
    // }
    
    
    println(data);
    
}

function rita(tag, str) {
    
    rs = RiString(str);
    var words = rs.words();
    var pos = rs.pos();
    
    for (var i = 0; i<words.length; i++) {
        var span = createElement(tag, words[i]); //createElement(span, text)
        if (pos[i] == 'nnp' || pos[i] == 'nnps' || pos[i] == 'fw') { //if word is a proper noun (singular or plural) or foriegn word
            span.style('background', 'yellow');
        } else if (pos[i] == 'jj') {
            span.style('background', '#EEE');
        }
    }
    
}


function styleThis(ele, p){
    ele.style('color', 'blue');
    ele.style('text-align', 'center')
    p.style('text-align', 'center')

}
