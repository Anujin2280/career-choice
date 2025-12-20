import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import professionRoutes from "./routes/professionRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS тохиргоо — зөв хэлбэрээр
app.use(
  cors({
    origin: "http://localhost:5173", // frontend порт
    credentials: true, // cookie дамжуулах бол
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/professions", professionRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API Working ✅"));

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
