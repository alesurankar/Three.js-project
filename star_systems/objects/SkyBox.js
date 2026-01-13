import * as THREE from "three";

export class SkyBox
{
    static Load() 
    {
        const loader = new THREE.CubeTextureLoader();
        return loader.load([
            './textures/skybox/n1.png',
            './textures/skybox/n2.png',
            './textures/skybox/n3.png',
            './textures/skybox/n4.png',
            './textures/skybox/n5.png',
            './textures/skybox/n6.png',
        ]);
    }
}