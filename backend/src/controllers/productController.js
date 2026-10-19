const mongoose = require("mongoose");
const Product = require("../models/Product");

const ALLOWED_CATEGORIES = [
"Gym Wear",
"Leggings",
"Shorts",
"Sports Bras",
"Shirts",
"Tennis Wear",
"Sneakers",
"Fitness Accessories",
];

const MAX_IMAGES = 10;
const MAX_IMAGE_STRING_LENGTH = 7 * 1024 * 1024;

const validateSalePrice = (salePrice, regularPrice) => {
if (
salePrice === null ||
salePrice === undefined ||
salePrice === ""
) {
return {
valid: true,
value: null,
};
}

const numericSalePrice = Number(salePrice);

if (
!Number.isFinite(numericSalePrice) ||
numericSalePrice <= 0
) {
return {
valid: false,
message: "Sale price must be a number greater than zero.",
};
}

if (numericSalePrice >= Number(regularPrice)) {
return {
valid: false,
message: "Sale price must be lower than the regular price.",
};
}

return {
valid: true,
value: numericSalePrice,
};
};

const validateStringArray = (
value,
fieldName,
maximumItems = 30
) => {
if (!Array.isArray(value)) {
return {
valid: false,
message: `${fieldName} must be provided as a list.`,
};
}

if (value.length > maximumItems) {
return {
valid: false,
message: `${fieldName} cannot contain more than ${maximumItems} items.`,
};
}

const normalizedValues = value.map((item) =>
typeof item === "string" ? item.trim() : ""
);

if (normalizedValues.some((item) => !item)) {
return {
valid: false,
message: `${fieldName} cannot contain empty values.`,
};
}

const uniqueValues = [
...new Map(
normalizedValues.map((item) => [
item.toLowerCase(),
item,
])
).values(),
];

return {
valid: true,
value: uniqueValues,
};
};

const validateImages = (images) => {
if (!Array.isArray(images)) {
return {
valid: false,
message: "Product images must be provided as a list.",
};
}

if (images.length > MAX_IMAGES) {
return {
valid: false,
message: `A product cannot have more than ${MAX_IMAGES} images.`,
};
}

for (const image of images) {
if (
typeof image !== "string" ||
!image.trim() ||
image.length > MAX_IMAGE_STRING_LENGTH
) {
return {
valid: false,
message: "One or more product images are invalid.",
};
}
}

return {
valid: true,
value: images.map((image) => image.trim()),
};
};

// GET ALL PRODUCTS FOR THE ADMIN DASHBOARD
const getAllProducts = async (req, res) => {
try {
const products = await Product.find().sort({
createdAt: -1,
});


return res.status(200).json({
  success: true,
  count: products.length,
  products,
});


} catch (error) {
console.error("Get products error:", error.message);


return res.status(500).json({
  success: false,
  message: "Unable to retrieve products.",
});


}
};

// GET ONE ACTIVE PRODUCT
const getProductById = async (req, res) => {
try {
const { id } = req.params;


if (!mongoose.isValidObjectId(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID.",
  });
}

const product = await Product.findOne({
  _id: id,
  isActive: true,
});

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found.",
  });
}

return res.status(200).json({
  success: true,
  product,
});


} catch (error) {
console.error("Get product error:", error.message);


return res.status(500).json({
  success: false,
  message: "Unable to retrieve this product.",
});


}
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
try {
const {
name,
category,
price,
salePrice,
stock,
description,
image,
images,
sizes,
colors,
material,
careInstructions,
rating,
badge,
isActive,
} = req.body;


if (
  typeof name !== "string" ||
  !name.trim()
) {
  return res.status(400).json({
    success: false,
    message: "Product name is required.",
  });
}

if (!ALLOWED_CATEGORIES.includes(category)) {
  return res.status(400).json({
    success: false,
    message: "Please select a valid product category.",
  });
}

if (
  price === undefined ||
  price === null ||
  price === "" ||
  !Number.isFinite(Number(price)) ||
  Number(price) < 0
) {
  return res.status(400).json({
    success: false,
    message: "Enter a valid product price.",
  });
}

const regularPrice = Number(price);

const salePriceResult = validateSalePrice(
  salePrice,
  regularPrice
);

if (!salePriceResult.valid) {
  return res.status(400).json({
    success: false,
    message: salePriceResult.message,
  });
}

if (
  stock !== undefined &&
  stock !== null &&
  stock !== "" &&
  (
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  )
) {
  return res.status(400).json({
    success: false,
    message: "Stock must be a non-negative whole number.",
  });
}

let validatedImages = [];

if (images !== undefined) {
  const imageResult = validateImages(images);

  if (!imageResult.valid) {
    return res.status(400).json({
      success: false,
      message: imageResult.message,
    });
  }

  validatedImages = imageResult.value;
}

const normalizedImage =
  typeof image === "string" ? image.trim() : "";

if (normalizedImage.length > MAX_IMAGE_STRING_LENGTH) {
  return res.status(400).json({
    success: false,
    message: "The main product image is too large.",
  });
}

if (
  validatedImages.length === 0 &&
  normalizedImage
) {
  validatedImages = [normalizedImage];
}

const primaryImage =
  normalizedImage || validatedImages[0] || "";

let validatedSizes = [];

if (sizes !== undefined) {
  const sizeResult = validateStringArray(
    sizes,
    "Sizes"
  );

  if (!sizeResult.valid) {
    return res.status(400).json({
      success: false,
      message: sizeResult.message,
    });
  }

  validatedSizes = sizeResult.value;
}

let validatedColors = [];

if (colors !== undefined) {
  const colorResult = validateStringArray(
    colors,
    "Colours"
  );

  if (!colorResult.valid) {
    return res.status(400).json({
      success: false,
      message: colorResult.message,
    });
  }

  validatedColors = colorResult.value;
}

if (
  rating !== undefined &&
  rating !== null &&
  rating !== "" &&
  (
    !Number.isFinite(Number(rating)) ||
    Number(rating) < 0 ||
    Number(rating) > 5
  )
) {
  return res.status(400).json({
    success: false,
    message: "Rating must be between 0 and 5.",
  });
}

const product = await Product.create({
  name: name.trim(),
  category,
  price: regularPrice,
  salePrice: salePriceResult.value,
  stock:
    stock === undefined ||
    stock === null ||
    stock === ""
      ? 0
      : Number(stock),
  description:
    typeof description === "string"
      ? description.trim()
      : "",
  image: primaryImage,
  images: validatedImages,
  sizes: validatedSizes,
  colors: validatedColors,
  material:
    typeof material === "string"
      ? material.trim()
      : "",
  careInstructions:
    typeof careInstructions === "string"
      ? careInstructions.trim()
      : "",
  rating:
    rating === undefined ||
    rating === null ||
    rating === ""
      ? 0
      : Number(rating),
  badge:
    typeof badge === "string"
      ? badge.trim()
      : "",
  isActive:
    isActive === undefined
      ? true
      : isActive === true || isActive === "true",
});

return res.status(201).json({
  success: true,
  message: "Product created successfully.",
  product,
});


} catch (error) {
if (
error.name === "ValidationError" ||
error.name === "CastError"
) {
return res.status(400).json({
success: false,
message: error.message,
});
}


console.error("Create product error:", error.message);

return res.status(500).json({
  success: false,
  message: "Unable to create the product.",
});


}
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
try {
const { id } = req.params;


if (!mongoose.isValidObjectId(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID.",
  });
}

const existingProduct = await Product.findById(id);

if (!existingProduct) {
  return res.status(404).json({
    success: false,
    message: "Product not found.",
  });
}

const {
  name,
  category,
  price,
  salePrice,
  stock,
  description,
  image,
  images,
  sizes,
  colors,
  material,
  careInstructions,
  rating,
  badge,
  isActive,
} = req.body;

if (name !== undefined) {
  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Product name cannot be empty.",
    });
  }

  existingProduct.name = name.trim();
}

if (category !== undefined) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid product category.",
    });
  }

  existingProduct.category = category;
}

const nextPrice =
  price !== undefined
    ? Number(price)
    : existingProduct.price;

if (price !== undefined) {
  if (
    price === "" ||
    price === null ||
    !Number.isFinite(nextPrice) ||
    nextPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid product price.",
    });
  }

  existingProduct.price = nextPrice;
}

if (salePrice !== undefined) {
  const salePriceResult = validateSalePrice(
    salePrice,
    nextPrice
  );

  if (!salePriceResult.valid) {
    return res.status(400).json({
      success: false,
      message: salePriceResult.message,
    });
  }

  existingProduct.salePrice = salePriceResult.value;
} else if (
  existingProduct.salePrice !== null &&
  existingProduct.salePrice !== undefined &&
  existingProduct.salePrice >= nextPrice
) {
  return res.status(400).json({
    success: false,
    message:
      "The regular price must be higher than the existing sale price. Update or remove the sale price first.",
  });
}

if (stock !== undefined) {
  if (
    stock === "" ||
    stock === null ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Stock must be a non-negative whole number.",
    });
  }

  existingProduct.stock = Number(stock);
}

if (description !== undefined) {
  if (typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be text.",
    });
  }

  existingProduct.description = description.trim();
}

if (image !== undefined) {
  if (typeof image !== "string") {
    return res.status(400).json({
      success: false,
      message: "The main image must be a valid string.",
    });
  }

  if (image.length > MAX_IMAGE_STRING_LENGTH) {
    return res.status(400).json({
      success: false,
      message: "The main product image is too large.",
    });
  }

  existingProduct.image = image.trim();

  if (
    images === undefined &&
    existingProduct.images.length > 0
  ) {
    existingProduct.images[0] = image.trim();
  } else if (
    images === undefined &&
    image.trim()
  ) {
    existingProduct.images = [image.trim()];
  }
}

if (images !== undefined) {
  const imageResult = validateImages(images);

  if (!imageResult.valid) {
    return res.status(400).json({
      success: false,
      message: imageResult.message,
    });
  }

  existingProduct.images = imageResult.value;

  if (image === undefined) {
    existingProduct.image =
      imageResult.value[0] || "";
  }
}

if (sizes !== undefined) {
  const sizeResult = validateStringArray(
    sizes,
    "Sizes"
  );

  if (!sizeResult.valid) {
    return res.status(400).json({
      success: false,
      message: sizeResult.message,
    });
  }

  existingProduct.sizes = sizeResult.value;
}

if (colors !== undefined) {
  const colorResult = validateStringArray(
    colors,
    "Colours"
  );

  if (!colorResult.valid) {
    return res.status(400).json({
      success: false,
      message: colorResult.message,
    });
  }

  existingProduct.colors = colorResult.value;
}

if (material !== undefined) {
  if (typeof material !== "string") {
    return res.status(400).json({
      success: false,
      message: "Material must be text.",
    });
  }

  existingProduct.material = material.trim();
}

if (careInstructions !== undefined) {
  if (typeof careInstructions !== "string") {
    return res.status(400).json({
      success: false,
      message: "Care instructions must be text.",
    });
  }

  existingProduct.careInstructions =
    careInstructions.trim();
}

if (rating !== undefined) {
  if (
    rating === "" ||
    rating === null ||
    !Number.isFinite(Number(rating)) ||
    Number(rating) < 0 ||
    Number(rating) > 5
  ) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 0 and 5.",
    });
  }

  existingProduct.rating = Number(rating);
}

if (badge !== undefined) {
  if (typeof badge !== "string") {
    return res.status(400).json({
      success: false,
      message: "Badge must be text.",
    });
  }

  existingProduct.badge = badge.trim();
}

if (isActive !== undefined) {
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Product status must be true or false.",
    });
  }

  existingProduct.isActive = isActive;
}

await existingProduct.save();

return res.status(200).json({
  success: true,
  message: "Product updated successfully.",
  product: existingProduct,
});


} catch (error) {
if (
error.name === "ValidationError" ||
error.name === "CastError"
) {
return res.status(400).json({
success: false,
message: error.message,
});
}


console.error("Update product error:", error.message);

return res.status(500).json({
  success: false,
  message: "Unable to update the product.",
});


}
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
try {
const { id } = req.params;


if (!mongoose.isValidObjectId(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID.",
  });
}

const product = await Product.findByIdAndDelete(id);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found.",
  });
}

return res.status(200).json({
  success: true,
  message: "Product deleted successfully.",
});


} catch (error) {
console.error("Delete product error:", error.message);


return res.status(500).json({
  success: false,
  message: "Unable to delete the product.",
});


}
};

module.exports = {
getAllProducts,
getProductById,
createProduct,
updateProduct,
deleteProduct,
};
