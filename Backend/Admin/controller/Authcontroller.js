const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const config = require("../Config/config");
const User = require("../Model/Usermodel");
const EmailVerification = require("../Model/EmailVerification");

const googleClient = new OAuth2Client();
const OTP_LIFETIME_MS = 10 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const emailExpression = (email) =>
  new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const sendEmail = async ({ to, subject, text }) => {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    const error = new Error(
      "Email service is not configured. Set RESEND_API_KEY and EMAIL_FROM."
    );
    error.status = 503;
    throw error;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [to], subject, text }),
  });

  if (!response.ok) {
    const error = new Error(`Email delivery failed (${response.status}).`);
    error.status = 502;
    throw error;
  }
};

const issueOtp = async ({ email, userId, purpose }) => {
  const now = new Date();
  const existing = await EmailVerification.findOne({ email, purpose });
  if (
    existing &&
    now.getTime() - existing.lastSentAt.getTime() < OTP_RESEND_DELAY_MS
  ) {
    const error = new Error("Please wait before requesting another code.");
    error.status = 429;
    throw error;
  }

  const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  await EmailVerification.findOneAndUpdate(
    { email, purpose },
    {
      $set: {
        userId,
        codeHash: hashValue(code),
        expiresAt: new Date(now.getTime() + OTP_LIFETIME_MS),
        lastSentAt: now,
        attempts: 0,
        verifiedAt: null,
        verificationTokenHash: null,
        consumedAt: null,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  try {
    await sendEmail({
      to: email,
      subject: purpose === "booking" ? "Your booking verification code" : "Reset your password",
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    });
  } catch (error) {
    await EmailVerification.deleteOne({ email, purpose });
    throw error;
  }
};

const matchesHash = (value, expectedHash) => {
  const actual = Buffer.from(hashValue(value), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

const failOtpAttempt = async (record) => {
  record.attempts += 1;
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await record.deleteOne();
  } else {
    await record.save();
  }
};

const requestBookingOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.user.email);
    await issueOtp({ email, userId: req.user._id, purpose: "booking" });
    return res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("Booking OTP error:", error.message);
    return res.status(error.status || 500).json({
      message: error.status ? error.message : "Could not send verification code.",
    });
  }
};

const verifyBookingOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.user.email);
    const { code } = req.body;
    if (!/^\d{6}$/.test(code || "")) {
      return res.status(400).json({ message: "Enter the 6-digit code." });
    }

    const record = await EmailVerification.findOne({
      email,
      userId: req.user._id,
      purpose: "booking",
      expiresAt: { $gt: new Date() },
      consumedAt: null,
    });
    if (!record) {
      return res.status(400).json({ message: "Code expired. Request a new one." });
    }
    if (record.attempts >= MAX_OTP_ATTEMPTS || !matchesHash(code, record.codeHash)) {
      await failOtpAttempt(record);
      return res.status(400).json({ message: "Invalid code." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    record.verifiedAt = new Date();
    record.verificationTokenHash = hashValue(verificationToken);
    await record.save();
    return res.status(200).json({ verificationToken });
  } catch (error) {
    console.error("Booking OTP verification error:", error.message);
    return res.status(500).json({ message: "Could not verify code." });
  }
};

const requestPasswordReset = async (req, res) => {
  const genericResponse = {
    message: "If an account exists for that email, a reset code has been sent.",
  };
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(200).json(genericResponse);

    const user = await User.findOne({ email: emailExpression(email) });
    if (user) {
      try {
        await issueOtp({ email, userId: user._id, purpose: "password-reset" });
      } catch (error) {
        if (error.status !== 429) throw error;
      }
    }
    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Password reset request error:", error.message);
    return res.status(error.status || 500).json({
      message: error.status
        ? error.message
        : "Could not process password reset request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { code, password } = req.body;
    if (!email || !/^\d{6}$/.test(code || "") || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Enter a valid email, 6-digit code, and password with at least 8 characters.",
      });
    }

    const record = await EmailVerification.findOne({
      email,
      purpose: "password-reset",
      expiresAt: { $gt: new Date() },
      consumedAt: null,
    });
    if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
      return res.status(400).json({ message: "Code expired or invalid. Request a new one." });
    }
    if (!matchesHash(code, record.codeHash)) {
      await failOtpAttempt(record);
      return res.status(400).json({ message: "Code expired or invalid. Request a new one." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: record.userId, email: emailExpression(email) },
      { password: passwordHash },
      { new: true }
    );
    if (!user) return res.status(400).json({ message: "Unable to reset password." });
    await record.deleteOne();
    return res.status(200).json({ message: "Password reset successfully. Please sign in." });
  } catch (error) {
    console.error("Password reset error:", error.message);
    return res.status(500).json({ message: "Could not reset password." });
  }
};

const googleSignIn = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: "Google sign-in is not configured." });
    }
    const { credential } = req.body;
    if (typeof credential !== "string" || !credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error("Google credential verification failed:", error.message);
      return res.status(401).json({ message: "Google account could not be verified." });
    }
    const googleUser = ticket.getPayload();
    if (!googleUser?.sub || !googleUser.email || googleUser.email_verified !== true) {
      return res.status(401).json({ message: "Google account could not be verified." });
    }

    const email = normalizeEmail(googleUser.email);
    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: emailExpression(email) }],
    });
    if (!user) {
      user = await User.create({
        name: googleUser.name || email,
        email,
        googleId: googleUser.sub,
        profileImage: googleUser.picture || "",
      });
    } else if (!user.googleId) {
      user.googleId = googleUser.sub;
      if (!user.profileImage && googleUser.picture) {
        user.profileImage = googleUser.picture;
      }
      await user.save();
    } else if (user.googleId !== googleUser.sub) {
      return res.status(409).json({ message: "This email is linked to another Google account." });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        vehicleType: user.vehicleType,
        vehicleModel: user.vehicleModel,
        preferredConnector: user.preferredConnector,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    return res.status(500).json({ message: "Google sign-in failed." });
  }
};

module.exports = {
  requestBookingOtp,
  verifyBookingOtp,
  requestPasswordReset,
  resetPassword,
  googleSignIn,
};
