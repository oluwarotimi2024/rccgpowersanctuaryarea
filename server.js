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

/* DATABASE CONNECTION */
connectDB();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SESSION CONFIGURATION */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'church_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/power_sanctuary',
    }),
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production" 
    },
  })
);

/* MEDIA UPLOAD SETUP */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        cb(null, "sanctuary-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/* STATIC ASSETS */
// We serve the uploads and public folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

/* API ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sermons", require("./routes/sermonRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/prayers", require("./routes/prayerRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

/* --- SMART PAGE ROUTING --- */

/**
 * HELPER: Find files in multiple possible locations
 * This prevents 404s if folder names are capitalized differently on GitHub
 */
const findFile = (subPath) => {
  const possibleLocations = [
    path.join(__dirname, "views", subPath),
    path.join(__dirname, "Views", subPath),
    path.join(__dirname, subPath)
  ];
  return possibleLocations.find(p => fs.existsSync(p));
};

// 1. ADMIN LOGIN PAGE (URL: /admin)
app.get("/admin", (req, res) => {
  const filePath = findFile("admin/login.html");
  if (filePath) return res.sendFile(filePath);
  
  // Debug helper if file is missing
  res.status(404).send("Admin Login file not found. Ensure views/admin/login.html exists.");
});

// 2. ADMIN DASHBOARD PAGE (URL: /admin/dashboard)
app.get("/admin/dashboard", (req, res) => {
  const filePath = findFile("admin/dashboard.html");
  if (filePath) return res.sendFile(filePath);
  
  res.status(404).send("Dashboard file not found. Ensure views/admin/dashboard.html exists.");
});

// 3. HOME PAGE (URL: /)
app.get("/", (req, res) => {
  const filePath = findFile("frontend/index.html");
  if (filePath) return res.sendFile(filePath);
  
  res.status(404).send("Frontend Home page not found.");
});

/* SERVER START */
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
