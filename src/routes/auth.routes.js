const express = require("express");
const { signup, verifyOtp } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", signup);
router.post("/register/verifyOtp", verifyOtp);

module.exports = router;
