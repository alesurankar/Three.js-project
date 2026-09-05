import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";

export class BarnardsSystem extends BaseScene
{
  constructor(scene, camera, player, focus = {})
  {
    super(scene, camera, player, focus);
    this.timeFactor = 1;

    this.SIZE_SCALE = 2;
    this.REGION_SIZE_SCALE = 0.0004 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.near = 10;
    this.far = 10000;
    this.cameraSettings = { near: this.near, far: this.far };
  }

  GetEntityConfig()
  {
    return {
      requiredKeys: ["barnards_star", "barnard_b"],
      scaleMap: {
        barnards_star: this.REGION_SIZE_SCALE,
        barnard_b: this.LOCAL_SIZE_SCALE,
      },
    };
  }

  CreateObjects()
  {
    // Create Bernard's Star
    this.barnards_star = createEntity(this.entityMap.barnards_star, {
      lightType: "pointLight",
      detail: 4,
    });
    this.scene.add(this.barnards_star.orbitPivot);
    this.objects.push(this.barnards_star);
    this.objectMap.barnards_star = this.barnards_star;
    this.primaryEntity = this.barnards_star;

    // Create Bernard B
    this.barnard_b = createEntity(this.entityMap.barnard_b, {
      orbitRadius: this.sizeMap.barnard_b * 68,
    });
    this.objects.push(this.barnard_b);
    this.objectMap.barnard_b = this.barnard_b;
  }

  PlayerEntryPosition()
  {
    const scale = this.sizeMap.barnards_star;
    const playerPos = new THREE.Vector3(2 * scale, 2 * scale, 2 * scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    this.player.FaceTarget(-10000, 0, 0);   // TO CHANGE
  }

  SetExitCondition()
  {
    this.exitDistance = this.sizeMap.barnards_star * 40;   // TO CHANGE
  }

  DefinePortals()
  {
    this.sceneTriggers = [
      { obj: this.barnard_b, threshold: this.sizeMap.barnard_b * 4, scene: "BarnardBOrbit" },
    ];
  }

  CheckSceneTransition()
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();
    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    if (playerPos.distanceTo(entityPos) > this.exitDistance) {
      this.requestedScene = "MilkyWay";      // TO CHANGE
      this.transitionFrom = "barnards_star"; // TO CHANGE
    }

    for (const trigger of this.sceneTriggers) {
      trigger.obj.objectRoot.getWorldPosition(entityPos);
      if (playerPos.distanceTo(entityPos) <= trigger.threshold) {
        this.requestedScene = trigger.scene;
        break;
      }
    }
  }
}
