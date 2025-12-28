// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); 

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/power_sanctuary');
    console.log("Connected to MongoDB...");

    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("sanctuary2025", salt);

    // 2. Create Admin Object
    // NOTE: If 'Admin' fails, try 'superadmin' or just remove the role line
    const adminData = {
      name: "Super Admin",
      email: "admin@powersanctuary.org",
      password: hashedPassword,
      role: "Admin" // Changed 'admin' to 'Admin'
    };

    const newAdmin = new Admin(adminData);

    await newAdmin.save();
    console.log("✅ Admin Created Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Still failing? Let's try without the role.");
    
    // FALLBACK: Try creating without the role field if your schema allows it
    try {
        const altAdmin = new Admin({
            name: "Super Admin",
            email: "admin@powersanctuary.org",
            password: await bcrypt.hash("sanctuary2025", 10)
        });
        await altAdmin.save();
        console.log("✅ Admin Created Successfully (Role omitted)!");
        process.exit();
    } catch (innerError) {
        console.error("Final Error:", innerError.message);
        process.exit(1);
    }
  }
};

seed();