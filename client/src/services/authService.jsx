
import { jwtDecode } from "jwt-decode";
import { apiRequest } from "../utils/apiRequest";

// =====================================================
// LOGIN
// =====================================================
export const login = async (username, password) => {
  const data = await apiRequest("/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  // Access token check
  if (!data?.access) {
    throw new Error(
      "Login successful but access token was not returned."
    );
  }

  // Decode JWT
  const decoded = jwtDecode(data.access);

  // Save tokens
  localStorage.setItem("access_token", data.access);

  if (data.refresh) {
    localStorage.setItem("refresh_token", data.refresh);
  } else {
    localStorage.removeItem("refresh_token");
  }

  // User data
  const userId =
    data.user_id ||
    data.user?.id ||
    decoded.user_id;

  const loggedUsername =
    data.username ||
    data.user?.username ||
    decoded.username ||
    username;

  const role =
    data.role ||
    data.user?.role ||
    decoded.role;

  // Save user data
  if (userId != null) {
    localStorage.setItem("user_id", String(userId));
  }

  if (loggedUsername) {
    localStorage.setItem("username", loggedUsername);
  }

  if (role) {
    localStorage.setItem("role", role);
  }

  return data;
};



// =====================================================
// CHANGE PASSWORD
// =====================================================
export const changePassword = async (
  currentPassword,
  newPassword
) => {
  return await apiRequest("/accounts/change-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
};


// =====================================================
// LOGOUT
// =====================================================
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("current_user");
};