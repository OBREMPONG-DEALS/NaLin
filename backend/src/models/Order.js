const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
{
product: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
required: false,
},


name: {
  type: String,
  required: true,
  trim: true,
},

image: {
  type: String,
  default: "",
},

price: {
  type: Number,
  required: true,
  min: 0,
},

quantity: {
  type: Number,
  required: true,
  min: 1,
},

size: {
  type: String,
  default: "",
},


},
{ _id: false }
);

const orderSchema = new mongoose.Schema(
{
orderNumber: {
type: String,
unique: true,
trim: true,
},


customer: {
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    default: "",
    trim: true,
    lowercase: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },
},

items: {
  type: [orderItemSchema],
  validate: {
    validator: (items) => items.length > 0,
    message: "An order must contain at least one product.",
  },
},

subtotal: {
  type: Number,
  required: true,
  min: 0,
},

deliveryFee: {
  type: Number,
  default: 0,
  min: 0,
},

total: {
  type: Number,
  required: true,
  min: 0,
},

paymentMethod: {
  type: String,
  enum: ["MOMO", "CASH", "CARD", "OTHER"],
  default: "MOMO",
},

paymentStatus: {
  type: String,
  enum: ["Pending", "Paid", "Failed", "Refunded"],
  default: "Pending",
},

status: {
  type: String,
  enum: [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ],
  default: "Pending",
},


},
{ timestamps: true }
);

orderSchema.pre("validate", function () {
if (!this.orderNumber) {
this.orderNumber = `NAL-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
}
});

module.exports = mongoose.model("Order", orderSchema);
