
import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem("ws_user");
      const savedToken = localStorage.getItem("ws_token");

      if (savedAdmin && savedToken) {
        return JSON.parse(savedAdmin);
      }

      return null;
    } catch {
      localStorage.removeItem("ws_user");
      localStorage.removeItem("ws_token");
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("ws_token");
    localStorage.removeItem("ws_user");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        setAdmin,
        logout,
        isAuthenticated: Boolean(admin && localStorage.getItem("ws_token")),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
}

