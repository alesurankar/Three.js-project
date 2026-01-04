import * as THREE from "three";
import { Asteroids } from "./objects/asteroids.js"
import { Planet } from "./objects/planet.js"
import { Star } from "./objects/star.js";
import { GameControls } from "./utils/gameControls.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 40;
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


// Ambient light, for simulation purposes
const ambientLight = new THREE.AmbientLight(
  0x404040,
  1.3
);
scene.add(ambientLight);

const gameControls = new GameControls(camera, document.body, 0.5);


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
const mercuryAxialSpeed = rotationSpeedFromDays(58.6, axialTimeScale);
const venusAxialSpeed   = -rotationSpeedFromDays(243, axialTimeScale);   // retrograde
const earthAxialSpeed   = rotationSpeedFromDays(1, axialTimeScale);
const moonAxialSpeed    = rotationSpeedFromDays(27.3, axialTimeScale);
const marsAxialSpeed    = rotationSpeedFromDays(1.03, axialTimeScale);
const jupiterAxialSpeed = rotationSpeedFromDays(0.41, axialTimeScale);
const saturnAxialSpeed  = rotationSpeedFromDays(0.45, axialTimeScale);
const uranusAxialSpeed  = -rotationSpeedFromDays(0.72, axialTimeScale);  // retrograde
const neptuneAxialSpeed = rotationSpeedFromDays(0.67, axialTimeScale);
const plutoAxialSpeed   = rotationSpeedFromDays(6.39, axialTimeScale);

// Orbitral Speeds
const mercuryOrbitalSpeed = orbitalSpeedFromDays(88, orbitalTimeScale);
const venusOrbitalSpeed   = orbitalSpeedFromDays(224.7, orbitalTimeScale);
const earthOrbitalSpeed   = orbitalSpeedFromDays(365.25, orbitalTimeScale);
const moonOrbitalSpeed    = orbitalSpeedFromDays(27.3, orbitalTimeScale);
const marsOrbitalSpeed    = orbitalSpeedFromDays(687, orbitalTimeScale);
const asteroidBeltOrbitalSpeed    = orbitalSpeedFromDays(1570, orbitalTimeScale);
const jupiterOrbitalSpeed = orbitalSpeedFromDays(4333, orbitalTimeScale);
const saturnOrbitalSpeed  = orbitalSpeedFromDays(10759, orbitalTimeScale);
const saturnRingOrbitalSpeed    = orbitalSpeedFromDays(0.6, orbitalTimeScale);
const uranusOrbitalSpeed  = orbitalSpeedFromDays(30687, orbitalTimeScale);
const uranusRingOrbitalSpeed    = -orbitalSpeedFromDays(0.26, orbitalTimeScale); //retrograde
const neptuneOrbitalSpeed = orbitalSpeedFromDays(60190, orbitalTimeScale);
const plutoOrbitalSpeed   = orbitalSpeedFromDays(90560, orbitalTimeScale);


const loader = new THREE.CubeTextureLoader();

const skybox = loader.load([
  './textures/skybox/n1.png',
  './textures/skybox/n2.png',
  './textures/skybox/n3.png',
  './textures/skybox/n4.png',
  './textures/skybox/n5.png',
  './textures/skybox/n6.png',
]);

scene.background = skybox;



// Create Sun
const sun = new Star({
  name: "sun",
  size: 100,
  position: new THREE.Vector3(0, 0, 0),
  temperature: 5778
});
scene.add(sun.group);


// Create Mercury
const mercury = new Planet({
  name: "mercury",
  size: 4,
  axialTilt: 0.034,
  axialRotationSpeed: mercuryAxialSpeed,
  orbitRadius: 400,
  orbitRotationSpeed: mercuryOrbitalSpeed,
  parent: sun.group,
});


// Create venus
const venus = new Planet({
  name: "venus",
  size: 9.5,
  axialTilt: 177.36,
  axialRotationSpeed: venusAxialSpeed,
  orbitRadius: 700,
  orbitRotationSpeed: venusOrbitalSpeed,
  parent: sun.group,
});


// Create earth
const earth = new Planet({
  name: "earth",
  size: 10,
  axialTilt: 23.44,
  axialRotationSpeed: earthAxialSpeed,
  cloudRotationSpeed: earthAxialSpeed * 0.3,
  orbitRadius: 1000,
  orbitRotationSpeed: earthOrbitalSpeed,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  parent: sun.group,
});


// Create moon
const moon = new Planet({
  name: "moon",
  size: 2.7,
  axialTilt: 6.68,
  axialRotationSpeed: moonAxialSpeed,
  orbitRadius: 30,
  orbitRotationSpeed: moonOrbitalSpeed,
  parent: earth.group,
});


// Create mars
const mars = new Planet({
  name: "mars",
  size: 5.3,
  axialTilt: 25.19,
  axialRotationSpeed: marsAxialSpeed,
  orbitRadius: 1500,
  orbitRotationSpeed: marsOrbitalSpeed,
  parent: sun.group,
});


// Create asteroid belt
const asteroids = new Asteroids({
  asteroidCount: 10000,
  orbitFarRadius: 1900,
  orbitNearRadius: 1700,
  axialRotationSpeed: axialTimeScale * 0.000014,
  orbitRotationSpeed: asteroidBeltOrbitalSpeed,
  thickness: 50,
  size: 0.8,
  parent: sun.group,
});


// Create jupiter
const jupiter = new Planet({
  name: "jupiter",
  size: 38,
  axialTilt: 3.13,
  axialRotationSpeed: jupiterAxialSpeed,
  orbitRadius: 2600,
  orbitRotationSpeed: jupiterOrbitalSpeed,
  parent: sun.group,
});


// Create saturn
const saturn = new Planet({
  name: "saturn",
  size: 34,
  axialTilt: 26.73,
  axialRotationSpeed: saturnAxialSpeed,
  orbitRadius: 3600,
  orbitRotationSpeed: saturnOrbitalSpeed,
  parent: sun.group,
});


// Create saturn ring
const saturnRing = new Asteroids({
  asteroidCount: 6000,
  orbitFarRadius: 65,
  orbitNearRadius: 40,
  axialRotationSpeed: 0.005,
  orbitRotationSpeed: saturnRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
  thickness: 0.6,
  size: 0.16,
  roughness: 0.9,
  metalness: 0.0,
  color: 0xdfe6f0,
  parent: saturn.group,
});


// Create uranus
const uranus = new Planet({
  name: "uranus",
  size: 20,
  axialTilt: 97.77,
  axialRotationSpeed: uranusAxialSpeed,
  orbitRadius: 4600,
  orbitRotationSpeed: uranusOrbitalSpeed,
  parent: sun.group,
});


// Create uranus ring
const uranusRing = new Asteroids({
  asteroidCount: 1200,
  orbitFarRadius: 50,
  orbitNearRadius: 42,
  axialRotationSpeed: 0.003,
  orbitRotationSpeed: uranusRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
  thickness: 0.3,
  size: 0.14,
  //color: 0x444444, // real, to dark
  color: 0xffffff, // not real
  parent: uranus.group,
});


// Create neptune
const neptune = new Planet({
  name: "neptune",
  size: 19,
  axialTilt: 28.32,
  axialRotationSpeed: neptuneAxialSpeed,
  orbitRadius: 5600,
  orbitRotationSpeed: neptuneOrbitalSpeed,
  parent: sun.group,
});


// Create pluto
const pluto = new Planet({
  name: "pluto",
  size: 1.8,
  axialTilt: 119.61,
  axialRotationSpeed: plutoAxialSpeed,
  orbitRadius: 6500,
  orbitRotationSpeed: plutoOrbitalSpeed,
  parent: sun.group,
});


// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);

  gameControls.update();

  mercury.rotate();
  venus.rotate();

  earth.rotate();
  //earth.updateNightLight(sun.light, camera);
  
  moon.rotate();

  mars.rotate();

  asteroids.update();

  jupiter.rotate();

  saturn.rotate();
  saturnRing.update();

  uranus.rotate();
  uranusRing.update();

  neptune.rotate();

  pluto.rotate();


  renderer.render(scene, camera);
}

animate();