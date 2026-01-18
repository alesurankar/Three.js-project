export class SceneManager 
{
    constructor(scene) 
    {
        this.scene = scene; 
        this.currentScene = null;
    }

    LoadScene(sceneClass) 
    {
        this.currentScene = new sceneClass(this.scene);
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