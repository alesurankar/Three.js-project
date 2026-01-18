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
        detail = 5,
        color = 0xffffff,
        parent = null,
    } = {}) 
    {
        // Prepare texture and material
        const surfTexture = `./app/textures/${name}/day.jpg`;
        const cloudTexture = `./app/textures/${name}/clouds.jpg`;
        let surfMat = null;
        let cloudMat = null;
        const loader = new THREE.TextureLoader();

        
        if (surfTexture) {
            const surfTex = loader.load(surfTexture);
            surfMat = new THREE.MeshStandardMaterial({
                map: surfTex,
                roughness: 1,
                metalness: 0,
                color,  
            });
        }

        // Cloud material
        if (cloudTexture) {
            const cloudTex = loader.load(cloudTexture);
            cloudMat = new THREE.MeshStandardMaterial({
                map: cloudTex,
                transparent: true,
                opacity: 0.4,
                blending: THREE.NormalBlending
            });
        }

        super({
            size,
            posToParent,
            axialTilt,
            axialRotationSpeed,
            orbitalSpeed,
            detail,
            surfMat,
            cloudMat,
            parent,
        });
    }
}
