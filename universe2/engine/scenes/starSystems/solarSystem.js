import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class SolarSystem extends BaseScene
{
  constructor(scene, camera, player, focus = {}) 
  {
    super(scene, camera, player, focus);
    this.timeFactor=100

    this.SIZE_SCALE = 1;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
    this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
    this.near = 12;
    this.far = 16000;
    this.cameraSettings = { near: this.near,far: this.far };
  }

  GetEntityConfig() 
  {
    const requiredKeys = [
      "sun",
      "mercury",
      "venus",
      "earth",
      "moon",
      "mars",
      "asteroid_belt",
      "jupiter",
      "saturn",
      "saturn_ring",
      "uranus",
      "uranus_ring",
      "neptune",
      "pluto",
      "kuiper_belt"
    ];

    const scaleMap = {
      sun: this.REGION_SIZE_SCALE,
      mercury: this.LOCAL_SIZE_SCALE,
      venus: this.LOCAL_SIZE_SCALE,
      earth: this.LOCAL_SIZE_SCALE,
      moon: this.LOCAL_SIZE_SCALE,
      mars: this.LOCAL_SIZE_SCALE,
      asteroid_belt: this.INNER_SIZE_SCALE,
      jupiter: this.LOCAL_SIZE_SCALE,
      saturn: this.LOCAL_SIZE_SCALE,
      saturn_ring: this.INNER_SIZE_SCALE,
      uranus: this.LOCAL_SIZE_SCALE,
      uranus_ring: this.INNER_SIZE_SCALE,
      neptune: this.LOCAL_SIZE_SCALE,
      pluto: this.LOCAL_SIZE_SCALE,
      kuiper_belt: this.INNER_SIZE_SCALE
    };
    return { requiredKeys, scaleMap };
  }

  CreateObjects()
  {
    // Create Sun
    this.sun = createEntity(this.entityMap.sun, {
      size: this.sizeMap.sun,
      lightType: "pointLight",
      detail: 4,
      orbitalTilt: 0,
      orbitalPeriod: 0,
      hasTexture: true,
    });
    this.scene.add(this.sun.orbitPivot);
    this.objects.push(this.sun);
    this.objectMap[this.entityMap.sun.key] = this.sun;
    this.primaryEntity = this.sun;

    // Create Mercury
    this.mercury = createEntity(this.entityMap.mercury, {
      size: this.sizeMap.mercury,
      orbitRadius: this.sizeMap.sun * 4,
      parent: this.objectMap[this.entityMap.mercury.parentKey].objectRoot,
    });
    this.objects.push(this.mercury);
    this.objectMap[this.entityMap.mercury.key] = this.mercury;

    // Create venus
    this.venus = createEntity(this.entityMap.venus, {
      size: this.sizeMap.venus,
      orbitRadius: this.sizeMap.sun * 7,
      parent: this.objectMap[this.entityMap.venus.parentKey].objectRoot,
    });
    this.objects.push(this.venus);
    this.objectMap[this.entityMap.venus.key] = this.venus;

    // Create Earth
    this.earth = createEntity(this.entityMap.earth, {
      size: this.sizeMap.earth,
      orbitRadius: this.sizeMap.sun * 10,
      parent: this.objectMap[this.entityMap.earth.parentKey].objectRoot,
    });
    this.objects.push(this.earth);
    this.objectMap[this.entityMap.earth.key] = this.earth;

    // Create moon
    this.moon = createEntity(this.entityMap.moon, {
      size: this.sizeMap.moon,
      orbitRadius: this.sizeMap.earth * 10,
      parent: this.objectMap[this.entityMap.moon.parentKey].objectRoot,
    });
    this.objects.push(this.moon);
    this.objectMap[this.entityMap.moon.key] = this.moon;

    // Create mars
    this.mars = createEntity(this.entityMap.mars, {
      size: this.sizeMap.mars,
      orbitRadius: this.sizeMap.sun * 15,
      parent: this.objectMap[this.entityMap.mars.parentKey].objectRoot,
    });
    this.objects.push(this.mars);
    this.objectMap[this.entityMap.mars.key] = this.mars;

    // Create asteroid belt
    this.asteroid_belt = createEntity(this.entityMap.asteroid_belt, {
      count: 5000,
      size: this.sizeMap.asteroid_belt,
      orbitFarRadius: this.sizeMap.sun * 19,
      orbitNearRadius: this.sizeMap.sun * 17,
      thickness: 50,
      parent: this.objectMap[this.entityMap.asteroid_belt.parentKey].objectRoot,
    });
    this.objects.push(this.asteroid_belt);
    this.objectMap[this.entityMap.asteroid_belt.key] = this.asteroid_belt;
    
    // Create jupiter
    this.jupiter = createEntity(this.entityMap.jupiter, {
      size: this.sizeMap.jupiter,
      orbitRadius: this.sizeMap.sun * 26,
      parent: this.objectMap[this.entityMap.jupiter.parentKey].objectRoot,
    });
    this.objects.push(this.jupiter);
    this.objectMap[this.entityMap.jupiter.key] = this.jupiter;
    
    // Create saturn
    this.saturn = createEntity(this.entityMap.saturn, {
      size: this.sizeMap.saturn,
      orbitRadius: this.sizeMap.sun * 36,
      parent: this.objectMap[this.entityMap.saturn.parentKey].objectRoot,
    });
    this.objects.push(this.saturn);
    this.objectMap[this.entityMap.saturn.key] = this.saturn;

    // Create saturn ring
    this.saturn_ring = createEntity(this.entityMap.saturn_ring, {
      count: 4000,
      size: this.sizeMap.saturn_ring,
      orbitFarRadius: this.sizeMap.saturn * 2,
      orbitNearRadius: this.sizeMap.saturn + this.sizeMap.saturn / 5,
      thickness: 0.6,   
      color: 0xdfe6f0,
      parent: this.objectMap[this.entityMap.saturn_ring.parentKey].axialFrame,
    });
    this.objects.push(this.saturn_ring);
    this.objectMap[this.entityMap.saturn_ring.key] = this.saturn_ring;
    
    // Create uranus
    this.uranus = createEntity(this.entityMap.uranus, {
      size: this.sizeMap.uranus,
      orbitRadius: this.sizeMap.sun * 46,
      parent: this.objectMap[this.entityMap.uranus.parentKey].objectRoot,
    });
    this.objects.push(this.uranus);
    this.objectMap[this.entityMap.uranus.key] = this.uranus;

    // Create uranus ring
    this.uranus_ring = createEntity(this.entityMap.uranus_ring, {
      count: 1800,
      size: this.sizeMap.uranus_ring,
      orbitFarRadius: this.sizeMap.uranus * 2.3,
      orbitNearRadius: this.sizeMap.uranus * 2,
      thickness: 0.3,   
      //color: 0x444444, // real, to dark
      color: 0xffffff, // not real
      parent: this.objectMap[this.entityMap.uranus_ring.parentKey].axialFrame,
    });
    this.objects.push(this.uranus_ring);
    this.objectMap[this.entityMap.uranus_ring.key] = this.uranus_ring;
    
    // Create neptune
    this.neptune = createEntity(this.entityMap.neptune, {
      size: this.sizeMap.neptune,
      orbitRadius: this.sizeMap.sun * 56,
      parent: this.objectMap[this.entityMap.neptune.parentKey].objectRoot,
    });
    this.objects.push(this.neptune);
    this.objectMap[this.entityMap.neptune.key] = this.neptune;
    
    // Create pluto
    this.pluto = createEntity(this.entityMap.pluto, {
      size: this.sizeMap.pluto,
      orbitRadius: this.sizeMap.sun * 65,
      parent: this.objectMap[this.entityMap.pluto.parentKey].objectRoot,
    });
    this.objects.push(this.pluto);
    this.objectMap[this.entityMap.pluto.key] = this.pluto;

    // Create kuiper belt
    this.kuiper_belt = createEntity(this.entityMap.kuiper_belt, {
      count: 5000,
      size: this.sizeMap.kuiper_belt,
      orbitFarRadius: this.sizeMap.sun * 70,
      orbitNearRadius: this.sizeMap.sun * 60,
      thickness: 250,
      color: 0xaaaaaa,
      parent: this.objectMap[this.entityMap.kuiper_belt.parentKey].objectRoot,
    });
    this.objects.push(this.kuiper_belt);
    this.objectMap[this.entityMap.kuiper_belt.key] = this.kuiper_belt;
  }

  PlayerEntryPosition() 
  {
    const targetPos = this.earth.GetPosition();
    const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    const scale = this.sizeMap.sun;    // TO CHANGE
    const playerPos = new THREE.Vector3(2*scale, 2*scale, 2*scale);
    this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);
    
    // Debug logs
    console.log("Earth position:", target);
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
    this.exitDistance = this.sizeMap.sun * 90;   // TO CHANGE
  }

  DefinePortals()
  {
    this.sceneTriggers = [
      { obj: this.mercury, threshold: this.sizeMap.mercury * 5, scene: "MercuryOrbit" },
      { obj: this.venus, threshold: this.sizeMap.venus * 4, scene: "VenusOrbit" },
      { obj: this.earth, threshold: this.sizeMap.earth * 4, scene: "EarthOrbit" },
      { obj: this.moon, threshold: this.sizeMap.moon * 4, scene: "MoonOrbit" },
      { obj: this.mars, threshold: this.sizeMap.mars * 4, scene: "MarsOrbit" },
      { obj: this.jupiter, threshold: this.sizeMap.jupiter * 3, scene: "JupiterOrbit" },
      { obj: this.saturn, threshold: this.sizeMap.saturn * 3, scene: "SaturnOrbit" },
      { obj: this.uranus, threshold: this.sizeMap.uranus * 3, scene: "UranusOrbit" },
      { obj: this.neptune, threshold: this.sizeMap.neptune * 3, scene: "NeptuneOrbit" },
      { obj: this.pluto, threshold: this.sizeMap.pluto * 3, scene: "PlutoOrbit" },
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
      this.requestedScene = "MilkyWay";      // TO CHANGE
      this.transitionFrom = "solar_system";  // TO CHANGE
    }

    for (const trigger of this.sceneTriggers) {
      trigger.obj.objectRoot.getWorldPosition(entityPos);
      const distance = playerPos.distanceTo(entityPos);
      if (distance <= trigger.threshold) {
        this.requestedScene = trigger.scene;
        //console.log("Step 14: solarSystem.js: triggeredScene: ", this.requestedScene);
        break;
      }
    } 
  }
}
