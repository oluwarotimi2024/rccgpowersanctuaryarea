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

/* STATIC FILES & ASSETS */
// Serve uploads and public assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// IMPORTANT: We do NOT use app.use("/admin", static) here anymore.
// This allows our custom routes below to handle the /admin URL properly.

/* API ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sermons", require("./routes/sermonRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/prayers", require("./routes/prayerRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

/* --- SMART PAGE ROUTING --- */

// Helper to find files regardless of folder casing (views/admin vs views/Admin)
const getSafePath = (subPath) => {
  const root = __dirname;
  const checks = [
    path.join(root, "views", subPath),
    path.join(root, "Views", subPath),
    path.join(root, subPath)
  ];
  return checks.find(p => fs.existsSync(p));
};

// 1. ADMIN LOGIN PAGE (URL: /admin)
app.get("/admin", (req, res) => {
  const filePath = getSafePath("admin/login.html");
  if (filePath) return res.sendFile(filePath);
  res.status(404).send("<h2>Admin Login File Not Found</h2>");
});

// 2. ADMIN DASHBOARD PAGE (URL: /admin/dashboard)
// We add '*' to handle /admin/dashboard.html automatically
app.get("/admin/dashboard*", (req, res) => {
  const filePath = getSafePath("admin/dashboard.html");
  if (filePath) return res.sendFile(filePath);
  res.status(404).send("<h2>Dashboard File Not Found</h2>");
});

// 3. HOME PAGE (URL: /)
app.get("/", (req, res) => {
  const filePath = getSafePath("frontend/index.html");
  if (filePath) return res.sendFile(filePath);
  // Fallback to static serving if custom route fails
  res.sendFile(path.join(__dirname, "views/frontend/index.html"));
});

// 4. CATCH-ALL FOR OTHER FRONTEND FILES
app.use(express.static(path.join(__dirname, "views/frontend")));

/* SERVER START */
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
