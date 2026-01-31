import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { SpaceStation } from "../../entities/spaceStation.js";
import { Star } from "../../entities/star.js";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=1
        this.cameraSettings = {
            pos: { x:2000, y:0, z:0 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 30,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;

        this.objects = [];

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 1000,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 8,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Create SomeSpaceStation
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1100, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.1),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create ISS
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1200, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.06),
            orbitalTilt: 51.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.06),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 270,
            posToParent: new THREE.Vector3(14000, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 3,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 100,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.earth.objectRoot,
            posToParent: new THREE.Vector3(15000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.sun);
    }

    Update(dt) 
    {
        this.objects.forEach(obj => obj.Update(dt));

        const earthWorldPos = new THREE.Vector3();
        this.earth.objectRoot.getWorldPosition(earthWorldPos);
        const distanceToEarth = this.camera.position.distanceTo(earthWorldPos);
        if (distanceToEarth > 4000) {
            this.requestedScene = "SolarSystem";
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
