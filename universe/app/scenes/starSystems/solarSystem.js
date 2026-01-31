import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { Star } from "../../entities/star.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { Asteroid } from "../../entities/asteroid.js";
import { BlackHole } from "../../entities/blackHole.js";

export class SolarSystem 
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=100
       
        this.cameraSettings = {
            pos: { x:1500, y:1500, z:0 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;

        this.objects = [];

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 110,
            lightType: "pointLight",
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
            hasTexture: true,
        });
        this.scene.add(this.sun.orbitPivot);
        this.objects.push(this.sun);

        // Create Wormhole
        this.wormhole = new BlackHole({
            size: 200,
            posToParent: new THREE.Vector3(2000, 2000, 0),
            facingTo: new THREE.Vector3(0, 0, 0),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.wormhole);

        // Create Mercury
        this.mercury = new Planet({
            name: "mercury",
            size: 4,
            posToParent: new THREE.Vector3(400, 0, 0),
            axialTilt: 0.034,
            orbitalTilt: 7.00,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mercury);

        // Create venus
        this.venus = new Planet({
            name: "venus",
            size: 9.5,
            posToParent: new THREE.Vector3(700, 0, 0),
            axialTilt: 177.36,
            orbitalTilt: 3.39,
            axialRotationSpeed: StarSystem.AxialRotationInDays(243),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(224.7),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.venus);

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            posToParent: new THREE.Vector3(1000, 0, 0),
            axialTilt: 23.44,
            orbitalTilt: 0,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.earth);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 2.7,
            posToParent: new THREE.Vector3(30, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create mars
        this.mars = new Planet({
            name: "mars",
            size: 5.3,
            posToParent: new THREE.Vector3(1500, 0, 0),
            axialTilt: 25.19,
            orbitalTilt: 1.85,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1.03),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.mars);

        // Create asteroid belt
        const asteroidCount = 3000;
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = new Asteroid({
                size: 1,
                orbitFarRadius: 1900,
                orbitNearRadius: 1700,
                orbitalTilt: 0.0,
                axialRotationSpeed: 0.0004,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
                thickness: 50,
                parent: this.sun.objectRoot
            });
            this.objects.push(asteroid);
        }
        
        // Create jupiter
        this.jupiter = new Planet({
            name: "jupiter",
            size: 38,
            posToParent: new THREE.Vector3(2600, 0, 0),
            axialTilt: 3.13,
            orbitalTilt: 1.31,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.jupiter);
        
        // Create saturn
        this.saturn = new Planet({
            name: "saturn",
            size: 34,
            posToParent: new THREE.Vector3(3600, 0, 0),
            axialTilt: 26.73,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.saturn);

        // Create saturn ring
        const saturnRingCount = 3000;
        for (let i = 0; i < saturnRingCount; i++) {
            const saturnRing = new Asteroid({
                size: 0.16,
                orbitFarRadius: 65,
                orbitNearRadius: 40,
                orbitalTilt: 0,
                axialRotationSpeed: 0.005,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
                thickness: 0.6,   
                color: 0xdfe6f0,
                parent: this.saturn.axialFrame
            });
            this.objects.push(saturnRing);
        }
        
        // Create uranus
        this.uranus = new Planet({
            name: "uranus",
            size: 20,
            posToParent: new THREE.Vector3(4600, 0, 0),
            axialTilt: 97.77,
            orbitalTilt: 0.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.72),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(30687),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.uranus);

        // // Create uranus ring
        this.uranusRing = [];
        const uranusRingCount = 1200;
        for (let i = 0; i < uranusRingCount; i++) {
            const uranusRing = new Asteroid({
                size: 0.14,
                orbitFarRadius: 50,
                orbitNearRadius: 42,
                orbitalTilt: 0,
                axialRotationSpeed: 0.003,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(0.26),
                thickness: 0.3,   
                //color: 0x444444, // real, to dark
                color: 0xffffff, // not real
                parent: this.uranus.axialFrame
            });
            this.objects.push(uranusRing);
        }
        
        // Create neptune
        this.neptune = new Planet({
            name: "neptune",
            size: 19,
            posToParent: new THREE.Vector3(5600, 0, 0),
            axialTilt: 28.32,
            orbitalTilt: 1.77,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.67),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(60190),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.neptune);
        
        // Create pluto
        this.pluto = new Planet({
            name: "pluto",
            size: 1.8,
            posToParent: new THREE.Vector3(6500, 0, 0),
            axialTilt: 119.61,
            orbitalTilt: 17.16,
            axialRotationSpeed: StarSystem.AxialRotationInDays(6.39),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(90560),
            parent: this.sun.objectRoot,
        });
        this.objects.push(this.pluto);
    }

    Update(dt) 
    {
        this.objects.forEach(obj => obj.Update(dt));

        const wormholeWorldPos = new THREE.Vector3();
        this.wormhole.objectRoot.getWorldPosition(wormholeWorldPos);
        const distanceToWrmhole = this.camera.position.distanceTo(wormholeWorldPos);
        if (distanceToWrmhole <= 100) {
            this.requestedScene = "MilkyWay";
        }
        const earthWorldPos = new THREE.Vector3();
        this.earth.objectRoot.getWorldPosition(earthWorldPos);
        const distanceToEarth = this.camera.position.distanceTo(earthWorldPos);
        if (distanceToEarth <= 30) {
            this.requestedScene = "EarthOrbit";
        } 
        const mercuryWorldPos = new THREE.Vector3();
        this.mercury.objectRoot.getWorldPosition(mercuryWorldPos);
        const distanceToMercury = this.camera.position.distanceTo(mercuryWorldPos);
        if (distanceToMercury <= 30) {
            this.requestedScene = "MercuryOrbit";
        } 
        
    }

    Dispose() 
    {
        this.objects.forEach(obj => obj?.Dispose());
        this.objects = [];
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}