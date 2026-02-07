import { Star } from "../entities/star.js";
import { BlackHole } from "../entities/blackHole.js";

export class TestObject {
  constructor(entityData, parent) {
    this.entityData = entityData;
    this.parent = parent;
    this.instance = null;

    this.#createInstance();
  }

  #createInstance() {
    const { type } = this.entityData;

    switch (type) {
      case "star":
        this.instance = new Star({
          size: 100,
          posToParent: { x: 0, y: 0, z: 0 },
          parent: this.parent,
        });
        break;

      case "blackhole":
        this.instance = new BlackHole({
          size: 200,
          posToParent: { x: 0, y: 0, z: 0 },
          parent: this.parent,
        });
        break;

      default:
        console.warn("Unknown entity type:", type);
    }
  }

  Update(dt) {
    this.instance?.Update?.(dt);
  }

  Dispose() {
    this.instance?.Dispose?.();
  }
}
