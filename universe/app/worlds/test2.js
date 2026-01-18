import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";


export class Test2
{
    constructor(scene) 
    {
        this.scene = scene;
        if (this.scene.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
        this.scene.background = SkyBox.Load("StarBox");
        // Create Venus
        this.venus = new Planet({
            name: "venus",
            size: 100,
            posToParent: new THREE.Vector3(-100, -100, -100),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 2
        });
        this.scene.add(this.venus.orbitPivot);
    }

    Update() 
    {
        this.venus.Update();
    }

    Dispose() 
    {
        // // Remove Earth
        // if (this.venus) {
        //     this.venus.orbitPivot.parent?.remove(this.venus.orbitPivot);
        //    this.venus = null;
        // }   this.venus.Dispose();
          
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}
