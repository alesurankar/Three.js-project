import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { BlackHole } from "../entities/blackHole.js";
import { GravityCenter } from "../entities/gravityCenter.js";
import { AsteroidBelt } from "../entities/asteroidBelt.js";
import { GlbModel } from "../entities/glbModel.js";

export function createEntity(entityData, extraOptions = {}) 
{
  const options = { ...entityData, ...extraOptions };

  switch(entityData.type) {
    case "planet": return new Planet(options);
    case "star": return new Star(options);
    case "black_hole": return new BlackHole(options);
    case "gravity_center": return new GravityCenter(options);
    case "belt": return new AsteroidBelt(options);
    case "ring": return new AsteroidBelt(options);
    case "probe": return new GlbModel(options);
  }
}
