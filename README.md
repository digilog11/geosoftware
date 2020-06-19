# geosoftware

In der Eingabeaufforderung erstelle einen Ordner, gehe in den Ordner ein, gib den Befehl "npm init" ein. 
In der Datei package.json ändere die Eingaben so, dass dort steht

{
  "name": DEIN ORDNER,
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@popperjs/core": "^2.4.2",
    "bootstrap": "^4.5.0",
    "express": "^4.17.1",
    "jquery": "^3.5.1",
    "leaflet": "^1.6.0",
    "leaflet-draw": "^1.0.4",
    "leaflet.heat": "^0.2.0",
    "mongodb": "^3.5.8"
  }
}

Dementsprechend müssen auch die packages express, leaflet, leaflet-draw, mongodb, leaflet.heat, bootstrap, jquery, @popperjs/core mit npm installiert werden.

Um den Server zu starten öffne in der Eingabeaufforderung den Ordner, dann gebe den Befehl "npm start" ein. Wenn du jetzt in einem Browser "localhost:3000" öffnest sollte die seite1.html geöffnet werden.
