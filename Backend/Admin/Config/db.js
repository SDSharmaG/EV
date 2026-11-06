const mongoose = require("mongoose");
const config = require("../Config/config");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(config.mongoURL);
    console.log("Connect to MongoDB Successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
