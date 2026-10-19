const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    // Get the token from the request header.
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in as an administrator.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Verify the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm that the administrator still exists and is active.
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Administrator account is invalid or inactive.",
      });
    }

    // Make the authenticated administrator available to controllers.
    req.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "CastError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please log in again.",
      });
    }

    console.error("Admin authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify administrator access.",
    });
  }
};

module.exports = protectAdmin;