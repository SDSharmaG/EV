// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    chargerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charger",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    vehicleType: String,
    status: { type: String, default: "pending" }, // pending, approved, rejected
    totalCost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
