import { useEffect, useRef, useState } from "react";
import {
Activity,
ImagePlus,
Pencil,
Plus,
Search,
Trash2,
X,
} from "lucide-react";

import "./ProductManagement.css";

const API_URL = "http://localhost:5000/api/products";

const categories = [
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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyProduct = {
name: "",
category: "Gym Wear",
price: "",
salePrice: "",
stock: "",
description: "",
image: "",
images: [],
sizes: "",
colors: "",
material: "",
careInstructions: "",
badge: "",
};

const formatMoney = (amount) =>
new Intl.NumberFormat("en-GH", {
style: "currency",
currency: "GHS",
minimumFractionDigits: 2,
maximumFractionDigits: 2,
})
.format(Number(amount) || 0)
.replace("GHS", "GH₵");

const splitList = (value) =>
String(value || "")
.split(",")
.map((item) => item.trim())
.filter(Boolean)
.filter(
(item, index, array) =>
array.findIndex(
(entry) => entry.toLowerCase() === item.toLowerCase()
) === index
);

const readFileAsDataURL = (file) =>
new Promise((resolve, reject) => {
const reader = new FileReader();

reader.onload = () => {
  if (typeof reader.result !== "string") {
    reject(new Error(`Unable to read ${file.name}.`));
    return;
  }

  resolve(reader.result);
};

reader.onerror = () => {
  reject(new Error(`Unable to read ${file.name}.`));
};

reader.readAsDataURL(file);


});

function ProductManagement({
products,
setProducts,
searchTerm = "",
}) {
const [formOpen, setFormOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [form, setForm] = useState({ ...emptyProduct });
const [imageError, setImageError] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [pageError, setPageError] = useState("");

const fileInputRef = useRef(null);

const getToken = () => localStorage.getItem("ws_token");

const apiRequest = async (url, options = {}) => {
const token = getToken();


if (!token) {
  throw new Error(
    "Your admin session has expired. Please log in again."
  );
}

const response = await fetch(url, {
  ...options,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  },
});

const data = await response.json().catch(() => ({}));

if (!response.ok) {
  throw new Error(
    data.message || "The request could not be completed."
  );
}

return data;


};

const loadProducts = async () => {
setLoading(true);
setPageError("");


try {
  const data = await apiRequest(`${API_URL}/admin/all`);

  const savedProducts = (data.products || []).map((product) => {
    const productImages = Array.isArray(product.images)
      ? product.images.filter(
          (item) => typeof item === "string" && item.trim()
        )
      : [];

    const mainImage =
      product.image || productImages[0] || "";

    return {
      ...product,
      id: product._id,
      price: Number(product.price) || 0,
      salePrice:
        product.salePrice === null ||
        product.salePrice === undefined
          ? ""
          : String(product.salePrice),
      stock: Number(product.stock) || 0,
      image: mainImage,
      images:
        productImages.length > 0
          ? productImages
          : mainImage
            ? [mainImage]
            : [],
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "",
      description: product.description || "",
      material: product.material || "",
      careInstructions: product.careInstructions || "",
      badge: product.badge || "",
      initials:
        product.name
          ?.split(/\s+/)
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "",
    };
  });

  setProducts(savedProducts);
} catch (error) {
  setPageError(error.message);
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadProducts();
}, []);

const filteredProducts = (products || []).filter((product) =>
`${product.name} ${product.category}`
.toLowerCase()
.includes(searchTerm.toLowerCase())
);

const resetFileInput = () => {
if (fileInputRef.current) {
fileInputRef.current.value = "";
}
};

const openAddForm = () => {
setEditingId(null);
setForm({ ...emptyProduct });
setImageError("");
setSuccessMessage("");
setPageError("");
setFormOpen(true);
resetFileInput();
};

const openEditForm = (product) => {
const productImages =
Array.isArray(product.images) && product.images.length > 0
? product.images
: product.image
? [product.image]
: [];


setEditingId(product.id ?? product._id);

setForm({
  name: product.name || "",
  category: product.category || "Gym Wear",
  price: String(product.price ?? ""),
  salePrice:
    product.salePrice === null ||
    product.salePrice === undefined
      ? ""
      : String(product.salePrice),
  stock: String(product.stock ?? ""),
  description: product.description || "",
  image: product.image || productImages[0] || "",
  images: productImages,
  sizes: Array.isArray(product.sizes)
    ? product.sizes.join(", ")
    : product.sizes || "",
  colors: Array.isArray(product.colors)
    ? product.colors.join(", ")
    : product.colors || "",
  material: product.material || "",
  careInstructions: product.careInstructions || "",
  badge: product.badge || "",
});

setImageError("");
setSuccessMessage("");
setPageError("");
setFormOpen(true);
resetFileInput();


};

const closeForm = () => {
setFormOpen(false);
setEditingId(null);
setForm({ ...emptyProduct });
setImageError("");
resetFileInput();
};

const handleChange = (event) => {
const { name, value } = event.target;


setForm((previous) => ({
  ...previous,
  [name]: value,
}));


};

const handleImageChange = async (event) => {
const files = Array.from(event.target.files || []);


if (files.length === 0) {
  return;
}

setImageError("");

const invalidFile = files.find(
  (file) => !file.type.startsWith("image/")
);

if (invalidFile) {
  setImageError(
    `${invalidFile.name} is not a valid image file.`
  );
  resetFileInput();
  return;
}

const oversizedFile = files.find(
  (file) => file.size > MAX_IMAGE_SIZE
);

if (oversizedFile) {
  setImageError(
    `${oversizedFile.name} exceeds the 5 MB image limit.`
  );
  resetFileInput();
  return;
}

const existingImages = Array.isArray(form.images)
  ? form.images
  : [];

const availableSlots = MAX_IMAGES - existingImages.length;

if (availableSlots <= 0) {
  setImageError(
    `You can add a maximum of ${MAX_IMAGES} images per product.`
  );
  resetFileInput();
  return;
}

if (files.length > availableSlots) {
  setImageError(
    `You can add only ${availableSlots} more image(s). A product can have a maximum of ${MAX_IMAGES} images.`
  );
  resetFileInput();
  return;
}

try {
  const newImages = await Promise.all(
    files.map((file) => readFileAsDataURL(file))
  );

  setForm((previous) => {
    const currentImages = Array.isArray(previous.images)
      ? previous.images
      : [];

    const combinedImages = [
      ...currentImages,
      ...newImages,
    ].slice(0, MAX_IMAGES);

    return {
      ...previous,
      images: combinedImages,
      image: combinedImages[0] || "",
    };
  });

  setImageError("");
} catch (error) {
  setImageError(error.message);
} finally {
  resetFileInput();
}


};

const removeImage = (indexToRemove) => {
setForm((previous) => {
const updatedImages = previous.images.filter(
(_, index) => index !== indexToRemove
);


  return {
    ...previous,
    images: updatedImages,
    image: updatedImages[0] || "",
  };
});

setImageError("");


};

const handleSubmit = async (event) => {
event.preventDefault();


setSuccessMessage("");
setImageError("");
setPageError("");

const name = form.name.trim();
const price = Number(form.price);
const stock = Number(form.stock);
const salePrice =
  form.salePrice.trim() === ""
    ? null
    : Number(form.salePrice);

if (!name) {
  setImageError("Please enter a product name.");
  return;
}

if (!categories.includes(form.category)) {
  setImageError("Please select a valid product category.");
  return;
}

if (
  form.price.trim() === "" ||
  !Number.isFinite(price) ||
  price <= 0
) {
  setImageError(
    "Enter a valid regular price greater than zero."
  );
  return;
}

if (
  salePrice !== null &&
  (
    !Number.isFinite(salePrice) ||
    salePrice <= 0 ||
    salePrice >= price
  )
) {
  setImageError(
    "The sale price must be greater than zero and lower than the regular price."
  );
  return;
}

if (
  form.stock.trim() === "" ||
  !Number.isInteger(stock) ||
  stock < 0
) {
  setImageError(
    "Stock must be a whole number of zero or more."
  );
  return;
}

const normalizedName = name.toLowerCase();

const duplicate = (products || []).some(
  (product) =>
    product.name.trim().toLowerCase() === normalizedName &&
    String(product.id ?? product._id) !== String(editingId)
);

if (duplicate) {
  setImageError(
    "A product with this name already exists. Please use a different name."
  );
  return;
}

const productImages = Array.isArray(form.images)
  ? form.images
  : [];

if (productImages.length > MAX_IMAGES) {
  setImageError(
    `A product cannot have more than ${MAX_IMAGES} images.`
  );
  return;
}

const productData = {
  name,
  category: form.category,
  price,
  salePrice,
  stock,
  description: form.description.trim(),
  image: productImages[0] || "",
  images: productImages,
  sizes: splitList(form.sizes),
  colors: splitList(form.colors),
  material: form.material.trim(),
  careInstructions: form.careInstructions.trim(),
  badge: form.badge.trim(),
};

setSaving(true);

try {
  if (editingId !== null) {
    await apiRequest(`${API_URL}/${editingId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });

    setSuccessMessage(
      "Product updated and saved successfully."
    );
  } else {
    await apiRequest(API_URL, {
      method: "POST",
      body: JSON.stringify(productData),
    });

    setSuccessMessage(
      "Product added and saved successfully."
    );
  }

  closeForm();
  await loadProducts();
} catch (error) {
  setImageError(error.message);
} finally {
  setSaving(false);
}


};

const handleDelete = async (product) => {
const confirmed = window.confirm(
`Are you sure you want to permanently delete "${product.name}"?`
);


if (!confirmed) {
  return;
}

setSuccessMessage("");
setPageError("");

try {
  await apiRequest(
    `${API_URL}/${product.id ?? product._id}`,
    {
      method: "DELETE",
    }
  );

  setSuccessMessage(
    `${product.name} was permanently deleted.`
  );

  await loadProducts();
} catch (error) {
  setPageError(error.message);
}


};

return ( <section className="admin-panel admin-management-panel pm-root"> <div className="admin-panel-heading pm-heading"> <div> <h3>Your Products</h3> <p>
Manage product images, prices, sizes, colours, stock,
and product information. </p> </div>


    <button
      type="button"
      className="admin-primary-button"
      onClick={openAddForm}
      disabled={saving}
    >
      <Plus size={18} />
      Add Product
    </button>
  </div>

  <div className="pm-demo-banner">
    <Activity size={17} />
    <span>
      Products are connected to MongoDB. Saved changes remain
      available after refreshing the dashboard.
    </span>
  </div>

  {pageError && (
    <div className="pm-error" role="alert">
      {pageError}

      <button
        type="button"
        onClick={() => setPageError("")}
        aria-label="Dismiss error"
        style={{ marginLeft: "12px" }}
      >
        <X size={16} />
      </button>
    </div>
  )}

  {successMessage && (
    <div className="pm-success" role="status">
      {successMessage}

      <button
        type="button"
        onClick={() => setSuccessMessage("")}
        aria-label="Dismiss message"
      >
        <X size={16} />
      </button>
    </div>
  )}

  {formOpen && (
    <form className="pm-form" onSubmit={handleSubmit}>
      <div className="pm-form-heading">
        <div>
          <h4>
            {editingId !== null
              ? "Edit Product"
              : "Add New Product"}
          </h4>

          <p>
            Enter the product details that customers will see
            in the shop.
          </p>
        </div>

        <button
          type="button"
          className="pm-close-button"
          onClick={closeForm}
          aria-label="Close product form"
          disabled={saving}
        >
          <X size={20} />
        </button>
      </div>

      <div className="pm-form-grid">
        <label className="pm-field">
          <span>Product Name *</span>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Premium Gym Leggings"
            maxLength={150}
            required
          />
        </label>

        <label className="pm-field">
          <span>Category *</span>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="pm-field">
          <span>Regular Price (GH₵) *</span>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="250.00"
            min="0.01"
            step="0.01"
            required
          />
        </label>

        <label className="pm-field">
          <span>Sale Price (GH₵)</span>

          <input
            type="number"
            name="salePrice"
            value={form.salePrice}
            onChange={handleChange}
            placeholder="Leave blank if not on sale"
            min="0.01"
            step="0.01"
          />

          <small>
            Optional. Must be lower than the regular price.
          </small>
        </label>

        <label className="pm-field">
          <span>Stock Quantity *</span>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="20"
            min="0"
            step="1"
            required
          />
        </label>

        <label className="pm-field">
          <span>Product Badge</span>

          <input
            type="text"
            name="badge"
            value={form.badge}
            onChange={handleChange}
            placeholder="e.g. New Arrival or Bestseller"
            maxLength={100}
          />
        </label>

        <label className="pm-field pm-full-width">
          <span>Available Sizes</span>

          <input
            type="text"
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="e.g. XS, S, M, L, XL"
          />

          <small>
            Separate each size with a comma. Leave blank if
            this product does not have size options.
          </small>
        </label>

        <label className="pm-field pm-full-width">
          <span>Available Colours</span>

          <input
            type="text"
            name="colors"
            value={form.colors}
            onChange={handleChange}
            placeholder="e.g. Black, White, Purple"
          />

          <small>
            Separate each colour with a comma.
          </small>
        </label>

        <label className="pm-field pm-full-width">
          <span>Material</span>

          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            placeholder="e.g. 80% Nylon, 20% Spandex"
            maxLength={300}
          />
        </label>

        <label className="pm-field pm-full-width">
          <span>Product Description</span>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the product, its features, fit, and benefits."
            rows="4"
            maxLength={2000}
          />
        </label>

        <label className="pm-field pm-full-width">
          <span>Care Instructions</span>

          <textarea
            name="careInstructions"
            value={form.careInstructions}
            onChange={handleChange}
            placeholder="e.g. Machine wash cold. Do not bleach. Air dry."
            rows="3"
            maxLength={1000}
          />
        </label>

        <div className="pm-field pm-full-width">
          <span>Product Images</span>

          <input
            ref={fileInputRef}
            className="pm-file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <div className="pm-image-picker">
            <div className="pm-image-actions">
              <button
                type="button"
                className="pm-secondary-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  saving ||
                  form.images.length >= MAX_IMAGES
                }
              >
                <ImagePlus size={17} />
                Choose Images
              </button>

              <small>
                Select up to {MAX_IMAGES} images per product.
                Each image must be 5 MB or smaller.
              </small>
            </div>

            {form.images.length > 0 ? (
              <div
                className="pm-image-gallery"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                {form.images.map((image, index) => (
                  <div
                    key={`${index}-${image.slice(0, 30)}`}
                    style={{
                      position: "relative",
                      minWidth: 0,
                    }}
                  >
                    <img
                      className="pm-image-preview"
                      src={image}
                      alt={`Product image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={saving}
                      aria-label={`Remove image ${index + 1}`}
                      title="Remove image"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        border: "none",
                        borderRadius: "50%",
                        width: "26px",
                        height: "26px",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <X size={15} />
                    </button>

                    {index === 0 && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        Main image
                      </small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pm-image-placeholder">
                <ImagePlus size={30} />
                <span>No images selected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {imageError && (
        <p className="pm-error" role="alert">
          {imageError}
        </p>
      )}

      <div className="pm-form-actions">
        <button
          type="button"
          className="pm-secondary-button"
          onClick={closeForm}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="admin-primary-button"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId !== null
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </form>
  )}

  <div className="pm-list-heading">
    <div>
      <h4>Product Catalogue</h4>

      <p>
        {loading
          ? "Loading products..."
          : `${filteredProducts.length} product(s) shown`}
      </p>
    </div>

    <button
      type="button"
      className="pm-secondary-button"
      onClick={loadProducts}
      disabled={loading || saving}
    >
      Refresh Products
    </button>
  </div>

  {loading ? (
    <div className="pm-empty">
      <Activity size={28} />
      <h4>Loading your products</h4>
      <p>
        Please wait while we retrieve your saved catalogue.
      </p>
    </div>
  ) : filteredProducts.length === 0 ? (
    <div className="pm-empty">
      <Search size={28} />
      <h4>No products found</h4>
      <p>
        Try another search term or add a new product to your
        catalogue.
      </p>
    </div>
  ) : (
    <div className="pm-table-wrap">
      <table className="pm-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id ?? product._id}>
              <td>
                <div className="pm-product-cell">
                  {product.image ? (
                    <img
                      className="pm-product-image"
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="pm-product-avatar">
                      {product.initials ||
                        product.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <span>{product.name}</span>
                </div>
              </td>

              <td>{product.category}</td>

              <td className="pm-price">
                {product.salePrice !== "" &&
                product.salePrice !== null &&
                Number(product.salePrice) > 0 ? (
                  <div>
                    <strong>
                      {formatMoney(product.salePrice)}
                    </strong>

                    <br />

                    <small
                      style={{
                        textDecoration: "line-through",
                        opacity: 0.7,
                      }}
                    >
                      {formatMoney(product.price)}
                    </small>
                  </div>
                ) : (
                  formatMoney(product.price)
                )}
              </td>

              <td>{product.stock} units</td>

              <td>
                <span
                  className={`pm-stock-status ${
                    product.stock === 0
                      ? "out"
                      : product.stock <= 5
                        ? "low"
                        : product.stock <= 10
                          ? "medium"
                          : "available"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : product.stock <= 5
                      ? "Low stock"
                      : product.stock <= 10
                        ? "Running low"
                        : "In stock"}
                </span>
              </td>

              <td>
                <div className="pm-row-actions">
                  <button
                    type="button"
                    className="pm-icon-button"
                    onClick={() => openEditForm(product)}
                    aria-label={`Edit ${product.name}`}
                    title="Edit product"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="pm-icon-button danger"
                    onClick={() => handleDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>


);
}

export default ProductManagement;
