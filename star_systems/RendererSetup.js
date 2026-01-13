import * as THREE from "three";

// Parameters
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 40;
const aspect = w / h;
const near = 0.1;
const far = 20000;

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 200, 600);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;

export const Renderer = renderer;
export const Camera = camera;