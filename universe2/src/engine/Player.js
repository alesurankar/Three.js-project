import * as THREE from "three";
import { GameControls } from "../utils/gameControls.js";

export class Player 
{
    constructor({ camera, container} = {}) 
    {
        this.camera = camera;
        this.gameControls = new GameControls(camera, container);

        // Root object
        this.objectRoot = new THREE.Object3D();

        // Optional pivot for future orbit logic
        this.orbitPivot = new THREE.Object3D();
        this.objectRoot.add(this.orbitPivot);

        // Attach camera to player
        if (this.camera) {
            this.orbitPivot.add(this.camera);
            this.camera.position.set(0, 2, 0);
        }
    }

    AttachTo(parent)
    {
        parent.add(this.objectRoot);
    }

    SetPosition(x, y, z) 
    {
        this.objectRoot.position.set(x, y, z);
    }

    Move(delta) 
    {
        // delta: THREE.Vector3
        this.objectRoot.position.add(delta);
    }

    Lock()
    {
        this.gameControls.ToggleLock();
    }

    Update(dt) 
    {
        this.gameControls.Update();
        if (!this.gameControls.controls.isLocked) return;

        const move = this.gameControls.move;
        const speed = move.fast ? 500 : 50;

        const velocity = new THREE.Vector3();

        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
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

        this.objectRoot = null;
        this.orbitPivot = null;
        this.camera = null;
    }
}