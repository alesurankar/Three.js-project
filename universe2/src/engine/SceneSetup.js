import { SceneManager } from "./SceneManager.js";
import { CreateCamera } from "./RendererSetup.js";
import { TestScene } from "../scenes/testScene.js";
import { SolarSystem } from "../scenes/starSystems/solarSystem.js"
import { ProximaCentauri } from "../scenes/starSystems/proximaCentauri.js";
import { ProximaBOrbit } from "../scenes/worlds/proximaBOrbit.js";
import { SaturnOrbit } from "../scenes/worlds/saturnOrbit.js";


// Step 1
export function CreateSceneManager(scene, onSceneChange) 
{
    console.log("Step 1: SceneSetup.js: CreateSceneManager()");
    const camera = CreateCamera();
    const manager = new SceneManager(scene, camera, onSceneChange);
    return manager;
}

// Step 7
export function FirstScene(manager)
{
    console.log("Step 7: SceneSetup.js: FirstScene()");
    manager?.SwitchScene("TestScene");
}

// Step ..
export function SceneUpdate(manager, timeScale = 1) 
{
    manager?.Update(timeScale);
}