import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";


export class StarSystem 
{
    static TimeScale = 500;
    static OrbitalRotationInDays(days, scale = StarSystem.TimeScale) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
    static AxialRotationInDays(days, scale = StarSystem.TimeScale) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }

    constructor(scene) 
    {
    }

    Update() 
    {
    }
}