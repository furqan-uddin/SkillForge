// SKILLFORGE/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

