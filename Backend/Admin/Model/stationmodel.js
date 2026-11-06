const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    chargers: { type: Number, required: true },
    address: { type: String, required: true },
    image: { type: String },
    status: {
      type: String,
      enum: ["Open", "Close", "Maintenance"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Station", stationSchema);
