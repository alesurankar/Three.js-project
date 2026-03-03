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
        this._currentLoadId = 0;
    }

    async Init() 
    {
        if (this._disposed) return;
        await Promise.all([
            ModelStore.Load("probe1"), 
            ModelStore.Load("probe2")
        ]);
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
        console.log(">>> SwitchScene CALLED:", sceneName);

        const SceneClass = Scenes[sceneName];
        if (!SceneClass) {
            console.warn(`Scene "${sceneName}" not found in Scenes.js`);
            return;
        }

        await this.LoadScene(SceneClass, params);

        this.currentSceneName = sceneName;
        if (this.onSceneChange) {
            this.onSceneChange(sceneName);
        }
    }

    async LoadScene(sceneClass, params = {}) 
    {   
        this._currentLoadId++;
        const loadId = this._currentLoadId;
        console.log(`[LoadScene ${loadId}] START`, sceneClass.name);

        if (this.currentScene) {
            console.log(`[LoadScene ${loadId}] Disposing previous scene`, this.currentSceneName);
            this.currentScene.Dispose();
            console.log(`[LoadScene ${loadId}] Previous scene disposed`);
        }

        const sceneInstance = new sceneClass(this.scene, this.camera, this.player, params);
        console.log(`[LoadScene ${loadId}] Scene instance created`, sceneInstance);

        this.currentScene = sceneInstance;

        if (sceneInstance.init) {
            console.log(`[LoadScene ${loadId}] Calling init()`);
            await sceneInstance.init();
            console.log(`[LoadScene ${loadId}] Init finished`);
        }
        console.log(`[LoadScene ${loadId}] UpdateCamera() about to run`);
        this.UpdateCamera();
        
        if (sceneInstance.OnEnter && this.player) {
            console.log(`[LoadScene ${loadId}] Calling OnEnter with player`, this.player);
            setTimeout(() => {
                if (this._currentLoadId === loadId) {
                    sceneInstance.OnEnter(this.player);
                    console.log(`[LoadScene ${loadId}] OnEnter finished`);
                } else {
                    console.warn(`[LoadScene ${loadId}] OnEnter skipped — another scene load started`);
                }
            }, 0);
        }

        console.log(`[LoadScene ${loadId}] LoadScene complete`);
    }

    UpdateCamera()
    {
        if (!this.currentScene) return;

        const settings = this.currentScene.cameraSettings || {};

        try {
            this.camera.near = settings.near ?? this.camera.near;
            this.camera.far = settings.far ?? this.camera.far;
            this.camera.updateProjectionMatrix();
        } 
        catch (err) {
            console.error("UpdateCamera error: invalid camera settings?", err, settings);
        }
    }

    async Update(timeScale) 
    {
        if (this.currentScene) {
            this.currentScene.Update(timeScale);
        }

        const requested = this.currentScene?.requestedScene;
        if (!requested) return;

        console.log("### Scene requested transition to:", requested);

        const focus = this.currentScene?.transitionFrom ?? null;

        this.currentScene.requestedScene = null;
        this.currentScene.transitionFrom = null;

        await this.SwitchScene(requested, { focus });
    }

    Dispose()   
    {
        this._disposed = true;
        this.currentScene?.Dispose();
        this.currentScene = null;
        ModelStore.Dispose();
    }
}