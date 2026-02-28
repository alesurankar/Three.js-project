import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class ProximaCentauri
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1

        this.SIZE_SCALE = 2;
        this.REGION_SIZE_SCALE = 0.0004 * this.SIZE_SCALE;

        this.near = 10;
        this.far = 10000;
        this.cameraSettings = {
            pos: { x:440, y:40, z:200 },
            lookAt: { x:200, y:0, z:10 },
            fov: 40,
            near: this.near,
            far: this.far
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.objects = [];
    }

    async init() 
    {
        if (!this.active) return;
        const requiredKeys = [
            "proximacentauri",
            "proxima_b",
        ];

        const scaleMap = {
            proximacentauri: this.REGION_SIZE_SCALE,
            proxima_b: this.REGION_SIZE_SCALE,
        };

        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.exitDistance = this.sizeMap.proximacentauri * 40;
            this.CreateObjects();
            this.Portals();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Proxima Centauri
        this.proximacentauri = createEntity(this.entityMap.proximacentauri, {
            size: this.sizeMap.proximacentauri,
            lightType: "pointLight",
            detail: 5,
            temperature: 3000,
        });
        this.scene.add(this.proximacentauri.orbitPivot);
        this.objects.push(this.proximacentauri);

        // Create Proxima B
        this.proxima_b = createEntity(this.entityMap.proxima_b, {
            size: this.sizeMap.proxima_b,
            posToParent: new THREE.Vector3(this.sizeMap.proxima_b * 68, 0, 0),
            axialRotationSpeed: StarSystem.AxialRotationInDays(11.2),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(11.2),
            detail: 3,
            parent: this.proximacentauri.objectRoot,
        });
        this.objects.push(this.proxima_b);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.proxima_b, threshold: this.sizeMap.proxima_b * 4, scene: "ProximaBOrbit" },
        ];
    }

    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        this.proximacentauri.objectRoot.getWorldPosition(pos);
        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "AlphaCentauriSystem";
            this.transitionFrom = this.entityMap.proximacentauri.key;
        }
        
        for (const trigger of this.sceneTriggers) {
            trigger.obj.objectRoot.getWorldPosition(pos);
            const distance = this.camera.position.distanceTo(pos);
            if (distance <= trigger.threshold) {
                this.requestedScene = trigger.scene;
                break;
            }
        }
    }

    Dispose() 
    {
        this.active = false;
        this.objects.forEach(obj => obj?.Dispose());
        this.objects = [];
        this.sceneTriggers = [];
        
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}