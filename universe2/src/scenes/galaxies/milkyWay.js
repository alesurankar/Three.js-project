import * as THREE from "three";
import { BlackHole } from "../../entities/blackHole.js";
import { Star } from "../../entities/star.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import api from "../../utils/api";


export class MilkyWay
{
    constructor(scene, camera) 
    {
        this.active = true;
        StarSystem.timeFactor=250
        
        const sizeFactor = 4;
        this.SMBHSize = 100 * sizeFactor;
        this.sunSize = 0.1 * sizeFactor;
        this.alphaCentauriASize = 0.08 * sizeFactor;
        this.alphaCentauriBSize = 0.08 * sizeFactor;
        this.proximaCentauri = 0.07 * sizeFactor;
        
        const starNum = 2000;
        this.redDwarfNum = starNum * 0.72;
        this.K_typeNum = starNum * 0.14;
        this.G_typeNum = starNum * 0.08;
        this.F_typeNum = starNum * 0.03;
        this.A_typeNum = starNum * 0.007;
        this.redMasiveNum = starNum * 0.0006;

        this.cameraSettings = {
            pos: { x:-1000, y:1000, z:1000 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("GalaxyBox");
        this.camera = camera;

        this.galaxyRadius = 60000;
        this.baseSpeed = StarSystem.OrbitalRotationInDays(250);

        // Scale constants
        this.SIZE_SCALE = 4;
        this.DISTANCE_SCALE = 0.1; // 1 unit = 1 light-year
        this.LOCAL_SCALE = 200; // scale down small interstellar distances
        this.sunPos = new THREE.Vector3(26700 * this.DISTANCE_SCALE, 0, 0);

        this.objects = [];
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    async init() 
    {
        try {
            if (!this.active) return;

            const res = await api.get("/entities");
            this.entities = res.data.entities;
            

            this.CreateObjects();
            this.Portals();
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }
    
     CreateObjects()
    {
        // Create SMBH
        this.SMBH = new BlackHole({
            name: "SMBH",
            size: this.SMBHSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialRotationSpeed: this.baseSpeed * this.DISTANCE_SCALE * 30,
        });
        this.scene.add(this.SMBH.orbitPivot);
        this.objects.push(this.SMBH);

        // Create Sun
        this.sun = new Star({
            size: this.sunSize,
            renderMode: "points",
            posToParent: this.sunPos,
            orbitalSpeed: this.baseSpeed,
            detail: 0,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.sun);

        this.alphaCentauriA = new Star({
            size: this.alphaCentauriASize,
            renderMode: "points",
            posToParent: new THREE.Vector3(this.sunPos.x + 3.5*this.LOCAL_SCALE, this.sunPos.y - 1.2*this.LOCAL_SCALE + 0.02*this.LOCAL_SCALE, this.sunPos.z-1.0*this.LOCAL_SCALE + 0.02*this.LOCAL_SCALE),
            orbitalSpeed: this.baseSpeed,
            detail: 0,
            temperature: 5790,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.alphaCentauriA);

        this.alphaCentauriB = new Star({
            size: this.alphaCentauriBSize,
            renderMode: "points",
            posToParent: new THREE.Vector3(this.sunPos.x + 3.5*this.LOCAL_SCALE, this.sunPos.y - 1.2*this.LOCAL_SCALE - 0.02*this.LOCAL_SCALE, this.sunPos.z - 1.0*this.LOCAL_SCALE + 0.02*this.LOCAL_SCALE),
            orbitalSpeed: this.baseSpeed,
            detail: 0,
            temperature: 5200,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.alphaCentauriB);

        this.proximaCentauri = new Star({
            size: this.proximaCentauri,
            renderMode: "points",
            posToParent: new THREE.Vector3(this.sunPos.x + 3.5*this.LOCAL_SCALE, this.sunPos.y - 1.2*this.LOCAL_SCALE, this.sunPos.z - 1.05*this.LOCAL_SCALE - 0.02*this.LOCAL_SCALE),
            orbitalSpeed: this.baseSpeed,
            detail: 0,
            temperature: 3000,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.proximaCentauri);

        // Create redDwarfs
        for (let i = 0, z = this.redDwarfNum; i < this.redDwarfNum; i++, z--) {
            const size = this.randomBetween(0.01 * this.SIZE_SCALE, 0.05 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `redDwarf${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(2500, 3300),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create K_type stars
        for (let i = 0, z = this.K_typeNum; i < this.K_typeNum; i++, z--) {
            const size = this.randomBetween(0.05 * this.SIZE_SCALE, 0.09 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `K_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(3300, 4600),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }  

        // Create G_type stars
        for (let i = 0, z = this.G_typeNum; i < this.G_typeNum; i++, z--) {
            const size = this.randomBetween(0.09 * this.SIZE_SCALE, 0.12 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `G_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(4600, 6200),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create F_type stars
        for (let i = 0, z = this.F_typeNum; i < this.F_typeNum; i++, z--) {
            const size = this.randomBetween(0.1 * this.SIZE_SCALE, 0.2 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `F_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(6200, 7500),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create A_type stars
        for (let i = 0, z = this.A_typeNum; i < this.A_typeNum; i++, z--) {
            const size = this.randomBetween(0.2 * this.SIZE_SCALE, 0.5 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `A_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(7500, 10000),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create redMasive stars
        for (let i = 0, z = this.redMasiveNum; i < this.redMasiveNum; i++, z--) {
            const size = this.randomBetween(0.5 * this.SIZE_SCALE, 1 * this.SIZE_SCALE);
            const radius = this.randomBetween(this.DISTANCE_SCALE * 700, this.DISTANCE_SCALE * this.galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = this.baseSpeed * Math.sqrt((this.DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `redMasive${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(2000, 3000),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   
    }

    Portals()
    {
        this.sceneTriggers = [
            { obj: this.sun, threshold: this.sunSize * 100, scene: "SolarSystem" },
            { obj: this.alphaCentauriA, threshold: this.alphaCentauriASize * 100, scene: "AlphaCenturySystem" },
        ];
    }

    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        for (const trigger of this.sceneTriggers) {
            const worldPos = new THREE.Vector3();
            trigger.obj.objectRoot.getWorldPosition(worldPos);
            const distance = this.camera.position.distanceTo(worldPos);
            if (distance <= trigger.threshold) {
                this.requestedScene = trigger.scene;
                break; 
            }
        }
    }

    Dispose() 
    {
        this.active = false;
        for (const obj of this.objects) {
            obj.Dispose();
        }
        this.objects = [];
        this.sceneTriggers = [];
        
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}