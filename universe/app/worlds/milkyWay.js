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
            size: 20,
            posToParent: new THREE.Vector3(0, 0, 0),
        });
        scene.add(this.SMBH.orbitPivot);

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 2,
            posToParent: new THREE.Vector3(100, 0, 0),
            orbitalSpeed: 0.01,
            detail: 8,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.alphaStar = new Star({
            name: "alphaStar",
            size: 2,
            posToParent: new THREE.Vector3(200, 0, 0),
            orbitalSpeed: 0.005,
            parent: this.SMBH.objectRoot,
        });
    }

    Update() 
    {
        this.SMBH.Update();
        this.sun.Update();
        this.alphaStar.Update();
    }
}