import * as THREE from "three";

export class Engine {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  cube: THREE.Mesh;
  container: HTMLDivElement;

  constructor(container: HTMLDivElement, { fps = 60 } = {}) {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.MainLoop = this.MainLoop.bind(this);
  }

  MainLoop() {
    // rotate cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.MainLoop);
  }

  Start() {
    requestAnimationFrame(this.MainLoop);
  }
}
