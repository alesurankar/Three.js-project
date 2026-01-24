import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        StarSystem.timeScale=1
        this.cameraSettings = {
            pos_x: 200000,
            pos_y: 0,
            pos_z: 0,
            look_x: 0,
            look_y: 0,
            look_z: 0,
            fov: 40,
            near: 40,
            far: 2000000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.requestedScene = null;

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 100000,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 10,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);

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

        const earthWorldPos = new THREE.Vector3();
        this.earth.objectRoot.getWorldPosition(earthWorldPos);
        const distanceToEarth = this.camera.position.distanceTo(earthWorldPos);
        if (distanceToEarth > 400000) {
            this.requestedScene = "SolarSystem";
        } 
    }

    Dispose() 
    {
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
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }

}
