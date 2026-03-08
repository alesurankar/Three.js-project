import * as THREE from "three";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";
import { createEntity } from "../factories/entityFactory.js";
import { loadEntities } from "../utils/loadEntities.js"


export class TestScene
{
    // Step 10
    constructor(scene, camera, player, focus = {}) 
    {  
        console.log("Step 10: testScene.js: constructor");
        this.active = true;
        StarSystem.timeFactor=100

        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
       
        this.near = 16;
        this.far = 16000;
        this.cameraSettings = { near: this.near, far: this.far };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.player = player;
        this.focus = focus;
        this.objects = [];
        this.objectMap = {};
    }

    // Step 11
    async Init() 
    {
        console.log("Step 11: testScene.js: async Init() ");
        if (!this.active) return;
        const { requiredKeys, scaleMap } = this.GetEntityConfig();

        try {
            const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
            this.entityMap = entityMap;
            this.sizeMap = sizeMap;
            this.CreateObjects();
            this.PlayerEntryPosition();
            if (this.SetExitCondition) {
                this.SetExitCondition();
            }
            if (this.DefinePortals) {
                this.DefinePortals();
            }
        } 
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }

    GetEntityConfig() 
    {
        const requiredKeys = [
            "sun",
            "earth",
            "moon",
            "saturn",
            "saturn_ring",
            "asteroid_belt",
            "probe1",
        ];

        const scaleMap = {
            sun: this.REGION_SIZE_SCALE,
            earth: this.LOCAL_SIZE_SCALE,
            moon: this.LOCAL_SIZE_SCALE,
            saturn: this.LOCAL_SIZE_SCALE,
            saturn_ring: this.INNER_SIZE_SCALE,
            asteroid_belt: this.INNER_SIZE_SCALE
        };      
        return { requiredKeys, scaleMap };
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
        
        // Create Earth
        this.earth = createEntity(this.entityMap.earth, {
            size: this.sizeMap.earth,
            posToParent: new THREE.Vector3(this.sizeMap.sun * 5, 0, 0),
            axialTilt: this.entityMap.earth.axialTilt,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.objectMap[this.entityMap.earth.parentKey].objectRoot,
        });
        this.objects.push(this.earth);
        this.objectMap[this.entityMap.earth.key] = this.earth;

        // Create moon
        this.moon = createEntity(this.entityMap.moon, {
            size: this.sizeMap.moon,
            posToParent: new THREE.Vector3(this.sizeMap.earth * 3, 0, 0),
            axialTilt: this.entityMap.moon.axialTilt,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.objectMap[this.entityMap.moon.parentKey].objectRoot,
        });
        this.objects.push(this.moon);
        this.objectMap[this.entityMap.moon.key] = this.moon;

        // Create asteroid belt
        this.asteroid_belt = createEntity(this.entityMap.asteroid_belt, {
            count: 6000,
            size: this.sizeMap.asteroid_belt,
            orbitFarRadius: this.sizeMap.sun * 16,
            orbitNearRadius: this.sizeMap.sun * 14,
            axialRotationSpeed: 0.0004,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
            thickness: 50,
            parent: this.objectMap[this.entityMap.earth.parentKey].objectRoot,
        });
        this.objects.push(this.asteroid_belt);
        this.objectMap[this.entityMap.asteroid_belt.key] = this.asteroid_belt;
        
        // Create saturn
        this.saturn = createEntity(this.entityMap.saturn, {
            size: this.sizeMap.saturn,
            posToParent: new THREE.Vector3(this.sizeMap.sun  * 8, 0, 0),
            axialTilt: this.entityMap.saturn.axialTilt,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.objectMap[this.entityMap.saturn.parentKey].objectRoot,
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
            parent: this.objectMap[this.entityMap.saturn_ring.parentKey].axialFrame,
        });
        this.objects.push(this.saturn_ring);
        this.objectMap[this.entityMap.saturn_ring.key] = this.saturn_ring;

        this.probe1 = createEntity(this.entityMap.probe1, {
            size: 0.3,
            parent: this.sun.objectRoot
        });
        this.objects.push(this.probe1);
        this.objectMap[this.entityMap.probe1.key] = this.probe1;
    }

    // Step 13
    PlayerEntryPosition() 
    {
        const entryPos = this.earth.GetPosition();
        const targetPos = this.sun.GetPosition();

        const entry = new THREE.Vector3(entryPos.x, entryPos.y, entryPos.z);
        const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

        const difference = new THREE.Vector3().subVectors(target, entry);
        
        const distance = new THREE.Vector3(
            Math.abs(difference.x),
            Math.abs(difference.y),
            Math.abs(difference.z)
        );

        console.log("Setting player position to:", entry.x, entry.y, entry.z);
        this.player.SetPosition( 2* this.sizeMap.earth + entry.x, 2* this.sizeMap.earth + entry.y, 2* this.sizeMap.earth + entry.z);

        console.log("Setting player facing direction:", 2*distance.x, 2*distance.y, 2*distance.z);
        this.player.FaceTarget(2*distance.x, 2*distance.y, 2*distance.z);
    }

    Update(dt) 
    {
        if (!this.sun) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (this.CheckSceneTransition) {
            this.CheckSceneTransition();
        }
    }

    Dispose() 
    {
        this.active = false;
        this.objects.forEach(obj => obj?.Dispose());
        this.objects = [];
        if (this.sceneTriggers) {
            this.sceneTriggers = [];
        }

        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
        // Clear objectMap to remove references
        this.objectMap = {};
    }
}