import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";


export class Test
{
    constructor(scene) 
    {
        this.scene = scene;
        if (this.scene.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
        this.scene.background = SkyBox.Load("SpaceBox");
        // Create Mars
        this.mars = new Planet({
            name: "mars",
            size: 100,
            posToParent: new THREE.Vector3(100, 100, 100),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 2
        });
        this.scene.add(this.mars.orbitPivot);
    }

    Update() 
    {
        this.mars.Update();
    }

    Dispose() 
    {
        // // Remove Earth
        // if (this.mars) {
        //     this.mars.orbitPivot.parent?.remove(this.mars.orbitPivot);
        //     this.mars.Dispose();
        //     this.mars = null;
        // }
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}
