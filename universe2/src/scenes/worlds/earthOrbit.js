import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { SpaceStation } from "../../entities/spaceStation.js";
import { Star } from "../../entities/star.js";
import api from "../../utils/api";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=1
        
        const sizeFactor = 1;
        this.earthSize = 1000 * sizeFactor;
        
        this.cameraSettings = {
            pos: { x:-this.earthSize * 2, y:0, z:this.earthSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 40,
            far: 25000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this._tempVec = new THREE.Vector3();
        this.exitDistance = this.earthSize * 5;
        this.objects = [];
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            
            this.earthEntity = this.entities.find(e => e.key === "earth");
            
            if (!this.earthEntity) throw new Error("Earth entity missing");

            this.CreateObjects();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
    CreateObjects()
    {
        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: this.earthSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 8,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Create SomeSpaceStation
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1100, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.1),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create ISS
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1200, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.06),
            orbitalTilt: 51.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.06),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 270,
            posToParent: new THREE.Vector3(14000, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 3,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 100,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.earth.objectRoot,
            posToParent: new THREE.Vector3(15000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        if (!this.earth) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        const pos = this._tempVec;
        this.earth.objectRoot.getWorldPosition(pos);

        const distanceToEarth = this.camera.position.distanceTo(pos);
        if (distanceToEarth > this.exitDistance) {
            this.requestedScene = "SolarSystem";
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
