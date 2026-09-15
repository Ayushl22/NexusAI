import "dotenv/config";

import cors from "cors";
import express from "express";

import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const localOrigins = ["http://localhost:5173", "http://localhost:3000"];
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);

app.use((req, res, next) => {
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0];
  const requestOrigin = `${forwardedProtocol || req.protocol}://${req.get("host")}`;

  return cors({
    origin(origin, callback) {
      const isAllowed =
        !origin || origin === requestOrigin || allowedOrigins.has(origin.replace(/\/$/, ""));
      callback(null, isAllowed);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(req, res, next);
});

const requestBodyLimit = process.env.VERCEL ? "4mb" : "50mb";
app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));

app.use((req, res, next) => {
  console.log(`REQ ${req.method} ${req.originalUrl}`);
  next();
});

const healthResponse = (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexusAI API is running successfully 🚀",
  });
};

app.get("/", healthResponse);
app.get("/api/health", healthResponse);

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

app.use(errorHandler);

export default app;
