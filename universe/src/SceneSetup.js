import * as THREE from "three";
import { SkyBox } from "../app/visuals/skyBox.js";
import { SolarSystem } from "../app/definitions/solarSystemDefinition.js";
//import { SunSystem } from "../app/systems/sunSystem.js";


// Scene
export const Scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

Scene.background = SkyBox.Load("SpaceBox");
const solarSystem = SolarSystem.Build(Scene);
//const solarSystem = new SunSystem(Scene);

export function Update() 
{
  solarSystem.Update();
}