import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.earthSize = 1000 * sizeFactor;
        this.moonSize = 270 * sizeFactor;
        
        this.cameraSettings = {
            pos: { x:-this.earthSize * 2, y:0, z:this.earthSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 40,
            far: 26000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.earthSize * 12;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solarsystem" && e.galaxyKey === "milkyway");
            
            this.earthEntity = this.entities.find(e => e.key === "earth");
            this.moonEntity = this.entities.find(e => e.key === "moon");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            this.probe1Entity = this.entities.find(e => e.key === "probe1");
            this.probe2Entity = this.entities.find(e => e.key === "probe2");
            
            if (!this.earthEntity) throw new Error("Earth entity missing");
            if (!this.moonEntity) throw new Error("Moon entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");
            if (!this.probe1Entity) throw new Error("Probe1 entity missing");
            if (!this.probe2Entity) throw new Error("Probe2 entity missing");

            this.CreateObjects();
            this.Portals();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 8,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Create probe
        this.probe = createEntity(this.probe1Entity, {
            size: 1,
            posToParent: new THREE.Vector3(1200, 200, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1200,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.03),
            orbitalTilt: 21.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.03),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.probe);

        // Create probe2
        this.probe = createEntity(this.probe2Entity, {
            size: 300,
            posToParent: new THREE.Vector3(1400, 300, 200),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1400,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.04),
            orbitalTilt: -30.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.04),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.probe);

        // Create probe3
        this.probe = createEntity(this.probe2Entity, {
            size: 300,
            posToParent: new THREE.Vector3(1400, 100, 200),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1400,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.033),
            orbitalTilt: -20.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.033),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.probe);

        // Create probe4
        this.probe = createEntity(this.probe2Entity, {
            size: 300,
            posToParent: new THREE.Vector3(1400, 0, 100),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1400,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.044),
            orbitalTilt: -40.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.044),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.probe);

        // Create moon
        this.moon = createEntity(this.moonEntity, {
            size: this.moonSize,
            posToParent: new THREE.Vector3(14000, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 3,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: 100,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.earth.objectRoot,
            posToParent: new THREE.Vector3(10000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.moon, threshold: this.moonSize * 14, scene: "MoonOrbit" },
        ];
    }

    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        this.earth.objectRoot.getWorldPosition(pos);

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
