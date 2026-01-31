import { SolarSystem } from "../app/scenes/starSystems/solarSystem.js";
import { AlphaCenturySystem } from "../app/scenes/starSystems/alphaCentauriSystem.js";
import { MilkyWay } from "../app/scenes/galaxies/milkyWay.js";
import { EarthOrbit } from "../app/scenes/worlds/earthOrbit.js";
import { TestScene } from "../app/scenes/testScene.js";

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
        this.camera.position.set(settings.pos.x, settings.pos.y, settings.pos.z);
        this.camera.lookAt(settings.lookAt.x, settings.lookAt.y, settings.lookAt.z);
        this.camera.fov = settings.fov ?? this.camera.fov;
        this.camera.near = settings.near ?? this.camera.near;
        this.camera.far = settings.far ?? this.camera.far;
        this.camera.updateProjectionMatrix();
    }

    LoadScene(sceneClass) 
    {
        this.currentScene = new sceneClass(this.scene, this.camera);
        this.UpdateCamera();
    }

    SwitchScene(sceneClass) 
    {
        this.currentScene.Dispose();
        this.currentScene = null;
        this.LoadScene(sceneClass);
    }

    Update(timeScale) 
    {
        if (this.currentScene) this.currentScene.Update(timeScale);

        if (!this.currentScene?.requestedScene) return;
        switch (this.currentScene.requestedScene) {
            case "EarthOrbit":
                this.SwitchScene(EarthOrbit);
                break;
            case "SolarSystem":
                this.SwitchScene(SolarSystem);
                break;
            case "AlphaCenturySystem":
                this.SwitchScene(AlphaCenturySystem);
                break;
            case "MilkyWay":
                this.SwitchScene(MilkyWay);
                break;
        }
        // Reset the request after switching
        this.currentScene.requestedScene = null;
    }
}