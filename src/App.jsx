
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AdminAuthProvider } from "./context/AdminAuthContext";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Customer-facing website */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Admin login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected admin pages */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;

