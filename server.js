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

/* --- PAGE ROUTES --- */

// 1. ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
  // We check for both "admin" and "Admin" folders
  const paths = [
    path.join(__dirname, "views/admin/login.html"),
    path.join(__dirname, "views/Admin/login.html"),
    path.join(__dirname, "admin/login.html")
  ];

  const loginPath = paths.find(p => fs.existsSync(p));
  
  if (loginPath) {
    res.sendFile(loginPath);
  } else {
    // This part helps us see exactly what is on your server if it fails
    let existingFiles = "";
    try {
        const baseDir = path.join(__dirname, "views");
        existingFiles = fs.readdirSync(baseDir).join(", ");
    } catch(e) { existingFiles = "Could not read views folder"; }

    res.status(404).send(`
      <h2>Admin Login (login.html) not found.</h2>
      <p>The server looked in: <b>views/admin/</b> and <b>views/Admin/</b></p>
      <p>Folders found in 'views': <b>${existingFiles}</b></p>
      <p>Please ensure your folder is named <b>admin</b> and contains <b>login.html</b>.</p>
    `);
  }
});

// 2. ADMIN DASHBOARD PAGE
app.get("/admin/dashboard", (req, res) => {
  const paths = [
    path.join(__dirname, "views/admin/dashboard.html"),
    path.join(__dirname, "views/Admin/dashboard.html")
  ];
  const dashPath = paths.find(p => fs.existsSync(p));
  if (dashPath) res.sendFile(dashPath);
  else res.status(404).send("Dashboard file not found.");
});
// 3. HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/frontend/index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
