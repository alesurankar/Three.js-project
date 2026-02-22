import * as THREE from "three";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";
import { createEntity } from "../factories/entityFactory.js";
import api from "../utils/api";


export class TestScene
{
    constructor(scene, camera) 
    {   
        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.0001 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.active = true;
        StarSystem.timeFactor=100
       
        this.cameraSettings = {
            pos: { x:1000, y:100, z:-200 },
            lookAt: { x:800, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.objects = [];
    }

    async init() 
    {
        try {
            const res = await api.get("/entities");
            if (!this.active) return;

            this.entities = res.data.entities;
            this.sunEntity = this.entities.find(e => e.key === "sun");
            this.earthEntity = this.entities.find(e => e.key === "earth");
            this.moonEntity = this.entities.find(e => e.key === "moon");
            this.saturnEntity = this.entities.find(e => e.key === "saturn");
            this.saturnringEntity = this.entities.find(e => e.key === "saturnring");
            this.asteroidbeltEntity = this.entities.find(e => e.key === "asteroidbelt");
            
            if (!this.sunEntity) throw new Error("Sun entity missing");
            if (!this.earthEntity) throw new Error("Earth entity missing");
            if (!this.moonEntity) throw new Error("Moon entity missing");
            if (!this.saturnEntity) throw new Error("Saturn entity missing");
            if (!this.saturnringEntity) throw new Error("Saturn Ring entity missing");
            if (!this.asteroidbeltEntity) throw new Error("Asteroid Belt entity missing");
            
            this.sunSize = this.sunEntity.size * this.REGION_SIZE_SCALE; 
            this.earthSize = this.earthEntity.size * this.LOCAL_SIZE_SCALE;
            this.moonSize = this.moonEntity.size * this.LOCAL_SIZE_SCALE;
            this.saturnSize = this.saturnEntity.size * this.LOCAL_SIZE_SCALE;
            this.saturnRingSize = this.saturnringEntity.size * this.INNER_SIZE_SCALE;
            this.asteroidBeltSize = this.asteroidbeltEntity.size * this.INNER_SIZE_SCALE;
            
            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }

    CreateObjects()
    {
        // Create Sun
        this.sun = createEntity(this.sunEntity, {
            size: this.sunSize,
            lightType: "pointLight",
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
            hasTexture: true,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);
        
        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            posToParent: new THREE.Vector3(this.sunSize * 5, 0, 0),
            axialTilt: 23.44,
            orbitalTilt: 0,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.earth);

        // Create moon
        this.moon = createEntity(this.moonEntity, {
            size: this.moonSize,
            posToParent: new THREE.Vector3(this.earthSize * 3, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create asteroid belt
        this.asteroidBelt = createEntity(this.asteroidbeltEntity, {
            count: 6000,
            size: this.asteroidBeltSize,
            orbitFarRadius: this.sunSize * 16,
            orbitNearRadius: this.sunSize * 14,
            axialRotationSpeed: 0.0004,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
            thickness: 50,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.asteroidBelt);
        
        // Create saturn
        this.saturn = createEntity(this.saturnEntity, {
            size: this.saturnSize,
            posToParent: new THREE.Vector3(this.sunSize  * 8, 0, 0),
            axialTilt: 26.73,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.saturn);

        // Create saturn ring
        this.saturnRing = createEntity(this.saturnringEntity, {
            count: 4000,
            size: this.saturnRingSize,
            orbitFarRadius: this.saturnSize * 2,
            orbitNearRadius: this.saturnSize + this.saturnSize/5,
            axialRotationSpeed: 0.005,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
            thickness: 0.6,   
            color: 0xdfe6f0,
            parent: this.saturn.axialFrame
        });
        this.objects.push(this.saturnRing);
    }

    Update(dt) 
    {
        this.objects.forEach(obj => obj.Update(dt));
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