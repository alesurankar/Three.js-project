import * as THREE from "three";

export class SkyBox
{
    static Load(name) 
    {
        const loader = new THREE.CubeTextureLoader();
        return loader.load([
            `./textures/${name}/n1.png`,
            `./textures/${name}/n2.png`,
            `./textures/${name}/n3.png`,
            `./textures/${name}/n4.png`,
            `./textures/${name}/n5.png`,
            `./textures/${name}/n6.png`,
        ]);
    }
}