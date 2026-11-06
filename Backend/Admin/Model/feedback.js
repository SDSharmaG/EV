const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
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
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model('Feedback', feedbackSchema);
