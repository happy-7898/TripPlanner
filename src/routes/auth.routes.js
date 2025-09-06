const express = require("express");
const { signup, verifyOtp, login, getMe } = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", signup);
router.post("/register/verifyOtp", verifyOtp);
router.post("/login", login);
router.get("/me", authenticate, getMe);

module.exports = router;
