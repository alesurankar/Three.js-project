import * as THREE from "three";
import { SkyBox } from "./objects/SkyBox.js";
import { StarSystem } from "./objects/StarSystem.js";


// Scene
export const Scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

Scene.background = SkyBox.Load("SpaceBox");
const sunSystem = new StarSystem(Scene);

export function Update() 
{
  sunSystem.Update();
}