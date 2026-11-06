const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const Admin = require("../Model/adminmodel");

const AdminAuth = async (req, res, next) => {
  try {
    // Read token from cookie or header
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return res.status(401).json({ error: "Token is invalid or expired" });
    }

    // Find admin by ID
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (err) {
    console.error("AdminAuth Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { AdminAuth };
