import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";

export class NeptuneOrbit extends BaseScene
{
  constructor(scene, camera, player, focus = {})
  {
    super(scene, camera, player, focus);
    this.timeFactor = 1;

    this.SIZE_SCALE = 2;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.near = 16;
    this.far = 30000;
    this.cameraSettings = { near: this.near, far: this.far };
  }

  GetEntityConfig()
  {
    return {
      requiredKeys: ["sun", "neptune"],
      scaleMap: {
        sun: this.REGION_SIZE_SCALE,
        neptune: this.LOCAL_SIZE_SCALE,
      },
    };
  }

  CreateObjects()
  {
    this.sun = createEntity(this.entityMap.sun, {
      maxSizeOnScreen: 0.04,
      renderMode: "points",
      lightType: "directionalLight",
      orbitalTilt: 0,
      orbitalPeriod: 0,
      sizeAtenuation: false,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap.sun = this.sun;

    this.neptune = createEntity(this.entityMap.neptune, {
      detail: 6,
      orbitRadius: this.far - this.sizeMap.neptune * 20,
      parent: this.objectMap[this.entityMap.neptune.parentKey].objectRoot,
    });
    this.objects.push(this.neptune);
    this.objectMap.neptune = this.neptune;
    this.primaryEntity = this.neptune;
    this.sun.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition()
  {
    const scale = this.sizeMap.neptune;
    const playerPos = new THREE.Vector3(2 * scale, 2 * scale, 2 * scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    this.player.FaceTarget(1000000, 0, 0);
  }

  SetExitCondition()
  {
    this.exitDistance = this.sizeMap.neptune * 18;
  }

  CheckSceneTransition()
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();
    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    if (playerPos.distanceTo(entityPos) > this.exitDistance) {
      this.requestedScene = "SolarSystem";
      this.transitionFrom = "neptune";
    }
  }
}
