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
            this.objectRoot.add(this.camera);
            this.camera.position.set(0, 2, -5);
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