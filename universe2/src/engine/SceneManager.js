import { Scenes } from "./Scenes.js";
import { ModelStore } from "../factories/modelStore.js";

// Step 3
export class SceneManager 
{
    constructor(scene, camera, onSceneChange) 
    {
        console.log("Step 3: SceneManager.js: constructor");
        this.scene = scene; 
        this.camera = camera;
        this.currentScene = null;
        this.currentSceneName = null;
        this.onSceneChange = onSceneChange;
        this._disposed = false;
        this._currentLoadId = 0;
    }

    // Async Step 2
    async Init() 
    {
        console.log("Async Step 2: SceneManager.js: async Init()");
        if (this._disposed) return;
        await Promise.all([
            ModelStore.Load("probe1"), 
            ModelStore.Load("probe2")
        ]);
    }

    // Step 6
    SetPlayer(player) 
    {
        console.log("Step 6: SceneManager.js: SetPlayer()");
        this.player = player;
    }

    GetCurrentSceneName() 
    {
        return this.currentSceneName ?? "None";
    }
    
    // Step 8
    async SwitchScene(sceneName, params = {})     // 1. apearance on params here
    {
        console.log("Step 8: SceneManager.js: SwitchScene()");

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

    // Step 9
    async LoadScene(sceneClass, params = {})  // 2. apearance on params here
    {   
        console.log("Step 9: SceneManager.js: LoadScene()");
        this._currentLoadId++;
        const loadId = this._currentLoadId;

        if (this.currentScene) {
            this.currentScene.Dispose();
        }

        const sceneInstance = new sceneClass(this.scene, this.camera, this.player, params);  // 3. apearance on params here
        this.currentScene = sceneInstance;

        if (sceneInstance.Init) {
            await sceneInstance.Init();
        }
        this.UpdateCamera();
        
        if (sceneInstance.OnEnter && this.player) {
            setTimeout(() => {
                if (this._currentLoadId === loadId) {
                    sceneInstance.OnEnter(this.player);
                } else {
                    console.warn(`[LoadScene ${loadId}] OnEnter skipped — another scene load started`);
                }
            }, 0);
        }
    }

    // Step 12
    UpdateCamera()
    {
        console.log("Step 12: SceneManager.js: UpdateCamera()");
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

    // Step ..
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