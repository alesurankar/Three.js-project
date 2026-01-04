import * as THREE from "three";
import { StarField } from "./utils/starField.js";
import { Asteroids } from "./objects/asteroids.js"
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


const ambientLight = new THREE.AmbientLight(
  0x404040,
  0.3
);

scene.add(ambientLight);

const gameControls = new GameControls(camera, document.body, 0.5);

const timeScale = 100;

function rotationSpeedFromDays(days, timeScale) {
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds) * timeScale;
}

const mercurySpeed = rotationSpeedFromDays(58.6, timeScale);
const venusSpeed   = -rotationSpeedFromDays(243, timeScale);   // retrograde
const earthSpeed   = rotationSpeedFromDays(1, timeScale);
const moonSpeed    = rotationSpeedFromDays(27.3,timeScale);
const marsSpeed    = rotationSpeedFromDays(1.03, timeScale);
const jupiterSpeed = rotationSpeedFromDays(0.41, timeScale);
const saturnSpeed  = rotationSpeedFromDays(0.45, timeScale);
const uranusSpeed  = -rotationSpeedFromDays(0.72, timeScale);  // retrograde
const neptuneSpeed = rotationSpeedFromDays(0.67,timeScale);
const plutoSpeed   = rotationSpeedFromDays(6.39, timeScale);

////////////////////////////////////////////
const stars = new StarField({
  starCount: 5000,
  radius: 15000,
  minDistance: 14500,
  starSize: 60,
});
stars.addToScene(scene);


// Create pluton
const pluto = new Planet({
  name: "pluto",
  size: 1.8,
  position: new THREE.Vector3(6500, 0, 0),
  rotationSpeed: plutoSpeed,
});
scene.add(pluto.group);


// Create neptune
const neptune = new Planet({
  name: "neptune",
  size: 19,
  position: new THREE.Vector3(5600, 0, 0),
  rotationSpeed: neptuneSpeed,
});
scene.add(neptune.group);


// Create uranus
const uranus = new Planet({
  name: "uranus",
  size: 20,
  position: new THREE.Vector3(4600, 0, 0),
  rotationSpeed: uranusSpeed,
});
scene.add(uranus.group);

const uranusOrbit = new THREE.Group();
uranus.group.add(uranusOrbit);

const uranusRingOrbit = new THREE.Group();
uranus.group.add(uranusRingOrbit);

// Create uranus ring
const uranusRing = new Asteroids({
  asteroidCount: 3000,
  radius: 55,
  minDistance: 38,
  thickness: 2,
  size: 0.6
});
uranusRingOrbit.add(uranusRing.group);


// Create saturn
const saturn = new Planet({
  name: "saturn",
  size: 34,
  position: new THREE.Vector3(3600, 0, 0),
  axialTilt: 26.7,
  rotationSpeed: saturnSpeed,
});
scene.add(saturn.group);

const saturnRingOrbit = new THREE.Group();
saturn.group.add(saturnRingOrbit);

// Create saturn ring
const saturnRing = new Asteroids({
  asteroidCount: 3000,
  radius: 55,
  minDistance: 38,
  thickness: 2,
  size: 0.6
});
saturnRingOrbit.add(saturnRing.group);


// Create jupiter
const jupiter = new Planet({
  name: "jupiter",
  size: 38,
  position: new THREE.Vector3(2600, 0, 0),
  rotationSpeed: jupiterSpeed,
});
scene.add(jupiter.group);


// Create asteroid belt
const asteroids = new Asteroids({
  asteroidCount: 10000,
  radius: 1900,
  minDistance: 1700,
  thickness: 50,
  size: 0.8
});
scene.add(asteroids.group);


// Create mars
const mars = new Planet({
  name: "mars",
  size: 5.3,
  position: new THREE.Vector3(1500, 0, 0),
  rotationSpeed: marsSpeed,
});
scene.add(mars.group);


// Create earth
const earth = new Planet({
  name: "earth",
  size: 10,
  position: new THREE.Vector3(1000, 0, 0),
  rotationSpeed: earthSpeed,
  cloudRotationSpeed: earthSpeed * 1.0001,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  axialTilt: -23.4
});
scene.add(earth.group);

const moonOrbit = new THREE.Group();
earth.group.add(moonOrbit);

// Create moon
const moon = new Planet({
  name: "moon",
  size: 2.7,
  position: new THREE.Vector3(30, 0, 0),
  axialTilt: 1.5,
  rotationSpeed: 0.0015,
});
moonOrbit.add(moon.group);


// Create venus
const venus = new Planet({
  name: "venus",
  size: 9.5,
  position: new THREE.Vector3(700, 0, 0),
  rotationSpeed: venusSpeed,
});
scene.add(venus.group);


// Create mercury
const mercury = new Planet({
  name: "mercury",
  size: 4,
  position: new THREE.Vector3(400, 0, 0),
  rotationSpeed: mercurySpeed,
});
scene.add(mercury.group);


// Add Sun to scene
const sun = new Star({
  name: "sun",
  size: 100,
  position: new THREE.Vector3(0, 0, 0),
  intensity: 5000000,
  distance: 0,
  color: 0xffffee
});
scene.add(sun.group);


// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);

  gameControls.update();

  asteroids.update(1);

  saturnRing.update(1);
  pluto.rotate();
  neptune.rotate();
  uranus.rotate();
  saturn.rotate();
  jupiter.rotate();
  mars.rotate();
  earth.rotate();
  venus.rotate();
  mercury.rotate();

  // earth.updateNightLight(sun.light, camera);
  
  // moonOrbit.rotation.y += orbitSpeed;

  // moon.group.rotation.y += orbitSpeed; 

  // moon.updateNightLight(sun.light, camera);

  renderer.render(scene, camera);
}

animate();