import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class GravityCenter extends CelestialBody 
{
  constructor({
    orbitRadius = 0,
    initialAngle = null,
    axialPeriod = 0,
    orbitalPeriod = 0,
    parent = null,
  } = {}) 
  {
    // Call base constructor
    super({
      renderMode: "none",
      orbitRadius,
      initialAngle,
      axialPeriod,
      orbitalPeriod,
      parent,
    });
  }
  
  Dispose()
  {
    super.Dispose();
  }
}