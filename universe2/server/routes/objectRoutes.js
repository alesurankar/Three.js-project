import express from "express";
import { createObject, getAllObjects } from "../controllers/objectController.js";

const router = express.Router();

// POST /api/objects -> create a new object
router.post("/", createObject);

// GET /api/objects -> get all objects
router.get("/", getAllObjects);

export default router;
