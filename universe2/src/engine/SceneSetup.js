import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { CreateCamera } from "./RendererSetup.js";
import { TestScene } from "../scenes/testScene.js";
import { SolarSystem } from "../scenes/starSystems/solarSystem.js"

export const Scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0x404040, 2);
Scene.add(ambientLight);

export function CreateSceneManager() 
{
  const camera = CreateCamera();
  const manager = new SceneManager(Scene, camera);

  //manager.LoadScene(TestScene);
  manager.LoadScene(SolarSystem);

  return manager;
}

export function Update(manager, timeScale = 1) 
{
    manager?.Update(timeScale);
}