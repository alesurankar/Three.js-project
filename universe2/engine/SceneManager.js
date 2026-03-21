import { Scenes } from "./Scenes.js";
import { ModelStore } from "./factories/modelStore.js";

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
    async SwitchScene(sceneName, focus = {})
    {
        console.log("Step 8: SceneManager.js: SwitchScene()");

        const SceneClass = Scenes[sceneName];
        if (!SceneClass) {
            console.warn(`Scene "${sceneName}" not found in Scenes.js`);
            return;
        }

        await this.LoadScene(SceneClass, focus);

        this.currentSceneName = sceneName;
        if (this.onSceneChange) {
            this.onSceneChange(sceneName);
        }
    }

    // Step 9
    async LoadScene(sceneClass, focus = {}) 
    {   
        console.log("Step 9: SceneManager.js: LoadScene()");
        if (this.currentScene) {
            this.currentScene.Dispose();
        }

        const sceneInstance = new sceneClass(this.scene, this.camera, this.player, focus);
        this.currentScene = sceneInstance;

        if (sceneInstance.Init) {
            await sceneInstance.Init();
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

    // Async Step 5
    async Update(timeScale) 
    {
        //console.log("Async Step 5: SceneManager.js: Update()");
        if (this.currentScene) {
            this.currentScene.Update(timeScale);
        }

        const requested = this.currentScene?.requestedScene; // Needs an Class Name
        if (!requested) return;

        const focus = this.currentScene?.transitionFrom;     // Needs an Object Key

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