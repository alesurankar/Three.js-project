import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class Asteroid extends CelestialBody {
    constructor({
        size = 1,
        posToParent = new THREE.Vector3(100, 0, 0),
    } = {}) 
    {
        
    }
}