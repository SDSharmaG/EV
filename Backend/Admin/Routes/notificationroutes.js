const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification"); // fixed capitalization

// Get notifications by role (Admin / User)

router.get("/notifications/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const notifications = await Notification.find({ role }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get notifications for a specific user

router.get("/notifications/:role/:userId", async (req, res) => {
  try {
    const { role, userId } = req.params;
    const notifications = await Notification.find({ role, userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark single notification as read

router.put("/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 1 }, // mark as read
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Optional: Mark all notifications as read for a user

router.put("/notifications/read-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, status: 0 },
      { status: 1 }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
