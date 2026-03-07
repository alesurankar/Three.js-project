import * as THREE from "three";
import { GameControls } from "../utils/gameControls.js";

export class Player 
{
    // Step 5
    constructor({ camera, container} = {}) 
    {
        console.log("Step 5: Player.js: constructor");
        this.objectRoot = new THREE.Object3D();

        this.camera = camera;
        this.objectRoot.add(this.camera);
        this.camera.position.set(0, 16, 16);
        this.camera.lookAt(new THREE.Vector3(0, 4, 0));

        //const geometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

        this.model = new THREE.Mesh(geometry, material);
        this.objectRoot.add(this.model);

        this.gameControls = new GameControls(this.objectRoot, container);
    }

    FaceTarget(targetPosition) 
    {
        if (!this.objectRoot || !targetPosition) return;
        // Make a copy so we don’t accidentally modify the original
        const target = targetPosition.clone();

        // Rotate player to look at the target
        this.objectRoot.lookAt(target);
    }

    AttachTo(parent)
    {
        parent.add(this.objectRoot);
    }

    SetPosition(x, y, z) 
    {
        if (!this.objectRoot) {
            console.warn("Player objectRoot not ready yet");
            return;
        }
        this.objectRoot.position.set(x, y, z);
    }

    Lock()
    {
        this.gameControls.ToggleLock();
    }

    // Async Step 4
    Update(dt) 
    {
        //console.log("Async Step 4: Player.js: Update()");
        this.gameControls.Update();
        
        const move = this.gameControls.move;
        const speed = move.fast ? 500 : 50;

        const velocity = new THREE.Vector3();

        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.normalize();

        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(forward, up).normalize();

        if (move.forward) velocity.add(forward.multiplyScalar(speed));
        if (move.backward) velocity.add(forward.multiplyScalar(-speed));
        if (move.left) velocity.add(right.multiplyScalar(-speed));
        if (move.right) velocity.add(right.multiplyScalar(speed));
        if (move.up) velocity.y += speed;
        if (move.down) velocity.y -= speed;

        this.objectRoot.position.addScaledVector(velocity, dt);
    }

    Dispose()
    {
        if (this.objectRoot.parent) 
            this.objectRoot.parent.remove(this.objectRoot);

        if (this.gameControls) {
            this.gameControls.Dispose();
            this.gameControls = null;
        }

        // Dispose model
        if (this.model) {
            this.model.geometry.dispose();
            if (this.model.material.map) this.model.material.map.dispose();
            this.model.material.dispose();
            this.model = null;
        }

        this.objectRoot = null;
        this.camera = null;
    }
}