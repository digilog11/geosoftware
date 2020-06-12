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
    "express": "^4.17.1",
    "leaflet": "^1.6.0",
    "leaflet-draw": "^1.0.4",
    "mongodb": "^3.5.8"
  }
}

Dementsprechend müssen auch die packages express, leaflet, leaflet-draw und mongodb mit npm installiert werden.

Um den Server zu starten öffne in der Eingabeaufforderung den Ordner, dann gebe den Befehl "npm start" ein. Wenn du jetzt in einem Browser "localhost:3000" öffnest sollte die seite1.html geöffnet werden.
