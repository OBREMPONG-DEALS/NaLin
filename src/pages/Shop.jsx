import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
  Music2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import nalinLogo from "../assets/images/NalinLogo.PNG";
import one from "../assets/images/one.jfif";
import two from "../assets/images/two.jfif";
import three from "../assets/images/three.jfif";

import "../App.css";


const API_URL = "https://nalin11.onrender.com/api";


const WHATSAPP_NUMBER = "233506735003";

const CART_STORAGE_KEY = "nalin_cart";

const CATEGORIES = [
  "All",
  "Gym Wear",
  "Leggings",
  "Shorts",
  "Sports Bras",
  "Shirts",
  "Tennis Wear",
  "Sneakers",
  "Fitness Accessories",
];

const FALLBACK_IMAGES = [one, two, three];

/* =====================================================
   HELPERS
===================================================== */

function readSavedCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .filter((item) => item && (item.id || item._id))
      .map((item) => ({
        ...item,
        id: String(item.id || item._id),
        quantity: Math.max(
          1,
          Number.parseInt(item.quantity, 10) || 1
        ),
        price: Number(item.price) || 0,
        image:
          typeof item.image === "string"
            ? item.image
            : "",
      }));
  } catch (error) {
    console.error("Unable to read NaLin cart:", error);
    return [];
  }
}

function getProductImages(product) {
  const images = [];

  if (typeof product.image === "string" && product.image.trim()) {
    images.push(product.image);
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((image) => {
      const imageUrl =
        typeof image === "string"
          ? image
          : image?.url;

      if (
        typeof imageUrl === "string" &&
        imageUrl.trim()
      ) {
        images.push(imageUrl);
      }
    });
  }

  const uniqueImages = [...new Set(images)];

  if (uniqueImages.length > 0) {
    return uniqueImages;
  }

  return [FALLBACK_IMAGES[0]];
}

function normalizeProduct(product) {
  const productId = product._id || product.id;

  const images = getProductImages(product);

  return {
    ...product,
    id: String(productId),
    _id: product._id || productId,
    name: product.name || "Unnamed Product",
    category: product.category || "Other",
    description: product.description || "",
    price: Number(product.salePrice ?? product.price ?? 0),
    stock: Math.max(0, Number(product.stock) || 0),
    rating: Math.max(
      0,
      Math.min(5, Number(product.rating) || 0)
    ),
    badge: product.badge || "",
    image: images[0],
    images,
  };
}

function formatMoney(amount) {
  return `GH₵${Number(amount || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* =====================================================
   SHOP COMPONENT
===================================================== */

function Shop() {
  /* =========================
     NAVIGATION
  ========================= */

  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================
     PRODUCT FILTERS
  ========================= */

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [showMobileFilter, setShowMobileFilter] =
    useState(false);

  /* =========================
     PRODUCT GALLERY
  ========================= */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [galleryIndex, setGalleryIndex] = useState(0);

  const [touchStart, setTouchStart] = useState(null);

  /* =========================
     BACK TO TOP
  ========================= */

  const [showBackToTop, setShowBackToTop] =
    useState(false);

  /* =========================
     PRODUCTS
  ========================= */

  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [productsError, setProductsError] =
    useState("");

  /* =========================
     SHOPPING CART
  ========================= */

  const [cart, setCart] = useState(readSavedCart);

  const [cartOpen, setCartOpen] = useState(false);

  /* =========================
     CHECKOUT
  ========================= */

  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  const [checkoutDetails, setCheckoutDetails] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [checkoutError, setCheckoutError] =
    useState("");

  /* =====================================================
     LOAD PRODUCTS FROM BACKEND
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load products from the server."
          );
        }

        const receivedProducts = Array.isArray(data.products)
          ? data.products
          : [];

        const normalizedProducts = receivedProducts
          .filter((product) => product.isActive !== false)
          .map(normalizeProduct);

        if (!cancelled) {
          setProducts(normalizedProducts);
        }
      } catch (error) {
        console.error(
          "Unable to load NaLin products:",
          error
        );

        if (!cancelled) {
          setProductsError(
            error.message ||
              "Unable to connect to the product server."
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     RESTORE CART IMAGES FROM LOADED PRODUCTS
  ===================================================== */

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    setCart((currentCart) =>
      currentCart.map((cartItem) => {
        const matchingProduct = products.find(
          (product) =>
            String(product.id) === String(cartItem.id)
        );

        if (!matchingProduct) {
          return cartItem;
        }

        return {
          ...cartItem,
          _id: matchingProduct._id,
          id: matchingProduct.id,
          name: matchingProduct.name,
          category: matchingProduct.category,
          price: matchingProduct.price,
          image:
            matchingProduct.image ||
            cartItem.image ||
            FALLBACK_IMAGES[0],
          images: matchingProduct.images,
        };
      })
    );
  }, [products]);

  /* =====================================================
     CART TOTALS
  ===================================================== */

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /* =====================================================
     SAVE CART
  ===================================================== */

  useEffect(() => {
    const compactCart = cart.map((item) => ({
      _id: item._id,
      id: String(item.id || item._id),
      name: item.name,
      category: item.category,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,

      // Do not save large Base64 image strings in localStorage.
      image:
        typeof item.image === "string" &&
        item.image.trim() &&
        !item.image.startsWith("data:")
          ? item.image
          : "",
    }));

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(compactCart)
      );
    } catch (error) {
      console.error(
        "Unable to save NaLin cart:",
        error
      );
    }

    window.dispatchEvent(
      new Event("nalin-cart-updated")
    );
  }, [cart]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm
      .toLowerCase()
      .trim();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.category
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  /* =====================================================
     INCREASE QUANTITY
  ===================================================== */

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (String(item.id) !== String(productId)) {
          return item;
        }

        const matchingProduct = products.find(
          (product) =>
            String(product.id) === String(productId)
        );

        if (
          matchingProduct &&
          item.quantity >= matchingProduct.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity || 0) + 1,
        };
      })
    );
  };

  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (String(item.id) !== String(productId)) {
            return item;
          }

          return {
            ...item,
            quantity: Number(item.quantity || 0) - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  /* =====================================================
     REMOVE FROM CART
  ===================================================== */

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => String(item.id) !== String(productId)
      )
    );
  };

  /* =====================================================
     ADD TO BAG
  ===================================================== */

  const addToBag = (product) => {
    if (!product || !product.id) {
      return;
    }

    if (Number(product.stock) <= 0) {
      return;
    }

    setCart((currentCart) => {
      const productId = String(product.id);

      const existingItem = currentCart.find(
        (item) => String(item.id) === productId
      );

      if (existingItem) {
        if (
          Number(existingItem.quantity) >=
          Number(product.stock)
        ) {
          return currentCart;
        }

        return currentCart.map((item) =>
          String(item.id) === productId
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) + 1,
                image:
                  product.image ||
                  item.image ||
                  FALLBACK_IMAGES[0],
                images: product.images,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          id: productId,
          quantity: 1,
          image: product.image || FALLBACK_IMAGES[0],
        },
      ];
    });
  };

  /* =====================================================
     OPEN CHECKOUT
  ===================================================== */

  const openCheckout = () => {
    if (cart.length === 0) {
      setCheckoutError(
        "Your shopping bag is empty."
      );

      return;
    }

    setCheckoutError("");
    setCheckoutOpen(true);
  };

  /* =====================================================
     SUBMIT ORDER
  ===================================================== */

  const submitOrder = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setCheckoutError(
        "Your shopping bag is empty."
      );

      return;
    }

    const customer = {
      name: checkoutDetails.name.trim(),
      email: checkoutDetails.email.trim(),
      phone: checkoutDetails.phone.trim(),
      address: checkoutDetails.address.trim(),
    };

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      setCheckoutError(
        "Please complete all checkout fields."
      );

      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      // Validate current stock before submitting.
      for (const item of cart) {
        const currentProduct = products.find(
          (product) =>
            String(product.id) === String(item.id)
        );

        if (!currentProduct) {
          throw new Error(
            `${item.name} is no longer available. Please refresh the shop.`
          );
        }

        if (
          Number(item.quantity) >
          Number(currentProduct.stock)
        ) {
          throw new Error(
            `Only ${currentProduct.stock} unit(s) of ${item.name} are currently available.`
          );
        }
      }

      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: Number(item.quantity),
      }));

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer,
            items: orderItems,
            paymentMethod: "MOMO",
            deliveryFee: 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "We could not save your order. Please try again."
        );
      }

      const order = data.order || {};

      const orderNumber =
        order.orderNumber ||
        order._id ||
        "Pending confirmation";

      const orderMessage = [
        "Hello NaLin Fitness Apparels!",
        "",
        "I would like to place an order.",
        "",
        `Order Number: ${orderNumber}`,
        `Customer Name: ${customer.name}`,
        `Email: ${customer.email}`,
        `Phone: ${customer.phone}`,
        `Delivery Address: ${customer.address}`,
        "",
        "ORDER DETAILS",
        "",
        ...cart.map(
          (item) =>
            `${item.name} x ${item.quantity} = ${formatMoney(
              Number(item.price) * Number(item.quantity)
            )}`
        ),
        "",
        `Total: ${formatMoney(cartTotal)}`,
        "",
        "Payment Method: MTN Mobile Money",
        "",
        "Please assist me with payment and delivery arrangements.",
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(orderMessage);

      // Clear the cart only after the backend confirms the order.
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);

      setCheckoutDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      window.location.href = whatsappUrl;
    } catch (error) {
      console.error(
        "NaLin order submission error:",
        error
      );

      setCheckoutError(
        error.message ||
          "Unable to submit your order. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const clearSearch = () => {
    setSearchTerm("");
  };

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =====================================================
     BACK TO TOP
  ===================================================== */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     PRODUCT GALLERY
  ===================================================== */

  const openGallery = (product) => {
    setSelectedProduct(product);
    setGalleryIndex(0);
  };

  const closeGallery = () => {
    setSelectedProduct(null);
    setGalleryIndex(0);
    setTouchStart(null);
  };

  const galleryImages = selectedProduct
    ? selectedProduct.images?.length
      ? selectedProduct.images
      : [selectedProduct.image || FALLBACK_IMAGES[0]]
    : [];

  const nextImage = () => {
    if (galleryImages.length <= 1) {
      return;
    }

    setGalleryIndex((current) =>
      current >= galleryImages.length - 1
        ? 0
        : current + 1
    );
  };

  const previousImage = () => {
    if (galleryImages.length <= 1) {
      return;
    }

    setGalleryIndex((current) =>
      current <= 0
        ? galleryImages.length - 1
        : current - 1
    );
  };

  /* =====================================================
     MOBILE GALLERY SWIPE
  ===================================================== */

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null) {
      return;
    }

    const touchEnd = event.changedTouches[0].clientX;

    const difference = touchStart - touchEnd;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setTouchStart(null);
  };

  /* =====================================================
     SCROLL LISTENER
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =====================================================
     CLOSE OVERLAYS WITH ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setCartOpen(false);
      setSelectedProduct(null);
      setMenuOpen(false);
      setShowMobileFilter(false);

      if (!checkoutLoading) {
        setCheckoutOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [checkoutLoading]);

  /* =====================================================
     LOCK BODY SCROLL WHEN OVERLAYS ARE OPEN
  ===================================================== */

  useEffect(() => {
    const shouldLock =
      Boolean(selectedProduct) ||
      cartOpen ||
      menuOpen ||
      showMobileFilter ||
      checkoutOpen;

    document.body.style.overflow =
      shouldLock ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    selectedProduct,
    cartOpen,
    menuOpen,
    showMobileFilter,
    checkoutOpen,
  ]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="shop-page">
      {/* TOP BAR */}

      <div className="top-bar">
        <p>
          FREE DELIVERY ON SELECTED ORDERS • ACCRA, GHANA
        </p>
      </div>

      {/* NAVBAR */}

      <header className="navbar">
        <Link
          to="/"
          className="brand-logo"
          onClick={closeMenu}
        >
          <img
            src={nalinLogo}
            alt="NaLin Fitness Apparels logo"
          />
        </Link>

        <nav className="desktop-nav">
          <Link to="/">Home</Link>

          <Link to="/shop" className="active">
            Shop
          </Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="cart-button"
            aria-label={`Shopping bag with ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} />

            <span>{cartCount}</span>
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}

      <div
        className={`mobile-menu-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={closeMenu}
      >
        <div
          className={`mobile-menu ${
            menuOpen ? "open" : ""
          }`}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mobile-menu-header">
            <img
              src={nalinLogo}
              alt="NaLin Fitness Apparels"
            />

            <button
              type="button"
              className="close-menu"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              <X size={25} />
            </button>
          </div>

          <nav className="mobile-nav">
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>

            <Link to="/shop" onClick={closeMenu}>
              Shop
            </Link>

            <Link to="/about" onClick={closeMenu}>
              About
            </Link>

            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </nav>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mobile-whatsapp"
            onClick={closeMenu}
          >
            Chat With Us On WhatsApp
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* SHOP HERO */}

      <section className="shop-hero">
        <div className="shop-hero-content">
          <p className="eyebrow">
            THE NALIN COLLECTION
          </p>

          <h1>
            Find your
            <em> perfect fit.</em>
          </h1>

          <p>
            Discover stylish, comfortable and affordable
            activewear designed to move with you.
          </p>

          <a
            href="#products"
            className="primary-button"
          >
            Explore Collection
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="shop-hero-image">
          <img
            src={one}
            alt="NaLin activewear collection"
          />
        </div>
      </section>

      {/* SHOP CONTROLS */}

      <section
        className="shop-controls"
        id="products"
      >
        <div className="shop-controls-top">
          <div>
            <p className="eyebrow">
              SHOP NALIN
            </p>

            <h2>Our Collection</h2>
          </div>

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setShowMobileFilter(true)
            }
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <div className="shop-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="category-filters">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* MOBILE FILTER */}

      <div
        className={`mobile-filter-overlay ${
          showMobileFilter ? "show" : ""
        }`}
        onClick={() =>
          setShowMobileFilter(false)
        }
      >
        <div
          className="mobile-filter-drawer"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mobile-filter-header">
            <h3>Shop By Category</h3>

            <button
              type="button"
              onClick={() =>
                setShowMobileFilter(false)
              }
              aria-label="Close filters"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mobile-filter-list">
            {CATEGORIES.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory === category
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setSelectedCategory(category);
                  setShowMobileFilter(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}

      <section className="shop-results">
        <div className="results-header">
          <p>
            Showing{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>

          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() =>
                setSelectedCategory("All")
              }
            >
              Clear filter
            </button>
          )}
        </div>

        {productsLoading ? (
          <div className="empty-shop">
            <div className="empty-shop-icon">
              <Search size={28} />
            </div>

            <h3>Loading our collection...</h3>

            <p>
              Please wait while we load our products.
            </p>
          </div>
        ) : productsError ? (
          <div className="empty-shop">
            <div className="empty-shop-icon">
              <Search size={28} />
            </div>

            <h3>Products temporarily unavailable</h3>

            <p>{productsError}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >
                <button
                  type="button"
                  className="product-image-button"
                  onClick={() =>
                    openGallery(product)
                  }
                  aria-label={`View ${product.name} images`}
                >
                  <div className="product-image-wrapper">
                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    <span className="image-view-label">
                      VIEW IMAGES
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                </button>

                <div className="product-details">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="product-bottom">
                    <div className="product-price">
                      {formatMoney(product.price)}
                    </div>

                    <div className="product-rating">
                      <Star
                        size={14}
                        fill="currentColor"
                      />

                      <span>
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="product-add-button"
                    onClick={() =>
                      addToBag(product)
                    }
                    disabled={product.stock <= 0}
                  >
                    {product.stock <= 0
                      ? "Out of Stock"
                      : "Add to Bag"}

                    <ShoppingBag size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-shop">
            <div className="empty-shop-icon">
              <Search size={28} />
            </div>

            <h3>No products found</h3>

            <p>
              Try another search or choose a different
              category.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              View All Products
            </button>
          </div>
        )}
      </section>

      {/* WHATSAPP CTA */}

      <section className="shop-whatsapp-cta">
        <div>
          <p className="eyebrow">
            NEED HELP CHOOSING?
          </p>

          <h2>
            Talk to the
            <em> NaLin team.</em>
          </h2>

          <p>
            Not sure what size or style is right for you?
            Send us a message and we will help you choose.
          </p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Chat On WhatsApp
          <ArrowRight size={18} />
        </a>
      </section>

      {/* FOOTER */}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img
              src={nalinLogo}
              alt="NaLin Fitness Apparels"
              className="footer-logo"
            />

            <p>
              Stylish, comfortable and affordable fitness
              apparel designed to help you move with
              confidence.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer-social instagram"
              >
                <span className="instagram-text">
                  ◎
                </span>
              </a>

              <a
                href="https://www.tiktok.com/@nancy0wusua"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="footer-social tiktok"
              >
                <Music2
                  size={18}
                  strokeWidth={1.6}
                />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="footer-social facebook"
              >
                <span className="facebook-text">
                  f
                </span>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <span>Explore</span>

            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <span>Customer Care</span>

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms &amp; Conditions
            </Link>

            <a href="mailto:nmcdavies1@gmail.com">
              Email Us
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>

          <div className="footer-column">
            <span>Payment</span>

            <div className="footer-payment">
              <strong>MTN MoMo</strong>

              <p>
                Mobile Money payments are accepted.
              </p>
            </div>

            <span className="footer-location-label">
              Location
            </span>

            <p className="footer-location">
              Weija-New Aplaku
              <br />
              AIT University, Sea View Campus
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} NaLin Fitness
            Apparels. All rights reserved.
          </p>

          <p>Developed by McK MEDIA.</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Chat with NaLin on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.55 0 .27 5.28.27 11.77c0 2.07.54 4.09 1.57 5.87L.17 24l6.5-1.7a11.76 11.76 0 0 0 5.37 1.29h.01c6.49 0 11.77-5.28 11.77-11.77 0-3.14-1.22-6.09-3.3-8.34ZM12.05 21.57h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.86 1.01 1.03-3.76-.23-.39a9.76 9.76 0 1 1 8.41 4.71Zm5.36-7.31c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.49.07-.75.37-.26.29-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.2 1.96 2.99 4.75 4.19.66.28 1.17.45 1.57.58.53-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
        </svg>
      </a>

      {/* BACK TO TOP */}

      {showBackToTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp size={19} />
        </button>
      )}

      {/* SHOPPING BAG DRAWER */}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">
                  NALIN BAG
                </p>

                <h2>Your Shopping Bag</h2>
              </div>

              <button
                type="button"
                className="cart-close"
                onClick={() =>
                  setCartOpen(false)
                }
                aria-label="Close shopping bag"
              >
                <X size={22} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={42} />

                <h3>Your bag is empty</h3>

                <p>
                  Add something beautiful from the
                  NaLin collection.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setCartOpen(false)
                  }
                >
                  Continue Shopping
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <img
                        src={
                          item.image ||
                          FALLBACK_IMAGES[0]
                        }
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            FALLBACK_IMAGES[0];
                        }}
                      />

                      <div className="cart-item-info">
                        <p className="cart-item-category">
                          {item.category}
                        </p>

                        <h3>{item.name}</h3>

                        <strong>
                          {formatMoney(item.price)}
                        </strong>

                        <div className="cart-item-bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus size={14} />
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                              disabled={
                                products.find(
                                  (product) =>
                                    String(product.id) ===
                                    String(item.id)
                                )?.stock <= item.quantity
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER SUMMARY */}

                <div className="cart-summary">
                  <div className="cart-summary-heading">
                    <span>ORDER SUMMARY</span>

                    <span>
                      {cartCount} ITEM
                      {cartCount !== 1 ? "S" : ""}
                    </span>
                  </div>

                  <div className="cart-summary-row">
                    <span>Items</span>

                    <strong>{cartCount}</strong>
                  </div>

                  <div className="cart-summary-row">
                    <span>Subtotal</span>

                    <strong>
                      {formatMoney(cartTotal)}
                    </strong>
                  </div>

                  <div className="cart-summary-divider" />

                  <div className="cart-summary-total">
                    <span>Total</span>

                    <strong>
                      {formatMoney(cartTotal)}
                    </strong>
                  </div>

                  <div className="cart-payment-note">
                    <ShoppingBag size={15} />

                    <span>
                      Payment available via MTN Mobile Money
                    </span>
                  </div>

                  <button
                    type="button"
                    className="cart-checkout-button"
                    onClick={openCheckout}
                  >
                    <span className="checkout-pulse" />

                    <span className="checkout-text">
                      Proceed To Order
                      <small>
                        Continue on WhatsApp
                      </small>
                    </span>

                    <ArrowRight size={20} />
                  </button>

                  <p className="cart-secure-note">
                    Your order details will be sent directly
                    to NaLin Fitness Apparels on WhatsApp.
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* CUSTOMER CHECKOUT FORM */}

      {checkoutOpen && (
        <div
          className="checkout-overlay"
          onClick={() => {
            if (!checkoutLoading) {
              setCheckoutOpen(false);
            }
          }}
        >
          <section
            className="checkout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="checkout-modal-header">
              <div>
                <span className="checkout-eyebrow">
                  NALIN FITNESS APPARELS
                </span>

                <h2>Checkout Details</h2>

                <p>
                  Enter your details to continue your order.
                </p>
              </div>

              <button
                type="button"
                className="checkout-close"
                onClick={() => {
                  if (!checkoutLoading) {
                    setCheckoutOpen(false);
                  }
                }}
                aria-label="Close checkout"
                disabled={checkoutLoading}
              >
                <X size={22} />
              </button>
            </div>

            <div className="checkout-order-preview">
              <span>Order total</span>

              <strong>
                {formatMoney(cartTotal)}
              </strong>
            </div>

            <form
              className="checkout-form"
              onSubmit={submitOrder}
            >
              <label htmlFor="checkout-name">
                Full Name
              </label>

              <input
                id="checkout-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={checkoutDetails.name}
                onChange={(event) =>
                  setCheckoutDetails((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                autoComplete="name"
                required
              />

              <label htmlFor="checkout-email">
                Email Address
              </label>

              <input
                id="checkout-email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={checkoutDetails.email}
                onChange={(event) =>
                  setCheckoutDetails((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                autoComplete="email"
                required
              />

              <label htmlFor="checkout-phone">
                Phone Number
              </label>

              <input
                id="checkout-phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={checkoutDetails.phone}
                onChange={(event) =>
                  setCheckoutDetails((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                autoComplete="tel"
                required
              />

              <label htmlFor="checkout-address">
                Delivery Address
              </label>

              <textarea
                id="checkout-address"
                name="address"
                placeholder="Enter your delivery location"
                value={checkoutDetails.address}
                onChange={(event) =>
                  setCheckoutDetails((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                autoComplete="street-address"
                rows={3}
                required
              />

              {checkoutError && (
                <div
                  className="checkout-error"
                  role="alert"
                >
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                className="checkout-submit-button"
                disabled={
                  checkoutLoading || cart.length === 0
                }
              >
                {checkoutLoading
                  ? "Saving Your Order..."
                  : "Save Order & Continue to WhatsApp"}

                {!checkoutLoading && (
                  <ArrowRight size={19} />
                )}
              </button>

              <p className="checkout-privacy-note">
                Your order will be recorded for NaLin's
                admin dashboard. WhatsApp will open afterward
                so you can arrange payment and delivery.
              </p>
            </form>
          </section>
        </div>
      )}

      {/* PRODUCT IMAGE GALLERY */}

      {selectedProduct && (
        <div
          className="product-gallery-overlay"
          onClick={closeGallery}
        >
          <button
            type="button"
            className="gallery-close"
            onClick={closeGallery}
            aria-label="Close product gallery"
          >
            <X size={25} />
          </button>

          <div
            className="gallery-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="gallery-main-image"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={
                  galleryImages[galleryIndex] ||
                  FALLBACK_IMAGES[0]
                }
                alt={`${selectedProduct.name} view ${
                  galleryIndex + 1
                }`}
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-left"
                    onClick={previousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>

                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-right"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              <div className="gallery-counter">
                {galleryIndex + 1} /{" "}
                {galleryImages.length}
              </div>
            </div>

            <div className="gallery-info">
              <p>{selectedProduct.category}</p>

              <h2>{selectedProduct.name}</h2>

              <strong>
                {formatMoney(selectedProduct.price)}
              </strong>

              {selectedProduct.description && (
                <p>
                  {selectedProduct.description}
                </p>
              )}

              <div className="gallery-dots">
                {galleryImages.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={
                        galleryIndex === index
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setGalleryIndex(index)
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                      />
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="gallery-add-button"
                onClick={() => {
                  addToBag(selectedProduct);
                  closeGallery();
                }}
                disabled={selectedProduct.stock <= 0}
              >
                {selectedProduct.stock <= 0
                  ? "Out of Stock"
                  : "Add To Bag"}

                <ShoppingBag size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;