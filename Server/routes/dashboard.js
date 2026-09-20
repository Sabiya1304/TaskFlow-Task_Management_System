const express = require("express");

const {
    getDashboard
} = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard
router.get("/", getDashboard);

module.exports = router;