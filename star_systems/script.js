import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { starGeometry, starMaterial } from "./stars.js";
import { Planet } from "./planet.js"
import { Star } from "./star.js";
import { GameControls } from "./gameControls.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 5000;
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



// ///////////////////////////////////////////////
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;



////////////////////////////////////////////
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


const gameControls = new GameControls(camera, document.body, 0.5);


// Create earth
const earth = new Planet({
  scene,
  name: "earth",
  size: 10,
  position: new THREE.Vector3(300, 300, 300),
  rotationSpeed: 0.001,
  cloudRotationSpeed: 0.0003,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  axialTilt: -23.4
});

// Create moon
const moon = new Planet({
  scene,
  name: "moon",
  size: 4,
  position: new THREE.Vector3(320, 300, 290),
  axialTilt: 1.5
});


// Add Sun to scene
const sun = new Star({
  scene,
  name: "sun",
  size: 30,
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
  
  moon.rotate();
  moon.updateNightLight(sun.light, camera);

  renderer.render(scene, camera);
  controls.update();
}

animate();