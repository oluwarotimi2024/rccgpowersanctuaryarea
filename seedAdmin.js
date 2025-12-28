// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin"); 

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/power_sanctuary');
    console.log("Connected to MongoDB...");

    // We do NOT hash the password here because your 
    // AdminSchema.pre("save") does it for us automatically!
    const adminData = {
      name: "Oluwarotimi Sunday",
      email: "admin@powersanctuary.org",
      password: "sanctuary2025", 
      role: "superadmin" // This matches your Enum perfectly
    };

    // Check if admin already exists to prevent "Unique Email" error
    const existing = await Admin.findOne({ email: adminData.email });
    if (existing) {
      console.log("⚠️ Admin already exists. Updating password instead...");
      existing.password = adminData.password;
      await existing.save();
    } else {
      const newAdmin = new Admin(adminData);
      await newAdmin.save();
    }

    console.log("✅ SUCCESS! Admin is ready.");
    console.log("Email: admin@powersanctuary.org");
    console.log("Password: sanctuary2025");
    process.exit();

  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

seed();