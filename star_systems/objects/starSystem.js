import * as THREE from "three";
import { Planet } from "./planet.js"
import { Star } from "./star.js"


export class StarSystem 
{
    static TimeScale = {axial: 2000, orbital: 2000};
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
            orbitalSpeed: 0,
            temperature: 5778,
        });
        scene.add(this.sun.objectRoot);

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            posToParent: new THREE.Vector3(400, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.RotationSpeedInDays(1),
            orbitalSpeed: 0.02,
            parent: this.sun.objectRoot,
        });

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 2.7,
            posToParent: new THREE.Vector3(40, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.RotationSpeedInDays(27.3),
            orbitalSpeed: 0.02,
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