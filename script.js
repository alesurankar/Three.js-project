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
const geometry = new THREE.TorusGeometry(10, 3, 16, 1000)
const material = new THREE.MeshStandardMaterial({
  color: 0xFF6347
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;



///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();