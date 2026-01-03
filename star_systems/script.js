import * as THREE from "three";
import { StarField } from "./utils/starField.js";
import { AsteroidBelt } from "./utils/asteroidBelt.js"
import { Planet } from "./objects/planet.js"
import { Star } from "./objects/star.js";
import { GameControls } from "./utils/gameControls.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 20000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(100,-100,0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;


////////////////////////////////////////////
const stars = new StarField({
  starCount: 20000,
  radius: 15000,
  minDistance: 10000,
  starSize: 60,
});
stars.addToScene(scene);


const gameControls = new GameControls(camera, document.body, 0.5);


// Create pluton
const pluto = new Planet({
  scene,
  name: "pluto",
  size: 1.8,
  position: new THREE.Vector3(6500, 0, 0),
});


// Create neptune
const neptune = new Planet({
  scene,
  name: "neptune",
  size: 19,
  position: new THREE.Vector3(5600, 0, 0),
});


// Create uranus
const uranus = new Planet({
  scene,
  name: "uranus",
  size: 20,
  position: new THREE.Vector3(4600, 0, 0),
});


// Create saturn
const saturn = new Planet({
  scene,
  name: "saturn",
  size: 34,
  position: new THREE.Vector3(3600, 0, 0),
});


// Create jupiter
const jupiter = new Planet({
  scene,
  name: "jupiter",
  size: 38,
  position: new THREE.Vector3(2600, 0, 0),
});


const meteors = new AsteroidBelt({
  starCount: 10000,
  radius: 1900,
  minDistance: 1700,
  thickness: 50,
  starSize: 5,
});
meteors.addToScene(scene);


// Create mars
const mars = new Planet({
  scene,
  name: "mars",
  size: 5.3,
  position: new THREE.Vector3(1500, 0, 0),
});


// Create earth
const earth = new Planet({
  scene,
  name: "earth",
  size: 10,
  position: new THREE.Vector3(1000, 0, 0),
  rotationSpeed: 0.001,
  cloudRotationSpeed: 0.0003,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  axialTilt: -23.4
});

const moonOrbit = new THREE.Group();
earth.group.add(moonOrbit);

// Create moon
const moon = new Planet({
  scene,
  name: "moon",
  size: 2.7,
  position: new THREE.Vector3(30, 0, 0),
  axialTilt: 1.5
});

moonOrbit.add(moon.group);


// Create venus
const venus = new Planet({
  scene,
  name: "venus",
  size: 9.5,
  position: new THREE.Vector3(700, 0, 0),
});


// Create mercury
const mercury = new Planet({
  scene,
  name: "mercury",
  size: 4,
  position: new THREE.Vector3(400, 0, 0),
});


// Add Sun to scene
const sun = new Star({
  scene,
  name: "sun",
  size: 100,
  position: new THREE.Vector3(0, 0, 0),
  intensity: 4000000,
  distance: 0,
  color: 0xffffee
});


// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);

  gameControls.update();

  earth.rotate();
  earth.updateNightLight(sun.light, camera);
  
  const orbitSpeed = 0.001; 
  moonOrbit.rotation.y += orbitSpeed;

  moon.group.rotation.y += orbitSpeed; 

  moon.updateNightLight(sun.light, camera);

  renderer.render(scene, camera);
  controls.update();
}

animate();