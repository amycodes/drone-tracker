import "./style.css";
import images from "./images";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { Circle as CircleStyle, Fill, Stroke, Icon, Style } from "ol/style.js";
import { Point } from "ol/geom.js";
import { getVectorContext } from "ol/render.js";
import { defaults as defaultInteractions } from "ol/interaction.js";

const BACKEND_URL = "{ADD-YOUR-BACKEND-URL-HERE}";

const tileLayer = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  layers: [tileLayer],
  target: "map",
  view: new View({
    center: [-9790000, 5120000],
    zoom: 10,
  }),
  interactions: defaultInteractions({
    doubleClickZoom: false,
    dragAndDrop: false,
    dragPan: true,
    keyboardPan: false,
    keyboardZoom: false,
    mouseWheelZoom: true,
    pointer: true,
    select: true,
  }),
});

const imageStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({ color: "blue" }),
    stroke: new Stroke({ color: "white", width: 1 }),
  }),
});

const drones = [];

tileLayer.on("postrender", function (event) {
  const vectorContext = getVectorContext(event);
  drones.forEach((drone) => {
    vectorContext.setStyle(imageStyle);
    vectorContext.drawGeometry(new Point([drone.x, drone.y]));
  });
});

let addDrone = document.getElementById("drones");
let addDrones = document.getElementById("add-drones");
let dronesDisplay = document.getElementById("drone-count");

addDrone.addEventListener("click", () => {
  setDrone();
});

addDrones.addEventListener("click", () => {
  for (let i = 0; i < 100; i++) {
    setDrone();
  }
});

function setDrone() {
  const drone = generateDrone();
  drones.push(drone);
}

let droneId = 1;
function generateDrone() {
  let drone = {
    id: droneId,
    x: -9795500,
    y: 5121000,
    ts: Date.now(),
    speed: Math.random() * 1000,
  };
  droneId += 1;
  return drone;
}

function moveDrones() {
  drones.forEach((drone) => {
    if (Math.random() > 0.5) {
      drone.x += 100 + drone.speed;
    } else {
      drone.x -= 100 - drone.speed;
    }
    if (Math.random() > 0.5) {
      drone.y += 100 + drone.speed;
    } else {
      drone.y -= 100 - drone.speed;
    }
    drone.ts = Date.now();
    drone.speed = Math.random() * 100;
    drone.image = images[0];
    sendDroneDataToSpaces(drone);
  });
}

async function sendDroneDataToSpaces(drone) {
  console.log("Sending Drone Data");
  console.log(drone);
  const formData = new FormData();
  formData.append("drone-id", drone.id);
  formData.append("image", drone.image);
  formData.append("speed", drone.speed);
  formData.append("x", drone.x);
  formData.append("y", drone.y);
  formData.append("timestamp", drone.ts);

  const res = await fetch(BACKEND_URL, {
    method: "POST",

    body: formData,
  });
  const data = await res.json();
  console.log(data);
}

const interval = setInterval(() => {
  dronesDisplay.innerHTML = drones.length;
  moveDrones();
  map.render();
}, 1000);

//map.render();

map.on("click", function (evt) {
  clearInterval(interval);
});
