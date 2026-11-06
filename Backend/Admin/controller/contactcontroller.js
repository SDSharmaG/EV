const ContactMessage = require("../Model/ContactMessage");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { createContact };
