import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class SaturnOrbit extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=1
    
    this.SIZE_SCALE = 2;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
    this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
    this.near = 16;
    this.far = 30000;
    this.cameraSettings = { near: this.near, far: this.far };
  }

  GetEntityConfig() 
  {
    const requiredKeys = [
      "sun",
      "saturn",
      "saturn_ring",
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      saturn: this.LOCAL_SIZE_SCALE,
      saturn_ring: this.INNER_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      size: this.sizeMap.sun,
      maxSizeOnScreen: 0.0557,
      renderMode: "points",
      lightType: "directionalLight",
      temperature: 5778,
      orbitalTilt: 0,
      orbitalPeriod: 0,
      sizeAtenuation: false,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;

    // Create Saturn
    this.saturn = createEntity(this.entityMap.saturn, {
      size: this.sizeMap.saturn,
      detail: 6,
      orbitRadius: this.far - this.sizeMap.saturn * 20,  // TO CHANGE
      parent: this.objectMap[this.entityMap.saturn.parentKey].objectRoot,
    });
    this.objects.push(this.saturn);
    this.objectMap[this.entityMap.saturn.key] = this.saturn;
    this.primaryEntity = this.saturn;

    // Create saturn ring
    this.saturn_ring = createEntity(this.entityMap.saturn_ring, {
      count: 4000,
      size: this.sizeMap.saturn_ring,
      orbitFarRadius: this.sizeMap.saturn * 2,
      orbitNearRadius: this.sizeMap.saturn + this.sizeMap.saturn / 5,
      axialRotationSpeed: 0.005,
      orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
      thickness: 0.6,   
      color: 0xdfe6f0,
      parent: this.objectMap[this.entityMap.saturn_ring.parentKey].axialFrame,
    });
    this.objects.push(this.saturn_ring);
    this.objectMap[this.entityMap.saturn_ring.key] = this.saturn_ring;
    
    // Assign light target
    this.sun.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sun.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.saturn;    // TO CHANGE
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
    this.exitDistance = this.sizeMap.saturn * 18;  // TO CHANGE
  }

  CheckSceneTransition() 
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();

    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    const distanceToParent = playerPos.distanceTo(entityPos);
    if (distanceToParent > this.exitDistance) {
      this.requestedScene = "SolarSystem"; // TO CHANGE
      this.transitionFrom = "saturn";      // TO CHANGE
    }
  }
}