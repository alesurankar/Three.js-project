import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { BlackHole } from "../entities/blackHole.js";
import { GravityCenter } from "../entities/gravityCenter.js";
import { AsteroidBelt } from "../entities/asteroidBelt.js";
import { GlbModel } from "../entities/glbModel.js";

export function createEntity(entityData, extraOptions = {}) 
{
  const options = { ...entityData, ...extraOptions };
  let entity;

  switch(entityData.type) {
    case "planet": entity = new Planet(options); break;
    case "star": entity = new Star(options); break;
    case "black_hole": entity = new BlackHole(options); break;
    case "gravity_center": entity = new GravityCenter(options); break;
    case "belt": entity = new AsteroidBelt(options); break;
    case "ring": entity = new AsteroidBelt(options); break;
    case "probe": entity = new GlbModel(options); break;
  }

  if (entity && extraOptions.posToParent) {
    entity.objectRoot.position.copy(extraOptions.posToParent);
  }

  return entity;
}
