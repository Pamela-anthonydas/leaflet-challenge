
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><h3>"+"Mag:" + feature.properties.mag + "</h3>"+ "<h3>"+"Time"+ new Date(feature.properties.time )+"</h3>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: 15000*(earthquakeData.properties.mag),
        color: color(earthquakeData.properties.mag),
        fillOpacity: 0.5
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      15.5994, -28.6731
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // create legend info to display at bottomright
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5],
        colors=['#ff3333','#ff6633','#ff9933','#ffcc33','#ffff33','ccff33'],
        labels = [];


    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(myMap);


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

//function to create markersize
function markerSize(magnitude) {
  return magnitude * 1000;
}

////function to return color based on magnitude
function color(magnitude){
  if (magnitude < 1) {
    return "#ccff33"
  }
  else if (magnitude < 2) {
    return "#ffff33"
  }
  else if (magnitude < 3) {
    return "#ffcc33"
  }
  else if (magnitude < 4) {
    return "#ff9933"
  }
  else if (magnitude < 5) {
    return "#ff6633"
  }
  else {
    return "#ff3333"
  }
}

