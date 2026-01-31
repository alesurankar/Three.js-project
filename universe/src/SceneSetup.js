import * as THREE from "three";
import { SolarSystem } from "../app/starSystems/solarSystem.js";
import { SceneManager } from "./SceneManager.js";
import { Camera } from "./RendererSetup.js";
import { TestSystem } from "../app/starSystems/testSystem.js";


// Scene
export const Scene = new THREE.Scene();
 
const ambientLight = new THREE.AmbientLight(0x404040, 3);
Scene.add(ambientLight);

const manager = new SceneManager(Scene, Camera);

//manager.LoadScene(SolarSystem);
manager.LoadScene(TestSystem);

export function Update(timeScale) 
{
    manager.Update(timeScale);
}