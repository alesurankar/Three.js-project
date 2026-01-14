import * as THREE from "three";
import { BlackHole } from "../entities/blackHole.js";
import { Star } from "../entities/star.js";


export class MilkyWay
{
    constructor(scene) 
    {
        // Create SMBH
        this.SMBH = new BlackHole({
            name: "SMBH",
            size: 100,
            posToParent: new THREE.Vector3(0, 0, 0),
        });
        scene.add(this.SMBH.orbitPivot);

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 1,
            posToParent: new THREE.Vector3(100, 0, 0),
            orbitalSpeed: 0.002,
            detail: 1,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.stars = [];
        for (let i = 0, z = 1000; i < 1000; i++, z--) {
            const angle = i * 0.15; // spiral twist
            const radius = 200 + i;
            this.stars.push(new Star({
                name: `star${i}`,
                size: 1,
                posToParent: new THREE.Vector3(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                ),
                orbitalSpeed: 0.001 * z/100,
                detail: 1,
                temperature: 9000 + i*10,
                parent: this.SMBH.objectRoot,
            }));
        }
    }

    Update() 
    {
        this.SMBH.Update();
        this.sun.Update();
        for (const star of this.stars) {
            star.Update();
        }
    }
}