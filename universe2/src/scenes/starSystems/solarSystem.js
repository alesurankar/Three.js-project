import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import api from "../../utils/api";


export class SolarSystem 
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=100

        const sizeFactor = 1
        this.sunSize = 110 * sizeFactor; 
        this.wormholeSize = 100 * sizeFactor;
        this.mercurySize = 4 * sizeFactor;
        this.venusSize = 9.5 * sizeFactor;
        this.earthSize = 10 * sizeFactor;
        this.moonSize = 2.7 * sizeFactor;
        this.asteroidBeltSize = 1.2 * sizeFactor;
        this.marsSize = 5.3 * sizeFactor;
        this.jupiterSize = 38 * sizeFactor;
        this.saturnSize = 34 * sizeFactor;
        this.saturnRingSize = 0.2 * sizeFactor;
        this.uranusSize = 20 * sizeFactor;
        this.uranusRingSize = 0.16 * sizeFactor;
        this.neptuneSize = 19 * sizeFactor;
        this.plutoSize = 1.8 * sizeFactor;
       
        this.cameraSettings = {
            pos: { x:1500, y:1500, z:0 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 16,
            far: 18000
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
            
            this.entities = res.data.entities;
            this.sunEntity = this.entities.find(e => e.key === "sun");
            this.wormholeEntity = this.entities.find(e => e.key === "wormhole_sol");
            this.mercuryEntity = this.entities.find(e => e.key === "mercury");
            this.venusEntity = this.entities.find(e => e.key === "venus");
            this.earthEntity = this.entities.find(e => e.key === "earth");
            this.moonEntity = this.entities.find(e => e.key === "moon");
            this.marsEntity = this.entities.find(e => e.key === "mars");
            this.asteroidbeltEntity = this.entities.find(e => e.key === "asteroidbelt");
            this.jupiterEntity = this.entities.find(e => e.key === "jupiter");
            this.saturnEntity = this.entities.find(e => e.key === "saturn");
            this.saturnringEntity = this.entities.find(e => e.key === "saturnring");
            this.uranusEntity = this.entities.find(e => e.key === "uranus");
            this.uranusringEntity = this.entities.find(e => e.key === "uranusring");
            this.neptuneEntity = this.entities.find(e => e.key === "neptune");
            this.plutoEntity = this.entities.find(e => e.key === "pluto");
            this.kuiperbeltEntity = this.entities.find(e => e.key === "kuiperbelt");
            
            if (!this.sunEntity) throw new Error("Sun entity missing");
            if (!this.wormholeEntity) throw new Error("Wormhole entity missing");
            if (!this.mercuryEntity) throw new Error("Mercury entity missing");
            if (!this.venusEntity) throw new Error("Venus entity missing");
            if (!this.earthEntity) throw new Error("Earth entity missing");
            if (!this.moonEntity) throw new Error("Moon entity missing");
            if (!this.marsEntity) throw new Error("Mars entity missing");
            if (!this.asteroidbeltEntity) throw new Error("Asteroid Belt entity missing");
            if (!this.jupiterEntity) throw new Error("Jupiter entity missing");
            if (!this.saturnEntity) throw new Error("Saturn entity missing");
            if (!this.saturnringEntity) throw new Error("Saturn Ring entity missing");
            if (!this.uranusEntity) throw new Error("Uranus entity missing");
            if (!this.uranusringEntity) throw new Error("Uranus Ring entity missing");
            if (!this.neptuneEntity) throw new Error("Neptune entity missing");
            if (!this.plutoEntity) throw new Error("Pluto entity missing");
            if (!this.kuiperbeltEntity) throw new Error("Kuiper Belt entity missing");

            this.CreateObjects();
            this.Portals();
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

        // Create Wormhole
        this.wormhole = createEntity(this.wormholeEntity, {
            size: this.wormholeSize,
            posToParent: new THREE.Vector3(2000, 2000, 0),
            facingTo: new THREE.Vector3(0, 0, 0),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.wormhole);

        // Create Mercury
        this.mercury = createEntity(this.mercuryEntity, {
            size: this.mercurySize,
            posToParent: new THREE.Vector3(400, 0, 0),
            axialTilt: 0.034,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mercury);

        // Create venus
        this.venus = createEntity(this.venusEntity, {
            size: this.venusSize,
            posToParent: new THREE.Vector3(700, 0, 0),
            axialTilt: 177.36,
            orbitalTilt: 3.39,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.venus);

        // Create Earth
        this.earth = createEntity(this.earthEntity, {
            size: this.earthSize,
            posToParent: new THREE.Vector3(1000, 0, 0),
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
            posToParent: new THREE.Vector3(40, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create mars
        this.mars = createEntity(this.marsEntity, {
            size: this.marsSize,
            posToParent: new THREE.Vector3(1500, 0, 0),
            axialTilt: 25.19,
            orbitalTilt: 1.85,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mars);

        // Create asteroid belt
        this.asteroidBelt = createEntity(this.asteroidbeltEntity, {
            count: 6000,
            size: this.asteroidBeltSize,
            orbitFarRadius: 1900,
            orbitNearRadius: 1700,
            axialRotationSpeed: 0.0004,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
            thickness: 50,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.asteroidBelt);
        
        // Create jupiter
        this.jupiter = createEntity(this.jupiterEntity, {
            size: this.jupiterSize,
            posToParent: new THREE.Vector3(2600, 0, 0),
            axialTilt: 3.13,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.jupiter);
        
        // Create saturn
        this.saturn = createEntity(this.saturnEntity, {
            size: this.saturnSize,
            posToParent: new THREE.Vector3(3600, 0, 0),
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
            orbitFarRadius: 65,
            orbitNearRadius: 40,
            axialRotationSpeed: 0.005,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
            thickness: 0.6,   
            color: 0xdfe6f0,
            parent: this.saturn.axialFrame
        });
        this.objects.push(this.saturnRing);
        
        // Create uranus
        this.uranus = createEntity(this.uranusEntity, {
            size: this.uranusSize,
            posToParent: new THREE.Vector3(4600, 0, 0),
            axialTilt: 97.77,
            orbitalTilt: 0.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.72),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(30687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.uranus);

        // Create uranus ring
        this.uranusRing = createEntity(this.uranusringEntity, {
            count: 1800,
            size: this.uranusRingSize,
            orbitFarRadius: 50,
            orbitNearRadius: 42,
            axialRotationSpeed: 0.003,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.26),
            thickness: 0.3,   
            //color: 0x444444, // real, to dark
            color: 0xffffff, // not real
            parent: this.uranus.axialFrame
        });
        this.objects.push(this.uranusRing);
        
        // Create neptune
        this.neptune = createEntity(this.neptuneEntity, {
            size: this.neptuneSize,
            posToParent: new THREE.Vector3(5600, 0, 0),
            axialTilt: 28.32,
            orbitalTilt: 1.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.67),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(60190),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.neptune);
        
        // Create pluto
        this.pluto = createEntity(this.plutoEntity, {
            size: this.plutoSize,
            posToParent: new THREE.Vector3(6500, 0, 0),
            axialTilt: 119.61,
            orbitalTilt: 17.16,
            axialRotationSpeed: StarSystem.AxialRotationInDays(6.39),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(90560),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.pluto);

        // Create kuiper belt
        this.kuiperBelt = createEntity(this.kuiperbeltEntity, {
            count: 5000,
            size: this.asteroidBeltSize,
            orbitFarRadius: 7000,
            orbitNearRadius: 6000,
            axialRotationSpeed: 0.0003,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(100000),
            thickness: 250,
            color: 0xaaaaaa,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.kuiperBelt);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.wormhole, threshold: this.wormholeSize / 2, scene: "MilkyWay" },
            { obj: this.mercury, threshold: this.mercurySize * 5, scene: "MercuryOrbit" },
            { obj: this.venus, threshold: this.venusSize * 4, scene: "VenusOrbit" },
            { obj: this.earth, threshold: this.earthSize * 4, scene: "EarthOrbit" },
            { obj: this.moon, threshold: this.moonSize * 4, scene: "MoonOrbit" },
            { obj: this.mars, threshold: this.moonSize * 4, scene: "MarsOrbit" },
            { obj: this.jupiter, threshold: this.jupiterSize * 3, scene: "JupiterOrbit" },
        ];
    }

    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;

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