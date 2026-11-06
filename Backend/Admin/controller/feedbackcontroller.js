const Feedback = require("../Model/feedback");
const Booking = require("../Model/Bookings");

// CREATE FEEDBACK
const createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Feedback allowed only after payment",
      });
    }

    const exists = await Feedback.findOne({ bookingId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });
    }

    const feedback = await Feedback.create({
      userId: booking.userId,
      bookingId,
      stationId: booking.stationId,
      chargerId: booking.chargerId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL FEEDBACK (ADMIN)
const getAllFeedback = async (req, res) => {
  try {
    const feedbackDetails = await Feedback.find()
      .populate("userId", "name email")
      .populate("stationId", "name")
      .populate("chargerId", "chargername");

    const formatted = feedbackDetails.map((f) => ({
      id: f._id,
      userName: f.userId?.name || "Unknown",
      userEmail: f.userId?.email || "N/A",
      stationName: f.stationId?.name || "N/A",
      chargerName: f.chargerId?.chargername || "N/A",
      rating: f.rating,
      comment: f.comment,
      createdAt: f.createdAt,
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Get feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

// GET USER FEEDBACK
const getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;

    const feedbacks = await Feedback.find({ userId })
      .populate("stationId", "name")
      .populate("chargerId", "chargername");

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const FeedbackTotal = async (req, res) => {
  try {
    const count = await Feedback.countDocuments();
    res.json({ success: true, totalFeedback: count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server Error", err });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getUserFeedback,
  FeedbackTotal,
};
