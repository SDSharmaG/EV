const User = require("../Model/Usermodel.js");
const bcrypt = require("bcrypt");
const config = require("../Config/config.js");
const jwt = require("jsonwebtoken");
const getImageUrl = require("../Config/imageUrl");

//Register
const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      vehicleType,
      vehicleModel,
      preferredConnector,
    } = req.body;
    const imageName = req.file ? req.file.filename : "";

    const saltRounds = 10;
    const PasswordHash = await bcrypt.hash(password, saltRounds);

    const newuser = new User({
      name,
      email,
      password: PasswordHash,
      phone,
      address,
      city,
      state,
      pincode,
      vehicleType,
      vehicleModel,
      preferredConnector,
      profileImage: imageName || "",
    });

    await newuser.save();

    // Create token for auto-login after registration
    const token = jwt.sign({ id: newuser._id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User Registered successfully",
      token: token,
      user: {
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        phone: newuser.phone,
        address: newuser.address,
        city: newuser.city,
        state: newuser.state,
        pincode: newuser.pincode,
        vehicleType: newuser.vehicleType,
        vehicleModel: newuser.vehicleModel,
        preferredConnector: newuser.preferredConnector,
        profileImage: getImageUrl(newuser.profileImage, "Users"),
        role: newuser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
};
//get all user
const getalluser = async (req, res) => {
  try {
    const users = await User.find();
    const formatted = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      vehicleType: user.vehicleType,
      vehicleModel: user.vehicleModel,
      preferredConnector: user.preferredConnector,
      profileImage: getImageUrl(user.profileImage, "Users"),
      createdat: user.createdAt,
    }));
    res.status(200).json({
      success: true,
      message: "All Users fetched successfully!",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get single user by ID
const getuserbyid = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        vehicleType: user.vehicleType,
        vehicleModel: user.vehicleModel,
        preferredConnector: user.preferredConnector,
        profileImage: user.profileImage,
        createdat: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching station:", error);
    res
      .status(500)
      .json({ message: "Error fetching station", error: error.message });
  }
};

//to update User
const updateuser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedStation = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: {
        _id: updatedStation._id,
        id: updatedStation._id,
        name: updatedStation.name,
        email: updatedStation.email,
        role: updatedStation.role,
        phone: updatedStation.phone,
        address: updatedStation.address,
        city: updatedStation.city,
        state: updatedStation.state,
        pincode: updatedStation.pincode,
        vehicleType: updatedStation.vehicleType,
        vehicleModel: updatedStation.vehicleModel,
        preferredConnector: updatedStation.preferredConnector,
        profileImage: getImageUrl(updatedStation.profileImage, "Users"),
      },
    });
  } catch (error) {
    console.error("Error updating station:", error);
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// Delete User
const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "User ID is required" });

    const deletedStation = await User.findByIdAndDelete(id);

    if (!deletedStation)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting station:", error);
    res
      .status(500)
      .json({ message: "Error deleting station", error: error.message });
  }
};

//Login user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Invalid Credential" });
    }
    const escapedEmail = email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({
      email: new RegExp(`^${escapedEmail}$`, "i"),
    });
    if (!user) return res.status(400).json({ message: "Invalid Credential" });
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Continue with Google or reset your password.",
      });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credential" });

    //create token
    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    console.log("Generated token:", token);

    //set cookie before sending response
    res.cookie(
      "token",
      token
      //, {
      //httpOnly : true, //prevent 35 access
      // secure : false, //set to true in production (HTTPS)
      //sameSite : "strict"
      //}
    );

    // Send both token AND user data
    res.status(200).json({
      message: "Login Successfully",
      token: token,
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
        profileImage: getImageUrl(user.profileImage, "Users"),
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//logout user

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "LogOut Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET total users count
const userTotal = async (req, res) => {
  try {
    const count = await User.countDocuments(); // gets total number of users
    res.json({ success: true, totalUsers: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  getalluser,
  updateuser,
  deleteuser,
  getuserbyid,
  userTotal,
};
