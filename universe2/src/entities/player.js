import * as THREE from "three";

export class Player 
{
    constructor(
    {
        posToParent = new THREE.Vector3(0, 0, 0),
        parent = null, 
   
    } = {}) 
    {
        // Root object for the player
        this.objectRoot = new THREE.Object3D(); 
        this.objectRoot.position.copy(posToParent);
        // Optional pivot for later rotations/movement
        this.orbitPivot = new THREE.Object3D();
        this.objectRoot.add(this.orbitPivot);
        // Attach to parent if provided
        if (parent) parent.add(this.objectRoot);
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
        // Later: implement movement logic here
    }

    Dispose()
    {
        if (this.objectRoot.parent) this.objectRoot.parent.remove(this.objectRoot);
        this.objectRoot = null;
        this.orbitPivot = null;
    }
}