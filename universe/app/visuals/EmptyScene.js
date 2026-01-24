
export class EmptyScene
{
    constructor(scene) 
    {
        this.cameraSettings = {
            pos_x: 0,
            pos_y: 50,
            pos_z: 100,
            look_x: 0,
            look_y: 0,
            look_z: 0,
            fov: 35,
            near: 1,
            far: 2000
        };
        this.scene = scene;
    }

    Update() 
    {
    }

    Dispose() 
    {
    }
}