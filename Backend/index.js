import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import userRoutes from "./routes/userRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import expressStaticGzip from "express-static-gzip";

//Resloving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());

// 🚀 PERFORMANCE: Compress all responses (reduces size by ~90%)
app.use(compression({
  level: 6, // Balance between speed and compression
  threshold: 1024, // Only compress responses > 1KB
}));

app.use(express.json({ limit: "20mb" })); // Increased body size limit
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Increased body size limit

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/contest", contestRoutes);

// ✅ Serve static frontend
app.use(
  "/",
  expressStaticGzip(path.join(__dirname, "public"), {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: function (res, path) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.use(express.static(path.join(__dirname, "../FrontEnd/dist")));

// ✅ Catch-all route
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../FrontEnd/dist/index.html"));
});

// MongoDB Connection with Connection Pooling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // 🚀 PERFORMANCE: Connection pooling for better concurrency
    maxPoolSize: 50,              // Maximum 50 connections
    minPoolSize: 10,              // Keep 10 connections ready
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB with connection pooling");
    console.log("📊 Pool size: 10-50 connections");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});