// server/index.js
// -----------------------------------------------------------------------------
// Main Express server entry point
// - Connects to MongoDB
// - Loads environment variables
// - Mounts auth and code execution routes
// -----------------------------------------------------------------------------

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://playground-frontend-taupe.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// app.options("*", cors());
app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// --- Ensure User Indexes for Uniqueness ---
const User = require("./models/User");
mongoose.connection.once("open", async () => {
  try {
    await User.init();
    console.log("✅ User indexes ensured");
  } catch (err) {
    console.error("❌ Index setup error:", err.message);
  }
});

// --- Auth Routes ---
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// --- Code Execution Route ---
const executeRoute = require("./routes/execute");
app.use("/api/execute", executeRoute);


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
