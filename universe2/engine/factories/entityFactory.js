import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { BlackHole } from "../entities/blackHole.js";
import { GravityCenter } from "../entities/gravityCenter.js";
import { AsteroidBelt } from "../entities/asteroidBelt.js";
import { GlbModel } from "../entities/glbModel.js";

let activeObjectMap = null;
let activeRequiredKeys = null;

export function SetEntityObjectMap(objectMap, requiredKeys) {
  activeObjectMap = objectMap;
  activeRequiredKeys = new Set(requiredKeys);
}

export function ClearEntityObjectMap() {
  activeObjectMap = null;
  activeRequiredKeys = null;
}

export function createEntity(entityData, extraOptions = {}) 
{
  let parent = extraOptions.parent;
  if (parent === undefined && entityData.parentKey && activeObjectMap) {
    const parentEntity = activeObjectMap[entityData.parentKey];
    if (!parentEntity && activeRequiredKeys?.has(entityData.parentKey)) {
      throw new Error(`Parent "${entityData.parentKey}" for "${entityData.key}" has not been created`);
    }
    if (parentEntity) {
      parent = entityData.type === "ring" ? parentEntity.axialFrame : parentEntity.objectRoot;
    }
  }

  const options = { ...entityData, ...extraOptions, parent };
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
