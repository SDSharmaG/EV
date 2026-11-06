const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    purpose: {
      type: String,
      enum: ["booking", "password-reset"],
      required: true,
    },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastSentAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    verifiedAt: Date,
    verificationTokenHash: String,
    consumedAt: Date,
  },
  { timestamps: true }
);

emailVerificationSchema.index({ email: 1, purpose: 1 }, { unique: true });
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
