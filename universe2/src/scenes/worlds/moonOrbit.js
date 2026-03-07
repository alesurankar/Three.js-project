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
        
        this.SIZE_SCALE = 14;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 30;
        this.far = 30000;
        this.cameraSettings = {
            pos: { x:-1900, y:500, z:-1900 },
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
            
            this.moonEntity = this.entities.find(e => e.key === "moon");
            this.earthEntity = this.entities.find(e => e.key === "earth");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.earthEntity) throw new Error("Earth entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.moonSize = this.moonEntity.size * this.LOCAL_SIZE_SCALE;
            this.earthSize = this.earthEntity.size * this.LOCAL_SIZE_SCALE;

            this.exitDistance = this.moonSize * 60;

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
        // Create Moon
        this.moon = createEntity(this.moonEntity, {
            size: this.moonSize,
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            detail: 6,
            hasClouds: false,
        });
        this.scene.add(this.moon.orbitPivot);
        this.objects.push(this.moon);

        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            posToParent: new THREE.Vector3(this.earthSize * 20, 0, this.earthSize * 20),
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
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
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
            { obj: this.earth, threshold: this.earthSize * 18, scene: "EarthOrbit" },
        ];
    }

    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
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
            this.transitionFrom = this.moonEntity.key;
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