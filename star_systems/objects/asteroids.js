import * as THREE from "three";

export class Asteroids {
    constructor({
        asteroidCount = 2000,
        radius = 140,
        minDistance = 70,
        thickness = 20,
        size = 1,
        rotationSpeed = 0.0001,
        color = 0x888888,
        roughness = 0.9,
        metalness = 0.1,
    } = {}) {
        this.group = new THREE.Group();
        this.rotationSpeed = rotationSpeed;

        const geometry = new THREE.IcosahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color,
            roughness,
            metalness,
        });
        this.mesh = new THREE.InstancedMesh(
            geometry, 
            material,
            asteroidCount,
        );
        this.mesh.count = asteroidCount;
        this.mesh.frustumCulled = false;
        // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;

        const dummy = new THREE.Object3D();

        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = minDistance + (radius - minDistance) * Math.cbrt(Math.random());

            dummy.position.set(
                Math.cos(angle) * r,
                (Math.random() - 0.5) * thickness,
                Math.sin(angle) * r
            );

            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            dummy.scale.setScalar(0.5 + Math.random());
            dummy.updateMatrix();

            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.group.add(this.mesh);
    }

    update(delta) {
        this.group.rotation.y += this.rotationSpeed * delta;
    }

    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        } else {
            this.group.position.set(x, y, z);
        }
    }
}