const express = require("express");
const cors = require("cors");

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Allow requests from the frontend.
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server-to-server calls.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("This origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON requests containing product details and multiple images.
app.use(express.json({ limit: "80mb" }));

// Parse URL-encoded form submissions.
app.use(express.urlencoded({ extended: true, limit: "80mb" }));

// Health check.
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "NaLin Fitness Apparels API is running.",
  });
});

// Main API routes.
app.use("/api/admin", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Root route.
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the NaLin Fitness Apparels API.",
  });
});

// Handle unknown routes.
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central error handler.
app.use((err, req, res, next) => {
  console.error("API error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "This origin is not allowed by CORS.") {
    return res.status(403).json({
      success: false,
      message: "This website origin is not allowed to access the API.",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message:
        "The submitted data is too large. Please reduce the image sizes and try again.",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "An unexpected server error occurred.",
  });
});

module.exports = app;