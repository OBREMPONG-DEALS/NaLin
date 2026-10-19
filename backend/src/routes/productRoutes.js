const express = require("express");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const Product = require("../models/Product");
const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// PUBLIC ROUTE: Get all active products for the shop.
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("========== PUBLIC PRODUCT ROUTE ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("================================================");

    return next(error);
  }
});

// PROTECTED ROUTE: Get all products for the admin dashboard.
router.get("/admin/all", protectAdmin, getAllProducts);

// PUBLIC ROUTE: Get one product by its ID.
router.get("/:id", getProductById);

// PROTECTED ROUTE: Create a new product.
router.post("/", protectAdmin, createProduct);

// PROTECTED ROUTE: Update an existing product.
router.put("/:id", protectAdmin, updateProduct);

// PROTECTED ROUTE: Delete a product.
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;