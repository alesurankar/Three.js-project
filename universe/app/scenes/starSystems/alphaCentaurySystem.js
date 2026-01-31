import * as THREE from "three";
import { Star } from "../../entities/star.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { BlackHole } from "../../entities/blackHole.js";

export class AlphaCenturySystem 
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
        this.stars = [];

        // Create BaryCenter
        this.barycenter = new THREE.Group();
        this.scene.add(this.barycenter);

        // Create Alpha Century A
        this.acA = new Star({
            size: 110,
            posToParent: new THREE.Vector3(900, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5790,
            parent: this.barycenter,
        });
        this.stars.push(this.acA);

        // Create Alpha Century B
        this.acB = new Star({
            size: 90,
            posToParent: new THREE.Vector3(-720, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5200,
            parent: this.barycenter,
        });
        this.stars.push(this.acB);

        // Create Proxima Centauri
        this.pc = new Star({
            size: 30,
            posToParent: new THREE.Vector3(8000, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
            temperature: 3000,
            parent: this.barycenter,
        });
        this.stars.push(this.pc);

        // Create Wormhole
        this.wormhole = new BlackHole({
            size: 200,
            posToParent: new THREE.Vector3(2000, 2000, 0),
            facingTo: new THREE.Vector3(0, 0, 0),
            parent: this.barycenter,
        });
    }
    
    Update(dt) 
    {
        for (const star of this.stars) {
            star.Update(dt);
        }
        this.wormhole.Update(dt);

        const wormholeWorldPos = new THREE.Vector3();
        this.wormhole.objectRoot.getWorldPosition(wormholeWorldPos);
        const distanceToWrmhole = this.camera.position.distanceTo(wormholeWorldPos);
        if (distanceToWrmhole <= 100) {
            this.requestedScene = "MilkyWay";
        }
    }

    Dispose() 
    {
        // Remove stars
        for (const star of this.stars) {
            star.Dispose();
        }
        this.stars.length = 0;
        // Remove Wormhole
        if (this.wormhole) {
            this.wormhole.Dispose();
            this.wormhole = null;
        }
        if (this.barycenter) {
            this.barycenter.clear();
            this.scene.remove(this.barycenter);
            this.barycenter = null;
        }
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}