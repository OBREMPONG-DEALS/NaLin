
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Starting NaLin backend...");
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connection successful.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`NaLin API is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("SERVER ERROR:", error);

      process.exit(1);
    });
  } catch (error) {
    console.error("BACKEND STARTUP ERROR:");
    console.error(error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);

    process.exit(1);
  }
};

startServer();

