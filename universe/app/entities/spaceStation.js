import * as THREE from "three";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import { CelestialBody } from "./celestialBody.js";

export class SpaceStation extends CelestialBody {
    constructor({
        name = "station",
        size = 1,
        posToParent = new THREE.Vector3(700, 0, 0),
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        parent = null
    }) {
        super({
            size,
            renderMode: "model",
            posToParent,
            axialRotationSpeed,
            orbitalSpeed,
            geometry: null,
            surfMat: null,
            parent
        });

        this.loader = new GLTFLoader();
        this.model = null;
        const modelPath = `./app/models/${name}.gltf`;  
        this.loader.load(modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.scale.setScalar(size);
            // Fix materials so the model appears gray
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,  // gray
                        metalness: 0.2,   // optional, adjust as needed
                        roughness: 0.8    // optional, adjust as needed
                    });
                }
            });
            this.body.add(this.model);
        });
    }

    Dispose() {
        if (this.model) {
            this.model.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        }
        super.Dispose();
    }
}
