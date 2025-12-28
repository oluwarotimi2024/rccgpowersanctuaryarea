const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  registerMember,
  getMembers,
  deleteMember,
} = require("../controllers/memberController");

router.post("/", registerMember);
router.get("/", auth, getMembers);
router.delete("/:id", auth, deleteMember);

module.exports = router;
