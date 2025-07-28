// SKILLFORGE/src/utils/authHelper.js

export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Logout User (works both inside and outside Router)
 * @param {function} navigate - (Optional) React Router navigate function
 */
export const logoutUser = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (navigate) {
    navigate("/login"); // ✅ If inside Router
  } else {
    window.location.href = "/login"; // ✅ If outside Router
  }
};
