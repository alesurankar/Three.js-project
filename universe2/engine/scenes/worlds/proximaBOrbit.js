import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";


export class ProximaBOrbit extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=1
      
    this.SIZE_SCALE = 14;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.near = 20;
    this.far = 30000;
    this.cameraSettings = { near: this.near, far: this.far };
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
      size: this.sizeMap.proxima_centauri,
      maxSizeOnScreen: 1.58,
      renderMode: "points",
      lightType: "directionalLight",
      sizeAtenuation: false,
    });
    this.scene.add(this.proxima_centauri.orbitPivot);
    this.objects.push(this.proxima_centauri);
    this.objectMap[this.entityMap.proxima_centauri.key] = this.proxima_centauri;

    // Create Proxima B
    this.proxima_b = createEntity(this.entityMap.proxima_b, {
      size: this.sizeMap.proxima_b, 
      detail: 6,
      orbitRadius: this.far - this.sizeMap.proxima_b * 20,  // TO CHANGE
      parent: this.objectMap[this.entityMap.proxima_b.parentKey].objectRoot,
    });
    this.objects.push(this.proxima_b);
    this.objectMap[this.entityMap.proxima_b.key] = this.proxima_b;
    this.primaryEntity = this.proxima_b;

    // Assign light target
    this.proxima_centauri.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.proxima_centauri.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.proxima_b;     // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);

    // Debug logs
    console.log("Proxima Centauri position:", target);
    console.log("Player set to:", playerPos);

    // Face the Sun
    this.player.FaceTarget(1000000, 0, 0);   // TO CHANGE

    // Log the resulting forward vector
    const forward = new THREE.Vector3();
    this.player.camera.getWorldDirection(forward);
    console.log("Player forward vector after lookAt:", forward);
  }

  SetExitCondition() 
  {
    this.exitDistance = this.sizeMap.proxima_b * 20;  // TO CHANGE
  }
  
  CheckSceneTransition() 
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();

    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    const distanceToParent = playerPos.distanceTo(entityPos);
    if (distanceToParent > this.exitDistance) {
      this.requestedScene = "ProximaCentauri";  // TO CHANGE
      this.transitionFrom = "proxima_b";        // TO CHANGE
    }
  }
}