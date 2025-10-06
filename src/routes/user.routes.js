const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { getMe, getUserById, updateUser } = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");
const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/:id", authenticate, getUserById);
router.put("/update", authenticate, upload.single("profilePicture"), updateUser);

module.exports = router;
