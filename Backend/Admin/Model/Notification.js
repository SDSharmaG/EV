// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String }, // booking_update, new_booking, etc.
    message: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    role: { type: String, enum: ["admin", "user"] },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
