import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class JupiterOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.jupiterSize = 1000 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.jupiterSize * 2, y:0, z:this.jupiterSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 40,
            far: 26000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.jupiterSize * 12;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.jupiterEntity = this.entities.find(e => e.key === "jupiter");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.jupiterEntity) throw new Error("Jupiter entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
         // Create Jupiter
        this.jupiter = createEntity(this.jupiterEntity, {
            size: this.jupiterSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 3.13,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            detail: 8,
            hasClouds: false,
        });
        this.scene.add(this.jupiter.orbitPivot);
        this.objects.push(this.jupiter);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.1018,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.jupiter.objectRoot,
            posToParent: new THREE.Vector3(10000, 0, 10000),
            orbitalTilt: 1.31,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.jupiter.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.jupiter) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.jupiter.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
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