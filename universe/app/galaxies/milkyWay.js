import * as THREE from "three";
import { BlackHole } from "../entities/blackHole.js";
import { Star } from "../entities/star.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";

export class MilkyWay
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=250

        this.cameraSettings = {
            pos_x: -1000,
            pos_y: 1000,
            pos_z: 1000,
            look_x: 0,
            look_y: 0,
            look_z: 0,
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("GalaxyBox");
        this.camera = camera;
        this.requestedScene = null;

        const galaxyRadius = 100000;

        const baseSpeed = StarSystem.OrbitalRotationInDays(250);
        const starNum = 6000;
        const redDwarfNum = starNum * 0.72;
        const K_typeNum = starNum * 0.14;
        const G_typeNum = starNum * 0.08;
        const F_typeNum = starNum * 0.03;
        const A_typeNum = starNum * 0.007;
        const redMasiveNum = starNum * 0.0006;
        this.stars = [];

        // Scale constants
        const SIZE_SCALE = 4;
        const DISTANCE_SCALE = 0.1; // 1 unit = 1 light-year
        const LOCAL_SCALE = 200; // scale down small interstellar distances
        const sunPos = new THREE.Vector3(26700 * DISTANCE_SCALE, 0, 0);

        // Create SMBH
        this.SMBH = new BlackHole({
            name: "SMBH",
            size: 100 * SIZE_SCALE,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialRotationSpeed: baseSpeed,
        });
        this.scene.add(this.SMBH.orbitPivot);

        // Create Sun
        this.sun = new Star({
            size: 0.1 * SIZE_SCALE,
            renderMode: "points",
            posToParent: sunPos,
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.stars.push(this.sun);

        this.alphaCentauriA = new Star({
            size: 0.08 * SIZE_SCALE,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE + 0.02*LOCAL_SCALE, sunPos.z-1.0*LOCAL_SCALE + 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5790,
            parent: this.SMBH.objectRoot,
        });
        this.stars.push(this.alphaCentauriA);

        this.alphaCentauriB = new Star({
            size: 0.08 * SIZE_SCALE,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE - 0.02*LOCAL_SCALE, sunPos.z - 1.0*LOCAL_SCALE + 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5200,
            parent: this.SMBH.objectRoot,
        });
        this.stars.push(this.alphaCentauriB);

        this.proximaCentauri = new Star({
            size: 0.07 * SIZE_SCALE,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE, sunPos.z - 1.05*LOCAL_SCALE - 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 3000,
            parent: this.SMBH.objectRoot,
        });
        this.stars.push(this.proximaCentauri);

        // // Create redDwarfs
        // for (let i = 0, z = redDwarfNum; i < redDwarfNum; i++, z--) {
        //     const size = this.randomBetween(0.01, 0.05);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `redDwarf${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(2500, 3300),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }   

        // // Create K_type stars
        // for (let i = 0, z = K_typeNum; i < K_typeNum; i++, z--) {
        //     const size = this.randomBetween(0.05, 0.09);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `K_type${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(3300, 4600),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }  

        // // Create G_type stars
        // for (let i = 0, z = G_typeNum; i < G_typeNum; i++, z--) {
        //     const size = this.randomBetween(0.09, 0.12);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `G_type${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(4600, 6200),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }   

        // // Create F_type stars
        // for (let i = 0, z = F_typeNum; i < F_typeNum; i++, z--) {
        //     const size = this.randomBetween(0.1, 0.2);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `F_type${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(6200, 7500),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }   

        // // Create A_type stars
        // for (let i = 0, z = A_typeNum; i < A_typeNum; i++, z--) {
        //     const size = this.randomBetween(0.2, 0.5);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `A_type${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(7500, 10000),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }   

        // // Create redMasive stars
        // for (let i = 0, z = redMasiveNum; i < redMasiveNum; i++, z--) {
        //     const size = this.randomBetween(0.5, 1);
        //     const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
        //     const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
        //     const star = new Star({
        //         name: `redMasive${i}`,
        //         size: size,
        //         renderMode: "points",
        //         posToParent: new THREE.Vector3(
        //             Math.cos(i) * radius,
        //             this.randomBetween(-5, 5),
        //             Math.sin(i) * radius
        //         ),
        //         orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
        //         detail: 0,
        //         temperature: this.randomBetween(2000, 3000),
        //         parent: this.SMBH.objectRoot,
        //     });
        //     this.stars.push(star);
        // }   
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    Update(dt) 
    {
        this.SMBH.Update(dt);
        for (const star of this.stars) {
            star.Update(dt);
        }

        const sunWorldPos = new THREE.Vector3();
        this.sun.objectRoot.getWorldPosition(sunWorldPos);
        const distanceToSun = this.camera.position.distanceTo(sunWorldPos);
        if (distanceToSun <= 25) {
           this.requestedScene = "SolarSystem";
        } 
    }

    Dispose() 
    {
        // Remove stars
        for (const star of this.stars) {
            star.Dispose();
        }

        // Remove SMBH
        if (this.SMBH) {
            this.SMBH.Dispose();
            this.SMBH = null;
        }

        this.stars = [];
    }
}