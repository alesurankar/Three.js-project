import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { ArtificialObject } from "./artificialObject.js";

export class GlbModel extends ArtificialObject {
    constructor({
        key = "station",
        size = 1,
        posToParent = new THREE.Vector3(700, 0, 0),
        pitch = 0,  // rotation around X
        yaw = 0,    // rotation around Y
        roll = 0,   // rotation around Z
        orbitalTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        parent = null
    }) {
        super({
            size,
            renderMode: "model",
            posToParent,
            orbitalTilt,
            axialRotationSpeed,
            orbitalSpeed,
            geometry: null,
            surfMat: null,
            parent
        });

        // Apply full 3D orientation
        this.body.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, roll, "YXZ"));

        this.loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");

        this.loader.setDRACOLoader(dracoLoader);

        this.model = null;
        const modelPath = `/models/glb/${key}/model.glb`;
        this.loader.load(
            modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.model.scale.setScalar(size);

                // Fix normals & double side
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.side = THREE.DoubleSide;
                        child.geometry.computeVertexNormals();
                    }
                });

                // Add to the scene/body
                this.body.add(this.model);
            },
            undefined,
            (error) => {
                console.error(`Failed to load model: ${modelPath}`, error);
            }
        );
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
