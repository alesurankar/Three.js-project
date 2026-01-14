import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class Planet extends CelestialBody 
{
    constructor({
        name = "planet",
        size = 4,
        posToParent = new THREE.Vector3(700, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        detail = 10,
        color = 0xffffff,
        parent = null,
    } = {}) 
    {
        // Prepare texture and material
        const texturePath = `./textures/${name}/day.jpg`;
        const loader = new THREE.TextureLoader();

        const texture = loader.load(
            texturePath,
            undefined,
            undefined,
            (err) => console.warn(`Texture not found for ${name}, using color.`)
        );

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1,
            metalness: 0,
            color,
        });

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
