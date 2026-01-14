import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";


export class StarSystem 
{
    static TimeScale = 500;
    static OrbitalRotationInDays(days, scale = StarSystem.TimeScale) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
    static AxialRotationInDays(days, scale = StarSystem.TimeScale) 
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
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
        });
        scene.add(this.sun.objectRoot);

        // Create Mercury
        this.mercury = new Planet({
            name: "mercury",
            size: 4,
            posToParent: new THREE.Vector3(400, 0, 0),
            axialTilt: 0.034,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.sun.objectRoot,
        });

        // Create venus
        this.venus = new Planet({
            name: "venus",
            size: 9.5,
            posToParent: new THREE.Vector3(700, 0, 0),
            axialTilt: 177.36,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            parent: this.sun.objectRoot,
        });

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            posToParent: new THREE.Vector3(1000, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.sun.objectRoot,
        });

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 2.7,
            posToParent: new THREE.Vector3(30, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });

        // Create mars
        this.mars = new Planet({
            name: "mars",
            size: 5.3,
            posToParent: new THREE.Vector3(1500, 0, 0),
            axialTilt: 25.19,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            parent: this.sun.objectRoot,
        });
    }

    Update() 
    {
        this.sun.Update();
        this.mercury.Update();
        this.venus.Update();
        this.earth.Update();
        this.moon.Update();
        this.mars.Update();
    }
}



// // Axial Speeds
// const mercuryAxialSpeed = rotationSpeedFromDays(58.6, axialTimeScale);
// const venusAxialSpeed   = -rotationSpeedFromDays(243, axialTimeScale);   // retrograde
// const earthAxialSpeed   = rotationSpeedFromDays(1, axialTimeScale);
// const moonAxialSpeed    = rotationSpeedFromDays(27.3, axialTimeScale);
// const marsAxialSpeed    = rotationSpeedFromDays(1.03, axialTimeScale);
// const jupiterAxialSpeed = rotationSpeedFromDays(0.41, axialTimeScale);
// const saturnAxialSpeed  = rotationSpeedFromDays(0.45, axialTimeScale);
// const uranusAxialSpeed  = -rotationSpeedFromDays(0.72, axialTimeScale);  // retrograde
// const neptuneAxialSpeed = rotationSpeedFromDays(0.67, axialTimeScale);
// const plutoAxialSpeed   = rotationSpeedFromDays(6.39, axialTimeScale);

// // Orbitral Speeds
// const mercuryOrbitalSpeed = orbitalSpeedFromDays(88, orbitalTimeScale);
// const venusOrbitalSpeed   = orbitalSpeedFromDays(224.7, orbitalTimeScale);
// const earthOrbitalSpeed   = orbitalSpeedFromDays(365.25, orbitalTimeScale);
// const moonOrbitalSpeed    = orbitalSpeedFromDays(27.3, orbitalTimeScale);
// const marsOrbitalSpeed    = orbitalSpeedFromDays(687, orbitalTimeScale);
// const asteroidBeltOrbitalSpeed    = orbitalSpeedFromDays(1570, orbitalTimeScale);
// const jupiterOrbitalSpeed = orbitalSpeedFromDays(4333, orbitalTimeScale);
// const saturnOrbitalSpeed  = orbitalSpeedFromDays(10759, orbitalTimeScale);
// const saturnRingOrbitalSpeed    = orbitalSpeedFromDays(0.6, orbitalTimeScale);
// const uranusOrbitalSpeed  = orbitalSpeedFromDays(30687, orbitalTimeScale);
// const uranusRingOrbitalSpeed    = -orbitalSpeedFromDays(0.26, orbitalTimeScale); //retrograde
// const neptuneOrbitalSpeed = orbitalSpeedFromDays(60190, orbitalTimeScale);
// const plutoOrbitalSpeed   = orbitalSpeedFromDays(90560, orbitalTimeScale);