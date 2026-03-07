import * as THREE from "three";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { createEntity } from "../../factories/entityFactory.js";
import { loadEntities } from "../../utils/loadEntities.js"


export class SolarSystem 
{
    constructor(scene, camera, player, params = {}) 
    {
        this.active = true;
        StarSystem.timeFactor=100

        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
        
        this.near = 12;
        this.far = 16000;
        this.cameraSettings = { near: this.near,far: this.far };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.player = player;
        this._tempVec = new THREE.Vector3();
        this.objects = [];
        this.objectMap = {};
    }

    async Init() 
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
            const sunPos = this.sun.GetPosition();
            this.player.SetPosition(sunPos.x, sunPos.y, sunPos.z);
            this.player.FaceTarget(this.mercury.GetPosition());
            this.Portals();

            if (this.params?.focus) {
                // console.log("Init focus param:", this.params.focus);
                // console.log("Calling PositionEntryCamera via requestAnimationFrame...");
                requestAnimationFrame(() => this.PlayerEntryPosition());
            }
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
        // Create Sun
        this.sun = createEntity(this.entityMap.sun, {
            size: this.sizeMap.sun,
            lightType: "pointLight",
            axialTilt: this.entityMap.sun.axialTilt,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            detail: 4,
            temperature: 5778,
            hasTexture: true,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);
        this.objectMap[this.entityMap.sun.key] = this.sun;

        // Create Mercury
        this.mercury = createEntity(this.entityMap.mercury, {
            size: this.sizeMap.mercury,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 4, 0, 0),
            axialTilt: this.entityMap.mercury.axialTilt,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.objectMap[this.entityMap.mercury.parentKey]?.objectRoot,
        });
        this.objects.push(this.mercury);
        this.objectMap[this.entityMap.mercury.key] = this.mercury;

        // Create venus
        this.venus = createEntity(this.entityMap.venus, {
            size: this.sizeMap.venus,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 7, 0, 0),
            axialTilt: this.entityMap.venus.axialTilt,
            orbitalTilt: 3.39,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            parent: this.objectMap[this.entityMap.venus.parentKey]?.objectRoot,
        });
        this.objects.push(this.venus);
        this.objectMap[this.entityMap.venus.key] = this.venus;

        // Create Earth
        this.earth = createEntity(this.entityMap.earth, {
            size: this.sizeMap.earth,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 10, 0, 0),
            axialTilt: this.entityMap.earth.axialTilt,
            orbitalTilt: 0,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.objectMap[this.entityMap.earth.parentKey]?.objectRoot,
        });
        this.objects.push(this.earth);
        this.objectMap[this.entityMap.earth.key] = this.earth;

        // Create moon
        this.moon = createEntity(this.entityMap.moon, {
            size: this.sizeMap.moon,
            posToParent: new THREE.Vector3(this.sizeMap.earth * 10, 0, 0),
            axialTilt: this.entityMap.moon.axialTilt,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.objectMap[this.entityMap.moon.parentKey]?.objectRoot,
        });
        this.objects.push(this.moon);
        this.objectMap[this.entityMap.moon.key] = this.moon;

        // Create mars
        this.mars = createEntity(this.entityMap.mars, {
            size: this.sizeMap.mars,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 15, 0, 0),
            axialTilt: this.entityMap.mars.axialTilt,
            orbitalTilt: 1.85,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            parent: this.objectMap[this.entityMap.mars.parentKey]?.objectRoot,
        });
        this.objects.push(this.mars);
        this.objectMap[this.entityMap.mars.key] = this.mars;

        // Create asteroid belt
        this.asteroid_belt = createEntity(this.entityMap.asteroid_belt, {
            count: 5000,
            size: this.sizeMap.asteroid_belt,
            orbitFarRadius: this.sizeMap.sun * 19,
            orbitNearRadius: this.sizeMap.sun * 17,
            axialRotationSpeed: 0.0004,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
            thickness: 50,
            parent: this.objectMap[this.entityMap.asteroid_belt.parentKey]?.objectRoot,
        });
        this.objects.push(this.asteroid_belt);
        this.objectMap[this.entityMap.asteroid_belt.key] = this.asteroid_belt;
        
        // Create jupiter
        this.jupiter = createEntity(this.entityMap.jupiter, {
            size: this.sizeMap.jupiter,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 26, 0, 0),
            axialTilt: this.entityMap.jupiter.axialTilt,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            parent: this.objectMap[this.entityMap.jupiter.parentKey]?.objectRoot,
        });
        this.objects.push(this.jupiter);
        this.objectMap[this.entityMap.jupiter.key] = this.jupiter;
        
        // Create saturn
        this.saturn = createEntity(this.entityMap.saturn, {
            size: this.sizeMap.saturn,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 36, 0, 0),
            axialTilt: this.entityMap.saturn.axialTilt,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.objectMap[this.entityMap.saturn.parentKey]?.objectRoot,
        });
        this.objects.push(this.saturn);
        this.objectMap[this.entityMap.saturn.key] = this.saturn;

        // Create saturn ring
        this.saturn_ring = createEntity(this.entityMap.saturn_ring, {
            count: 4000,
            size: this.sizeMap.saturn_ring,
            orbitFarRadius: this.sizeMap.saturn * 2,
            orbitNearRadius: this.sizeMap.saturn + this.sizeMap.saturn / 5,
            axialRotationSpeed: 0.005,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
            thickness: 0.6,   
            color: 0xdfe6f0,
            parent: this.objectMap[this.entityMap.saturn_ring.parentKey]?.axialFrame,
        });
        this.objects.push(this.saturn_ring);
        this.objectMap[this.entityMap.saturn_ring.key] = this.saturn_ring;
        
        // Create uranus
        this.uranus = createEntity(this.entityMap.uranus, {
            size: this.sizeMap.uranus,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 46, 0, 0),
            axialTilt: this.entityMap.uranus.axialTilt,
            orbitalTilt: 0.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.72),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(30687),
            parent: this.objectMap[this.entityMap.uranus.parentKey]?.objectRoot,
        });
        this.objects.push(this.uranus);
        this.objectMap[this.entityMap.uranus.key] = this.uranus;

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
            parent: this.objectMap[this.entityMap.uranus_ring.parentKey]?.axialFrame,
        });
        this.objects.push(this.uranus_ring);
        this.objectMap[this.entityMap.uranus_ring.key] = this.uranus_ring;
        
        // Create neptune
        this.neptune = createEntity(this.entityMap.neptune, {
            size: this.sizeMap.neptune,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 56, 0, 0),
            axialTilt: this.entityMap.neptune.axialTilt,
            orbitalTilt: 1.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.67),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(60190),
            parent: this.objectMap[this.entityMap.neptune.parentKey]?.objectRoot,
        });
        this.objects.push(this.neptune);
        this.objectMap[this.entityMap.neptune.key] = this.neptune;
        
        // Create pluto
        this.pluto = createEntity(this.entityMap.pluto, {
            size: this.sizeMap.pluto,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 65, 0, 0),
            axialTilt: this.entityMap.pluto.axialTilt,
            orbitalTilt: 17.16,
            axialRotationSpeed: StarSystem.AxialRotationInDays(6.39),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(90560),
            parent: this.objectMap[this.entityMap.pluto.parentKey]?.objectRoot,
        });
        this.objects.push(this.pluto);
        this.objectMap[this.entityMap.pluto.key] = this.pluto;

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
            parent: this.objectMap[this.entityMap.kuiper_belt.parentKey]?.objectRoot,
        });
        this.objects.push(this.kuiper_belt);
        this.objectMap[this.entityMap.kuiper_belt.key] = this.kuiper_belt;
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

    PlayerEntryPosition()
    {
        if (!this.params?.focus) {
            console.log("PlayerEntryPosition skipped: no focus param");
            return;
        }

        const target = this[this.params.focus];
        if (!target || !target.objectRoot) {
            console.warn(`PlayerEntryPosition: target for focus "${this.params.focus}" not found`);
            return;
        }

        // Force update on all matrices before computing world position
        this.scene.updateMatrixWorld(true);

        const targetPos = new THREE.Vector3();
        target.objectRoot.getWorldPosition(targetPos);

        const offset = this.sizeMap[this.params.focus] * 8;

        // Compute desired player position
        const playerPos = new THREE.Vector3(
            targetPos.x + offset,
            targetPos.y + offset * 0.4,
            targetPos.z + offset
        );

        // Move the player
        if (this.player) {
            this.player.SetPosition(playerPos.x, playerPos.y, playerPos.z);

            // Make the player look at the target
            this.player.objectRoot.lookAt(targetPos);
        } 
        else {
            console.warn("PlayerEntryPosition: player is not defined");
        }
    }
    
    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
        if (!this.sun) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (!this.sceneTriggers) return;

        const pos = this._tempVec;
        const playerPos = this.player.objectRoot.position;
        this.sun.objectRoot.getWorldPosition(pos);

        const distanceToParent = playerPos.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "MilkyWay";
            this.transitionFrom = "solar_system";
        }

        for (const trigger of this.sceneTriggers) {
            trigger.obj.objectRoot.getWorldPosition(pos);
            const distance = playerPos.distanceTo(pos);
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
        // Clear objectMap to remove references
        this.objectMap = {};
    }
}