import * as THREE from "three";
import { Planet } from "./TestPlanet.js"
import { Star } from "./TestStar.js"


export class StarSystem 
{
    constructor(scene, sunAxialSpeed, earthAxialSpeed, moonAxialSpeed) 
    {
        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 110,
            axialTilt: 7.25,
            axialRotationSpeed: sunAxialSpeed,
            temperature: 5778,
        });
        scene.add(this.sun.objectRoot);

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            axialTilt: 23.44,
            axialRotationSpeed: earthAxialSpeed,
            parent: this.sun.objectRoot,
        });

        // Create moon
        this.moon = new Planet({
        name: "moon",
        size: 2.7,
        posToParent: new THREE.Vector3(40, 0, 0),
        axialTilt: 6.68,
        axialRotationSpeed: moonAxialSpeed,
        parent: this.earth.objectRoot,
        });
    }

    update() {
        this.sun.update();
        this.earth.update();
        this.moon.update();
    }
}