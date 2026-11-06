const express = require("express");
const Authcontroller = require("../controller/Authcontroller");
const { UserAuth } = require("../Middleware/userauthMiddleware");

const router = express.Router();

router.post("/booking-otp/request", UserAuth, Authcontroller.requestBookingOtp);
router.post("/booking-otp/verify", UserAuth, Authcontroller.verifyBookingOtp);
router.post("/password-reset/request", Authcontroller.requestPasswordReset);
router.post("/password-reset/confirm", Authcontroller.resetPassword);
router.post("/google", Authcontroller.googleSignIn);

module.exports = router;
