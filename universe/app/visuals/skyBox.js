import * as THREE from "three";

export class SkyBox
{
    static Load(name) 
    {
        const loader = new THREE.CubeTextureLoader();
        return loader.load([
            `./app/textures/${name}/n1.png`,
            `./app/textures/${name}/n2.png`,
            `./app/textures/${name}/n3.png`,
            `./app/textures/${name}/n4.png`,
            `./app/textures/${name}/n5.png`,
            `./app/textures/${name}/n6.png`,
        ]);
    }

    static Dispose(cubeTexture) 
    {
        if (cubeTexture) cubeTexture.dispose();
    }
}