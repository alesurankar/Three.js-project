import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class MercuryOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.cameraSettings = {
            pos: { x:-60, y:0, z:60 },
            lookAt: { x:1000, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 10000
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
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.mercuryEntity = this.entities.find(e => e.key === "mercury");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.mercuryEntity) throw new Error("Mercury entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");
            
            this.sunSize = this.sunEntity.size * this.REGION_SIZE_SCALE;
            this.mercurySize = this.mercuryEntity.size * this.LOCAL_SIZE_SCALE;
            
            this.exitDistance = this.mercurySize * 30;

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Mercury
        this.mercury = createEntity(this.mercuryEntity, {
            size: this.mercurySize,
            axialTilt: 0.034,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            detail: 6,
            hasClouds: false,
        });
        this.scene.add(this.mercury.orbitPivot);
        this.objects.push(this.mercury);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: this.sunSize,
            maxSizeOnScreen: 1.37,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.mercury.objectRoot,
            posToParent: new THREE.Vector3(this.exitDistance * 3, 0, 0),
            orbitalTilt: 7.00,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.mercury.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.mercury) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.mercury.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
            this.transitionFrom = this.mercuryEntity.key;
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