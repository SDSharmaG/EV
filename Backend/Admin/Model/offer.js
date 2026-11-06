const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minAmount: { type: Number, default: 0 },
    applicableStations: { type: [String], default: ["all"] },
    validFrom: Date,
    validTill: Date,
    image: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
