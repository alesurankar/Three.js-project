import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class MercuryOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 14;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 30;
        this.far = 30000;
        this.cameraSettings = {
            pos: { x:-2000, y:400, z:-1500 },
            lookAt: { x:1000, y:0, z:0 },
            fov: 40,
            near: this.near,
            far: this.far
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.objects = [];
        this.objectMap = {};
    }

    async init() 
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
            this.exitDistance = this.sizeMap.mercury * 30;
            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Sun
        this.sun = createEntity(this.entityMap.sun, {
            size: this.sizeMap.sun,
            maxSizeOnScreen: 1.37,
            renderMode: "points",
            lightType: "directionalLight",
            orbitalTilt: 7.00,
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
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.objectMap[this.entityMap.mercury.parentKey].objectRoot,
        });
        this.objects.push(this.mercury);
        this.objectMap[this.entityMap.mercury.key] = this.mercury;

        // Make camera look at Mercury initially
        this.camera.lookAt(this.mercury.objectRoot.position);

        // Assign target now that mercury exists
        this.sun.targetObject = this.mercury.objectRoot;

    }

    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
        if (!this.sun) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.mercury.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
            this.transitionFrom = this.entityMap.mercury.key;
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