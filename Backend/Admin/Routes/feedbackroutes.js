const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  getUserFeedback,
  FeedbackTotal,
} = require("../controller/feedbackcontroller");

// ADMIN → get all feedback
router.get("/adminfeedback", getAllFeedback);

// USER → create feedback
router.post("/create", createFeedback);

// USER → get feedback by userId
router.get("/user/:userId", getUserFeedback);

//Feedback total count
router.get("/total", FeedbackTotal);

module.exports = router;
