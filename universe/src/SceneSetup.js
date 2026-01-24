import * as THREE from "three";
import { SolarSystem } from "../app/systems/solarSystem.js";
import { MilkyWay } from "../app/galaxies/milkyWay.js";
import { EarthOrbit } from "../app/worlds/earthOrbit.js";
import { EmptyScene } from "../app/visuals/EmptyScene.js";
import { SceneManager } from "./SceneManager.js";
import { Camera } from "./RendererSetup.js";


// Scene
export const Scene = new THREE.Scene();
 
const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

const manager = new SceneManager(Scene, Camera);

const scenes = [EmptyScene, EarthOrbit, SolarSystem, MilkyWay];

let currentIndex = 0;
manager.LoadScene(scenes[currentIndex]);

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        currentIndex = (currentIndex + 1) % scenes.length;
        manager.SwitchScene(scenes[currentIndex]);
    }
});

export function Update() 
{
    manager.Update();
}