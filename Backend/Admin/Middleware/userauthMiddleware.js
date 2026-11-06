const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const User = require("../Model/Usermodel");

const UserAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    const token = authHeader.slice("Bearer ".length);

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

module.exports = { UserAuth };
