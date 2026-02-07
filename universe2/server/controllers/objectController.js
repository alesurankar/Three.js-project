import ObjectModel from "../models/objectModel.js";
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
 * Create a new Object
 * @route POST /api/objects
 * @access Public (for now)
 */
export const createObject = asyncErrorHandler(async (req, res, next) => {
    console.log("🔥 createObject triggered");

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
    while (await ObjectModel.findOne({ key })) {
        key = `${baseKey}_${counter}`;
        counter++;
    }

    // Create new object
    const object = await ObjectModel.create({ 
        key, 
        name, 
        type: safeType, 
    });

    res.status(201).json({
        success: true,
        object,
        message: "Object created successfully",
    });
});

/**
 * Get all Objects
 * @route GET /api/objects
 * @access Public
 */
export const getAllObjects = asyncErrorHandler(async (req, res, next) => {
    const objects = await ObjectModel.find({});
    res.status(200).json({
        success: true,
        count: objects.length,
        objects,
    });
});
