import './style.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl';

// initialize the map
const map = new maplibregl.Map({
  container: 'map',
  style: 'http://localhost:9000/style.json', // stylesheet location
});

map.on('load', function() {
  let layers = map.getStyle().layers;

  let init = Date.now();
  let background = color(map.getPaintProperty('background', 'background-color'));
  let highway = color(map.getPaintProperty('highway', 'line-color'));
  let building = color(map.getPaintProperty('building', 'fill-extrusion-color'));

  setInterval(() => {
    let time = Date.now();
    let interval = Math.round((time - init));
    let increment = interval / 10;
    map.setPaintProperty('background', 'background-color', rgba(incrementColor(background, increment)));
    map.setPaintProperty('highway', 'line-color', rgba(incrementColor(highway, increment)));
    map.setPaintProperty('building', 'fill-extrusion-color', rgba(incrementColor(building, increment)));
  }, 100)
});


function rgba(color) {
  return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
}

function color(rgba) {
  return rgba.match(/\d+/g).map(Number);
}

function incrementColor(color, inc) {
  console.log(color, inc)
  return [
    (color[0] + inc) % 255,
    (color[1] + inc) % 255,
    (color[2] + inc) % 255,
    color[3],
  ];
}
