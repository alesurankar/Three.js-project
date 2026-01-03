import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";



///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
camera.position.setZ(30);



///////////////////////////////////////////////
const planetGroup = new THREE.Group();
planetGroup.rotation.z = -23.4 * Math.PI /180;
scene.add(planetGroup);



///////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;



///////////////////////////////////////////////
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earth.jpg")
});

const planet = new THREE.Mesh(geometry, material);
planetGroup.add(planet);



///////////////////////////////////////////////
const hemiLight = new THREE.HemisphereLight();
scene.add(hemiLight);



///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  
  planet.rotation.y += 0.003

  renderer.render(scene, camera);
  controls.update();
}

animate();