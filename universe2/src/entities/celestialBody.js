import * as THREE from "three";


export class CelestialBody 
{
  constructor({
    renderMode = "mesh",
    posToParent = new THREE.Vector3(0, 0, 0),
    axialTilt = 0,
    orbitalTilt = 0,
    axialPeriod = 0,
    orbitalPeriod = 0,
    surfMat = null,
    cloudMat = null,
    geometry = null,
    parent = null, 
  } = {}) 
  {
    if (renderMode === "points") {
      this.body = new THREE.Points(geometry, surfMat);
    }
    else if (renderMode === "mesh") {
      this.body = new THREE.Mesh(geometry, surfMat);
      if (cloudMat) {
        this.clouds = new THREE.Mesh(geometry, cloudMat);
        this.clouds.scale.set(1.03, 1.03, 1.03);
      }
    }
    else if (renderMode === "model") {
      this.body = new THREE.Group();
    }
    else if (renderMode === "none") {
      this.body = new THREE.Object3D();
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
    this.orbitalSpeed = CelestialBody.OrbitalRotationInDays(orbitalPeriod);
    const axialRotationSpeed = CelestialBody.AxialRotationInDays(axialPeriod);
    this.axialTilt = axialTilt * Math.PI / 180;
    this.orbitalTilt = orbitalTilt * Math.PI / 180;
    this.axialRotationSpeed = axialRotationSpeed - this.orbitalSpeed;
    this.axialFrame.rotation.z = this.axialTilt;
    this.orbitPivot.rotation.x = this.orbitalTilt;
    this.objectRoot.position.copy(posToParent)

    // Add to parent if any
    if (parent) parent.add(this.orbitPivot);
  }

  static OrbitalRotationInDays(days) 
  {
    if (!days) return 0;
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds);
  }

  static AxialRotationInDays(days) 
  {
    if (!days) return 0;
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds);
  }

  GetPosition() 
  {
    if (!this.objectRoot) return new THREE.Vector3();
    const pos = new THREE.Vector3();
    this.objectRoot.getWorldPosition(pos);
    return pos;
  }

  Update(dt) 
  {
    // Orbit parent 
    if (this.orbitalSpeed !== 0) {
      this.orbitPivot.rotation.y += this.orbitalSpeed * dt;
    }
    // Spin around own axis
    if (this.axialRotationSpeed !== 0) {
      this.body.rotation.y += this.axialRotationSpeed * dt;
    }
    if (this.clouds && this.axialRotationSpeed !== 0) {
      this.clouds.rotation.y += this.axialRotationSpeed * 1.1 * dt;
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