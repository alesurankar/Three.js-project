import * as THREE from "three";
import { CelestialBody } from "./celestialBody";


export class TestObject extends CelestialBody 
{
  constructor(
  {
    entity = null,
    name = "unknown",
    size = 4,
    renderMode = "mesh",
    posToParent = new THREE.Vector3(700, 0, 0),
    axialTilt = 0,
    orbitalTilt = 0,
    axialRotationSpeed = 0,
    orbitalSpeed = 0,
    detail = 4,
    color = 0xffffff,
    parent = null,
  } = {}) 
  {
    const finalName = entity?.name || name;

    // Prepare texture and material
    let surfMat = null;
    let cloudMat = null;
    const loader = new THREE.TextureLoader();

    const surfTexture = `/textures/${finalName}/day.jpg`;   
    const surfTex = loader.load(surfTexture);
    surfMat = new THREE.MeshStandardMaterial({
      map: surfTex,
      roughness: 1,
      metalness: 0,
      color,  
    });

    // Create geometry
    const geometry = new THREE.IcosahedronGeometry(size, detail);

    super({
      size,
      renderMode,
      posToParent,
      axialTilt,
      orbitalTilt,
      axialRotationSpeed,
      orbitalSpeed,
      surfMat,
      cloudMat,
      geometry,
      parent,
    });
  }

  Dispose()
  {
    super.Dispose();
  }
}
