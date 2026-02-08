import EntityModel from "../models/entityModel.js";
import asyncErrorHandler from "../middlewares/helpers/asyncErrorHandler.js";


// helper: convert text to safe slug
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Create a new Entity
 * @route POST /api/entities
 * @access Public (for now)
 */
export const createEntity = asyncErrorHandler(async (req, res, next) => {
    console.log("🔥 createEntity triggered");

    const { key, name, type, parentKey, systemKey, galaxyKey } = req.body;

    // Basic validation
    if ( !key || !name || !type || !parentKey || !systemKey || !galaxyKey) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const safeKey = slugify(key);
    const safeType = slugify(type);
    const safeParentKey = slugify(parentKey);
    const safeSystemKey = slugify(systemKey);
    const safeGalaxyKey = slugify(galaxyKey);

    // Create new entity
    const entity = await EntityModel.create({ 
        key: safeKey, 
        name,  
        type: safeType,
        parentKey: safeParentKey,
        systemKey: safeSystemKey,
        galaxyKey: safeGalaxyKey,
    });

    res.status(201).json({
        success: true,
        entity,
        message: "Entity created successfully",
    });
});

/**
 * Get all entities
 * @route GET /api/entities
 * @access Public
 */
export const getAllEntities = asyncErrorHandler(async (req, res, next) => {
    const entities = await EntityModel.find({});
    res.status(200).json({
        success: true,
        count: entities.length,
        entities,
    });
});
