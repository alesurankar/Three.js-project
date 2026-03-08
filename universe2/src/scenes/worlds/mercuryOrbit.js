import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class MercuryOrbit
{
    constructor(scene, camera, player, focus = {}) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 10;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 16;
        this.far = 30000;
        this.cameraSettings = { near: this.near, far: this.far };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.player = player;
        this.focus = focus;
        this._tempVec = new THREE.Vector3();
        this.objects = [];
        this.objectMap = {};
    }

    async Init() 
    {
        if (!this.active) return;
        const requiredKeys = [
            "sun",
            "mercury",
        ];

        const scaleMap = {
            sun: this.REGION_SIZE_SCALE,
            mercury: this.LOCAL_SIZE_SCALE,
        };
        
        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.exitDistance = this.sizeMap.mercury * 20;
            this.CreateObjects();
            this.PlayerEntryPosition();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }

    PlayerEntryPosition() 
    {
        const entryPos = this.mercury.GetPosition();
        const targetPos = this.sun.GetPosition();

        const entry = new THREE.Vector3(entryPos.x, entryPos.y, entryPos.z);
        const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

        const difference = new THREE.Vector3().subVectors(target, entry);
        
        const distance = new THREE.Vector3(
            Math.abs(difference.x),
            Math.abs(difference.y),
            Math.abs(difference.z)
        );

        console.log("Setting player position to:", 2*entry.x, entry.y, entry.z);
        this.player.SetPosition( this.sizeMap.mercury + entry.x, this.sizeMap.mercury + entry.y, this.sizeMap.mercury + entry.z);

        console.log("Setting player facing direction:", 2*distance.x, 2*distance.y, 2*distance.z);
        this.player.FaceTarget(2*distance.x, 2*distance.y, 2*distance.z);
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
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
            axialTilt: this.entityMap.mercury.axialTilt,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.objectMap[this.entityMap.mercury.parentKey].objectRoot,
        });
        this.objects.push(this.mercury);
        this.objectMap[this.entityMap.mercury.key] = this.mercury;

        // Assign target now that mercury exists
        this.sun.light.target = this.mercury.objectRoot;
    }

    Update(dt) 
    {
        if (!this.sun) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        const playerPos = this.player.objectRoot.position;
        this.mercury.objectRoot.getWorldPosition(pos);

        const distanceToParent = playerPos.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
            this.transitionFrom = "mercury";
            console.log("Step 14: mercuryOrbit.js: requestedScene: ", this.requestedScene);
            console.log("Step 14: mercuryOrbit.js: transitionFrom: ", this.transitionFrom);
        }
    }

    Dispose() 
    {
        this.active = false;
        this.objects.forEach(obj => obj?.Dispose());
        this.objects = [];
        
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
        // Clear objectMap to remove references
        this.objectMap = {};
    }
}