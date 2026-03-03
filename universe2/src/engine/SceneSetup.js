import { SceneManager } from "./SceneManager.js";
import { CreateCamera } from "./RendererSetup.js";
import { TestScene } from "../scenes/testScene.js";
import { SolarSystem } from "../scenes/starSystems/solarSystem.js"
import { ProximaCentauri } from "../scenes/starSystems/proximaCentauri.js";
import { ProximaBOrbit } from "../scenes/worlds/proximaBOrbit.js";
import { SaturnOrbit } from "../scenes/worlds/saturnOrbit.js";


export function CreateSceneManager(scene, onSceneChange, initialParams = {}) 
{
  const camera = CreateCamera();
  const manager = new SceneManager(scene, camera, onSceneChange);

  manager.SwitchScene("SolarSystem", initialParams);

  return manager;
}

export function Update(manager, timeScale = 1) 
{
    manager?.Update(timeScale);
}