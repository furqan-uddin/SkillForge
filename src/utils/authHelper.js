// SKILLFORGE/src/utils/authHelper.js

// src/utils/authHelper.js
// Non-opinionated helpers used across your app.
// Keeps the same behavior as original, but adds a small in-tab notification (custom event) so components can react instantly.

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = parseJwt(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * loginUser: saves token & user and notifies other components in the same tab
 * Keep shape compatible with your existing calls (we pass token and user object)
 */
export const loginUser = ({ token, user }) => {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  // Broadcast small custom event so Navbar (and others) can react immediately without reload
  window.dispatchEvent(new Event("skillforge-auth"));
};

/**
 * logoutUser: clears token & user; optionally navigate using passed navigate function
 * Keeps previous redirect behavior for outside-router usage.
 */
export const logoutUser = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("skillforge-auth"));
  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    // fallback hard redirect (keeps compatibility with places that call logoutUser() without router)
    window.location.href = "/login";
  }
};

