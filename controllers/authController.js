const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

/* REGISTER ADMIN */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Note: Password hashing happens in the Model's .pre("save") hook
    const admin = await Admin.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/* LOGIN */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email); 

    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ message: "Admin account not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    req.session.admin = {
      id: admin._id,
      role: admin.role,
      name: admin.name,
    };

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: "Session Save Error" });
      res.json({ message: "Login successful", admin: req.session.admin });
    });

  } catch (error) {
    console.error("Login Controller Error:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

/* LOGOUT */
exports.logoutAdmin = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Could not log out" });
      res.clearCookie('connect.sid'); 
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Already logged out" });
  }
};