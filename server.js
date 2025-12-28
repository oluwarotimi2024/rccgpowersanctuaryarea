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
app.use("/admin", express.static(path.join(__dirname, "views/admin")));
app.use(express.static(path.join(__dirname, "views/frontend")));

/* API ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sermons", require("./routes/sermonRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/prayers", require("./routes/prayerRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

/* --- PAGE ROUTES --- */

// 1. ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
  // Matches your GitHub filename: login.html
  const loginPath = path.join(__dirname, "views/admin/login.html");
  
  if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    res.status(404).send("Admin Login file (login.html) not found in views/admin.");
  }
});

// 2. ADMIN DASHBOARD PAGE
app.get("/admin/dashboard", (req, res) => {
  // Matches your GitHub filename: dashboard.html
  const dashboardPath = path.join(__dirname, "views/admin/dashboard.html");
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.status(404).send("Dashboard file (dashboard.html) not found.");
  }
});

// 3. HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/frontend/index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
