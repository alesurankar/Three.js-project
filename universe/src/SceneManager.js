export class SceneManager 
{
    constructor(scene, camera) 
    {
        this.scene = scene; 
        this.camera = camera;
        this.currentScene = null;
    }

    UpdateCamera()
    {
        const settings = this.currentScene.cameraSettings || {};
        this.camera.position.set(settings.pos_x, settings.pos_y, settings.pos_z);
        this.camera.lookAt(settings.look_x, settings.look_y, settings.look_z);
        this.camera.fov = settings.fov ?? this.camera.fov;
        this.camera.near = settings.near ?? this.camera.near;
        this.camera.far = settings.far ?? this.camera.far;
        this.camera.updateProjectionMatrix();
    }

    LoadScene(sceneClass) 
    {
        this.currentScene = new sceneClass(this.scene);
        this.UpdateCamera();
    }

    SwitchScene(sceneClass) 
    {
        this.currentScene.Dispose();
        this.currentScene = null;
        this.LoadScene(sceneClass);
    }

    Update() 
    {
        if (this.currentScene) this.currentScene.Update();
    }
}