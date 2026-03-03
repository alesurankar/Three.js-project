import * as THREE from "three";

export function CreateCamera() 
{
    const w = window.innerWidth;
    const h = window.innerHeight;
    const fov = 40;
    const aspect = w / h;
    const near = 20;
    const far = 200000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-1000, 1000, 1000);
    camera.lookAt(0, 0, 0);

    return camera;
}

export function CreateRenderer(container) 
{
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