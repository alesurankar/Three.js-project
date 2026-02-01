// server/controllers/objectController.js

import ObjectModel from "../models/objectModel.js"; // your Mongoose model
import asyncErrorHandler from "../middlewares/helpers/asyncErrorHandler.js";

/**
 * Create a new Object
 * @route POST /api/objects
 * @access Public (for now)
 */
export const createObject = asyncErrorHandler(async (req, res, next) => {
    console.log("🔥 createObject triggered");

    const { id, name } = req.body;

    // Basic validation
    if (!id || !name) {
        return res.status(400).json({ message: "Both id and name are required" });
    }

    // Check if object already exists
    const existingObject = await ObjectModel.findOne({ id });
    if (existingObject) {
        return res.status(400).json({ message: "Object with this ID already exists" });
    }

    // Create new object
    const object = await ObjectModel.create({ id, name });

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
