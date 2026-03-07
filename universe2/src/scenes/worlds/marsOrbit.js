import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class MarsOrbit
{
    constructor(scene, camera, player, focus = {})  
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
            pos: { x:-2000, y:400, z:-1500 },
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
            
            this.marsEntity = this.entities.find(e => e.key === "mars");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.marsEntity) throw new Error("Mars entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");
            
            this.marsSize = this.marsEntity.size * this.LOCAL_SIZE_SCALE;
            
            this.exitDistance = this.marsSize * 30;

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    PlayerEntryPosition() 
    {
    }
    
    CreateObjects()
    {
        // Create Mars
        this.mars = createEntity(this.marsEntity, {
            size: this.marsSize,
            axialTilt: 25.19,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            detail: 6,
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
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
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
            this.transitionFrom = this.marsEntity.key;
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