import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class VenusOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.venusSize = 950 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.venusSize * 2, y:0, z:this.venusSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 30,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.venusSize * 6;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.venusEntity = this.entities.find(e => e.key === "venus");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.venusEntity) throw new Error("Venus entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Venus
        this.venus = createEntity(this.venusEntity, {
            size: this.venusSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 177.36,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            detail: 8,
            hasClouds: false,
        });
        this.scene.add(this.venus.orbitPivot);
        this.objects.push(this.venus);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.72,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.venus.objectRoot,
            posToParent: new THREE.Vector3(15000, 0, 10000),
            orbitalTilt: 3.39,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.venus.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.venus) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.venus.objectRoot.getWorldPosition(pos);

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