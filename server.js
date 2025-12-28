require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const connectDB = require("./config/db");
const app = express();

/* DATABASE */
connectDB();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SESSION */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'church_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/power_sanctuary',
    }),
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24,
      secure: false 
    },
  })
);

/* --- MEDIA UPLOAD CONFIGURATION --- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, "sanctuary-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/* STATIC FILES */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
// Serving static files from views
app.use(express.static(path.join(__dirname, "views/admin")));
app.use(express.static(path.join(__dirname, "views/frontend")));

/* API ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sermons", require("./routes/sermonRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/prayers", require("./routes/prayerRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Dedicated Media Upload Route
app.post("/api/media/upload", upload.array("media", 10), (req, res) => {
    try {
        const files = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname
        }));
        res.status(200).json({ message: "Upload successful", files });
    } catch (error) {
        res.status(500).json({ message: "Upload failed" });
    }
});

/* --- PAGE ROUTES (The Fix) --- */

// 1. Admin Page Route
app.get("/admin", (req, res) => {
  // This looks for views/admin/index.html or views/Admin/index.html
  const adminPath = path.join(__dirname, "views/admin/index.html");
  const adminPathAlt = path.join(__dirname, "views/Admin/index.html");
  
  if (fs.existsSync(adminPath)) {
    res.sendFile(adminPath);
  } else {
    res.sendFile(adminPathAlt);
  }
});

// 2. Frontend Page Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/frontend/index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
