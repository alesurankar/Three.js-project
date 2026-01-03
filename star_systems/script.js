import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { starGeometry, starMaterial } from "./stars.js";
import { Planet } from "./planet.js"
import { Star } from "./star.js";


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 5000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0,0,30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;



// ///////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;



////////////////////////////////////////////
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);



// Create planet
const earth = new Planet({
  scene,
  name: "earth",
  position: new THREE.Vector3(300, 300, 300),
});


// Add Sun to scene
const sun = new Star({
  scene,
  name: "sun",
  size: 30,
  position: new THREE.Vector3(0, 0, 0),
  intensity: 1000000,
  distance: 0,
  color: 0xffffff
});


// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  
  earth.rotate();
  earth.updateNightLight(sun.light, camera);
  
  renderer.render(scene, camera);
  controls.update();
}

animate();