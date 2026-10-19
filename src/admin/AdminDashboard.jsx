import { useEffect, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

import "./AdminDashboard.css";
import ProductManagement from "./ProductManagement";


const API_URL = "https://nalin11.onrender.com/api/products";
const ORDERS_API_URL = "https://nalin11.onrender.com/api/orders";


const LOW_STOCK_LIMIT = 5;

const getAdminToken = () => localStorage.getItem("ws_token");

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingBag },
  { label: "Inventory", icon: Boxes },
  { label: "Customers", icon: Users },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  })
    .format(Number(amount) || 0)
    .replace("GHS", "GH₵");

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getOrderStatusClass = (status) => {
  const normalizedStatus = String(status || "Pending").toLowerCase();

  if (normalizedStatus === "delivered") {
    return "completed";
  }

  if (normalizedStatus === "shipped") {
    return "processing";
  }

  if (normalizedStatus === "cancelled") {
    return "cancelled";
  }

  if (normalizedStatus === "processing") {
    return "processing";
  }

  return "pending";
};

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [orderActionMessage, setOrderActionMessage] = useState("");
  const [orderActionError, setOrderActionError] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [refreshingOrders, setRefreshingOrders] = useState(false);

  const pageTitles = {
    Overview: "Dashboard Overview",
    Products: "Product Management",
    Orders: "Order Management",
    Inventory: "Inventory Management",
    Customers: "Customer Overview",
    Settings: "Store Settings",
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboardProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const token = getAdminToken();

        if (!token) {
          throw new Error(
            "Your admin session has expired. Please log in again."
          );
        }

        const response = await fetch(
          `${API_URL}/admin/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard products."
          );
        }

        const savedProducts = (data.products || []).map((product) => {
          const initials = String(product.name || "")
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return Object.assign({}, product, {
            id: product._id,
            price: Number(product.price) || 0,
            stock: Number(product.stock) || 0,
            initials,
          });
        });

        setProducts(savedProducts);
      } catch (error) {
        if (error.name !== "AbortError") {
          setProductsError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      }
    };

    loadDashboardProducts();

    return () => controller.abort();
  }, []);

  const loadOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshingOrders(true);
      } else {
        setOrdersLoading(true);
      }

      setOrdersError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      const response = await fetch(ORDERS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load customer orders."
        );
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      setOrdersError(
        error.message || "Unable to load customer orders."
      );
    } finally {
      setOrdersLoading(false);
      setRefreshingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!selectedOrder) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !updatingOrder) {
        setSelectedOrder(null);
        setOrderActionMessage("");
        setOrderActionError("");
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedOrder, updatingOrder]);

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name || "";
    const orderNumber = order.orderNumber || "";
    const customerPhone = order.customer?.phone || "";
    const customerEmail = order.customer?.email || "";

    const productNames = (order.items || [])
      .map((item) => item.name || "")
      .join(" ");

    const searchText =
      `${orderNumber} ${customerName} ${customerPhone} ${customerEmail} ${productNames}`
        .toLowerCase();

    return searchText.includes(searchTerm.toLowerCase());
  });

  const filteredProducts = products.filter((product) =>
    `${product.name || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= LOW_STOCK_LIMIT
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  );

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const totalOrderRevenue = orders.reduce((total, order) => {
    if (order.status === "Cancelled") {
      return total;
    }

    return total + Number(order.total || 0);
  }, 0);

  const customers = orders.reduce((list, order) => {
    const customer = order.customer || {};
    const customerKey = (
      customer.email ||
      customer.phone ||
      customer.name ||
      ""
    ).toLowerCase();

    if (!customerKey) {
      return list;
    }

    const existingCustomer = list.find(
      (item) => item.customerKey === customerKey
    );

    if (existingCustomer) {
      existingCustomer.orderCount += 1;
      existingCustomer.totalSpent += Number(order.total || 0);

      if (order.status === "Cancelled") {
        existingCustomer.totalSpent -= Number(order.total || 0);
      }

      existingCustomer.lastOrder = order.createdAt;
      return list;
    }

    const firstOrderValue =
      order.status === "Cancelled" ? 0 : Number(order.total || 0);

    list.push({
      customerKey,
      name: customer.name || "Unnamed customer",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      orderCount: 1,
      totalSpent: firstOrderValue,
      lastOrder: order.createdAt,
    });

    return list;
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status || "Pending");
    setOrderActionMessage("");
    setOrderActionError("");
  };

  const closeOrder = () => {
    if (updatingOrder) {
      return;
    }

    setSelectedOrder(null);
    setOrderActionMessage("");
    setOrderActionError("");
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !selectedOrder._id) {
      setOrderActionError("This order does not have a valid database ID.");
      return;
    }

    if (selectedOrder.status === "Delivered" ||
        selectedOrder.status === "Cancelled") {
      setOrderActionError(
        "Delivered and cancelled orders cannot be changed."
      );
      return;
    }

    try {
      setUpdatingOrder(true);
      setOrderActionError("");
      setOrderActionMessage("");

      const token = getAdminToken();

      if (!token) {
        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      const response = await fetch(
        `${ORDERS_API_URL}/${selectedOrder._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update the order status."
        );
      }

      const updatedOrder = data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setSelectedOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
      setOrderActionMessage(
        data.message || "Order status updated successfully."
      );

      if (updatedOrder.status === "Cancelled") {
        setProducts((currentProducts) =>
          currentProducts.map((product) => {
            const restoredItems = updatedOrder.items || [];

            const restoredQuantity = restoredItems.reduce(
              (total, item) => {
                const productId =
                  typeof item.product === "object"
                    ? item.product?._id
                    : item.product;

                if (productId === product.id ||
                    productId === product._id) {
                  return total + Number(item.quantity || 0);
                }

                return total;
              },
              0
            );

            return Object.assign({}, product, {
              stock: Number(product.stock || 0) + restoredQuantity,
            });
          })
        );
      }
    } catch (error) {
      setOrderActionError(
        error.message || "Unable to update the order status."
      );
    } finally {
      setUpdatingOrder(false);
    }
  };

  const renderOrders = (items) => {
    if (ordersLoading) {
      return (
        <div className="admin-empty">
          Loading customer orders.
        </div>
      );
    }

    if (ordersError) {
      return (
        <div className="admin-order-error">
          <p>{ordersError}</p>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => loadOrders(true)}
            disabled={refreshingOrders}
          >
            {refreshingOrders ? "Refreshing" : "Try Again"}
          </button>
        </div>
      );
    }

    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {items.map((order) => {
              const productNames = (order.items || [])
                .map((item) => item.name)
                .filter(Boolean)
                .join(", ");

              return (
                <tr key={order._id}>
                  <td className="admin-order-id">
                    {order.orderNumber || "Order"}
                  </td>

                  <td>
                    <strong>
                      {order.customer?.name || "Unnamed customer"}
                    </strong>
                    <br />
                    <small>
                      {order.customer?.phone || "No phone number"}
                    </small>
                  </td>

                  <td>
                    {productNames || "No product information"}
                  </td>

                  <td className="admin-amount">
                    {formatMoney(order.total)}
                  </td>

                  <td>
                    <span
                      className={`admin-status ${getOrderStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="admin-text-button"
                      onClick={() => openOrder(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="admin-empty">
                  {orders.length === 0
                    ? "No customer orders have been placed yet."
                    : "No matching orders found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProducts = (items) => (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Availability</th>
          </tr>
        </thead>

        <tbody>
          {items.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="admin-product-cell">
                  <div className="admin-product-avatar">
                    {product.initials}
                  </div>

                  <span>{product.name}</span>
                </div>
              </td>

              <td>{product.category}</td>

              <td className="admin-amount">
                {formatMoney(product.price)}
              </td>

              <td>{product.stock} units</td>

              <td>
                <span
                  className={`admin-status ${
                    product.stock <= LOW_STOCK_LIMIT
                      ? "pending"
                      : product.stock <= 10
                        ? "processing"
                        : "completed"
                  }`}
                >
                  {product.stock <= LOW_STOCK_LIMIT
                    ? "Low stock"
                    : product.stock <= 10
                      ? "Running low"
                      : "In stock"}
                </span>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="admin-empty">
                No matching products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderInventorySummary = () => (
    <section className="admin-panel admin-inventory-summary">
      <div className="admin-panel-heading">
        <div>
          <h3>Inventory Summary</h3>
          <p>Monitor your product stock levels at a glance.</p>
        </div>

        <button
          type="button"
          className="admin-select"
          onClick={() => setActivePage("Inventory")}
        >
          View Inventory
        </button>
      </div>

      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Stock</span>
            <span className="admin-stat-icon blue">
              <Package size={20} />
            </span>
          </div>

          <h3>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : totalStock}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Total units across all products
            </span>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Low Stock</span>
            <span className="admin-stat-icon">
              <Activity size={20} />
            </span>
          </div>

          <h3>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : lowStockProducts.length}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Products with 1 to 5 units remaining
            </span>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Out of Stock</span>
            <span className="admin-stat-icon">
              <Package size={20} />
            </span>
          </div>

          <h3>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : outOfStockProducts.length}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Products that need restocking
            </span>
          </div>
        </article>
      </div>
    </section>
  );

  const renderOverview = () => (
    <>
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">
            YOUR BUSINESS AT A GLANCE
          </span>

          <h2>Welcome to your store.</h2>

          <p>
            Here's what's happening with NaLin Fitness Apparels today.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => setActivePage("Products")}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Products</span>

            <span className="admin-stat-icon blue">
              <Package size={20} />
            </span>
          </div>

          <h3>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : totalProducts}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              <Activity size={15} />
              Products in database
            </span>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Orders</span>

            <span className="admin-stat-icon purple">
              <ShoppingBag size={20} />
            </span>
          </div>

          <h3>
            {ordersLoading ? "Loading" : ordersError ? "Unavailable" : orders.length}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Orders recorded in the database
            </span>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Customers</span>

            <span className="admin-stat-icon green">
              <Users size={20} />
            </span>
          </div>

          <h3>
            {ordersLoading ? "Loading" : ordersError ? "Unavailable" : customers.length}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Customers identified from orders
            </span>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Order Value</span>

            <span className="admin-stat-icon">
              <Activity size={20} />
            </span>
          </div>

          <h3>
            {ordersLoading
              ? "Loading"
              : ordersError
                ? "Unavailable"
                : formatMoney(totalOrderRevenue)}
          </h3>

          <div className="admin-stat-foot">
            <span className="admin-neutral">
              Excludes cancelled orders
            </span>
          </div>
        </article>
      </div>

      {renderInventorySummary()}

      <div className="admin-content-grid">
        <section className="admin-panel admin-sales-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Sales totals will be expanded in a later step.</p>
            </div>
          </div>

          <div className="admin-chart-summary">
            <strong>{formatMoney(totalOrderRevenue)}</strong>

            <span className="admin-neutral">
              Order value
            </span>
          </div>

          <div className="admin-settings-placeholder">
            <Activity size={30} />

            <h4>Sales reporting</h4>

            <p>
              Detailed daily and monthly sales reports will be added
              after the order management process has been tested.
            </p>
          </div>
        </section>

        <section className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Order Activity</h3>
              <p>A quick look at your orders.</p>
            </div>
          </div>

          <div className="admin-activity-list">
            <div className="admin-activity-item">
              <span className="admin-activity-icon purple">
                <ShoppingBag size={18} />
              </span>

              <div>
                <strong>Pending</strong>
                <p>Awaiting processing</p>
              </div>

              <b>{pendingOrders.length}</b>
            </div>

            <div className="admin-activity-item">
              <span className="admin-activity-icon green">
                <CheckCircle2 size={18} />
              </span>

              <div>
                <strong>Delivered</strong>
                <p>Successfully delivered</p>
              </div>

              <b>{deliveredOrders.length}</b>
            </div>

            <div className="admin-activity-item">
              <span className="admin-activity-icon orange">
                <Clock3 size={18} />
              </span>

              <div>
                <strong>Processing</strong>
                <p>Being prepared or shipped</p>
              </div>

              <b>{processingOrders.length}</b>
            </div>
          </div>

          <button
            type="button"
            className="admin-text-button"
            onClick={() => setActivePage("Orders")}
          >
            View all orders
            <ArrowUpRight size={16} />
          </button>
        </section>
      </div>

      <section className="admin-panel admin-recent-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Recent Orders</h3>
            <p>Keep track of your latest customer orders.</p>
          </div>

          <button
            type="button"
            className="admin-text-button"
            onClick={() => setActivePage("Orders")}
          >
            View all
            <ArrowUpRight size={16} />
          </button>
        </div>

        {renderOrders(orders.slice(0, 5))}
      </section>
    </>
  );

  const renderOrdersPage = () => (
    <section className="admin-panel admin-management-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>All Orders</h3>

          <p>
            View customer purchases and manage order status.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => loadOrders(true)}
          disabled={refreshingOrders || ordersLoading}
        >
          {refreshingOrders ? "Refreshing" : "Refresh Orders"}
        </button>
      </div>

      <div className="admin-order-summary">
        <div>
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>{pendingOrders.length}</strong>
        </div>

        <div>
          <span>Processing</span>
          <strong>{processingOrders.length}</strong>
        </div>

        <div>
          <span>Delivered</span>
          <strong>{deliveredOrders.length}</strong>
        </div>
      </div>

      {renderOrders(filteredOrders)}
    </section>
  );

  const renderInventoryPage = () => (
    <section className="admin-panel admin-management-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>Stock Overview</h3>
          <p>Identify products that may need restocking.</p>
        </div>
      </div>

      <div className="admin-inventory-summary">
        <div>
          <span>Total Products</span>
          <strong>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : totalProducts}
          </strong>
        </div>

        <div>
          <span>Total Stock Units</span>
          <strong>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : totalStock}
          </strong>
        </div>

        <div>
          <span>Low-stock Products</span>
          <strong>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : lowStockProducts.length}
          </strong>
        </div>

        <div>
          <span>Out-of-stock Products</span>
          <strong>
            {productsLoading
              ? "Loading"
              : productsError
                ? "Unavailable"
                : outOfStockProducts.length}
          </strong>
        </div>
      </div>

      {productsError && (
        <div className="admin-order-error">
          {productsError}
        </div>
      )}

      {renderProducts(filteredProducts)}
    </section>
  );

  const renderCustomersPage = () => (
    <section className="admin-panel admin-management-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>Customer Overview</h3>
          <p>Customers identified from actual orders.</p>
        </div>
      </div>

      {ordersLoading && (
        <div className="admin-empty">
          Loading customer information.
        </div>
      )}

      {ordersError && (
        <div className="admin-order-error">
          {ordersError}
        </div>
      )}

      {!ordersLoading && !ordersError && (
        <div className="admin-customer-list">
          {customers
            .filter((customer) => {
              const searchText =
                `${customer.name} ${customer.email} ${customer.phone}`
                  .toLowerCase();

              return searchText.includes(searchTerm.toLowerCase());
            })
            .map((customer) => (
              <div
                className="admin-customer-item"
                key={customer.customerKey}
              >
                <div className="admin-customer-avatar">
                  {customer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>{customer.name}</strong>
                  <p>{customer.email || customer.phone || "No contact details"}</p>
                  <p>{customer.phone}</p>
                </div>

                <span>
                  {customer.orderCount} order(s)
                </span>
              </div>
            ))}

          {customers.length === 0 && (
            <div className="admin-empty">
              No customer records are available yet.
            </div>
          )}
        </div>
      )}
    </section>
  );

  const renderSettingsPage = () => (
    <section className="admin-panel admin-management-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>Store Settings</h3>
          <p>Store configuration will be connected in a later step.</p>
        </div>
      </div>

      <div className="admin-settings-placeholder">
        <Settings size={30} />

        <h4>Store settings</h4>

        <p>
          Business details, notifications, payment settings and
          administrator account controls will be added in the next stages.
        </p>
      </div>
    </section>
  );

  const renderPageContent = () => {
    if (activePage === "Overview") {
      return renderOverview();
    }

    if (activePage === "Products") {
      return (
        <ProductManagement
          products={products}
          setProducts={setProducts}
          searchTerm={searchTerm}
        />
      );
    }

    if (activePage === "Orders") {
      return renderOrdersPage();
    }

    if (activePage === "Inventory") {
      return renderInventoryPage();
    }

    if (activePage === "Customers") {
      return renderCustomersPage();
    }

    return renderSettingsPage();
  };

  return (
    <div className="nalin-admin">
      {sidebarOpen && (
        <button
          type="button"
          className="admin-mobile-backdrop"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="admin-brand">
          <div className="admin-brand-mark">N</div>

          <div>
            <strong>NaLin</strong>
            <span>FITNESS APPARELS</span>
          </div>

          <button
            type="button"
            className="admin-close-sidebar"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-store-label">
          STORE MANAGEMENT
        </div>

        <nav
          className="admin-navigation"
          aria-label="Admin navigation"
        >
          {navigation.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`admin-nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(label);
                closeSidebar();
                setSearchTerm("");
              }}
            >
              <Icon size={19} strokeWidth={1.8} />

              <span>{label}</span>

              {label === "Orders" && (
                <span className="admin-nav-count">
                  {ordersLoading ? " " : orders.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <span className="admin-help-icon">
              <CircleHelp size={20} />
            </span>

            <strong>Need a hand?</strong>
            <p>Manage your store with confidence.</p>
          </div>

          <button
            type="button"
            className={`admin-nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("Settings");
              closeSidebar();
            }}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </button>

          <div className="admin-profile">
            <div className="admin-profile-avatar">N</div>

            <div className="admin-profile-details">
              <strong>Store Admin</strong>
              <span>Administrator</span>
            </div>

            <LogOut size={17} className="admin-profile-icon" />
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <div className="admin-breadcrumb">
              <span>NaLin Store</span>
              <span className="admin-breadcrumb-divider">/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <label className="admin-search">
              <Search size={18} />

              <input
                type="search"
                placeholder={
                  activePage === "Orders"
                    ? "Search orders or customers"
                    : activePage === "Products" ||
                        activePage === "Inventory"
                      ? "Search products"
                      : activePage === "Customers"
                        ? "Search customers"
                        : "Search"
                }
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="admin-notification-button"
              aria-label="Notifications"
              title="Notifications will be connected later"
              onClick={() =>
                window.alert(
                  "Notifications will be connected in a later step."
                )
              }
            >
              <Bell size={19} />
              <span />
            </button>

            <button
              type="button"
              className="admin-account-button"
              onClick={() => setActivePage("Settings")}
            >
              <div className="admin-account-avatar">N</div>

              <div>
                <strong>Store Admin</strong>
                <span>Administrator</span>
              </div>

              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="admin-page-content">
          <div className="admin-page-title">
            <div>
              <h1>{pageTitles[activePage]}</h1>

              <p>
                Manage your store, products and customers from one place.
              </p>
            </div>

            <span className="admin-date-label">
              <Clock3 size={15} />
              Live store data
            </span>
          </div>

          {renderPageContent()}

          <footer className="admin-footer">
            <span>
              © {new Date().getFullYear()} NaLin Fitness Apparels
            </span>

            <span>Store Management Dashboard</span>
          </footer>
        </div>
      </main>

      {selectedOrder && (
        <div
          className="admin-order-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeOrder();
            }
          }}
        >
          <section
            className="admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-modal-title"
          >
            <div className="admin-order-modal-header">
              <div>
                <span className="admin-eyebrow">
                  CUSTOMER ORDER
                </span>

                <h2 id="admin-order-modal-title">
                  {selectedOrder.orderNumber || "Order details"}
                </h2>

                <p>
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                type="button"
                className="admin-order-modal-close"
                onClick={closeOrder}
                aria-label="Close order details"
                disabled={updatingOrder}
              >
                <X size={22} />
              </button>
            </div>

            <div className="admin-order-modal-body">
              <div className="admin-order-detail-section">
                <h3>Customer Information</h3>

                <div className="admin-order-detail-grid">
                  <div>
                    <span>Full Name</span>
                    <strong>
                      {selectedOrder.customer?.name || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone Number</span>
                    <strong>
                      {selectedOrder.customer?.phone || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>
                      {selectedOrder.customer?.email || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Address</span>
                    <strong>
                      {selectedOrder.customer?.address || "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="admin-order-detail-section">
                <h3>Products Ordered</h3>

                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    className="admin-order-product"
                    key={`${selectedOrder._id}-${index}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Ordered product"}
                      />
                    ) : (
                      <div className="admin-order-product-placeholder">
                        <Package size={24} />
                      </div>
                    )}

                    <div className="admin-order-product-info">
                      <strong>{item.name || "Product"}</strong>

                      <span>
                        Quantity: {Number(item.quantity) || 0}
                      </span>

                      {item.size && (
                        <span>Size: {item.size}</span>
                      )}

                      <span>
                        Unit price: {formatMoney(item.price)}
                      </span>
                    </div>

                    <strong className="admin-order-product-total">
                      {formatMoney(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      )}
                    </strong>
                  </div>
                ))}

                {(selectedOrder.items || []).length === 0 && (
                  <p className="admin-empty">
                    No product details are available for this order.
                  </p>
                )}
              </div>

              <div className="admin-order-detail-section">
                <h3>Payment Information</h3>

                <div className="admin-order-detail-grid">
                  <div>
                    <span>Payment Method</span>
                    <strong>
                      {selectedOrder.paymentMethod || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>
                    <strong>
                      {selectedOrder.paymentStatus || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatMoney(selectedOrder.subtotal)}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Fee</span>
                    <strong>
                      {formatMoney(selectedOrder.deliveryFee)}
                    </strong>
                  </div>
                </div>

                <div className="admin-order-grand-total">
                  <span>Order Total</span>

                  <strong>
                    {formatMoney(selectedOrder.total)}
                  </strong>
                </div>
              </div>

              <div className="admin-order-detail-section">
                <h3>Manage Order Status</h3>

                <div className="admin-order-current-status">
                  <span>Current Status</span>

                  <span
                    className={`admin-status ${getOrderStatusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>

                {selectedOrder.status === "Delivered" ||
                selectedOrder.status === "Cancelled" ? (
                  <p className="admin-order-locked-message">
                    This order is {selectedOrder.status.toLowerCase()}.
                    Its status cannot be changed.
                  </p>
                ) : (
                  <div className="admin-order-status-controls">
                    <select
className="admin-order-status-select"
value={selectedStatus}
onChange={(event) =>
setSelectedStatus(event.target.value)
}
disabled={updatingOrder}
aria-label="Choose new order status"

>

  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Cancelled">Cancelled</option>
</select>


                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={updateOrderStatus}
                      disabled={
                        updatingOrder ||
                        selectedStatus === selectedOrder.status
                      }
                    >
                      {updatingOrder
                        ? "Saving"
                        : "Save Status"}
                    </button>
                  </div>
                )}

                {orderActionMessage && (
                  <div className="admin-order-success">
                    {orderActionMessage}
                  </div>
                )}

                {orderActionError && (
                  <div className="admin-order-error">
                    {orderActionError}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;