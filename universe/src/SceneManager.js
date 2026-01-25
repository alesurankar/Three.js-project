import { SolarSystem } from "../app/starSystems/solarSystem.js";
import { AlphaCenturySystem } from "../app/starSystems/alphaCentauriSystem.js";
import { MilkyWay } from "../app/galaxies/milkyWay.js";
import { EarthOrbit } from "../app/worlds/earthOrbit.js";

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