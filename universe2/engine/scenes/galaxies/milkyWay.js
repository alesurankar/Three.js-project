import * as THREE from "three";
import { Star } from "../../entities/star.js";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class MilkyWay extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus, "GalaxyBox");
    this.timeFactor=200
      
    this.SIZE_SCALE = 5;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.OUTER_SIZE_SCALE = 0.001 * this.REGION_SIZE_SCALE;

    // Scale constants
    this.DISTANCE_SCALE = 0.1; // 1 unit = 1 light-year
    this.LOCAL_SCALE = 200; // scale down small interstellar distances
    this.sunPos = new THREE.Vector3(26700 * this.DISTANCE_SCALE, -200, -200);

    this.near = 20;
    this.far = 20000;
    this.cameraSettings = { near: this.near,far: this.far };
    
    const starNum = 2000;
    this.redDwarfNum = starNum * 0.72;
    this.K_typeNum = starNum * 0.14;
    this.G_typeNum = starNum * 0.08;
    this.F_typeNum = starNum * 0.03;
    this.A_typeNum = starNum * 0.007;
    this.redMasiveNum = starNum * 0.0006;

    this.baseSpeed = StarSystem.OrbitalRotationInDays(250);
  }
    
  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  GetEntityConfig() 
  {
    const requiredKeys = [
      "sagittarius_a",
      "sun",
      "alpha_centauri_center",
      "alpha_centauri_a",
      "alpha_centauri_b",
      "proxima_centauri",
    ];

    const scaleMap = {
      sagittarius_a: this.REGION_SIZE_SCALE,
      sun: this.OUTER_SIZE_SCALE,
      alpha_centauri_a: this.OUTER_SIZE_SCALE,
      alpha_centauri_b: this.OUTER_SIZE_SCALE,
      proxima_centauri: this.OUTER_SIZE_SCALE,
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Sagittarius A blackhole
    this.SMBH = createEntity(this.entityMap.sagittarius_a, {
      size: this.sizeMap.sagittarius_a,
      posToParent: new THREE.Vector3(0, 0, 0),
      axialRotationSpeed: this.baseSpeed * this.DISTANCE_SCALE * 30,
    });
    this.scene.add(this.SMBH.orbitPivot);
    this.objects.push(this.SMBH);

    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      size: this.sizeMap.sun,
      renderMode: "points",
      posToParent: this.sunPos,
      orbitalSpeed: this.baseSpeed,
      temperature: 5778,
      parent: this.SMBH.objectRoot,
    });
    this.objects.push(this.sun);

    // Create Alpha Centauri
    this.alpha_centauri_center = createEntity(this.entityMap.alpha_centauri_center, {
      posToParent: new THREE.Vector3(this.sunPos.x + 3.5*this.LOCAL_SCALE, this.sunPos.y - 1.2*this.LOCAL_SCALE + 0.02*this.LOCAL_SCALE, this.sunPos.z-1.0*this.LOCAL_SCALE + 0.02*this.LOCAL_SCALE),
      orbitalSpeed: this.baseSpeed /1000,
      parent: this.SMBH.objectRoot,
    });
    this.objects.push(this.alpha_centauri_center);

    this.alpha_centauri_a = createEntity(this.entityMap.alpha_centauri_a, {
      size: this.sizeMap.alpha_centauri_a,
      renderMode: "points",
      posToParent: new THREE.Vector3(-this.sizeMap.alpha_centauri_a * 18, 0, 0),
      orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
      temperature: 5790,
      parent: this.alpha_centauri_center.objectRoot,
    });
    this.objects.push(this.alpha_centauri_a);

    this.alpha_centauri_b = createEntity(this.entityMap.alpha_centauri_b, {
      size: this.sizeMap.alpha_centauri_b,
      renderMode: "points",
      posToParent: new THREE.Vector3(this.sizeMap.alpha_centauri_b * 14, 0, 0),   
      orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
      temperature: 5200,
      parent: this.alpha_centauri_center.objectRoot,
    });
    this.objects.push(this.alpha_centauri_b);

    this.proxima_centauri = createEntity(this.entityMap.proxima_centauri, {
      size: this.sizeMap.proxima_centauri,
      renderMode: "points",
      posToParent: new THREE.Vector3(0, 0, this.sizeMap.alpha_centauri_a* 100),  
      orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
      temperature: 3000,
      parent: this.alpha_centauri_center.objectRoot,
    });
    this.objects.push(this.proxima_centauri);

    // Create redDwarfs
    for (let i = 0, z = this.redDwarfNum; i < this.redDwarfNum; i++, z--) {
      const size = this.randomBetween(0.01 * this.SIZE_SCALE, 0.05 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `redDwarf${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(2500, 3300),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }   

    // Create K_type stars
    for (let i = 0, z = this.K_typeNum; i < this.K_typeNum; i++, z--) {
      const size = this.randomBetween(0.05 * this.SIZE_SCALE, 0.09 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `K_type${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(3300, 4600),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }  

    // Create G_type stars
    for (let i = 0, z = this.G_typeNum; i < this.G_typeNum; i++, z--) {
      const size = this.randomBetween(0.09 * this.SIZE_SCALE, 0.12 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `G_type${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(4600, 6200),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }   

    // Create F_type stars
    for (let i = 0, z = this.F_typeNum; i < this.F_typeNum; i++, z--) {
      const size = this.randomBetween(0.1 * this.SIZE_SCALE, 0.2 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `F_type${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(6200, 7500),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }   

    // Create A_type stars
    for (let i = 0, z = this.A_typeNum; i < this.A_typeNum; i++, z--) {
      const size = this.randomBetween(0.2 * this.SIZE_SCALE, 0.5 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `A_type${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(7500, 10000),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }   

    // Create redMasive stars
    for (let i = 0, z = this.redMasiveNum; i < this.redMasiveNum; i++, z--) {
      const size = this.randomBetween(0.5 * this.SIZE_SCALE, 1 * this.SIZE_SCALE);
      const radius = this.randomBetween(this.DISTANCE_SCALE * this.galaxyNear, this.DISTANCE_SCALE * this.galaxyFar);
      const falloff = 0.7;
      const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
      const star = new Star({
        name: `redMasive${i}`,
        size: size,
        renderMode: "points",
        posToParent: new THREE.Vector3(
          Math.cos(i) * radius,
          this.randomBetween(-5, 5),
          Math.sin(i) * radius
        ),
        orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        temperature: this.randomBetween(2000, 3000),
        parent: this.SMBH.objectRoot,
      });
      this.objects.push(star);
    }   
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.sagittarius_a.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.sagittarius_a;    // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    
    // Debug logs
    console.log("Sagittarus A:", target);
    console.log("Player set to:", playerPos);

    // Face the Sun
    this.player.FaceTarget(-10000, 0, 0);   // TO CHANGE
    
    // Log the resulting forward vector
    const forward = new THREE.Vector3();
    this.player.camera.getWorldDirection(forward);
    console.log("Player forward vector after lookAt:", forward);
  }
    
  Portals()
  {
    this.sceneTriggers = [
      { obj: this.sun, threshold: this.sizeMap.sun * 100, scene: "SolarSystem" },
      { obj: this.alpha_centauri_a, threshold: this.sizeMap.alpha_centauri_a * 100, scene: "AlphaCentauriSystem" },
    ];
  }

  CheckSceneTransition() 
  {
    const entityPos = new THREE.Vector3();
    const playerPos = new THREE.Vector3();

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