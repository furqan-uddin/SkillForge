import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("skillforge-auth"));
  };

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    window.dispatchEvent(new Event("skillforge-auth"));
  };

  // Check token expiry on mount and periodically
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Already logged out
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          logout();
        }
      } catch {
        // Bad token → logout for safety
        logout();
      }
    };

    // Run once on mount
    checkTokenValidity();

    // Run every 1 minute (safe refresh check)
    const interval = setInterval(checkTokenValidity, 60 * 1000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  // Keep multiple tabs in sync (no logout loops)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("skillforge-auth", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("skillforge-auth", handleStorageChange);
    };
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
