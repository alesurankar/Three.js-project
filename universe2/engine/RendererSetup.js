import * as THREE from "three";

// Step 2
export function CreateCamera() 
{
  console.log("Step 2: RendererSetup.js: CreateCamera()");
  const w = window.innerWidth;
  const h = window.innerHeight;
  const fov = 40;
  const aspect = w / h;
  const near = 20;
  const far = 200000;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, 0);

  return camera;
}

// Step 4
export function CreateRenderer(container) 
{
  console.log("Step 4: RendererSetup.js: CreateRenderer()");
  const w = container.clientWidth;
  const h = container.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);

  return renderer;
}