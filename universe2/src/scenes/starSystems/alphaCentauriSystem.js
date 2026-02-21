import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class AlphaCentauriSystem 
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=100
        
        const sizeFactor = 0.5
        this.acASize = 110 * sizeFactor;
        this.acBSize = 90 * sizeFactor;
        this.pcSize = 30 * sizeFactor;
       
        this.cameraSettings = {
            pos: { x:1500, y:1500, z:0 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 12000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.acASize * 160;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "alphacentauri" && e.galaxyKey === "milkyway");
            
            this.acAEntity = this.entities.find(e => e.key === "alphacentauriA");
            this.acBEntity = this.entities.find(e => e.key === "alphacentauriB");
            this.pcEntity = this.entities.find(e => e.key === "proximacentauri");
            
            if (!this.acAEntity) throw new Error("Alpha Centauri A entity missing");
            if (!this.acBEntity) throw new Error("Alpha Centauri B entity missing");
            if (!this.pcEntity) throw new Error("Proxyma Centauri entity missing");

            this.CreateObjects();
            this.Portals();
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
        this.acA = createEntity(this.acAEntity, {
            size: this.acASize,
            posToParent: new THREE.Vector3(900, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5790,
            parent: this.barycenter,
        });
        this.objects.push(this.acA);

        // Create Alpha Centuri B
        this.acB = createEntity(this.acBEntity, {
            size: this.acBSize,
            posToParent: new THREE.Vector3(-720, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5200,
            parent: this.barycenter,
        });
        this.objects.push(this.acB);

        // Create Proxima Centauri
        this.pc = createEntity(this.pcEntity, {
            size: this.pcSize,
            posToParent: new THREE.Vector3(8000, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
            temperature: 3000,
            parent: this.barycenter,
        });
        this.objects.push(this.pc);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.pc, threshold: this.pcSize * 3, scene: "ProximaCentauri" },
        ];
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