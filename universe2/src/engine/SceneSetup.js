import { SceneManager } from "./SceneManager.js";
import { CreateCamera } from "./RendererSetup.js";
import { TestScene } from "../scenes/testScene.js";
import { SolarSystem } from "../scenes/starSystems/solarSystem.js"
import { ProximaCentauri } from "../scenes/starSystems/proximaCentauri.js";


export function CreateSceneManager(scene) 
{
  const camera = CreateCamera();
  const manager = new SceneManager(scene, camera);

  //manager.LoadScene(TestScene);
  manager.LoadScene(ProximaCentauri);

  return manager;
}

export function Update(manager, timeScale = 1) 
{
    manager?.Update(timeScale);
}