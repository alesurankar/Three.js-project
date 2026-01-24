import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=10
        this.cameraSettings = {
            pos_x: 2000,
            pos_y: 0,
            pos_z: 0,
            look_x: 0,
            look_y: 0,
            look_z: 0,
            fov: 40,
            near: 20,
            far: 200000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.requestedScene = null;

        this.objects = [];

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 1000,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 10,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 270,
            posToParent: new THREE.Vector3(9000, 0, 0),
            axialTilt: 6.68,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 6,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);
    }

    Update() 
    {
        this.objects.forEach(obj => obj.Update());

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
