import * as THREE from "three";
import { SolarSystem } from "../app/systems/solarSystem.js";
import { MilkyWay } from "../app/galaxies/milkyWay.js";
import { EarthAtmosphere } from "../app/worlds/earthAtmosphere.js";


// Scene
export const Scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

//const scene = new EarthAtmosphere(Scene);
//const scene = new SolarSystem(Scene);
const scene = new MilkyWay(Scene);

export function Update() 
{
  scene.Update();
}