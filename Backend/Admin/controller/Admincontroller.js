const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const Admin = require("../Model/adminmodel");

//Register
const Register = async (req, res) => {
  const newAdmin = new Admin(req.body);
  console.log(newAdmin);
  try {
    //1.Extract user data from request body
    const { name, email, password } = req.body;
    const saltRounds = 10;
    //2.Hash the password with bcrypt (10 saltrounds)
    const PasswordHash = await bcrypt.hash(password, saltRounds);
    //3.Create a new user object with hashed password
    const newadmin = new Admin({
      name,
      email,
      password: PasswordHash,
    });
    //save user to the database
    await newadmin.save();
    //Method 1 . send a success response(without password for security)
    res.status(201).json({
      id: newadmin._id,
      name: newadmin.name,
      email: newadmin.email,
      message: "Admin Registered successfully",
    });
    //Method 2 . Send a success password with full information
    //res.status(200).json(newuser)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid Credentials Email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials passweord" });

    const token = jwt.sign({ id: admin._id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    // Set token cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // true in production (HTTPS)
    //   sameSite: "Lax",
    //   maxAge: 3600000, // 1 hour
    // });

    // res.status(200).json({ message: "Login Successful" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//logout user

const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // res.clearCookie(token)
    res.status(200).json({ message: "LogOut Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { Register, Login, Logout };
