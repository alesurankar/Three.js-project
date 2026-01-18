import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";


export class EarthAtmosphere 
{
    constructor(scene) 
    {
        scene.background = SkyBox.Load("StarBox");
        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 100000,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 10
        });
        scene.add(this.earth.orbitPivot);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 27000,
            posToParent: new THREE.Vector3(900000, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 6,
            parent: this.earth.objectRoot,
        });
    }

    Update() 
    {
        this.earth.Update();
        this.moon.Update();
    }
}
