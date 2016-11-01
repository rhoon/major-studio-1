var leafletMap;
var canvas;
var mags =[];
var quakes = [];
var slider;

function setup() {
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('leafletMap');
    initLeaflet();
    loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv', parseSource)
    
    slider = createSlider(0, 10, 1);
    slider.position(width/2-50, 25);
    slider.changed(updateQuakes);
    
}

// function draw() {
//     for (var i = 1; i<data.length; i++) {
//         quakes[i].setRadius(mags[i]);
        
//     }
// }

function parseSource(data) {
    for (var i = 1; i<data.length; i++) {
        var row = split(data[i], ',');
        mags[i] = row[4];
        var place = row[13];
        
        //creats leaflet circle maker
        quakes[i] = L.circleMarker([row[1],row[2]], {
            stroke: true,
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.8,
            radius: row[4]
            // fillColor: setColor(row[4])
        });
        
        var place = row[13];
        
        quakes[i]
            .addTo(leafletMap)
            .bindPopup('<b>' + row[4] + ' magnitude </b>' + place);
    }
    
}

function initLeaflet() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoicmhvb24iLCJhIjoiY2l1aW5tZHdpMDAwODJvcGxodXExa3cyMyJ9.zrZZWtSkaDYztnOZmZBDNw';
    leafletMap = L.mapbox.map('leafletMap', 'mapbox.light').setView([20, 0], 2);
    
    function onMapClick(e) {
        // need the function
    }
    
    leafletMap.on('click', onMapClick);
    
}

function updateQuakes() {
    for (var i = 1; i< quakes.length; i++) {
        //check if slider value exceeds individual mag
        if (mags[i] > slider.value()) {
            quakes[i].setRadius(mags[i]);
        } else {
            quakes[i].setRadius(0);
        }
        
    }
}