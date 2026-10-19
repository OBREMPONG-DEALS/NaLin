const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the submitted details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    // Find the administrator by email
    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    // Do not reveal whether the email exists
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check whether the administrator account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "This administrator account is inactive.",
      });
    }

    // Compare the submitted password with the stored password hash
    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Ensure the JWT secret has been configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from the environment.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured correctly.",
      });
    }

    // Generate the authentication token
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the successful login response
    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login.",
    });
  }
};

module.exports = {
  adminLogin,
};