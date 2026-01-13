import * as THREE from "three";
import { SkyBox } from "./objects/SkyBox.js";
import { StarSystem } from "./objects/StarSystem.js";
import { GameControls } from "./utils/GameControls.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 40;
const aspect = w / h;
const near = 0.1;
const far = 20000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 200, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;


// Ambient light, for simulation purposes
const ambientLight = new THREE.AmbientLight(
  0x404040,
  10.3
);
scene.add(ambientLight);

const gameControls = new GameControls(camera, document.body);

const FIXED_FPS = 40;
const FIXED_DT = 1 / FIXED_FPS;
let lastTime = performance.now() / 1000;
let accumulator = 0;


const axialTimeScale = 1000;
function rotationSpeedFromDays(days, axialTimeScale) {
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds) * axialTimeScale;
}

const orbitalTimeScale = 1000;
function orbitalSpeedFromDays(days, orbitalTimeScale) {
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds) * orbitalTimeScale;
}

// Axial Speeds
const sunAxialSpeed   = rotationSpeedFromDays(25, axialTimeScale);
const earthAxialSpeed   = rotationSpeedFromDays(1, axialTimeScale);
const moonAxialSpeed    = rotationSpeedFromDays(27.3, axialTimeScale);

// Orbitral Speeds
const earthOrbitalSpeed   = orbitalSpeedFromDays(365.25, orbitalTimeScale);
const moonOrbitalSpeed    = orbitalSpeedFromDays(27.3, orbitalTimeScale);


scene.background = SkyBox.Load();


const sunSystem = new StarSystem(
  scene,
  sunAxialSpeed,
  earthAxialSpeed,
  moonAxialSpeed
);


function Update() {
  gameControls.Update();

  sunSystem.Update();
}


// ///////////////////////////////////////////////
function animate(now) {
  requestAnimationFrame(animate);

  const currentTime = now / 1000;
  let frameTime = currentTime - lastTime;
  lastTime = currentTime;

  frameTime = Math.min(frameTime, 0.25);
  accumulator += frameTime;

  while (accumulator >= FIXED_DT) {
    Update();
    accumulator -= FIXED_DT;
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);