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

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);


/////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  // normalize mouse coords (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const selected = intersects[0].object;
    console.log('Selected:', selected);

    selected.material.color.set(0xff0000); // highlight
  }
});

////////////////////////////////////////
function assStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(assStar);



const spaceTexture = new THREE.TextureLoader().load('/textures/space.jpg')
scene.background = spaceTexture;


let scrollY = 0;
let scrollZ = 0;

window.addEventListener('wheel', (event) => {
  scrollY += event.deltaY * 0.001;
  scrollZ += event.deltaY * 0.0001;
});

///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  // yaw
  scene.rotation.y = scrollY;
  scene.rotation.z = scrollZ;

  // optional roll
  //torus.rotation.x = scrollY * 0.3
  renderer.render(scene, camera);
  controls.update();
}

animate();