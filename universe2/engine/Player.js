import * as THREE from "three";
import { GameControls } from "./utils/gameControls.js";

export class Player 
{
    // Step 5
    constructor({ camera, container} = {}) 
    {
        console.log("Step 5: Player.js: constructor");
        this.objectRoot = new THREE.Object3D();

        this.camera = camera;
        this.objectRoot.add(this.camera);
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.gameControls = new GameControls(this.objectRoot, container);
    }

    FaceTarget(x, y, z) 
    {
        if (!this.objectRoot) return;
        this.objectRoot.lookAt(x, y, z);
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

        if (move.forward)  this.objectRoot.translateZ(-speed * dt);
        if (move.backward) this.objectRoot.translateZ(speed * dt);
        if (move.left)     this.objectRoot.translateX(-speed * dt);
        if (move.right)    this.objectRoot.translateX(speed * dt);
        if (move.up)       this.objectRoot.translateY(speed * dt);
        if (move.down)     this.objectRoot.translateY(-speed * dt);
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