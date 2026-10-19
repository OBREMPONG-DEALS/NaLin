const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
name: {
type: String,
required: [true, "Product name is required"],
trim: true,
maxlength: 150,
},

category: {
  type: String,
  required: [true, "Product category is required"],
  enum: [
    "Gym Wear",
    "Leggings",
    "Shorts",
    "Sports Bras",
    "Shirts",
    "Tennis Wear",
    "Sneakers",
    "Fitness Accessories",
  ],
},

price: {
  type: Number,
  required: [true, "Product price is required"],
  min: [0, "Price cannot be negative"],
},

salePrice: {
  type: Number,
  default: null,
  min: [0, "Sale price cannot be negative"],
  validate: {
    validator: function (value) {
      return (
        value === null ||
        value === undefined ||
        value < this.price
      );
    },
    message: "Sale price must be lower than the regular price.",
  },
},

stock: {
  type: Number,
  required: [true, "Product stock is required"],
  min: [0, "Stock cannot be negative"],
  default: 0,
  validate: {
    validator: Number.isInteger,
    message: "Stock must be a whole number",
  },
},

description: {
  type: String,
  trim: true,
  default: "",
  maxlength: 2000,
},

// Original image field retained for existing products.
image: {
  type: String,
  default: "",
},

// Additional images for the product gallery.
images: {
  type: [
    {
      type: String,
      trim: true,
    },
  ],
  default: [],
  validate: {
    validator: function (images) {
      return images.length <= 10;
    },
    message: "A product cannot have more than 10 images.",
  },
},

// Available clothing sizes or product sizes.
sizes: {
  type: [
    {
      type: String,
      trim: true,
    },
  ],
  default: [],
},

// Available colours.
colors: {
  type: [
    {
      type: String,
      trim: true,
    },
  ],
  default: [],
},

// Product fabric or material.
material: {
  type: String,
  trim: true,
  default: "",
  maxlength: 300,
},

// Washing and product care information.
careInstructions: {
  type: String,
  trim: true,
  default: "",
  maxlength: 1000,
},

// Existing rating field retained during the review upgrade.
rating: {
  type: Number,
  default: 0,
  min: 0,
  max: 5,
},

// Number of genuine reviews, to be maintained by the review system.
reviewCount: {
  type: Number,
  default: 0,
  min: 0,
},

badge: {
  type: String,
  default: "",
  trim: true,
},

isActive: {
  type: Boolean,
  default: true,
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model("Product", productSchema);
