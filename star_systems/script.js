import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { starGeometry, starMaterial } from "./stars.js";
import {Planet} from "./planet.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 5000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0,0,0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
camera.position.setZ(30);



// ///////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;



////////////////////////////////////////////
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(10,10,50);
scene.add(sunLight);



// Create planet
const earth = new Planet({
  name: "earth"
});
scene.add(earth.group);



// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  
//   updatePlanet();
  earth.rotate();
  earth.updateNightLight(sunLight, camera);
//   checkVisibility();

  renderer.render(scene, camera);
  controls.update();
}

animate();