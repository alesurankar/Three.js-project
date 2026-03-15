import * as THREE from "three";
import { ModelStore } from "../factories/modelStore.js";
import { ArtificialObject } from "./artificialObject.js";

export class GlbModel extends ArtificialObject 
{
  constructor({
    key = "station",
    size = 1,
    posToParent = new THREE.Vector3(0, 0, 0),
    pitch = 0,  // rotation around X
    yaw = 0,    // rotation around Y
    roll = 0,   // rotation around Z
    orbitalTilt = 0,
    axialPeriod = 0,
    orbitalPeriod = 0,
    parent = null
  }= {}) 
  {
    super({
      size,
      renderMode: "model",
      posToParent,
      orbitalTilt,
      axialPeriod,
      orbitalPeriod,
      geometry: null,
      surfMat: null,
      parent
    });

    // Apply full 3D orientation
    this.body.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, roll, "YXZ"));

    this.loader = null;
    
    ModelStore.GetClone(key).then((clone) => {
      clone.scale.setScalar(size);
      this.body.add(clone);
      this.model = clone;
    });
  }

  Dispose() 
  {
    if (this.model) {
      this.body.remove(this.model);
      this.model = null;
    }
    super.Dispose();
  }
}
