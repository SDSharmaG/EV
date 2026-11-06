const express = require("express");
const router = express.Router();
const profileController = require("../controller/profilecontoller");
const { AdminAuth } = require("../Middleware/authMiddleware");

router.get("/profile", AdminAuth, profileController.getAdminProfile);

module.exports = router;
