const express = require("express");
const { loginAdmin } = require("../controllers/authController");
const { registerAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
