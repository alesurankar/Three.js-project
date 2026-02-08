import { Planet } from "./planet.js";
import { Star } from "./star.js";
import { BlackHole } from "./blackHole.js";
import { TestObject } from "./testObject.js";

export function createEntity(entityData, extraOptions = {}) {
    const options = { ...entityData, ...extraOptions };

    switch(entityData.type) {
        case "planet": return new Planet(options);
        case "star": return new Star(options);
        case "blackhole": return new BlackHole(options);
        default: return new TestObject(options);
    }
}
