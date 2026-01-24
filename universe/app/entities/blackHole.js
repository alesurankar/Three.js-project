import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class BlackHole extends CelestialBody 
{
    constructor({
        name = "blackHole",
        size = 10,
        renderMode = "mesh",
        posToParent = new THREE.Vector3(0, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        detail = 1,
        color = 0x000000,
        parent = null,
    } = {}) 
    {
        const surfMat = new THREE.MeshStandardMaterial({ 
            color,
            transparent: true,
            opacity: 0.8,
        });

        // Create geometry
        const geometry = new THREE.IcosahedronGeometry(size, detail);

        // Call base constructor
        super({
            size,
            renderMode,
            posToParent,
            axialTilt,
            axialRotationSpeed,
            orbitalSpeed,
            surfMat,
            geometry,
            parent,
        });
    }
    
    Dispose()
    {
        super.Dispose();
    }
}