import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class MarsOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.marsSize = 1000 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.marsSize * 2, y:0, z:this.marsSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 40,
            far: 26000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.marsSize * 12;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.marsEntity = this.entities.find(e => e.key === "mars");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.marsEntity) throw new Error("Mars entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Mars
        this.mars = createEntity(this.marsEntity, {
            size: this.marsSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 25.19,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            detail: 8,
            hasClouds: false,
        });
        this.scene.add(this.mars.orbitPivot);
        this.objects.push(this.mars);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.34,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.mars.objectRoot,
            posToParent: new THREE.Vector3(10000, 0, 10000),
            orbitalTilt: 1.85,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.mars.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.mars) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.mars.objectRoot.getWorldPosition(pos);

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