"use_strict";

// create a map with option of putting markers
var map = L.map('mapId').setView( [51.96,7.63],10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:18,
  attribution: 'Leaflet, OpenStreetMap Contributors',
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    polygon: false,
    polyline: false,
    rectangle: false,
    circle: false,
    circlemarker: false
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

// when a feature is created add it to the feature group
map.on('draw:created', function (e) {
  var type = e.layerType,
  layer = e.layer;
  drawnItems.addLayer(layer);
});

/**
 * gets the data from the drawn items, converts it into GeoJSON, then into a String
 * and displays it in the textarea l_point
 */
function leafletToGeoJSON(){
  // clear textarea
  document.getElementById("l_point").value = "";

  // get GeoJSON from feature group
  var geoJSON = drawnItems.toGeoJSON();

  if(geoJSON.features.length != 1){
    document.getElementById("adress_Leaflet_error").innerHTML = "Eingabe darf nur ein Punkt sein";
  }
  else{
    // convert GeoJSON to string
    var geoJSON_String = JSON.stringify(geoJSON);

    // write GeoJSON string in textarea
    document.getElementById("l_point").value = '{"type": "Point", "coordinates": ['
      + geoJSON.features[0].geometry.coordinates[0] + "," + geoJSON.features[0].geometry.coordinates[1] + "]}";
  }
}

/**
 * gets the text from the textarea l_point and gives it on to function sendAddedPointToServer()
 */
function submitLPoint(){
  var x = document.getElementById("l_point").value;

  sendAddedPointToServer(x);
}
