const express = require("express");

const {
createOrder,
getAllOrders,
updateOrderStatus,
} = require("../controllers/orderController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Customer places an order
router.post("/", createOrder);

// Admin retrieves all orders
router.get("/", protectAdmin, getAllOrders);

// Admin updates an order's status
router.patch("/:id/status", protectAdmin, updateOrderStatus);

module.exports = router;
