import EntityModel from "../models/entityModel.js";
import asyncErrorHandler from "../middlewares/helpers/asyncErrorHandler.js";
import { getEntities } from "../data/entityProvider.js";


/**
 * Create a new Entity
 * @route POST /api/entities
 * @access Public (for now)
 */
export const createEntity = asyncErrorHandler(async (req, res, next) => {
  console.log("🔥 createEntity triggered");

  const { key, name, type, parentKey, systemKey, galaxyKey, size } = req.body;

  // Basic validation
  if ( !key || !name || !type || !parentKey || !systemKey || !galaxyKey || !size) {
      return res.status(400).json({ message: "All fields are required" });
  }

  // Create new entity
  const entity = await EntityModel.create({ 
    key, 
    name,  
    type,
    parentKey,
    systemKey,
    galaxyKey,
    size,
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
  const entities = await getEntities();
  
  res.status(200).json({
    success: true,
    count: entities.length,
    entities,
  });
});
