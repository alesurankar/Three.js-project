import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { BlackHole } from "../entities/blackHole.js";
import { AsteroidBelt } from "../entities/asteroidBelt.js";

export function createEntity(entityData, extraOptions = {}) 
{
    const options = { ...entityData, ...extraOptions };

    switch(entityData.type) {
        case "planet": return new Planet(options);
        case "star": return new Star(options);
        case "blackhole": return new BlackHole(options);
        case "belt": return new AsteroidBelt(options);
        case "ring": return new AsteroidBelt(options);
    }
}
