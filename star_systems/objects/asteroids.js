import * as THREE from "three";

export class Asteroids {
  constructor({
    scene,
    asteroidCount = 2000,
    radius = 140,
    minDistance = 70,
    thickness = 20,
    size = 1
  } = {}) {
    if (!scene) throw new Error("Asteroids require a scene.");

    const geometry = new THREE.IcosahedronGeometry(size, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.9,
        metalness: 0.1
    });
    this.mesh = new THREE.InstancedMesh(
        geometry, 
        material,
        asteroidCount
    );
    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {
        // Flat disk distribution
        const angle = Math.random() * Math.PI * 2;
        const r = minDistance + (radius - minDistance) * Math.cbrt(Math.random());

        dummy.position.set(
            Math.cos(angle) * r,
            (Math.random() - 0.5) * thickness,
            Math.sin(angle) * r
        );

        // Random rotation
        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // Slight size variation
        const scale = 0.5 + Math.random() * 1.5;
        dummy.scale.setScalar(scale);

        dummy.updateMatrix();
        this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;

    scene.add(this.mesh);
  }

  rotate(delta) {
        this.mesh.rotation.y += delta * 0.0001;
    }
}