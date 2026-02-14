import { Scenes } from "./Scenes.js";

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
        if (!this.currentScene) return;

        const settings = this.currentScene.cameraSettings || {};
        this.camera.position.set(settings.pos.x, settings.pos.y, settings.pos.z);
        this.camera.lookAt(settings.lookAt.x, settings.lookAt.y, settings.lookAt.z);
        this.camera.fov = settings.fov ?? this.camera.fov;
        this.camera.near = settings.near ?? this.camera.near;
        this.camera.far = settings.far ?? this.camera.far;
        this.camera.updateProjectionMatrix();
    }

    async LoadScene(sceneClass) 
    {
        const sceneInstance = new sceneClass(this.scene, this.camera);
        this.currentScene = sceneInstance;
        if (sceneInstance.init) {
            await sceneInstance.init();
        }
        if (this.currentScene !== sceneInstance || !this.currentScene) {
            return;
        }
        this.UpdateCamera();
    }

    SwitchScene(sceneName) 
    {
        if (this.currentScene) this.currentScene.Dispose();

        const SceneClass = Scenes[sceneName];
        if (!SceneClass) {
            console.warn(`Scene "${sceneName}" not found in Scenes.js`);
            return;
        }

        this.currentScene = new SceneClass(this.scene, this.camera);
        this.UpdateCamera();
    }

    Update(timeScale) 
    {
        if (this.currentScene) this.currentScene.Update(timeScale);

        const requested = this.currentScene?.requestedScene;
        if (!requested) return;

        this.SwitchScene(requested);
        this.currentScene.requestedScene = null;
    }

    Dispose()   
    {
        this.currentScene?.Dispose();
        this.currentScene = null;
    }

}