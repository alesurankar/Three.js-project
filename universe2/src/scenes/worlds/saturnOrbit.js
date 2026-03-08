import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class SaturnOrbit extends BaseScene
{
    constructor(scene, camera, player, focus = {}) 
    {
        super(scene, camera, player, focus);
        StarSystem.timeFactor=1
        
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
            sizeAtenuation: false,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);
        this.objectMap[this.entityMap.sun.key] = this.sun;

        // Create Saturn
        this.saturn = createEntity(this.entityMap.saturn, {
            size: this.sizeMap.saturn,
            posToParent: new THREE.Vector3(this.far - this.sizeMap.saturn * 20, 0, 0),  // TO CHANGE
            axialTilt: this.entityMap.saturn.axialTilt,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
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
        const entryPos = this.primaryEntity.GetPosition();
        const targetPos = this.sun.GetPosition();

        const entry = new THREE.Vector3(entryPos.x, entryPos.y, entryPos.z);
        const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

        const difference = new THREE.Vector3().subVectors(target, entry);
        
        const distance = new THREE.Vector3(
            Math.abs(difference.x),
            Math.abs(difference.y),
            Math.abs(difference.z)
        );

        const scale = this.sizeMap.saturn;   // TO CHANGE

        this.player.SetPosition(2*scale + entry.x, 2*scale + entry.y, 2*scale + entry.z);
        this.player.FaceTarget(2*distance.x, 2*distance.y, 2*distance.z);
    }

    SetExitCondition() 
    {
        this.exitDistance = this.sizeMap.saturn * 20;  // TO CHANGE
    }

    CheckSceneTransition() 
    {
        const pos = this._tempVec;
        const playerPos = this.player.objectRoot.position;
        this.saturn.objectRoot.getWorldPosition(pos);

        const distanceToParent = playerPos.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem"; // TO CHANGE
            this.transitionFrom = "saturn";      // TO CHANGE
        }
    }
}