import * as THREE from "three";
import { Planet } from "./TestPlanet.js"
import { Star } from "./TestStar.js"


export class StarSystem 
{
    static TimeScale = {axial: 1000, orbital: 1000};
    static RotationSpeedInDays(days, scale = StarSystem.TimeScale.axial) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
    static OrbitalSpeedInDays(days, scale = StarSystem.TimeScale.orbital) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }

    constructor(scene) 
    {
        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 110,
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.RotationSpeedInDays(25),
            temperature: 5778,
        });
        scene.add(this.sun.objectRoot);

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.RotationSpeedInDays(1),
            parent: this.sun.objectRoot,
        });

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 2.7,
            posToParent: new THREE.Vector3(40, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.RotationSpeedInDays(27.3),
            parent: this.earth.objectRoot,
        });
    }

    Update() 
    {
        this.sun.Update();
        this.earth.Update();
        this.moon.Update();
    }
}