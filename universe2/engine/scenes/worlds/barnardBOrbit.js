import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";

export class BarnardBOrbit extends BaseScene
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
      "barnards_star",
      "barnard_b",
    ];

    const scaleMap = {
      barnards_star: this.REGION_SIZE_SCALE,
      barnard_b: this.LOCAL_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Bernard's Star
    this.barnards_star = createEntity(this.entityMap.barnards_star, { 
      maxSizeOnScreen: 4.3, 
      renderMode: "points", 
      lightType: "directionalLight", 
      sizeAtenuation: false 
    });
    this.scene.add(this.barnards_star.orbitPivot);
    this.objects.push(this.barnards_star);
    this.objectMap.barnards_star = this.barnards_star;

    // Create Bernard B
    this.barnard_b = createEntity(this.entityMap.barnard_b, { 
      detail: 6, 
      orbitRadius: this.far - this.sizeMap.barnard_b * 20, 
    });
    this.objects.push(this.barnard_b);
    this.objectMap.barnard_b = this.barnard_b;
    this.primaryEntity = this.barnard_b;
    
    // Assign light target
    this.barnards_star.light.target = this.primaryEntity.objectRoot;
  }

  PlayerEntryPosition()
  {
    const scale = this.sizeMap.barnard_b;
    const playerPos = new THREE.Vector3(2 * scale, 2 * scale, 2 * scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    this.player.FaceTarget(1000000, 0, 0);
  }

  SetExitCondition() { 
    this.exitDistance = this.sizeMap.barnard_b * 20; 
  }

  CheckSceneTransition()
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();

    this.primaryEntity.objectRoot.getWorldPosition(entityPos);
    this.player.objectRoot.getWorldPosition(playerPos);

    if (playerPos.distanceTo(entityPos) > this.exitDistance) {
      this.requestedScene = "BarnardsSystem";
      this.transitionFrom = "barnard_b";
    }
  }
}
