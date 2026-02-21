import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class MoonOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.moonSize = 270 * sizeFactor;
        this.earthSize = 1000 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.moonSize * 2, y:0, z:this.moonSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 30,
            far: 22000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.moonSize * 18;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.moonEntity = this.entities.find(e => e.key === "moon");
            this.earthEntity = this.entities.find(e => e.key === "earth");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.earthEntity) throw new Error("Earth entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.CreateObjects();
            this.Portals();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Moon
        this.moon = createEntity(this.moonEntity, {
            size: this.moonSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            detail: 8,
            hasClouds: false,
        });
        this.scene.add(this.moon.orbitPivot);
        this.objects.push(this.moon);

        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            posToParent: new THREE.Vector3(14000, 0, 0),
            axialTilt: 23.44,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 3,
            hasClouds: true,
            parent: this.moon.objectRoot,
        });
        this.objects.push(this.earth);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.moon.objectRoot,
            posToParent: new THREE.Vector3(16000, 0, 12000),
            orbitalTilt: 5.145,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.moon.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.earth, threshold: this.earthSize * 10, scene: "EarthOrbit" },
        ];
    }

    Update(dt) 
    {
        if (!this.moon) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        this.moon.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
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