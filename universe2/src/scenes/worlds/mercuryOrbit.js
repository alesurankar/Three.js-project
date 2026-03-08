import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js"


export class MercuryOrbit extends BaseScene
{
    constructor(scene, camera, player, focus = {}) 
    {
        super(scene, camera, player, focus);
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 10;
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
            "mercury",
        ];

        const scaleMap = {
            sun: this.REGION_SIZE_SCALE,
            mercury: this.LOCAL_SIZE_SCALE,
        };
        return { requiredKeys, scaleMap };
    }
    
    CreateObjects()
    {
        // Create Sun
        this.sun = createEntity(this.entityMap.sun, {
            size: this.sizeMap.sun,
            maxSizeOnScreen: 1.37,
            renderMode: "points",
            lightType: "directionalLight",
            temperature: 5778,
            sizeAtenuation: false,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);
        this.objectMap[this.entityMap.sun.key] = this.sun;

        // Create Mercury
        this.mercury = createEntity(this.entityMap.mercury, {
            size: this.sizeMap.mercury,
            posToParent: new THREE.Vector3(this.far - this.sizeMap.mercury * 20, 0, 0),
            axialTilt: this.entityMap.mercury.axialTilt,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.objectMap[this.entityMap.mercury.parentKey].objectRoot,
        });
        this.objects.push(this.mercury);
        this.objectMap[this.entityMap.mercury.key] = this.mercury;
        this.primaryEntity = this.mercury;

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
        const scale = this.sizeMap.mercury;   // TO CHANGE

        this.player.SetPosition(2*scale + entry.x, 2*scale + entry.y, 2*scale + entry.z);
        this.player.FaceTarget(2*distance.x, 2*distance.y, 2*distance.z);
    }

    SetExitCondition() 
    {
        this.exitDistance = this.sizeMap.mercury * 20;  // TO CHANGE
    }

    CheckSceneTransition() 
    {
        const pos = this._tempVec;
        const playerPos = this.player.objectRoot.position;
        this.primaryEntity.objectRoot.getWorldPosition(pos);

        const distanceToParent = playerPos.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem"; // TO CHANGE
            this.transitionFrom = "mercury";     // TO CHANGE
            //console.log("Step 14: mercuryOrbit.js: requestedScene: ", this.requestedScene);
            //console.log("Step 14: mercuryOrbit.js: transitionFrom: ", this.transitionFrom);
        }
    }
}