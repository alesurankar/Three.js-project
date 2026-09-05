import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";


export class JupiterOrbit extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=1
  
    this.SIZE_SCALE = 2;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
    this.near = 30;
    this.far = 30000;
    this.cameraSettings = { near: this.near, far: this.far };
  }

  GetEntityConfig() 
  {
    const requiredKeys = [
      "sun",
      "jupiter",
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      jupiter: this.LOCAL_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      maxSizeOnScreen: 0.1018,
      renderMode: "points",
      lightType: "directionalLight",
      orbitalTilt: 0,
      orbitalPeriod: 0,
      sizeAtenuation: false,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;
    
    // Create Jupiter
    this.jupiter = createEntity(this.entityMap.jupiter, {
      orbitRadius: this.far - this.sizeMap.jupiter * 20,  // TO CHANGE
      detail: 6,
      parent: this.objectMap[this.entityMap.jupiter.parentKey].objectRoot,
    });
    this.objects.push(this.jupiter);
    this.objectMap[this.entityMap.jupiter.key] = this.jupiter;
    this.primaryEntity = this.jupiter;

    // Assign light target
    this.sun.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sun.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.jupiter;     // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);

    // Debug logs
    console.log("Sun position:", target);
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
    this.exitDistance = this.sizeMap.jupiter * 15;  // TO CHANGE
  }
}