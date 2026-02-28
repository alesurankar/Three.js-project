import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class AlphaCentauriSystem 
{
    constructor(scene, camera, params = {}) 
    {
        this.params = params;
        this.overrideCamera = false;
        this.active = true;
        StarSystem.timeFactor=100
        
        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.0001 * this.SIZE_SCALE;
       
        this.near = 20;
        this.far = 16000;
        this.cameraSettings = {
            pos: { x:-1500, y:500, z:200 },
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
    }

    async init() 
    {
        if (!this.active) return;
        const requiredKeys = [
            "alpha_centauri_a",
            "alpha_centauri_b",
            "proxima_centauri",
        ];

        const scaleMap = {
            alpha_centauri_a: this.REGION_SIZE_SCALE,
            alpha_centauri_b: this.REGION_SIZE_SCALE,
            proxima_centauri: this.REGION_SIZE_SCALE,
        }
        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.exitDistance = this.sizeMap.alpha_centauri_a * 160;
            this.CreateObjects();
            this.Portals();

            if (this.params?.focus) {
                // console.log("Init focus param:", this.params.focus);
                // console.log("Calling PositionEntryCamera via requestAnimationFrame...");
                requestAnimationFrame(() => this.PositionEntryCamera());
            }
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create BaryCenter
        this.barycenter = new THREE.Group();
        this.scene.add(this.barycenter);

        // Create Alpha Centuri A
        this.alpha_centauri_a = createEntity(this.entityMap.alpha_centauri_a, {
            size: this.sizeMap.alpha_centauri_a,
            posToParent: new THREE.Vector3(this.sizeMap.alpha_centauri_a * 9, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5790,
            parent: this.barycenter,
        });
        this.objects.push(this.alpha_centauri_a);

        // Create Alpha Centuri B
        this.alpha_centauri_b = createEntity(this.entityMap.alpha_centauri_b, {
            size: this.sizeMap.alpha_centauri_b,
            posToParent: new THREE.Vector3(this.sizeMap.alpha_centauri_a * (-7.2), 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5200,
            parent: this.barycenter,
        });
        this.objects.push(this.alpha_centauri_b);

        // Create Proxima Centauri
        this.proxima_centauri = createEntity(this.entityMap.proxima_centauri, {
            size: this.sizeMap.proxima_centauri,
            posToParent: new THREE.Vector3(this.sizeMap.alpha_centauri_a * 70, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
            temperature: 3000,
            parent: this.barycenter,
        });
        this.objects.push(this.proxima_centauri);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.proxima_centauri, threshold: this.sizeMap.proxima_centauri * 4, scene: "ProximaCentauri" },
        ];
    }

    PositionEntryCamera()
    {
        if (!this.params?.focus) {
            console.log("PositionEntryCamera skipped: no focus param");
            return;
        }

        const target = this[this.params.focus];
        if (!target || !target.objectRoot) {
            console.warn(`PositionEntryCamera: target for focus "${this.params.focus}" not found`);
            return;
        }

        // Force update on all matrices before computing world position
        this.scene.updateMatrixWorld(true);

        const pos = new THREE.Vector3();
        target.objectRoot.getWorldPosition(pos);
        
        const offset =this.sizeMap[this.params.focus] * 8;

        this.camera.position.set(
            pos.x + offset,
            pos.y + offset * 0.4,
            pos.z + offset
        );
        this.camera.lookAt(pos);
        this.overrideCamera = true;
    }

    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;
        
        const pos = this._tempVec;
        this.barycenter.getWorldPosition(pos);
        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "MilkyWay";
            this.transitionFrom = "alpha_centauri";
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

        if (this.barycenter) {
            this.barycenter.clear();
            this.scene.remove(this.barycenter);
            this.barycenter = null;
        }

        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}