import * as THREE from "three";
import { SkyBox } from "./objects/SkyBox.js";
import { StarSystem } from "./objects/StarSystem.js";


// Scene
export const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(
  0x404040,
  10.3
);
scene.add(ambientLight);

scene.background = SkyBox.Load("SpaceBox");
const sunSystem = new StarSystem(scene);

export function Update() 
{
  sunSystem.Update();
}