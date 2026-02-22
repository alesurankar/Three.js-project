import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class ProximaCentauri
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1

        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.0004 * this.SIZE_SCALE;

        this.near = 12;
        this.far = 16000;
        this.cameraSettings = {
            pos: { x:220, y:20, z:100 },
            lookAt: { x:100, y:0, z:0 },
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
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "alphacentauri" && e.galaxyKey === "milkyway");
            
            this.proximaCentauriEntity = this.entities.find(e => e.key === "proximacentauri");
            this.proximaBEntity = this.entities.find(e => e.key === "proxima_b");
            
            if (!this.proximaCentauriEntity) throw new Error("Proxima Centauri entity missing");
            if (!this.proximaBEntity) throw new Error("Proxima B entity missing");
            
            this.proximaCentauriSize = this.proximaCentauriEntity.size * this.REGION_SIZE_SCALE;
            this.proximaBSize = this.proximaBEntity.size * this.REGION_SIZE_SCALE;
            
            this.exitDistance = this.proximaCentauriSize * 40;

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
        this.pc = createEntity(this.proximaCentauriEntity, {
            size: this.proximaCentauriSize,
            lightType: "pointLight",
            detail: 5,
            temperature: 3000,
        });
        this.scene.add(this.pc.orbitPivot);
        this.objects.push(this.pc);

        // Create Proxima B
        this.pb = createEntity(this.proximaBEntity, {
            size: this.proximaBSize,
            posToParent: new THREE.Vector3(this.proximaBSize * 68, 0, 0),
            axialRotationSpeed: StarSystem.AxialRotationInDays(11.2),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(11.2),
            detail: 3,
            parent: this.pc.objectRoot,
        });
        this.objects.push(this.pb);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.pb, threshold: this.proximaBSize * 4, scene: "ProximaBOrbit" },
        ];
    }

    Update(dt) 
    {
        console.log("Camera position:", this.camera.position);
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        this.pc.objectRoot.getWorldPosition(pos);
        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "AlphaCentauriSystem";
            this.transitionFrom = this.proximaCentauriEntity.key;
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