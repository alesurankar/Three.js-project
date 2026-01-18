import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "..//visuals/skyBox.js";


export class SolarSystem 
{
    constructor(scene) 
    {
        this.scene = scene;
        this.scene.background = SkyBox.Load("SpaceBox");
        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 110,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
            hasTexture: true,
        });
        this.scene.add(this.sun.orbitPivot);

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

        // // Create asteroid belt
        // this.asteroids = new Asteroids({
        //   asteroidCount: 10000,
        //   orbitFarRadius: 1900,
        //   orbitNearRadius: 1700,
        //   axialRotationSpeed: axialTimeScale * 0.000014,
        //   orbitRotationSpeed: asteroidBeltOrbitalSpeed,
        //   thickness: 50,
        //   size: 0.8,
        //   parent: sun.group,
        // });
        
        // Create jupiter
        this.jupiter = new Planet({
            name: "jupiter",
            size: 38,
            posToParent: new THREE.Vector3(2600, 0, 0),
            axialTilt: 3.13,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            parent: this.sun.objectRoot,
        });
        
        // Create saturn
        this.saturn = new Planet({
            name: "saturn",
            size: 34,
            posToParent: new THREE.Vector3(3600, 0, 0),
            axialTilt: 26.73,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.sun.objectRoot,
        });
        
        // // Create saturn ring
        // this.saturnRing = new Asteroids({
        //   asteroidCount: 6000,
        //   orbitFarRadius: 65,
        //   orbitNearRadius: 40,
        //   axialRotationSpeed: 0.005,
        //   orbitRotationSpeed: saturnRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
        //   thickness: 0.6,
        //   size: 0.16,
        //   roughness: 0.9,
        //   metalness: 0.0,
        //   color: 0xdfe6f0,
        //   parent: saturn.group,
        // });
        
        // Create uranus
        this.uranus = new Planet({
            name: "uranus",
            size: 20,
            posToParent: new THREE.Vector3(4600, 0, 0),
            axialTilt: 97.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.72),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(30687),
            parent: this.sun.objectRoot,
        });
        
        // // Create uranus ring
        // this.uranusRing = new Asteroids({
        //   asteroidCount: 1200,
        //   orbitFarRadius: 50,
        //   orbitNearRadius: 42,
        //   axialRotationSpeed: 0.003,
        //   orbitRotationSpeed: uranusRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
        //   thickness: 0.3,
        //   size: 0.14,
        //   //color: 0x444444, // real, to dark
        //   color: 0xffffff, // not real
        //   parent: uranus.group,
        // });
        
        // Create neptune
        this.neptune = new Planet({
            name: "neptune",
            size: 19,
            posToParent: new THREE.Vector3(5600, 0, 0),
            axialTilt: 28.32,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.67),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(60190),
            parent: this.sun.objectRoot,
        });
        
        // Create pluto
        this.pluto = new Planet({
            name: "pluto",
            size: 1.8,
            posToParent: new THREE.Vector3(6500, 0, 0),
            axialTilt: 119.61,
            axialRotationSpeed: StarSystem.AxialRotationInDays(6.39),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(90560),
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
        //this.asteroids.Update();
        this.jupiter.Update();
        this.saturn.Update();
        //this.saturnRing.Update();
        this.uranus.Update();
        //this.uranusRing.Update();
        this.neptune.Update();
        this.pluto.Update();
    }

    Dispose() 
    {
        // Remove Sun
        if (this.sun) {
            this.sun.Dispose();
            this.sun = null;
        }
        // Remove Mercury
        if (this.mercury) {
            this.mercury.Dispose();
            this.mercury = null;
        }
        // Remove Venus
        if (this.venus) {
            this.venus.Dispose();
            this.venus = null;
        }
        // Remove Earth
        if (this.earth) {
            this.earth.Dispose();
            this.earth = null;
        }
        // Remove Moon
        if (this.moon) {
            this.moon.Dispose();
            this.moon = null;
        }
        // Remove Mars
        if (this.mars) {
            this.mars.Dispose();
            this.mars = null;
        }
        // Remove Jupiter
        if (this.jupiter) {
            this.jupiter.Dispose();
            this.jupiter = null;
        }
        // Remove Saturn
        if (this.saturn) {
            this.saturn.Dispose();
            this.saturn = null;
        }
        // Remove Uranus
        if (this.uranus) {
            this.uranus.Dispose();
            this.uranus = null;
        }
        // Remove Neptune
        if (this.neptune) {
            this.neptune.Dispose();
            this.neptune = null;
        }
        // Remove Pluto
        if (this.pluto) {
            this.pluto.Dispose();
            this.pluto = null;
        }
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}

// // Orbitral Speeds
// const asteroidBeltOrbitalSpeed    = orbitalSpeedFromDays(1570, orbitalTimeScale);
// const saturnRingOrbitalSpeed    = orbitalSpeedFromDays(0.6, orbitalTimeScale);
// const uranusRingOrbitalSpeed    = -orbitalSpeedFromDays(0.26, orbitalTimeScale); //retrograde