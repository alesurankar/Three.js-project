import * as THREE from "three";
import { starGeometry, starMaterial } from "./utils/starField.js";
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
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


const gameControls = new GameControls(camera, document.body, 0.5);


// Create mars
const mars = new Planet({
  scene,
  name: "mars",
  size: 4,
  position: new THREE.Vector3(600, 0, 100),
});


// Create earth
const earth = new Planet({
  scene,
  name: "earth",
  size: 10,
  position: new THREE.Vector3(500, 0, 60),
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
  size: 2,
  position: new THREE.Vector3(50, 0, 0),
  axialTilt: 1.5
});

moonOrbit.add(moon.group);


// Create venus
const venus = new Planet({
  scene,
  name: "venus",
  size: 10,
  position: new THREE.Vector3(400, 0, 20),
});


// Create mercury
const mercury = new Planet({
  scene,
  name: "mercury",
  size: 4,
  position: new THREE.Vector3(350, 0, 0),
});


// Add Sun to scene
const sun = new Star({
  scene,
  name: "sun",
  size: 40,
  position: new THREE.Vector3(0, 0, 0),
  intensity: 1000000,
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