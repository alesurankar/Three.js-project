import { Scenes } from "./Scenes.js";
import { ModelStore } from "../factories/modelStore.js";

export class SceneManager 
{
    constructor(scene, camera, onSceneChange) 
    {
        this.scene = scene; 
        this.camera = camera;
        this.currentScene = null;
        this.currentSceneName = null;
        this.onSceneChange = onSceneChange;
        this._disposed = false;
        //console.log("SceneManager.constructor", { scene, camera, onSceneChange });
    }

    async Init() 
    {
        if (this._disposed) return;
        //console.log("SceneManager.Init: loading models...");
        await Promise.all([
            ModelStore.Load("probe1"), 
            ModelStore.Load("probe2")
        ]);
        //console.log("SceneManager.Init: models loaded");
    }

    SetPlayer(player) 
    {
        this.player = player;
    }

    GetCurrentSceneName() 
    {
        return this.currentSceneName ?? "None";
    }
    
    async SwitchScene(sceneName, params = {}) 
    {
        //console.log("SceneManager.SwitchScene called", { sceneName, params });

        const SceneClass = Scenes[sceneName];
        if (!SceneClass) {
            console.warn(`Scene "${sceneName}" not found in Scenes.js`);
            return;
        }

        await this.LoadScene(SceneClass, params);

        this.currentSceneName = sceneName;
        //console.log("SceneManager.SwitchScene: currentSceneName updated", this.currentSceneName);

        if (this.onSceneChange) {
            //console.log("SceneManager.SwitchScene: notifying engine");
            this.onSceneChange(sceneName);
        }
    }

    async LoadScene(sceneClass, params = {}) 
    {
        //console.log("SceneManager.LoadScene called", { sceneClass, params });

        if (this.currentScene) {
            //console.log("SceneManager.LoadScene: disposing previous scene", this.currentSceneName);
            this.currentScene.Dispose();
        }

        const sceneInstance = new sceneClass(this.scene, this.camera, this.player, params);
        //console.log("SceneManager.LoadScene: new scene instance created", sceneInstance);

        this.currentScene = sceneInstance;

        if (sceneInstance.init) {
            //console.log("SceneManager.LoadScene: calling scene.init()");
            await sceneInstance.init();
        }

        if (this.currentScene !== sceneInstance || !this.currentScene) {
            console.warn("SceneManager.LoadScene: scene instance changed or disposed during init, aborting further setup");
            return;
        }

        if (!sceneInstance.overrideCamera) {
            //console.log("SceneManager.LoadScene: updating camera from scene settings");
            this.UpdateCamera();
        } 
        else {
            //console.log("SceneManager.LoadScene: scene overrides camera, skipping UpdateCamera");
        }
    }

    UpdateCamera()
    {
        if (!this.currentScene) return;
        if (this.currentScene.overrideCamera) {
            //console.log("UpdateCamera skipped: currentScene.overrideCamera is true");
            return;
        }

        const settings = this.currentScene.cameraSettings || {};
        //console.log("UpdateCamera applying settings", settings);

        try {
            this.camera.near = settings.near ?? this.camera.near;
            this.camera.far = settings.far ?? this.camera.far;
            //console.log("Camera updated:", this.camera.position);
        } 
        catch (err) {
            console.error("UpdateCamera error: invalid camera settings?", err, settings);
        }
    }

    async Update(timeScale) 
    {
        if (this.currentScene) {
            //console.log("SceneManager.Update: updating current scene", this.currentSceneName);
            this.currentScene.Update(timeScale);
        }

        const requested = this.currentScene?.requestedScene;
        if (!requested) return;

        const focus = this.currentScene?.transitionFrom ?? null;
        //console.log("SceneManager.Update: scene transition requested", { requested, focus });

        await this.SwitchScene(requested, { focus });

        this.currentScene.requestedScene = null;
        this.currentScene.transitionFrom = null;
    }

    Dispose()   
    {
        this._disposed = true;
        //console.log("SceneManager.Dispose: disposing current scene and models");
        this.currentScene?.Dispose();
        this.currentScene = null;
        ModelStore.Dispose();
    }
}