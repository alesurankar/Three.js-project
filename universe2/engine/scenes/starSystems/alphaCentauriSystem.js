import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class AlphaCentauriSystem extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=20000
      
    this.SIZE_SCALE = 1;
    this.REGION_SIZE_SCALE = 0.0001 * this.SIZE_SCALE;
    this.near = 20;
    this.far = 16000;
    this.cameraSettings = { near: this.near,far: this.far };
  }
  
  GetEntityConfig() 
  {
    const requiredKeys = [
      "alpha_centauri_center",
      "alpha_centauri_a",
      "alpha_centauri_b",
      "proxima_centauri",
    ];

    const scaleMap = {
      alpha_centauri_a: this.REGION_SIZE_SCALE,
      alpha_centauri_b: this.REGION_SIZE_SCALE,
      proxima_centauri: this.REGION_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Bary Center
    this.alpha_centauri_center = createEntity(this.entityMap.alpha_centauri_center, {
      orbitalPeriod: 0,
    });
    this.scene.add(this.alpha_centauri_center.orbitPivot);
    this.objects.push(this.alpha_centauri_center);
    this.objectMap[this.entityMap.alpha_centauri_center.key] = this.alpha_centauri_center;
    this.primaryEntity = this.alpha_centauri_center;

    // Create Alpha Centuri A
    this.alpha_centauri_a = createEntity(this.entityMap.alpha_centauri_a, {
      orbitRadius: this.sizeMap.alpha_centauri_a * 9,
      initialAngle: 3.14,
      detail: 3,
      parent: this.objectMap[this.entityMap.alpha_centauri_a.parentKey].objectRoot,
    });
    this.objects.push(this.alpha_centauri_a);
    this.objectMap[this.entityMap.alpha_centauri_a.key] = this.alpha_centauri_a;

    // Create Alpha Centuri B
    this.alpha_centauri_b = createEntity(this.entityMap.alpha_centauri_b, {
      orbitRadius: this.sizeMap.alpha_centauri_a * (7.2),
      initialAngle: 0,
      detail: 3,
      parent: this.objectMap[this.entityMap.alpha_centauri_b.parentKey].objectRoot,
    });
    this.objects.push(this.alpha_centauri_b);
    this.objectMap[this.entityMap.alpha_centauri_b.key] = this.alpha_centauri_b;

    // Create Proxima Centauri
    this.proxima_centauri = createEntity(this.entityMap.proxima_centauri, {
      orbitRadius: this.sizeMap.alpha_centauri_a * 70,
      detail: 3,
      parent: this.objectMap[this.entityMap.proxima_centauri.parentKey].objectRoot,
    });
    this.objects.push(this.proxima_centauri);
    this.objectMap[this.entityMap.proxima_centauri.key] = this.proxima_centauri;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.proxima_centauri.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.alpha_centauri_a;    // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    
    // Debug logs
    console.log("Proxima Centaury position:", target);
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
    this.exitDistance = this.sizeMap.alpha_centauri_a * 160;   // TO CHANGE
  }
    
  DefinePortals()
  {
    this.sceneTriggers = [
      { obj: this.proxima_centauri, threshold: this.sizeMap.proxima_centauri * 4, scene: "ProximaCentauri" },
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
      this.requestedScene = "MilkyWay";                 // TO CHANGE
      this.transitionFrom = "alpha_centauri_system";    // TO CHANGE
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