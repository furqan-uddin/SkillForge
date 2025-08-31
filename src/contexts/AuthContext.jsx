import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Use a functional update to initialize state from localStorage once
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  // Effect to handle state changes from other tabs or windows
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const updatedUser = storedUser ? JSON.parse(storedUser) : null;

        // This check prevents an infinite loop by only updating if the value has truly changed
        // Use a more stable check to avoid the error.
        if (JSON.stringify(user) !== JSON.stringify(updatedUser)) {
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    const onAuthBroadcast = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("skillforge-auth", onAuthBroadcast);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("skillforge-auth", onAuthBroadcast);
    };
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);

    window.dispatchEvent(new Event("skillforge-auth"));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
   
    window.dispatchEvent(new Event("skillforge-auth"));
  };

  const isAuthenticated = !!user;

  const value = { user, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
