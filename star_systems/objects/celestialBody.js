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
        // Create geometry
        this.geometry = new THREE.IcosahedronGeometry(size, detail);

        if (!material) {
            throw new Error("CelestialBody requires a material");
        }
        // Create the body mesh
        this.body = new THREE.Mesh(this.geometry, material);

        // Create the groups
        this.objectRoot = new THREE.Group();   // orbit
        this.axialFrame = new THREE.Group();   // tilt + spin
        
        // Assemble hierarchy
        this.axialFrame.add(this.body);
        this.objectRoot.add(this.axialFrame);

        // Set rotation and position
        this.axialTilt = axialTilt * Math.PI / 180;
        this.axialRotationSpeed = axialRotationSpeed;
        this.body.rotation.z = this.axialTilt;
        this.body.position.copy(posToParent)

        // Add to parent if any
        if (parent) parent.add(this.objectRoot);
    }

    update() {
        // Spin around own axis
        this.body.rotation.y += this.axialRotationSpeed;
    }
}