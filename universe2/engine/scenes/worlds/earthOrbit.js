import * as THREE from "three";
import { createEntity } from "../../factories/entityFactory.js";
import { BaseScene } from "../baseScene.js";


export class EarthOrbit extends BaseScene
{
    constructor(scene, camera, player, focus = {}) 
    {
        super(scene, camera, player, focus);
        this.timeFactor=1
        
        this.SIZE_SCALE = 10;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 50 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;

        this.near = 30;
        this.far = 30000;
        this.cameraSettings = { near: this.near, far: this.far };
    }

    GetEntityConfig() 
    {
        const requiredKeys = [
            "sun",
            "earth",
            "moon",
            "probe1",
            "probe2",
        ];

        const scaleMap = {
            sun: this.REGION_SIZE_SCALE,
            earth: this.LOCAL_SIZE_SCALE,
            moon: this.LOCAL_SIZE_SCALE,
            probe1: this.INNER_SIZE_SCALE,
            probe2: this.INNER_SIZE_SCALE,
        };
        return { requiredKeys, scaleMap };
    }

    CreateObjects()
    {
        // Create Sun
        this.sun = createEntity(this.entityMap.sun, {
            size: this.sizeMap.sun,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            temperature: 5778,
            orbitalTilt: 0,
            orbitalPeriod: 0,
            sizeAtenuation: false,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);
        this.objectMap[this.entityMap.sun.key] = this.sun;

        // Create Earth
        this.earth = createEntity(this.entityMap.earth, {
            size: this.sizeMap.earth,
            detail: 6,
            posToParent: new THREE.Vector3(this.far - this.sizeMap.earth * 20, 0, 0),  // TO CHANGE
            hasClouds: true,
            parent: this.objectMap[this.entityMap.earth.parentKey].objectRoot,
        });
        this.objects.push(this.earth);
        this.objectMap[this.entityMap.earth.key] = this.earth;
        this.primaryEntity = this.earth;
        
        // Create moon
        this.moon = createEntity(this.entityMap.moon, {
            size: this.sizeMap.moon,
            posToParent: new THREE.Vector3(this.sizeMap.earth * 20, 0, this.sizeMap.earth * 20),
            detail: 3,
            parent: this.objectMap[this.entityMap.moon.parentKey].objectRoot,
        });
        this.objects.push(this.moon);
        this.objectMap[this.entityMap.moon.key] = this.moon;

        // Constants for simple orbital speed scaling (not physically perfect)
        const baseSpeed1 = 0.03; // base orbital period for probe1
        const baseSpeed2 = 0.025; // base orbital period for probe2

        // --- Create 100 probe1 (prograde, slightly tilted) ---
        for (let i = 0; i < 100; i++) {
            const radius = this.sizeMap.earth * 1.3 + Math.random() *  this.sizeMap.earth * 0.3;
            const longitude = Math.random() * Math.PI * 2;
            const latitude = (Math.random() - 0.5) * 0.6;

            const x = radius * Math.cos(longitude) * Math.cos(latitude)
            const y = radius * Math.sin(latitude)
            const z = radius * Math.sin(longitude) * Math.cos(latitude)

            const probe = createEntity(this.entityMap.probe1, {
                size: 0.3,
                posToParent: new THREE.Vector3(x, y, z),
                pitch: 0,
                yaw: longitude + Math.PI / 2,
                roll: 0,
                orbitRadius: radius,
                axialPeriod: (0.01 + Math.random() * 0.01),
                orbitalTilt: latitude * (180 / Math.PI),
                orbitalPeriod: (baseSpeed1 + Math.random() * 0.01),
                parent: this.earth.objectRoot
            });
            this.objects.push(probe);
        }

        // --- Create 100 probe2 (higher orbit, prograde) ---
        for (let i = 0; i < 100; i++) {
            const radius = this.sizeMap.earth * 1.2 + Math.random() *  this.sizeMap.earth * 0.2;
            const longitude = Math.random() * Math.PI * 2;
            const latitude = (Math.random() - 0.5) * 0.6;

            const x = radius * Math.cos(longitude) * Math.cos(latitude)
            const y = radius * Math.sin(latitude)
            const z = radius * Math.sin(longitude) * Math.cos(latitude)

            const probe = createEntity(this.entityMap.probe2, {
                size: 80,
                posToParent: new THREE.Vector3(-x, -y, -z),
                pitch: 0,
                yaw: longitude + Math.PI / 2,
                roll: 0,
                orbitRadius: radius,
                axialPeriod: (0.02 + Math.random() * 0.02),
                orbitalTilt: latitude * (180 / Math.PI),
                orbitalPeriod: (baseSpeed2 + Math.random() * 0.02),
                parent: this.earth.objectRoot
            });
            this.objects.push(probe);
        }

        // Assign light target
        this.sun.light.target = this.primaryEntity.objectRoot;
    }

    PlayerEntryPosition() 
    {
        const entryPos = this.primaryEntity.GetPosition();
        const targetPos = this.sun.GetPosition();

        const entry = new THREE.Vector3(entryPos.x, entryPos.y, entryPos.z);
        const target = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

        const difference = new THREE.Vector3().subVectors(target, entry);
        
        const distance = new THREE.Vector3(
            Math.abs(difference.x),
            Math.abs(difference.y),
            Math.abs(difference.z)
        );
        const scale = this.sizeMap.earth;   // TO CHANGE

        this.player.SetPosition(2*scale + entry.x, 2*scale + entry.y, 2*scale + entry.z);
        this.player.FaceTarget(-2*distance.x, 2*distance.y, 2*distance.z);
    }

    SetExitCondition() 
    {
        this.exitDistance = this.sizeMap.earth * 28;  // TO CHANGE
    }

    DefinePortals()
    {
        this.sceneTriggers = [
            { obj: this.moon, threshold: this.sizeMap.moon * 24, scene: "MoonOrbit" },
        ];
    }

    CheckSceneTransition() 
    {
        const pos = this._tempVec;
        const playerPos = this.player.objectRoot.position;
        this.primaryEntity.objectRoot.getWorldPosition(pos);

        const distanceToParent = playerPos.distanceTo(pos);
        if (distanceToParent > this.exitDistance) {
            this.requestedScene = "SolarSystem"; // TO CHANGE
            this.transitionFrom = "earth";       // TO CHANGE
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
}
