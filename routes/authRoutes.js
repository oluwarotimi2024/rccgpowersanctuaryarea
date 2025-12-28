const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/authController");

router.post("/register", registerAdmin); // run once
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
