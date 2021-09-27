# Contextual Mapping

The goal of this demo is to demonstrate the ability of maplibre to render data according to a context. In our case, we will use the time to change the colors of a map.

Import the London data:

```
baremaps import \
  --database 'jdbc:postgresql://localhost:5432/baremaps?&user=baremaps&password=baremaps' \
  --file 'https://download.geofabrik.de/europe/great-britain/england/greater-london-latest.osm.pbf' \
  --enable-http
```

Start the tile server:

```
cd contextual-mapping/baremaps
baremaps view \
  --database 'jdbc:postgresql://localhost:5432/baremaps?user=baremaps&password=baremaps' \
  --tileset 'tileset.json' \
  --style 'style.json'
```

Start the frontend application:

```
cd contextual-mapping
npm run dev
```

Open the browser (http://localhost:3000) to the see the map and look at the main.js file to observe how the colors are updated.