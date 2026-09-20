const express = require("express");

const {
    register,
    login,
    getMe,
    updateProfile
} = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// User routes
router.get("/me", getMe);
router.put("/profile", updateProfile);

module.exports = router;