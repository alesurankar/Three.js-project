import * as THREE from "three";


export class CelestialBody 
{
    constructor(
    {
        size = 1,
        renderMode = "mesh",
        posToParent = new THREE.Vector3(100, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        surfMat = null,
        cloudMat = null,
        geometry = null,
        parent = null, 
    } = {}) 
    {
        if (renderMode === "points") {
           this.body = new THREE.Points(geometry, surfMat);
        }
        else {
            // Create the body mesh
            this.body = new THREE.Mesh(geometry, surfMat);
            if (cloudMat) {
                this.clouds = new THREE.Mesh(geometry, cloudMat);
                this.clouds.scale.set(1.03, 1.03, 1.03);
            }
        }
        
        

        // Create the groups
        this.orbitPivot = new THREE.Group();   // orbit
        this.objectRoot = new THREE.Group();   // position
        this.axialFrame = new THREE.Group();   // tilt
        
        // Assemble hierarchy
        this.axialFrame.add(this.body);
        if (this.clouds) {
            this.axialFrame.add(this.clouds);
        }
        this.objectRoot.add(this.axialFrame);
        this.orbitPivot.add(this.objectRoot);

        // Set rotation and position
        this.orbitalSpeed = orbitalSpeed;
        this.axialTilt = axialTilt * Math.PI / 180;
        this.axialRotationSpeed = axialRotationSpeed - orbitalSpeed;
        this.axialFrame.rotation.z = this.axialTilt;
        this.objectRoot.position.copy(posToParent)

        // Add to parent if any
        if (parent) parent.add(this.orbitPivot);
    }

    Update() 
    {
        // Orbit parent
        this.orbitPivot.rotation.y += this.orbitalSpeed;

        // Spin around own axis
        this.body.rotation.y += this.axialRotationSpeed;
        if (this.clouds) {
            this.clouds.rotation.y += this.axialRotationSpeed * 1.1;
        }
    }

    Dispose() 
    {
        if (this.body) {
            if (this.body.geometry) this.body.geometry.dispose();
            if (this.body.material) {
                if (Array.isArray(this.body.material)) {
                    this.body.material.forEach(m => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                } else {
                    if (this.body.material.map) this.body.material.map.dispose();
                    this.body.material.dispose();
                }
            }
        }

        if (this.clouds) {
            if (this.clouds.geometry) this.clouds.geometry.dispose();
            if (this.clouds.material) {
                if (Array.isArray(this.clouds.material)) {
                    this.clouds.material.forEach(m => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                } else {
                    if (this.clouds.material.map) this.clouds.material.map.dispose();
                    this.clouds.material.dispose();
                }
            }
        }

        // Remove from parent
        this.orbitPivot.clear();
        this.orbitPivot.parent?.remove(this.orbitPivot);

        // Null references
        this.body = null;
        this.clouds = null;
        this.geometry = null;
        this.orbitPivot = null;
        this.objectRoot = null;
        this.axialFrame = null;
    }
}