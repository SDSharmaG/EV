const mongoose = require("mongoose");

const ChargerSchema = new mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    chargername: { type: String, required: true },
    type: {
      type: String,
      enum: ["AC", "DC Fast", "Superfast"],
      required: true,
    },
    poweroutput: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "In Use", "Under Maintenance", "Offline"],
      required: true,
    },
    connectortype: {
      type: String,
      enum: ["Type 1", "Type 2", "GB/T (AC)"],
      required: true,
    },
    rate: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Charger", ChargerSchema);
