import * as THREE from "three";
import { SolarSystem } from "../app/systems/solarSystem.js";
import { MilkyWay } from "../app/galaxies/milkyWay.js";
import { EarthOrbit } from "../app/worlds/earthOrbit.js";
import { SceneManager } from "./SceneManager.js";


// Scene
export const Scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 10.3);
Scene.add(ambientLight);

const manager = new SceneManager(Scene);

const scenes = [EarthOrbit, SolarSystem, MilkyWay];

let currentIndex = 1;
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