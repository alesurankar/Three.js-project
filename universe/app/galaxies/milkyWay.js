import * as THREE from "three";
import { BlackHole } from "../entities/blackHole.js";
import { Star } from "../entities/star.js";


export class MilkyWay
{
    constructor(scene) 
    {
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
        const SMBH_Size = 140;

        const baseSpeed = 0.01;
        const starNum = 6000;
        const redDwarfNum = starNum * 0.72;
        const K_typeNum = starNum * 0.14;
        const G_typeNum = starNum * 0.08;
        const F_typeNum = starNum * 0.03;
        const A_typeNum = starNum * 0.007;
        const redMasiveNum = starNum * 0.0006;
        this.stars = [];


        // Create SMBH
        this.SMBH = new BlackHole({
            name: "SMBH",
            size: SMBH_Size,
            posToParent: new THREE.Vector3(0, 0, 0),
        });
        this.scene.add(this.SMBH.orbitPivot);

        // Create Sun
        const sun = new Star({
            name: "sun",
            size: 1,
            posToParent: new THREE.Vector3(10 * SMBH_Size, SMBH_Size, SMBH_Size),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.stars.push(sun);

        // Create redDwarfs
        for (let i = 0, z = redDwarfNum; i < redDwarfNum; i++, z--) {
            const size = this.randomBetween(0.01, 0.05);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `redDwarf${i}`,
                size: size,
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
            this.stars.push(star);
        }   

        // Create K_type stars
        for (let i = 0, z = K_typeNum; i < K_typeNum; i++, z--) {
            const size = this.randomBetween(0.05, 0.09);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `K_type${i}`,
                size: size,
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
            this.stars.push(star);
        }  

        // Create G_type stars
        for (let i = 0, z = G_typeNum; i < G_typeNum; i++, z--) {
            const size = this.randomBetween(0.09, 0.12);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `G_type${i}`,
                size: size,
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
            this.stars.push(star);
        }   

        // Create F_type stars
        for (let i = 0, z = F_typeNum; i < F_typeNum; i++, z--) {
            const size = this.randomBetween(0.1, 0.2);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `F_type${i}`,
                size: size,
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
            this.stars.push(star);
        }   

        // Create A_type stars
        for (let i = 0, z = A_typeNum; i < A_typeNum; i++, z--) {
            const size = this.randomBetween(0.2, 0.5);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `A_type${i}`,
                size: size,
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
            this.stars.push(star);
        }   

        // Create redMasive stars
        for (let i = 0, z = redMasiveNum; i < redMasiveNum; i++, z--) {
            const size = this.randomBetween(0.5, 1);
            const radius = this.randomBetween(SMBH_Size + size, 20 * SMBH_Size);
            const angularSpeed = baseSpeed * Math.sqrt(SMBH_Size / radius);
            const star = new Star({
                name: `redMasive${i}`,
                size: size,
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
            this.stars.push(star);
        }   
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    Update() 
    {
        this.SMBH.Update();
        for (const star of this.stars) {
            star.Update();
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