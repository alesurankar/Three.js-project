import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class ProximaBOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        this.SIZE_SCALE = 14;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;

        this.near = 40;
        this.far = 30000;
        this.cameraSettings = {
            pos: { x:-4000, y:0, z:1000 },
            lookAt: { x:1000, y:0, z:2000 },
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

    async init() 
    {
        if (!this.active) return;
        const requiredKeys = [
            "proxima_centauri",
            "proxima_b",
        ];

        const scaleMap = {
            proxima_centauri: this.REGION_SIZE_SCALE,
            proxima_b: this.LOCAL_SIZE_SCALE,
        };

        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.exitDistance = this.sizeMap.proxima_b * 20;
            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Proxima B
        this.proxima_b = createEntity(this.entityMap.proxima_b, {
            size: this.sizeMap.proxima_b,
            axialRotationSpeed: StarSystem.AxialRotationInDays(11.2),
            detail: 6,
        });
        this.scene.add(this.proxima_b.orbitPivot);
        this.objects.push(this.proxima_b);

        // Create Proxima Centauri
        this.proxima_centauri = createEntity(this.entityMap.proxima_centauri, {
            size: 100,
            maxSizeOnScreen: 1.58,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.proxima_b.objectRoot,
            posToParent: new THREE.Vector3(10000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(11.2),
            temperature: 3000,
            sizeAtenuation: false,
            parent: this.proxima_b.objectRoot,
        });
        this.objects.push(this.proxima_centauri);
    }

    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
        if (!this.proxima_b) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.proxima_b.objectRoot.getWorldPosition(pos);

        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "ProximaCentauri";
            this.transitionFrom = this.entityMap.proxima_b.key;
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