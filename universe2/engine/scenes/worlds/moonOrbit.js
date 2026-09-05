import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";


export class MoonOrbit extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=1
    
    this.SIZE_SCALE = 10;
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
      "earth",
      "moon",
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      earth: this.LOCAL_SIZE_SCALE,
      moon: this.LOCAL_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }
    
  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      size: this.sizeMap.sun,
      maxSizeOnScreen: 0.52,
      renderMode: "points",
      lightType: "directionalLight",
      orbitalTilt: 0,
      orbitalPeriod: 0,
      sizeAtenuation: false,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;
    
    // Create Earth
    this.earth = createEntity(this.entityMap.earth, {
      size: this.sizeMap.earth,
      orbitRadius: this.far - this.sizeMap.earth * 22,  // TO CHANGE
      detail: 3,
      hasClouds: true,
      parent: this.objectMap[this.entityMap.earth.parentKey].objectRoot,
    });
    this.objects.push(this.earth);
    this.objectMap[this.entityMap.earth.key] = this.earth;

    // Create Moon
    this.moon = createEntity(this.entityMap.moon, {
      size: this.sizeMap.moon,
      orbitRadius: this.sizeMap.earth * 18,  // TO CHANGE
      detail: 6,
      parent: this.objectMap[this.entityMap.moon.parentKey].objectRoot,
    });
    this.objects.push(this.moon);
    this.objectMap[this.entityMap.moon.key] = this.moon;
    this.primaryEntity = this.moon;

    // Assign light target
    this.sun.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sun.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.moon;     // TO CHANGE
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
    this.exitDistance = this.sizeMap.moon * 60;  // TO CHANGE
  }

  DefinePortals()
  {
    this.sceneTriggers = [
      { obj: this.earth, threshold: this.sizeMap.earth * 10, scene: "EarthOrbit" },
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
      this.requestedScene = "SolarSystem";  // TO CHANGE
      this.transitionFrom = "moon";         // TO CHANGE
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
