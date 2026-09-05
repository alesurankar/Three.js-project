import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class ProximaCentauri extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=1

    this.SIZE_SCALE = 2;
    this.REGION_SIZE_SCALE = 0.0004 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.near = 10;
    this.far = 10000;
    this.cameraSettings = { near: this.near,far: this.far };
  }

  GetEntityConfig() 
  {
    const requiredKeys = [
      "proxima_centauri",
      "proxima_b",
    ];

    const scaleMap = {
      proxima_centauri: this.REGION_SIZE_SCALE,
      proxima_b: this.LOCAL_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }
  
  CreateObjects()
  {
    // Create Proxima Centauri
    this.proxima_centauri = createEntity(this.entityMap.proxima_centauri, {
      lightType: "pointLight",
      detail: 4,
    });
    this.scene.add(this.proxima_centauri.orbitPivot);
    this.objects.push(this.proxima_centauri);
    this.objectMap[this.entityMap.proxima_centauri.key] = this.proxima_centauri;
    this.primaryEntity = this.proxima_centauri;

    // Create Proxima B
    this.proxima_b = createEntity(this.entityMap.proxima_b, {
      orbitRadius: this.sizeMap.proxima_b * 68,
    });
    this.objects.push(this.proxima_b);
    this.objectMap[this.entityMap.proxima_b.key] = this.proxima_b;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.proxima_b.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.proxima_centauri;    // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    
    // Debug logs
    console.log("Proxima B position:", target);
    console.log("Player set to:", playerPos);

    // Face the Sun
    this.player.FaceTarget(-10000, 0, 0);   // TO CHANGE
    
    // Log the resulting forward vector
    const forward = new THREE.Vector3();
    this.player.camera.getWorldDirection(forward);
    console.log("Player forward vector after lookAt:", forward);
  }

  SetExitCondition() 
  {
    this.exitDistance = this.sizeMap.proxima_centauri * 40;   // TO CHANGE
  }

  DefinePortals()
  {
    this.sceneTriggers = [
      { obj: this.proxima_b, threshold: this.sizeMap.proxima_b * 4, scene: "ProximaBOrbit" },
    ];
  }

  CheckSceneTransition() 
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();

    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    const distanceToParent = playerPos.distanceTo(entityPos);
    if (distanceToParent > this.exitDistance) {
      this.requestedScene = "AlphaCentauriSystem";  // TO CHANGE
      this.transitionFrom = "proxima_centauri";     // TO CHANGE
    }

    for (const trigger of this.sceneTriggers) {
      trigger.obj.objectRoot.getWorldPosition(entityPos);
      const distance = playerPos.distanceTo(entityPos);
      if (distance <= trigger.threshold) {
        this.requestedScene = trigger.scene;
        break;
      }
    } 
  }
}