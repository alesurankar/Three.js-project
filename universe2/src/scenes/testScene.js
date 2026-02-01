import * as THREE from "three";

export class TestScene
{
    constructor(scene, camera) 
    {
        this.cameraSettings = {
            pos: { x: 5, y: 5, z: 5 },
            lookAt: { x: 0, y: 0, z: 0 },
            fov: 75,
            near: 0.1,
            far: 1000
        };
        // Cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        scene.add(this.cube);
    }

    Update(dt) 
    {
        // rotate cube
        this.cube.rotation.x += 0.01 * dt;
        this.cube.rotation.y += 0.01 * dt;
    }

    Dispose() 
    {
        this.cube.geometry.dispose();
        this.cube.material.dispose();
        this.cube.parent.remove(this.cube);
        this.cube = null;
    }
}