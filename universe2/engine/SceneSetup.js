import { SceneManager } from "./SceneManager.js";
import { CreateCamera } from "./RendererSetup.js";


// Step 1
export function CreateSceneManager(scene, onSceneChange) 
{
  console.log("Step 1: SceneSetup.js: CreateSceneManager()");
  const camera = CreateCamera();
  const manager = new SceneManager(scene, camera, onSceneChange);
  return manager;
}

// Step 7
export function FirstScene(manager, firstScene)
{
  console.log("Step 7: SceneSetup.js: FirstScene()");
  manager?.SwitchScene(firstScene);
}

// Step ..
export function SceneUpdate(manager, timeScale = 1) 
{
  manager?.Update(timeScale);
}