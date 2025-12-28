const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createPrayer,
  getPrayers,
  updatePrayerStatus,
} = require("../controllers/prayerController");

router.post("/", createPrayer);
router.get("/", auth, getPrayers);
router.put("/:id", auth, updatePrayerStatus);

module.exports = router;
