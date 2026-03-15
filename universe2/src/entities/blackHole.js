import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class BlackHole extends CelestialBody 
{
  constructor({
    size = 10,
    posToParent = new THREE.Vector3(0, 0, 0),
    facingTo = new THREE.Vector3(0, -1, 0),
    axialPeriod = 0.01,
    orbitalPeriod = 0,
    parent = null,
  } = {}) 
  {
    // Prepare texture and material
    const texture = new THREE.TextureLoader().load("/textures/blackHole.png");

    // Use a plane as the geometry
    const geometry = new THREE.PlaneGeometry(size, size);

    const surfMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Call base constructor
    super({
      renderMode: "mesh",
      posToParent,
      axialPeriod,
      orbitalPeriod,
      surfMat,
      geometry,
      parent,
    });
    this.body.lookAt(facingTo);
  }

  Update(dt) 
  {
    this.body.rotation.z -= this.axialRotationSpeed * dt;
  }
    
  Dispose()
  {
    super.Dispose();
  }
}