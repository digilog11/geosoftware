"use_strict";

const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * function which creates a Connection to MongoDB and the collection points.
 * Retries every 3 seconds if no connection could be established.
 */
async function connectMongoDB() {
  try{
    // connect to database server
    app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});
    // connect do database "geosoft"
    app.locals.db = await app.locals.dbConnection.db("geosoft");
    console.log("Using db: " + app.locals.db.databaseName);
    // create collection
    try{
      app.locals.db.createCollection("points");
      console.log("Collection points created");
    }
    catch (error){
      console.dir(error);
      setTimeout(connectMongoDB, 3000);
    }
  }
  catch (error){
    console.dir(error);
    setTimeout(connectMongoDB, 3000);
  }
}

//Start connecting
connectMongoDB();

/**
 * inserts a document into the MongoDB collection points
 * @param {object} obj - point {lon, lat}
 */
function insertPointMongo (obj) {
   app.locals.db.collection("points").insertOne(obj, (error, result) => {
     if (error){
       console.dir(error);
     }
     console.log("1 Document inserted");
   });
}

/**
 * deletes a document from the MongoDB collection points
 * @param {object} obj - point {lon, lat}
 */
function deletePointMongo (obj) {
  app.locals.db.collection("points").deleteOne(obj, (error, result) => {
    if (error){
      console.dir(error);
    }
    console.log("1 Document deleted");
  });
}

/**
 * updates a document in the MongoDB collection points, replaces oldP with newP
 * @param {object} oldP - point {lon, lat}
 * @param {object} newP - point {lon, lat}
 */
function updatePointMongo (oldP, newP){
  var newvalues = {$set: newP};
  app.locals.db.collection("points").updateOne(oldP, newvalues, (error, result) => {
    if (error){
      console.dir(error);
    }
    console.log("1 Document updated");
  });
}

// Make all Files stored in Folder "public" accessible over localhost:3000/public
app.use("/public", express.static(__dirname + "/public"));

// Make leaflet library available over localhost:3000/leaflet
app.use("/leaflet", express.static(__dirname + "/node_modules/leaflet/dist"));

// Make leaflet-Draw library available over localhost:3000/leaflet-draw
app.use("/leaflet-draw", express.static(__dirname + "/node_modules/leaflet-draw/dist"));

// Send seite1.html on request to "/"
app.get("/", (req,res) => {
  res.sendFile(__dirname + "/seite1.html")
});

// Send seite2.html on request to "/seite2"
app.get("/seite2", (req,res) => {
  res.sendFile(__dirname + "/seite2.html")
});

// takes request body from pointAdded-Post-Request and gives it on to function
// insertPointMongo()
app.post("/pointAdded", (req,res) => {
  var x = req.body;
  var lon = x.coordinates[0];
  var lat = x.coordinates[1];
  var obj = {lon, lat};
  insertPointMongo(obj);
})

// takes request body from pointDeleted-Post-Request and gives it on to function
// deletePointMongo()
app.post("/pointDeleted", (req,res) => {
  var x = req.body;
  var lon = x.coordinates[0];
  var lat = x.coordinates[1];
  var obj = {lon, lat};
  deletePointMongo(obj);
})

// takes request body from pointUpdated-Post-Request and gives it on to function
// updatePointMongo()
app.post("/pointUpdated", (req,res) => {
  var x = req.body;
  var lonOld = x.old.coordinates[0];
  var latOld = x.old.coordinates[1];
  var lonNew = x.new.coordinates[0];
  var latNew = x.new.coordinates[1];
  var oldP = {"lon": lonOld, "lat": latOld};
  var newP = {"lon": lonNew, "lat": latNew};
  updatePointMongo(oldP, newP);
})

// Returns all items stored in collection points
app.get("/points", (req,res) => {
  app.locals.db.collection("points").find({}).toArray((error, result) => {
    if (error){
      console.dir(error);
    }
    res.json(result);
  });
});

// listen on port 3000
app.listen(port,
  () => console.log("app listening at http://localhost:3000")
);
