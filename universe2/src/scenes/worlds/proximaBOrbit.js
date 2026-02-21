import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class ProximaBOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.proximaBSize = 1000 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.proximaBSize * 2, y:0, z:this.proximaBSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 30,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.proximaBSize * 8;
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

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Proxima B
        this.pb = createEntity(this.proximaBEntity, {
            size: this.proximaBSize,
            axialRotationSpeed: StarSystem.AxialRotationInDays(11.2),
            detail: 8,
        });
        this.scene.add(this.pb.orbitPivot);
        this.objects.push(this.pb);

        // Create Proxima Centauri
        this.pc = createEntity(this.proximaCentauriEntity, {
            size: 100,
            maxSizeOnScreen: 1.58,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.pb.objectRoot,
            posToParent: new THREE.Vector3(10000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(11.2),
            temperature: 3000,
            sizeAtenuation: false,
            parent: this.pb.objectRoot,
        });
        this.objects.push(this.pc);

    }

    Update(dt) 
    {
        if (!this.pb) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.pb.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "ProximaCentauri";
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
    }
}