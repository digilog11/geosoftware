"use_strict";

/**
 * changes degrees into radians
 * @param {number} degrees - the coordinate in degrees
 * @return {number} - the coordinate in radians
 */
function toRadians (degrees) {
  return degrees * (Math.PI/180);
}

/**
 * changes radians into degrees
 * @param {number} radians - the coordinate in radians
 * @return {number} - the coordinate in degrees
 */
function toDegrees (radians) {
  return radians * (180/Math.PI);
}

/**
 * converts from unix time to human-readable time
 * @param {number} unix - unix time in seconds
 * @return {string} - time e.g. "10:04 Uhr"
 */
function toReadableTime (unix) {
  var time = new Date (unix*1000);
  var hours = time.getHours();
  var minutes = time.getMinutes();
  if (minutes < 10){
    return "" + hours + ":0" + minutes + " Uhr";
  }else{
    return "" + hours + ":" + minutes + " Uhr";
  }
}

/**
 * converts from seconds to minutes
 * @param {number} seconds - time in seconds
 * @return {string} - time in minutes e.g. "4 Minuten"
 */
function toMinutes (seconds) {
  var minutes = Math.round(seconds/60);
  if (minutes >= 1 && minutes < 2){
    return "" + minutes + " Minute";
  }else{
    return "" + minutes + " Minuten";
  }
}

/**
 * rounds a number to three places behind the comma
 * @param {number} num - input number
 * @return {number} - rounded number
 */
function round3 (num) {
  return Number(Math.round(num+'e'+3)+'e-'+3);
}

/**
 * calculates the distance between two points on the basis of a spherical earth
 * @param {number} lon1 - Point 1 Longitude
 * @param {number} lat1 - Point 1 Latitude
 * @param {number} lon2 - Point 2 Longitude
 * @param {number} lat2 - Point 2 Latitude
 * @return {number} - the distance in kilometres
 */
function getDistance (lon1, lat1, lon2, lat2) {
  var R = 6371e3; // metres
  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2-lat1);
  var Δλ = toRadians(lon2-lon1);
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d*0.001; // kilometres
}

/**
 * calculates the bearing between two points on the basis of a spherical earth
 * @param {number} lon1 - Point 1 Longitude
 * @param {number} lat1 - Point 1 Latitude
 * @param {number} lon2 - Point 2 Longitude
 * @param {number} lat2 - Point 2 Latitude
 * @return {number} - the bearing in degrees between 0 and 360
 */
function getBearing (lon1, lat1, lon2, lat2) {
  var dlon = lon2-lon1;
  var y = Math.sin(toRadians(dlon)) * Math.cos(toRadians(lat2));
  var x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
          Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(toRadians(dlon));
  var brng0 = toDegrees(Math.atan2(y, x));
  var brng1 = (brng0+360)%360;
  if (brng1 < 0 || brng1 >= 360) {
    throw "Error: Bearing outside 0-360°";
  } else return brng1;
}

/**
 * decides the compass direction relative from a point 1 to a point 2 using the getBearing function
 * @param {number} lon1 - Point 1 Longitude
 * @param {number} lat1 - Point 1 Latitude
 * @param {number} lon2 - Point 2 Longitude
 * @param {number} lat2 - Point 2 Latitude
 * @return {string} - the direction as a string
 */
function getDirection (lon1, lat1, lon2, lat2) {
  var brng = getBearing(lon1, lat1, lon2, lat2);
  // the circle is divided into 8 segments of each 45°. N, NE, E, SE, S, SW, W and NW are each in the middle
  // of the segments, i.e. N is at 0° and the North-Segment goes from -22.5°(or 337.5°) to 22.5°
  if (brng <= 22.5 || brng > 337.5 ) return "N";
  else if (brng > 22.5 && brng <= 67.5) return "NE";
  else if (brng > 67.5 && brng <= 112.5) return "E";
  else if (brng > 112.5 && brng <= 157.5) return "SE";
  else if (brng > 157.5 && brng <= 202.5) return "S";
  else if (brng > 202.5 && brng <= 247.5) return "SW";
  else if (brng > 247.5 && brng <= 292.5) return "W";
  else return "NW";
}

/**
 * sorts the array in ascending order according to distance
 * @param {object[]} array - input array of objects with property 'distance'
 */
function sortByDistance (array) {
  array.sort(function (a, b) {return a.distance - b.distance});
}

/**
 * sorts the array in ascending order according to time
 * @param {object[]} array - input array of objects with property 'departure_time'
 */
function sortByTime (array) {
  array.sort(function (a, b) {return a.departure_time - b.departure_time});
}

/**
 * uses xhr to request a JSON from an url and after success invokes a function
 * @param {string} url - url from which to request the JSON
 * @param {string} cFunction - name of function to be called after request is ready
 * @param {object} object - parameter of cFunction
 */
function requestJSON (url, cFunction, object) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
     if(request.readyState == 4 && request.status == "200"){
       cFunction(this, object);
     }
   };
   request.open("GET", url, true);
   request.send();
}

/**
 * uses xhr to request a JSON from an url and after success invokes a function
 * same as function requestJSON, but doesn't give on an object
 * @param {string} url - url from which to request the JSON
 * @param {string} cFunction - name of function to be called after request is ready
 */
function requestJSON2 (url, cFunction) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
     if(request.readyState == 4 && request.status == "200"){
       cFunction(this);
     }
   };
   request.open("GET", url, true);
   request.send();
}

/**
 * @constructor creates a new Busstop
 * @property {string} name - the name of the Busstop
 * @property {number} number - the number of the Busstop
 * @property {number} distance - the distance of the Busstop
 * @property {string} direction - the direction of the Busstop
 * @property {number[]} coordinates - the coordinates of the Busstop
 * @example new Busstop = {name: "Domplatz", number: 345673, distance: 0.877, direction: "SW", coordinates: [51.96,7.63]}
 */
function Busstop (name, number, distance, direction, coordinates) {
  this.name = name
  this.number = number;
  this.distance = distance;
  this.direction = direction;
  this.coordinates = coordinates;
}

/**
 * @constructor creates a new Ride
 * @property {number} departure_time - the time of departure in unix seconds
 * @property {number} delay - the delay in seconds
 * @property {string} line - the line number of the Ride
 * @property {string} destination - the destination of the Ride
 * @example new Ride = {departure_time: 1588851540, delay: 8, line: "9", destination: "Von-Humboldt-Straße"}
 */
function Ride (departure_time, delay, line, destination) {
  this.departure_time = departure_time;
  this.delay = delay;
  this.line = line;
  this.destination = destination;
}

/**
 * uses the response from the requestJSON function to create an array of Busstop objects, sorts the array
 * and displays it in the html doc as map and table, also requests the busrides at the nearest busstop in the next 20 minutes
 * @param {object} request - XMLHttpRequest
 * @param {array} point - used to calculate distance and direction between point and busstops
 */
function displayBusstops (request, point) {
  var busstops = JSON.parse(request.response);
  var sortedBusstops = new Array();

  // fill the new array with Busstop objects
  for (var i = 0; i < busstops.features.length; i++){
    sortedBusstops[i] = new Busstop (
      busstops.features[i].properties.lbez,
      busstops.features[i].properties.nr,
      round3(getDistance(point.lon,point.lat,busstops.features[i].geometry.coordinates[0],busstops.features[i].geometry.coordinates[1])),
      getDirection(point.lon,point.lat,busstops.features[i].geometry.coordinates[0],busstops.features[i].geometry.coordinates[1]),
      [busstops.features[i].geometry.coordinates[0],busstops.features[i].geometry.coordinates[1]]
    )
  }

  sortByDistance(sortedBusstops);

  // get Busrides at nearest busstop
  // sekunden = 1200 => 20 minutes
  requestJSON('https://rest.busradar.conterra.de/prod/haltestellen/' + sortedBusstops[0].number
   + '/abfahrten?sekunden=1200', displayNearestBusstop, sortedBusstops);

  // write the sorted array into the html doc
  for (var i = 1; i < 5; i++){
     document.getElementById("busstops").innerHTML +=
       "<div class='container bg-primary py-2 text-white'>" +
       "<div class='row'>" +
       "<div class='col-md-4'>" +
       "<b>" + "Bushaltestelle: " + "</b>" + sortedBusstops[i].name + "</div>" +
       "<div class='col-md-4'>" +
       "<b>" + "Distanz: " + "</b>" + sortedBusstops[i].distance + " km" + "</div>" +
       "<div class='col-md-4'>" +
       "<b>" + "Himmelsrichtung: " + "</b>" + sortedBusstops[i].direction + "</div>" +
       "</div>" + "</div>" +
       "<div class='col'style='height: 10px;'></div>";
  }

  // create baselayer
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:18,
    attribution: 'Leaflet, OpenStreetMap Contributors',
    });

  // empty map div in case it has already been initialized
  document.getElementById("mapContainer").innerHTML ="<div id='mapId' style='height: 400px;'></div>";

  // create a Leaflet map, center is position of user
  var map = L.map('mapId').setView([point.lat,point.lon],15);
  osm.addTo(map);

  // add a marker at the position of user
  L.marker([point.lat,point.lon]).addTo(map).bindPopup("Dein Standort").openPopup();

  // add markers for the busstops and popups with information about name, distance and
  // direction of the busstop
  for (var i = 0; i < sortedBusstops.length; i++){
    L.marker([sortedBusstops[i].coordinates[1],sortedBusstops[i].coordinates[0]]).addTo(map).bindPopup(
       "<p>" + "<b>" + "Bushaltestelle: " + "</b>" + sortedBusstops[i].name + "<br>" +
       "<b>" + "Distanz zum Standort: " + "</b>" + sortedBusstops[i].distance + " km" + "<br>" +
       "<b>" + "Himmelsrichtung: " + "</b>" + sortedBusstops[i].direction + "</p>" );
 }

 // create array of heatPoints
 var heatPoints = [];
 // fill it with all the busstops
 for (var i = 0; i < sortedBusstops.length; i++){
   heatPoints[i] = [sortedBusstops[i].coordinates[1],sortedBusstops[i].coordinates[0],1]
 }
 // create new Layer on map with heatpoints
 var heat = L.heatLayer(heatPoints, {radius:50});
 // group osm and heat into one layer
 var osmHeat = L.layerGroup([osm, heat]);

 // add layer control
 var overlayMaps = {"Heatmap": osmHeat, "Basemap": osm};
 L.control.layers(overlayMaps).addTo(map);
}

/**
 * uses the response from the requestJSON function to create an array of Ride objects, sorts the array
 * and displays it in the html doc after also displaying the nearest busstop
 * @param {object} request - XMLHttpRequest
 * @param {object} sortedBusstops - used to display the nearest busstop
 */
function displayNearestBusstop (request, sortedBusstops) {
  var rides = JSON.parse(request.response);
  var sortedRides = new Array();

  // fill the new array with Ride objects
  for (var i = 0; i < rides.length; i++){
    sortedRides[i] = new Ride (
      rides[i].abfahrtszeit,
      rides[i].delay,
      rides[i].linientext,
      rides[i].richtungstext
    )
  }

  sortByTime(sortedRides);

  // write the nearest busstop into the html doc
  document.getElementById("nearest_busstop").innerHTML +=
    "<div class='container bg-primary py-2 text-white'>" +
    "<div class='row'>" +
    "<div class='col-md-4'>" +
    "<b>" + "Bushaltestelle: " + "</b>" + sortedBusstops[0].name + "</div>" +
    "<div class='col-md-4'>" +
    "<b>" + "Distanz: " + "</b>" + sortedBusstops[0].distance + " km" + "</div>" +
    "<div class='col-md-4'>" +
    "<b>" + "Himmelsrichtung: " + "</b>" + sortedBusstops[0].direction + "</div>" +
    "</div>" + "</div>" +
    "<div class='col'style='height: 10px;'></div>";

  // write the busrides at the nearest busstop into the html doc
  if (rides.length == 0) {
    document.getElementById("nearest_busstop").innerHTML += "<p> Keine Fahrten in den nächsten 5 Minuten </p>";
  }else{
    for (var i = 0; i < sortedRides.length; i++){
      document.getElementById("nearest_busstop").innerHTML +=
      "<div class='container bg-danger py-2 text-white'>" +
      "<div class='row'>" +
      "<div class='col-md-3'>" +
      "<b>" + "Abfahrtszeit: " + "</b>" + toReadableTime(sortedRides[i].departure_time) + "</div>" +
      "<div class='col-md-3'>" +
      "<b>" + "Verspätung: " + "</b>" + toMinutes(sortedRides[i].delay) + "</div>" +
      "<div class='col-md-2'>" +
      "<b>" + "Linie: " + "</b>" + sortedRides[i].line + "</div>" +
      "<div class='col-md-4'>" +
      "<b>" + "Richtung: " + "</b>" + sortedRides[i].destination + "</div>" +
      "</div>" + "</div>" +
      "<div class='col'style='height: 10px;'></div>";
    }
  }
}

/**
 * requests the busstops from the conterra API, gives selected point on to function displayBusstops()
 * @param {number} lon - longitude
 * @param {number} lat - latitude
 */
 function calculateBusDistance (lon, lat) {
   // clear area
   document.getElementById("busstops").innerHTML = "";
   document.getElementById("nearest_busstop").innerHTML = "";

   var x = {lon: lon, lat: lat};

   // get busstops
   requestJSON('https://rest.busradar.conterra.de/prod/haltestellen', displayBusstops, x);
 }

 /**
  * gets the selected point and gives the lon and lat values of that point on to function calculateBusDistance()
  */
 function selectPoint() {
   var radioButtons = document.getElementsByName("point");

   for (var i = 0; i < radioButtons.length; i++){
     if(radioButtons[i].checked == true){
       calculateBusDistance(radioButtons[i].value, radioButtons[i].id);
     }
   }
 }

 /**
  * uses the response from the requestJSON function to display the points from the MongoDB database
  * in a form as selectable radio buttons
  * @param {object} request - XMLHttpRequest
  */
 function loadPoints (request) {
   var points = JSON.parse(request.response);

   for(var i = 0; i < points.length; i++){
      document.getElementById("radioSelectPoint").innerHTML +=
       "<div class='form-check'>" +
       "<input type = 'radio' class = 'form-check-input' name = 'point' value =" + points[i].lon + " id =" + points[i].lat + ">" +
       "<label class = 'form-check-label'>" + "lon: " + points[i].lon + ", lat: " + points[i].lat + ",<span class='text-muted'> id: " + points[i]._id + "</span> </label>" +
       "</div>";
   }
 }

requestJSON2("http://localhost:3000/points", loadPoints);
