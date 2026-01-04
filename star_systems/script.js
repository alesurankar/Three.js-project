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
const moonSpeed    = rotationSpeedFromDays(27.3, timeScale);
const marsSpeed    = rotationSpeedFromDays(1.03, timeScale);
const jupiterSpeed = rotationSpeedFromDays(0.41, timeScale);
const saturnSpeed  = rotationSpeedFromDays(0.45, timeScale);
const uranusSpeed  = -rotationSpeedFromDays(0.72, timeScale);  // retrograde
const neptuneSpeed = rotationSpeedFromDays(0.67, timeScale);
const plutoSpeed   = rotationSpeedFromDays(6.39, timeScale);

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
  color: 0xffffff
});
scene.add(sun.group);


// Create Mercury
const mercury = new Planet({
  name: "mercury",
  size: 4,
  orbitRadius: 400,
  orbitSpeed: 0.01,
  rotationSpeed: mercurySpeed,
  axialTilt: 0.034,
  parent: sun.group
});


// Create venus
const venus = new Planet({
  name: "venus",
  size: 9.5,
  orbitRadius: 700,
  orbitSpeed: 0.001,
  position: new THREE.Vector3(700, 0, 0),
  rotationSpeed: venusSpeed,
  axialTilt: 177.36,
  parent: sun.group
});


// Create earth
const earth = new Planet({
  name: "earth",
  size: 10,
  orbitRadius: 1000,
  orbitSpeed: 0.001,
  rotationSpeed: earthSpeed,
  cloudRotationSpeed: earthSpeed * 1.0001,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  axialTilt: 23.44,
  parent: sun.group
});


// Create moon
const moon = new Planet({
  name: "moon",
  size: 2.7,
  orbitRadius: 30,
  orbitSpeed: 0.001,
  rotationSpeed: moonSpeed,
  axialTilt: 6.68,
  parent: earth.group
});


// Create mars
const mars = new Planet({
  name: "mars",
  size: 5.3,
  orbitRadius: 1500,
  orbitSpeed: 0.1,
  rotationSpeed: marsSpeed,
  axialTilt: 25.19,
  parent: sun.group
});


// Create asteroid belt
const asteroids = new Asteroids({
  asteroidCount: 10000,
  radius: 1900,
  minDistance: 1700,
  thickness: 50,
  size: 0.8
});
scene.add(asteroids.group);


// Create jupiter
const jupiter = new Planet({
  name: "jupiter",
  size: 38,
  orbitRadius: 2600,
  orbitSpeed: 0.02,
  rotationSpeed: jupiterSpeed,
  axialTilt: 3.13,
  parent: sun.group
});


// Create saturn
const saturn = new Planet({
  name: "saturn",
  size: 34,
  orbitRadius: 3600,
  orbitSpeed: 0.0001,
  rotationSpeed: saturnSpeed,
  axialTilt: 26.73,
  parent: sun.group
});

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


// Create uranus
const uranus = new Planet({
  name: "uranus",
  size: 20,
  orbitRadius: 4600,
  orbitSpeed: 0.001,
  rotationSpeed: uranusSpeed,
  axialTilt: 97.77,
  parent: sun.group
});

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


// Create neptune
const neptune = new Planet({
  name: "neptune",
  size: 19,
  orbitRadius: 5600,
  orbitSpeed: 0.002,
  rotationSpeed: neptuneSpeed,
  axialTilt: 28.32,
  parent: sun.group
});


// Create pluton
const pluto = new Planet({
  name: "pluto",
  size: 1.8,
  orbitRadius: 6500,
  orbitSpeed: 0.03,
  rotationSpeed: plutoSpeed,
  axialTilt: 119.61,
  parent: sun.group
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