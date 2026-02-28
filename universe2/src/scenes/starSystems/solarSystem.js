import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class SolarSystem 
{
    constructor(scene, camera, params = {}) 
    {
        this.params = params;
        this.overrideCamera = false;
        this.active = true;
        StarSystem.timeFactor=100

        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
        
        this.near = 12;
        this.far = 16000;
        this.cameraSettings = {
            pos: { x:1500, y:1500, z:0 },
            lookAt: { x:0, y:0, z:0 },
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
            "sun",
            "mercury",
            "venus",
            "earth",
            "moon",
            "mars",
            "asteroid_belt",
            "jupiter",
            "saturn",
            "saturn_ring",
            "uranus",
            "uranus_ring",
            "neptune",
            "pluto",
            "kuiper_belt"
        ];

        const scaleMap = {
            sun: this.REGION_SIZE_SCALE,
            mercury: this.LOCAL_SIZE_SCALE,
            venus: this.LOCAL_SIZE_SCALE,
            earth: this.LOCAL_SIZE_SCALE,
            moon: this.LOCAL_SIZE_SCALE,
            mars: this.LOCAL_SIZE_SCALE,
            asteroid_belt: this.INNER_SIZE_SCALE,
            jupiter: this.LOCAL_SIZE_SCALE,
            saturn: this.LOCAL_SIZE_SCALE,
            saturn_ring: this.INNER_SIZE_SCALE,
            uranus: this.LOCAL_SIZE_SCALE,
            uranus_ring: this.INNER_SIZE_SCALE,
            neptune: this.LOCAL_SIZE_SCALE,
            pluto: this.LOCAL_SIZE_SCALE,
            kuiper_belt: this.INNER_SIZE_SCALE
        };

        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.exitDistance = this.sizeMap.sun * 100;
            this.CreateObjects();
            this.Portals();

            if (this.params?.focus) {
                // console.log("Init focus param:", this.params.focus);
                // console.log("Calling PositionEntryCamera via requestAnimationFrame...");
                requestAnimationFrame(() => this.PositionEntryCamera());
            }
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }

    CreateObjects()
    {
        // Create Sun
        this.sun = createEntity(this.entityMap.sun, {
            size: this.sizeMap.sun,
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

        // Create Mercury
        this.mercury = createEntity(this.entityMap.mercury, {
            size: this.sizeMap.mercury,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 4, 0, 0),
            axialTilt: 0.034,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mercury);

        // Create venus
        this.venus = createEntity(this.entityMap.venus, {
            size: this.sizeMap.venus,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 7, 0, 0),
            axialTilt: 177.36,
            orbitalTilt: 3.39,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.venus);

        // Create Earth
        this.earth = createEntity(this.entityMap.earth, {
            size: this.sizeMap.earth,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 10, 0, 0),
            axialTilt: 23.44,
            orbitalTilt: 0,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.earth);

        // Create moon
        this.moon = createEntity(this.entityMap.moon, {
            size: this.sizeMap.moon,
            posToParent: new THREE.Vector3(this.sizeMap.earth * 10, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create mars
        this.mars = createEntity(this.entityMap.mars, {
            size: this.sizeMap.mars,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 15, 0, 0),
            axialTilt: 25.19,
            orbitalTilt: 1.85,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mars);

        // Create asteroid belt
        this.asteroid_belt = createEntity(this.entityMap.asteroid_belt, {
            count: 5000,
            size: this.sizeMap.asteroid_belt,
            orbitFarRadius: this.sizeMap.sun * 19,
            orbitNearRadius: this.sizeMap.sun * 17,
            axialRotationSpeed: 0.0004,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
            thickness: 50,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.asteroid_belt);
        
        // Create jupiter
        this.jupiter = createEntity(this.entityMap.jupiter, {
            size: this.sizeMap.jupiter,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 26, 0, 0),
            axialTilt: 3.13,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.jupiter);
        
        // Create saturn
        this.saturn = createEntity(this.entityMap.saturn, {
            size: this.sizeMap.saturn,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 36, 0, 0),
            axialTilt: 26.73,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.saturn);

        // Create saturn ring
        this.saturn_ring = createEntity(this.entityMap.saturn_ring, {
            count: 4000,
            size: this.sizeMap.saturn_ring,
            orbitFarRadius: this.sizeMap.saturn * 1.8,
            orbitNearRadius: this.sizeMap.saturn + this.sizeMap.saturn / 6,
            axialRotationSpeed: 0.005,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
            thickness: 0.6,   
            color: 0xdfe6f0,
            parent: this.saturn.axialFrame
        });
        this.objects.push(this.saturn_ring);
        
        // Create uranus
        this.uranus = createEntity(this.entityMap.uranus, {
            size: this.sizeMap.uranus,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 46, 0, 0),
            axialTilt: 97.77,
            orbitalTilt: 0.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.72),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(30687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.uranus);

        // Create uranus ring
        this.uranus_ring = createEntity(this.entityMap.uranus_ring, {
            count: 1800,
            size: this.sizeMap.uranus_ring,
            orbitFarRadius: this.sizeMap.uranus * 2.3,
            orbitNearRadius: this.sizeMap.uranus * 2,
            axialRotationSpeed: 0.003,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.26),
            thickness: 0.3,   
            //color: 0x444444, // real, to dark
            color: 0xffffff, // not real
            parent: this.uranus.axialFrame
        });
        this.objects.push(this.uranus_ring);
        
        // Create neptune
        this.neptune = createEntity(this.entityMap.neptune, {
            size: this.sizeMap.neptune,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 56, 0, 0),
            axialTilt: 28.32,
            orbitalTilt: 1.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.67),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(60190),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.neptune);
        
        // Create pluto
        this.pluto = createEntity(this.entityMap.pluto, {
            size: this.sizeMap.pluto,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 65, 0, 0),
            axialTilt: 119.61,
            orbitalTilt: 17.16,
            axialRotationSpeed: StarSystem.AxialRotationInDays(6.39),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(90560),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.pluto);

        // Create kuiper belt
        this.kuiper_belt = createEntity(this.entityMap.kuiper_belt, {
            count: 5000,
            size: this.sizeMap.kuiper_belt,
            orbitFarRadius: this.sizeMap.sun * 70,
            orbitNearRadius: this.sizeMap.sun * 60,
            axialRotationSpeed: 0.0003,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(100000),
            thickness: 250,
            color: 0xaaaaaa,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.kuiper_belt);
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.mercury, threshold: this.sizeMap.mercury * 5, scene: "MercuryOrbit" },
            { obj: this.venus, threshold: this.sizeMap.venus * 4, scene: "VenusOrbit" },
            { obj: this.earth, threshold: this.sizeMap.earth * 4, scene: "EarthOrbit" },
            { obj: this.moon, threshold: this.sizeMap.moon * 4, scene: "MoonOrbit" },
            { obj: this.mars, threshold: this.sizeMap.mars * 4, scene: "MarsOrbit" },
            { obj: this.jupiter, threshold: this.sizeMap.jupiter * 3, scene: "JupiterOrbit" },
            { obj: this.saturn, threshold: this.sizeMap.saturn * 3, scene: "SaturnOrbit" },
        ];
    }

    PositionEntryCamera()
    {
        if (!this.params?.focus) {
            console.log("PositionEntryCamera skipped: no focus param");
            return;
        }

        const target = this[this.params.focus];
        if (!target || !target.objectRoot) {
            console.warn(`PositionEntryCamera: target for focus "${this.params.focus}" not found`);
            return;
        }

        // Force update on all matrices before computing world position
        this.scene.updateMatrixWorld(true);

        const pos = new THREE.Vector3();
        target.objectRoot.getWorldPosition(pos);

        const offset =this.sizeMap[this.params.focus] * 8;

        this.camera.position.set(
            pos.x + offset,
            pos.y + offset * 0.4,
            pos.z + offset
        );
        this.camera.lookAt(pos);
        this.overrideCamera = true;
    }
    
    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        this.sun.objectRoot.getWorldPosition(pos);
        const distanceToParent = this.camera.position.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "MilkyWay";
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