import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class JupiterOrbit
{
    constructor(scene, camera, player, focus = {}) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 3;
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

    async Init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            this.entities = this.entities.filter(e => e.systemKey === "solar_system" && e.galaxyKey === "milky_way");
            
            this.jupiterEntity = this.entities.find(e => e.key === "jupiter");
            this.sunEntity = this.entities.find(e => e.key === "sun");
            
            if (!this.jupiterEntity) throw new Error("Jupiter entity missing");
            if (!this.sunEntity) throw new Error("Sun entity missing");

            this.jupiterSize = this.jupiterEntity.size * this.LOCAL_SIZE_SCALE;
            
            this.exitDistance = this.jupiterSize * 15;

            this.CreateObjects();
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
         // Create Jupiter
        this.jupiter = createEntity(this.jupiterEntity, {
            size: this.jupiterSize,
            axialTilt: 3.13,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            detail: 6,
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
            posToParent: new THREE.Vector3(this.far - this.exitDistance, 0, 0),
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
        // console.log("Camera position:", this.camera.position);
        if (!this.jupiter) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.jupiter.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem";
            this.transitionFrom = this.jupiterEntity.key;
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