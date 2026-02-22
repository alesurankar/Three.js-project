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
        
        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 40 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.cameraSettings = {
            pos: { x:-80, y:0, z:80 },
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
            
            this.venusEntity = this.entities.find(e => e.key === "venus");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.venusEntity) throw new Error("Venus entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");
            
            this.sunSize = this.sunEntity.size * this.REGION_SIZE_SCALE;
            this.venusSize = this.venusEntity.size * this.LOCAL_SIZE_SCALE;

            this.exitDistance = this.venusSize * 25;

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
            axialTilt: 177.36,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            detail: 6,
            hasClouds: false,
        });
        this.scene.add(this.venus.orbitPivot);
        this.objects.push(this.venus);

        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: this.sunSize,
            maxSizeOnScreen: 0.72,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.venus.objectRoot,
            posToParent: new THREE.Vector3(this.exitDistance * 3, 0, 0),
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
            this.transitionFrom = this.venusEntity.key;
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