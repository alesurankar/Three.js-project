import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class GravityCenter extends CelestialBody 
{
    constructor({
        posToParent = new THREE.Vector3(0, 0, 0),
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        parent = null,
    } = {}) 
    {
        // Call base constructor
        super({
            renderMode: "none",
            posToParent,
            axialRotationSpeed,
            orbitalSpeed,
            parent,
        });
    }
    
    Dispose()
    {
        super.Dispose();
    }
}