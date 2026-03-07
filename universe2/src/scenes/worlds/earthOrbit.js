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
        
        this.SIZE_SCALE = 10;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 30;
        this.far = 30000;
        this.cameraSettings = {
            pos: { x:-500, y:400, z:-2100 },
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

    async Init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solar_system" && e.galaxyKey === "milky_way");
            
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

            this.moonSize = this.moonEntity.size * this.LOCAL_SIZE_SCALE;
            this.earthSize = this.earthEntity.size * this.LOCAL_SIZE_SCALE;

            this.exitDistance = this.earthSize * 28;

            this.CreateObjects();
            this.Portals();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    OnEnter(player) 
    {
    }
    
    CreateObjects()
    {
        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 6,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Constants for simple orbital speed scaling (not physically perfect)
        const baseSpeed1 = 0.03; // base orbital period for probe1
        const baseSpeed2 = 0.025; // base orbital period for probe2

        // --- Create 100 probe1 (prograde, slightly tilted) ---
        for (let i = 0; i < 100; i++) {
            const radius = this.earthSize * 1.3 + Math.random() *  this.earthSize * 0.3;
            const longitude = Math.random() * Math.PI * 2;
            const latitude = (Math.random() - 0.5) * 0.6;

            const x = radius * Math.cos(longitude) * Math.cos(latitude)
            const y = radius * Math.sin(latitude)
            const z = radius * Math.sin(longitude) * Math.cos(latitude)

            const probe = createEntity(this.probe1Entity, {
                size: 0.3,
                posToParent: new THREE.Vector3(x, y, z),
                pitch: 0,
                yaw: longitude + Math.PI / 2,
                roll: 0,
                orbitRadius: radius,
                axialRotationSpeed: StarSystem.AxialRotationInDays(0.01 + Math.random() * 0.01),
                orbitalTilt: latitude * (180 / Math.PI),
                orbitalSpeed: StarSystem.OrbitalRotationInDays(baseSpeed1 + Math.random() * 0.01),
                parent: this.earth.objectRoot
            });
            this.objects.push(probe);
        }

        // --- Create 100 probe2 (higher orbit, prograde) ---
        for (let i = 0; i < 100; i++) {
            const radius = this.earthSize * 1.2 + Math.random() *  this.earthSize * 0.2;
            const longitude = Math.random() * Math.PI * 2;
            const latitude = (Math.random() - 0.5) * 0.6;

            const x = radius * Math.cos(longitude) * Math.cos(latitude)
            const y = radius * Math.sin(latitude)
            const z = radius * Math.sin(longitude) * Math.cos(latitude)

            const probe = createEntity(this.probe2Entity, {
                size: 80,
                posToParent: new THREE.Vector3(-x, -y, -z),
                pitch: 0,
                yaw: longitude + Math.PI / 2,
                roll: 0,
                orbitRadius: radius,
                axialRotationSpeed: StarSystem.AxialRotationInDays(0.02 + Math.random() * 0.02),
                orbitalTilt: latitude * (180 / Math.PI),
                orbitalSpeed: StarSystem.OrbitalRotationInDays(baseSpeed2 + Math.random() * 0.02),
                parent: this.earth.objectRoot
            });
            this.objects.push(probe);
        }

        // Create moon
        this.moon = createEntity(this.moonEntity, {
            size: this.moonSize,
            posToParent: new THREE.Vector3(this.earthSize * 20, 0, this.earthSize * 20),
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
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
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
            { obj: this.moon, threshold: this.moonSize * 24, scene: "MoonOrbit" },
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
            this.transitionFrom = this.earthEntity.key;
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
