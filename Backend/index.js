import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import expressStaticGzip from "express-static-gzip";

//Resloving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Routes
app.use("/api/users", userRoutes);

// Middleware
app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse JSON bodies

// Use the Frontend app

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

// Catch-all handler to send back index.html for any other routes
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, "../FrontEnd/dist/index.html"));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
