import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });

  process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.message}`);
    server.close(() => process.exit(1));
  });
};

process.on("uncaughtException", (error) => {
  console.error(`💥 Uncaught Exception: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});

startServer().catch((error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
