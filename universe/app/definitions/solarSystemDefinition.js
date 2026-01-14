import * as THREE from "three";
import { Star } from "../entities/star.js";
import { Planet } from "../entities/planet.js";
import { StarSystem } from "../systems/starSystem.js";


export class SolarSystem
{
    static Build(scene)
    {
        const system = new StarSystem(scene);
        // Sun
        const sun = new Star({
            name: "sun",
            size: 110,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
        });
        system.AddBody(sun);

        // Mercury
        const mercury = new Planet({
            name: "mercury",
            size: 4,
            posToParent: new THREE.Vector3(400, 0, 0),
            axialTilt: 0.034,
            axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
            parent: sun.objectRoot,
        });
        system.AddBody(mercury);

        // Venus

        // Earth

        // Moon

        // Mars

        // Asteroids Belt

        // Jupiter

        // Saturn

        // Saturn's ring

        // Uranus

        // Uranus's ring

        // Neptune

        // Pluto

        return system;
    }
}