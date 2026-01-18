import * as THREE from "three";
import { SkyBox } from "../app/visuals/skyBox.js";
import { SolarSystem } from "../app/systems/solarSystem.js";
import { MilkyWay } from "../app/worlds/milkyWay.js";


// Scene
export const Scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

//Scene.background = SkyBox.Load("SpaceBox");
//const solarSystem = new SolarSystem(Scene);
const milkyWay = new MilkyWay(Scene);

export function Update() 
{
  //solarSystem.Update();
  milkyWay.Update();
}