import * as THREE from "three";

export class Player 
{
    constructor(
    {
        camera,
        posToParent = new THREE.Vector3(0, 0, 0),
        orbitalTilt = 0,
        orbitalSpeed = 0,
        parent = null, 
   
    } = {}) 
    {
        this.camera = camera;
        // Root object for the player
        this.objectRoot = new THREE.Object3D(); 
        // Optional pivot for later rotations/movement
        this.orbitPivot = new THREE.Object3D();
        this.objectRoot.add(this.orbitPivot);
        // Attach to parent if provided
        if (parent) parent.add(this.objectRoot);


        // experimental movement
        this.orbitalSpeed = orbitalSpeed;
        this.orbitalTilt = orbitalTilt * Math.PI / 180;
        this.orbitPivot.rotation.x = this.orbitalTilt;
        this.objectRoot.position.copy(posToParent)
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

    Update(dt) 
    {
        // experimental movement
        if (this.orbitalSpeed !== 0) {
            this.orbitPivot.rotation.y += this.orbitalSpeed * dt;
        }
    }

    Dispose()
    {
        if (this.objectRoot.parent) this.objectRoot.parent.remove(this.objectRoot);
        this.objectRoot = null;
        this.orbitPivot = null;
    }
}