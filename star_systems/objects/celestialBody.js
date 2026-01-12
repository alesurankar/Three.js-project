import * as THREE from "three";

export class CelestialBody {
    constructor(
    {
        size = 1,
        posToParent = new THREE.Vector3(100, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        detail = 0,
        material = null,
        parent = null, 
    } = {}) 
    {
        this.axialTilt = axialTilt * Math.PI / 180;
        this.axialRotationSpeed = axialRotationSpeed;

        // geometry
        this.geometry = new THREE.IcosahedronGeometry(size, detail);

        if (!material) {
            throw new Error("CelestialBody requires a material");
        }

        this.body = new THREE.Mesh(this.geometry, material);
        this.body.rotation.z = this.axialTilt;
        this.body.position.copy(posToParent)

        // Add to parent if passed
        if (parent) parent.add(this.body);
    }

    update() {
        // spin around own axis
        this.body.rotation.y += this.axialRotationSpeed;
    }
}