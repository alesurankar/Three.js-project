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

const mercuryAxialSpeed = rotationSpeedFromDays(58.6, timeScale);
const venusAxialSpeed   = -rotationSpeedFromDays(243, timeScale);   // retrograde
const earthAxialSpeed   = rotationSpeedFromDays(1, timeScale);
const moonAxialSpeed    = rotationSpeedFromDays(27.3, timeScale);
const marsAxialSpeed    = rotationSpeedFromDays(1.03, timeScale);
const jupiterAxialSpeed = rotationSpeedFromDays(0.41, timeScale);
const saturnAxialSpeed  = rotationSpeedFromDays(0.45, timeScale);
const uranusAxialSpeed  = -rotationSpeedFromDays(0.72, timeScale);  // retrograde
const neptuneAxialSpeed = rotationSpeedFromDays(0.67, timeScale);
const plutoAxialSpeed   = rotationSpeedFromDays(6.39, timeScale);

////////////////////////////////////////////
const stars = new StarField({
  starCount: 5000,
  radius: 15000,
  minDistance: 14500,
  starSize: 60,
});
stars.addToScene(scene);




// Create Sun
const sun = new Star({
  name: "sun",
  size: 100,
  position: new THREE.Vector3(0, 0, 0),
  intensity: 5000000,
  distance: 0,
  color: 0xffffff,
});
scene.add(sun.group);


// Create Mercury
const mercury = new Planet({
  name: "mercury",
  size: 4,
  axialTilt: 0.034,
  axialRotationSpeed: mercuryAxialSpeed,
  orbitRadius: 400,
  orbitRotationSpeed: 0.01,
  parent: sun.group,
});


// Create venus
const venus = new Planet({
  name: "venus",
  size: 9.5,
  axialTilt: 177.36,
  axialRotationSpeed: venusAxialSpeed,
  orbitRadius: 700,
  orbitRotationSpeed: 0.001,
  parent: sun.group,
});


// Create earth
const earth = new Planet({
  name: "earth",
  size: 10,
  axialTilt: 23.44,
  axialRotationSpeed: earthAxialSpeed,
  cloudRotationSpeed: earthAxialSpeed * 1.0001,
  orbitRadius: 1000,
  orbitRotationSpeed: 0.001,
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
  orbitRotationSpeed: 0.001,
  parent: earth.group,
});


// Create mars
const mars = new Planet({
  name: "mars",
  size: 5.3,
  axialTilt: 25.19,
  axialRotationSpeed: marsAxialSpeed,
  orbitRadius: 1500,
  orbitRotationSpeed: 0.1,
  parent: sun.group,
});


// Create asteroid belt
const asteroids = new Asteroids({
  asteroidCount: 10000,
  radius: 1900,
  minDistance: 1700,
  thickness: 50,
  size: 0.8,
});
scene.add(asteroids.group);


// Create jupiter
const jupiter = new Planet({
  name: "jupiter",
  size: 38,
  axialTilt: 3.13,
  axialRotationSpeed: jupiterAxialSpeed,
  orbitRadius: 2600,
  orbitRotationSpeed: 0.02,
  parent: sun.group,
});


// Create saturn
const saturn = new Planet({
  name: "saturn",
  size: 34,
  axialTilt: 26.73,
  axialRotationSpeed: saturnAxialSpeed,
  orbitRadius: 3600,
  orbitRotationSpeed: 0.0001,
  parent: sun.group,
});

const saturnRingOrbit = new THREE.Group();
saturn.group.add(saturnRingOrbit);

// Create saturn ring
const saturnRing = new Asteroids({
  asteroidCount: 3000,
  radius: 55,
  minDistance: 38,
  thickness: 2,
  size: 0.6,
});
saturnRingOrbit.add(saturnRing.group);


// Create uranus
const uranus = new Planet({
  name: "uranus",
  size: 20,
  axialTilt: 97.77,
  axialRotationSpeed: uranusAxialSpeed,
  orbitRadius: 4600,
  orbitRotationSpeed: 0.001,
  parent: sun.group,
});

const uranusRingOrbit = new THREE.Group();
uranus.group.add(uranusRingOrbit);

// Create uranus ring
const uranusRing = new Asteroids({
  asteroidCount: 3000,
  radius: 55,
  minDistance: 38,
  thickness: 2,
  size: 0.6,
});
uranusRingOrbit.add(uranusRing.group);


// Create neptune
const neptune = new Planet({
  name: "neptune",
  size: 19,
  axialTilt: 28.32,
  axialRotationSpeed: neptuneAxialSpeed,
  orbitRadius: 5600,
  orbitRotationSpeed: 0.002,
  parent: sun.group,
});


// Create pluton
const pluto = new Planet({
  name: "pluto",
  size: 1.8,
  axialTilt: 119.61,
  axialRotationSpeed: plutoAxialSpeed,
  orbitRadius: 6500,
  orbitRotationSpeed: 0.03,
  parent: sun.group,
});


// ///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);

  gameControls.update();

  mercury.rotate();
  venus.rotate();

  earth.rotate();
  earth.updateNightLight(sun.light, camera);
  
  moon.rotate();

  mars.rotate();

  asteroids.update(1);

  jupiter.rotate();

  saturn.rotate();
  saturnRing.update(1);

  uranus.rotate();
  uranusRing.update(1);

  neptune.rotate();

  pluto.rotate();


  renderer.render(scene, camera);
}

animate();