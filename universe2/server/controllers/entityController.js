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

    const { name, type } = req.body;

    // Basic validation
    if (!name || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const safeName = slugify(name);
    const safeType = slugify(type);

    // base key: type_name
    let baseKey = `${safeType}_${safeName}`;
    let key = baseKey;

    // ensure unique key
    let counter = 1;
    while (await EntityModel.findOne({ key })) {
        key = `${baseKey}_${counter}`;
        counter++;
    }

    // Create new entity
    const entity = await EntityModel.create({ 
        key, 
        name, 
        type: safeType, 
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
