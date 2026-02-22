import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class SaturnOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 2;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 30;
        this.far = 30000;
        this.cameraSettings = {
            pos: { x:-4000, y:400, z:-4500 },
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
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.saturnEntity = this.entities.find(e => e.key === "saturn");
            this.saturnringEntity = this.entities.find(e => e.key === "saturnring");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.saturnEntity) throw new Error("Saturn entity missing");
            if (!this.saturnringEntity) throw new Error("Saturn Ring entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");
            
            this.saturnSize = this.saturnEntity.size * this.LOCAL_SIZE_SCALE;
            this.saturnRingSize = this.saturnringEntity.size * this.INNER_SIZE_SCALE;

            this.exitDistance = this.saturnSize * 15;

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Saturn
        this.saturn = createEntity(this.saturnEntity, {
            size: this.saturnSize,
            axialTilt: 26.73,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            detail: 6,
            hasClouds: false,
        });
        this.scene.add(this.saturn.orbitPivot);
        this.objects.push(this.saturn);

        // Create saturn ring
        this.saturnRing = createEntity(this.saturnringEntity, {
            count: 6000,
            size: this.saturnRingSize,
            orbitFarRadius: this.saturnSize * 1.8,
            orbitNearRadius: this.saturnSize + this.saturnSize/6,
            axialRotationSpeed: 0.005,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
            thickness: 0.6,   
            color: 0xdfe6f0,
            parent: this.saturn.axialFrame
        });
        this.objects.push(this.saturnRing);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.0557,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.saturn.objectRoot,
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
            orbitalTilt: 2.49,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.saturn.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.saturn) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.saturn.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
            this.transitionFrom = this.saturnEntity.key;
            console.log("from SaturnOrbit.Update()", this.saturnEntity.key)
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