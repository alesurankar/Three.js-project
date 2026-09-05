import * as THREE from "three";
import { createEntity } from "../factories/entityFactory.js";
import { BaseScene } from "./baseScene.js"


export class TestScene extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {  
    super(scene, camera, player, focus);
    this.timeFactor = 100;
    
    this.SIZE_SCALE = 1;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
    this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
    this.near = 16;
    this.far = 16000;
    this.cameraSettings = { near: this.near, far: this.far };
  }

  GetEntityConfig() 
  {
    const requiredKeys = [
      "sun",
      "earth",
      "moon",
      "saturn",
      "saturn_ring",
      "asteroid_belt",
      "probe1",
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      earth: this.LOCAL_SIZE_SCALE,
      moon: this.LOCAL_SIZE_SCALE,
      saturn: this.LOCAL_SIZE_SCALE,
      saturn_ring: this.INNER_SIZE_SCALE,
      asteroid_belt: this.INNER_SIZE_SCALE,
      probe1: this.INNER_SIZE_SCALE
    };      
    return { requiredKeys, scaleMap };
  }
  
  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      lightType: "pointLight",
      detail: 4,
      orbitalTilt: 0,
      orbitalPeriod: 0,
      hasTexture: true,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;
    
    // Create Earth
    this.earth = createEntity(this.entityMap.earth, {
      orbitRadius: this.sizeMap.sun *5,
      parent: this.sun.objectRoot,
    });
    this.objects.push(this.earth);
    this.objectMap[this.entityMap.earth.key] = this.earth;

    // Create moon
    this.moon = createEntity(this.entityMap.moon, {
      orbitRadius: this.sizeMap.earth *3,
      parent: this.earth.objectRoot,
    });
    this.objects.push(this.moon);
    this.objectMap[this.entityMap.moon.key] = this.moon;

    // Create asteroid belt
    this.asteroid_belt = createEntity(this.entityMap.asteroid_belt, {
      count: 6000,
      orbitFarRadius: this.sizeMap.sun * 16,
      orbitNearRadius: this.sizeMap.sun * 14,
      thickness: 50,
      parent: this.sun.objectRoot,
    });
    this.objects.push(this.asteroid_belt);
    this.objectMap[this.entityMap.asteroid_belt.key] = this.asteroid_belt;
    
    // Create saturn
    this.saturn = createEntity(this.entityMap.saturn, {
      orbitRadius: this.sizeMap.sun *8,
      parent: this.sun.objectRoot,
    });
    this.objects.push(this.saturn);
    this.objectMap[this.entityMap.saturn.key] = this.saturn;

    // Create saturn ring
    this.saturn_ring = createEntity(this.entityMap.saturn_ring, {
      count: 4000,
      orbitFarRadius: this.sizeMap.saturn * 2,
      orbitNearRadius: this.sizeMap.saturn + this.sizeMap.saturn / 5,
      thickness: 0.6,   
      color: 0xdfe6f0,
      parent: this.saturn.axialFrame,
    });
    this.objects.push(this.saturn_ring);
    this.objectMap[this.entityMap.saturn_ring.key] = this.saturn_ring;

    // Creating Probe1
    this.probe1 = createEntity(this.entityMap.probe1, {
      orbitRadius: this.sizeMap.sun *2,
      parent: this.sun.objectRoot
    });
    this.objects.push(this.probe1);
    this.objectMap[this.entityMap.probe1.key] = this.probe1;
    this.primaryEntity = this.probe1;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sun.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.earth;     // TO CHANGE
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
}