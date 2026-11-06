const getAdminProfile = async (req, res) => {
  try {
    // admin is attached in AdminAuth middleware
    const admin = req.admin;

    const profile = {
      name: admin.name,
      email: admin.email,
      role: "admin"
    };

    res.status(200).json({ profile });

  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAdminProfile };


