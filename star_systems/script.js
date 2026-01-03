import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { starGeometry, starMaterial } from "./stars.js";


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



///////////////////////////////////////////////
const planetGroup = new THREE.Group();
scene.add(planetGroup);



///////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;



///////////////////////////////////////////////
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const dayMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earth/earth.jpg"),
  color: new THREE.Color(0.8, 1, 1),
});
const nightMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earth/earth_night.jpg"),
  transparent: true,
  opacity: 0.3,
  depthWrite: false,
  color: new THREE.Color(1.0, 1.0, 0.3)
});
const cloudTex = loader.load("./textures/earth/earth_cloud2.jpg");
const cloudMat = new THREE.MeshStandardMaterial({
  map: cloudTex,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
}) 

const planetDay = new THREE.Mesh(geometry, dayMat);
planetGroup.add(planetDay);
const planetNight = new THREE.Mesh(geometry, nightMat);
planetGroup.add(planetNight);
const planetClouds = new THREE.Mesh(geometry, cloudMat);
planetClouds.scale.setScalar(1.003);
planetGroup.add(planetClouds);



////////////////////////////////////////////
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
scene.add(sunLight);



///////////////////////////////////////////////
function updatePlanet() {
  const rot = -23.4 * Math.PI /180;
  planetGroup.rotation.z = rot
  planetGroup.rotation.y += 0.001
  planetClouds.rotation.z = rot;
  planetClouds.rotation.y += 0.0002
}



///////////////////////////////////////////////
function checkVisibility() {
  const planetWorldPos = new THREE.Vector3();
  const sunWorldPos = new THREE.Vector3();
  const cameraWorldPos = new THREE.Vector3();


    // world positions
    planetGroup.getWorldPosition(planetWorldPos);
    sunLight.getWorldPosition(sunWorldPos);
    camera.getWorldPosition(cameraWorldPos);

    // directions from planet
    const toSun = sunWorldPos.clone().sub(planetWorldPos).normalize();
    const toCamera = cameraWorldPos.clone().sub(planetWorldPos).normalize();

    // dot product
    const dot = toSun.dot(toCamera);

    // if sun and camera are opposite → night visible
    const nightStrength = THREE.MathUtils.smoothstep(0.1, -0.2, dot);

    planetNight.material.opacity = nightStrength * 0.4;
}



///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  
  updatePlanet();

  checkVisibility();

  renderer.render(scene, camera);
  controls.update();
}

animate();