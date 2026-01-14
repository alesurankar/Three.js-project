import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class BlackHole extends CelestialBody 
{
    constructor({
        name = "blackHole",
        size = 10,
        posToParent = new THREE.Vector3(0, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        detail = 2,
        color = 0x000000,
        parent = null,
    } = {}) 
    {
        const material = new THREE.MeshStandardMaterial({ 
            color,
            transparent: true,
            opacity: 0.8,
        });

        // Call base constructor
        super({
            size,
            posToParent,
            axialTilt,
            axialRotationSpeed,
            orbitalSpeed,
            detail,
            material,
            parent,
        });
    }
}