"use_strict";

/**
 * gets the current position of user and gives it on to function showPosition
 */
function loadCurrentPosition () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

/**
 * displays the current position of user in the textarea input_point in GeoJSON syntax
 * @param {object} position - calculated by loadCurrentPosition function
 */
function showPosition (position) {
  document.getElementById("input_point").value = '{"type": "Point", "coordinates": ['
    + position.coords.longitude + "," + position.coords.latitude + "]}";
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
 * uses the Nominatim response, gets the coordinates from a response point object
 * and sends them as a geoJSON point on to function sendAddedPointToServer()
 * @param {object} request - XMLHttpRequest
 */
function getPoint(request){
  var point = JSON.parse(request.response);

  // error handling if no point found for address
  if(point.features[0]==null){
    document.getElementById("address_error").innerHTML = "Eingabe unzulässig";
  }else{
    // write adress as GeoJSON point in textarea
    document.getElementById("input_address").value = '{"type": "Point", "coordinates": ['
      + point.features[0].geometry.coordinates[0] + "," + point.features[0].geometry.coordinates[1] + "]}";
    // send point to server
    sendAddedPointToServer(document.getElementById("input_address").value);
  }
}

/**
 * takes the input from the textarea input_adress and sends a request to the Nominatim API
 * which Open Street Map uses for geocoding, no token needed
 */
function submitAddress(){
  var query = document.getElementById("input_address").value;
  var url = 'https://nominatim.openstreetmap.org/search?q=' + query + '&format=geojson';

  requestJSON2(url, getPoint);
}

/**
 * sends obj to "/pointAdded" via POST-Request
 * @param {object} obj - geoJSON point
 */
function sendAddedPointToServer(obj){
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/pointAdded", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(obj);
}

/**
 * sends obj to "/pointDeleted" via POST-Request
 * @param {object} obj - geoJSON point
 */
function sendDeletedPointToServer(obj){
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/pointDeleted", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(obj);
}

/**
 * sends obj to "/pointUpdated" via POST-Request
 * @param {object} obj - object containing 2 geoJSON points
 */
function sendUpdatedPointToServer(obj){
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/pointUpdated", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(obj);
}

/**
 * takes the input from the textarea input_point and gives it on to function sendAddedPointToServer()
 */
function submitPoint(){
  var x = document.getElementById("input_point").value;
  sendAddedPointToServer(x);
}

/**
 * takes the input from the textarea delete_point and gives it on to function sendDeletedPointToServer()
 */
function deletePoint(){
  var x = document.getElementById("delete_point").value;
  sendDeletedPointToServer(x);
}

/**
 * takes the inputs from the textareas update_point and original_point and gives them on to function sendUpdatedPointToServer()
 */
function updatePoint(){
  var x = JSON.parse(document.getElementById("update_point").value);
  var y = JSON.parse(document.getElementById("original_point").value);
  var obj = {'old': y, 'new': x};
  sendUpdatedPointToServer(JSON.stringify(obj));
}
