import * as THREE from "three";
import getLayer from "./getLayer.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { EXRLoader } from "jsm/loaders/EXRLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();
const path = './textures/rock/';
const map = texLoader.load(`${path}diff.jpg`, (tex) => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 1);
});
const normalMap = exrLoader.load(`${path}nor_gl.exr`, (tex) => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 1);
});
const roughnessMap = exrLoader.load(`${path}rough.exr`, (tex) => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 1);
});

const geo = new THREE.TorusKnotGeometry(1, 0.4, 256, 32);

const mat = new THREE.MeshStandardMaterial({
  map,
  metalness: 0.4,
  roughness: (0.3),
  normalScale: new THREE.Vector2(4,4),
  normalMap,
  roughnessMap,
})
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(-2,2,7);
scene.add(keyLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

// Sprites BG
const gradientBackground = getLayer({
  hue: 0.5,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -15.5,
});
scene.add(gradientBackground);

function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.0005;
  mesh.rotation.y = t * 0.00005;
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);