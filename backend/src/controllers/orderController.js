const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE CUSTOMER ORDER
const createOrder = async (req, res) => {
  const stockChanges = [];

  try {
    const { customer, items, paymentMethod } = req.body;

    // Validate customer information.
    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone number, and delivery address are required.",
      });
    }

    if (
      typeof customer.name !== "string" ||
      typeof customer.phone !== "string" ||
      typeof customer.address !== "string" ||
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid customer information.",
      });
    }

    if (
      customer.email !== undefined &&
      customer.email !== null &&
      typeof customer.email !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      customer.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Validate order items.
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your order must contain at least one product.",
      });
    }

    if (items.length > 100) {
      return res.status(400).json({
        success: false,
        message: "An order cannot contain more than 100 item entries.",
      });
    }

    const normalizedItems = new Map();

    for (const item of items) {
      if (
        !item ||
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        Number(item.quantity) > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have a valid product ID and quantity.",
        });
      }

      const productId = String(item.productId);
      const quantity = Number(item.quantity);
      const size = item.size === undefined ? "" : item.size;

      if (typeof size !== "string") {
        return res.status(400).json({
          success: false,
          message: "Product size must be text.",
        });
      }

      const key = `${productId}:${size.trim()}`;
      const existingItem = normalizedItems.get(key);

      if (existingItem) {
        existingItem.quantity += quantity;

        if (existingItem.quantity > 100) {
          return res.status(400).json({
            success: false,
            message: "The requested quantity for a product is too large.",
          });
        }
      } else {
        normalizedItems.set(key, {
          productId,
          quantity,
          size: size.trim(),
        });
      }
    }

    // Validate the payment method.
    const selectedPaymentMethod = paymentMethod || "MOMO";
    const allowedPaymentMethods = ["MOMO", "CASH", "CARD", "OTHER"];

    if (!allowedPaymentMethods.includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Please select a supported payment method.",
      });
    }

    // Check products and calculate prices using trusted database values.
    const orderItems = [];
    let subtotal = 0;

    for (const item of normalizedItems.values()) {
      const product = await Product.findOne({
        _id: item.productId,
        isActive: true,
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products are unavailable.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available quantity: ${product.stock}.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        price: product.price,
        quantity: item.quantity,
        size: item.size,
      });

      subtotal += product.price * item.quantity;
    }

    // Reserve stock atomically so concurrent orders cannot oversell it.
    for (const item of normalizedItems.values()) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          isActive: true,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        {
  returnDocument: "after",
  runValidators: true,
}
      );

      if (!updatedProduct) {
        throw new Error(
          "Stock changed while the order was being processed. Please try again."
        );
      }

      stockChanges.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // Delivery fees remain zero until the business defines its delivery rates.
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        email: customer.email ? customer.email.trim().toLowerCase() : "",
        phone: customer.phone.trim(),
        address: customer.address.trim(),
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "Pending",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    // Restore stock if any part of the order creation failed.
    for (const change of stockChanges) {
      try {
        await Product.updateOne(
          { _id: change.productId },
          { $inc: { stock: change.quantity } }
        );
      } catch (restoreError) {
        console.error(
          "Stock restoration error:",
          change.productId,
          restoreError.message
        );
      }
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create the order. Please try again.",
    });
  }
};

// GET ALL ORDERS
// This controller must be protected by administrator authentication.
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders.",
    });
  }
};

// UPDATE ORDER STATUS
// This controller must be protected by administrator authentication.
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const allowedStatuses = [
  "Pending",
  "Processing",
  "Cancelled",
];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid order status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.status === status) {
      return res.status(200).json({
        success: true,
        message: "The order already has this status.",
        order,
      });
    }

    if (order.status === "Cancelled") {
  return res.status(400).json({
    success: false,
    message: "Cancelled orders cannot be changed.",
  });
}

    if (status === "Cancelled") {
      const restoredProducts = [];

      try {
        for (const item of order.items) {
          if (!item.product) {
            continue;
          }

          const product = await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: { stock: item.quantity },
            },
            {
  returnDocument: "after",
  runValidators: true,
}
          );

          if (product) {
            restoredProducts.push({
              productId: product._id,
              quantity: item.quantity,
            });
          }
        }

        order.status = "Cancelled";
        await order.save();
      } catch (error) {
        for (const restored of restoredProducts) {
          try {
            await Product.updateOne(
              { _id: restored.productId },
              { $inc: { stock: -restored.quantity } }
            );
          } catch (rollbackError) {
            console.error(
              "Stock rollback error:",
              rollbackError.message
            );
          }
        }

        throw error;
      }
    } else {
      order.status = status;
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update the order status.",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};