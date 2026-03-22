import api from "./api";

export async function loadEntities(requiredKeys, scaleMap) {
  const res = await api.get("/entities");
  const entities = res.data.entities;

  // Build lookup map
  const entityMap = Object.fromEntries(entities.map(e => [e.key, e]));
  // console.log("Received entity keys:", Object.keys(entityMap));

  // Validate required keys
  for (const key of requiredKeys) {
    if (!entityMap[key]) {
      throw new Error(
        `Entity "${key}" is missing from server response. Available keys: ${Object.keys(entityMap).join(", ")}`
      );
    }
  }

  // Build size map safely
  const sizeMap = {};
  for (const [key, scale] of Object.entries(scaleMap)) {
    if (!entityMap[key]) {
      throw new Error(`Cannot compute size: entity "${key}" missing`);
    }
    sizeMap[key] = entityMap[key].size * scale;
  }

  return { entityMap, sizeMap };
}