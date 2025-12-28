const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");
const {
  createSermon,
  getSermons,
  deleteSermon,
} = require("../controllers/sermonController");

router.get("/", getSermons);
router.post("/", auth, upload.single("file"), createSermon);
router.delete("/:id", auth, deleteSermon);

module.exports = router;
