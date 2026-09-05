import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class UranusOrbit extends BaseScene
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
      "uranus",
      "uranus_ring",
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      uranus: this.LOCAL_SIZE_SCALE,
      uranus_ring: this.INNER_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      maxSizeOnScreen: 0.0557,
      renderMode: "points",
      lightType: "directionalLight",
      orbitalTilt: 0,
      orbitalPeriod: 0,
      sizeAtenuation: false,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;

    // Create Uranus
    this.uranus = createEntity(this.entityMap.uranus, {
      detail: 6,
      orbitRadius: this.far - this.sizeMap.uranus * 20,  // TO CHANGE
    });
    this.objects.push(this.uranus);
    this.objectMap[this.entityMap.uranus.key] = this.uranus;
    this.primaryEntity = this.uranus;

    // Create Uranus ring
    this.uranus_ring = createEntity(this.entityMap.uranus_ring, {
      count: 1800,
      orbitFarRadius: this.sizeMap.uranus * 2.3,
      orbitNearRadius: this.sizeMap.uranus * 2,
      thickness: 0.3,
      color: 0xffffff,
    });
    this.objects.push(this.uranus_ring);
    this.objectMap[this.entityMap.uranus_ring.key] = this.uranus_ring;
    
    // Assign light target
    this.sun.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sun.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.uranus;    // TO CHANGE
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
    this.exitDistance = this.sizeMap.uranus * 18;  // TO CHANGE
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
      this.transitionFrom = "uranus";      // TO CHANGE
    }
  }
}
