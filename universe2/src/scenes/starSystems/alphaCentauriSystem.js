import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


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
       
        this.cameraSettings = {
            pos: { x:-1500, y:500, z:200 },
            lookAt: { x:1000, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "alphacentauri" && e.galaxyKey === "milkyway");
            
            this.alphacentauriAEntity = this.entities.find(e => e.key === "alphacentauriA");
            this.alphacentauriBEntity = this.entities.find(e => e.key === "alphacentauriB");
            this.proximacentauriEntity = this.entities.find(e => e.key === "proximacentauri");
            
            if (!this.alphacentauriAEntity) throw new Error("Alpha Centauri A entity missing");
            if (!this.alphacentauriBEntity) throw new Error("Alpha Centauri B entity missing");
            if (!this.proximacentauriEntity) throw new Error("Proxyma Centauri entity missing");

            this.alphacentauriASize = this.alphacentauriAEntity.size * this.REGION_SIZE_SCALE;
            this.alphacentauriBSize = this.alphacentauriBEntity.size * this.REGION_SIZE_SCALE;
            this.proximacentauriSize = this.proximacentauriEntity.size * this.REGION_SIZE_SCALE;

            this.exitDistance = this.alphacentauriASize * 160;
            
            if (this.params?.focus) {
                console.log("Init focus param:", this.params.focus);
            }

            this.CreateObjects();
            this.Portals();

            if (this.params?.focus) {
                console.log("Calling PositionEntryCamera via requestAnimationFrame...");
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
        this.alphacentauriA = createEntity(this.alphacentauriAEntity, {
            size: this.alphacentauriASize,
            posToParent: new THREE.Vector3(this.alphacentauriASize * 9, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5790,
            parent: this.barycenter,
        });
        this.objects.push(this.alphacentauriA);

        // Create Alpha Centuri B
        this.alphacentauriB = createEntity(this.alphacentauriBEntity, {
            size: this.alphacentauriBSize,
            posToParent: new THREE.Vector3(this.alphacentauriASize * (-7.2), 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5200,
            parent: this.barycenter,
        });
        this.objects.push(this.alphacentauriB);

        // Create Proxima Centauri
        this.proximacentauri = createEntity(this.proximacentauriEntity, {
            size: this.proximacentauriSize,
            posToParent: new THREE.Vector3(this.alphacentauriASize * 70, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
            temperature: 3000,
            parent: this.barycenter,
        });
        this.objects.push(this.proximacentauri);

        this.alphacentauriA.size = this.alphacentauriASize;
        this.alphacentauriB.size = this.alphacentauriBSize;
        this.proximacentauri.size = this.proximacentauriSize;
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.proximacentauri, threshold: this.proximacentauriSize * 4, scene: "ProximaCentauri" },
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

        const offset = target.size * 8;

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
            this.transitionFrom = "alphacentauri";
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