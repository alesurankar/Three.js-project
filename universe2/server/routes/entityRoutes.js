import express from "express";
import { createEntity, getAllEntities } from "../controllers/entityController.js";

const router = express.Router();

// POST /api/objects -> create a new object
router.post("/", createEntity);

// GET /api/objects -> get all objects
router.get("/", getAllEntities);

export default router;
