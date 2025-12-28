const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/", auth, getMessages);
router.delete("/:id", auth, deleteMessage);

module.exports = router;
