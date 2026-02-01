import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Universe API works!" });
});

export default router;  // <--- default export
