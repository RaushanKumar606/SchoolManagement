
// import { apiRequest } from "../utils/auth";
// const API_URL = "http://127.0.0.1:8000/api";

// export const login = async (username, password) => {
//   const response = await fetch(`${API_URL}/auth/login/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username,
//       password,
//     }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(
//       data.detail || "Invalid username or password"
//     );
//   }
//    const decoded = jwtDecode(data.access);
          

//   if (!data.access) {
//     throw new Error("Login successful but access token was not returned.");
//   }

//   localStorage.setItem("access_token", data.access);

//   if (data.refresh) {
//     localStorage.setItem("refresh_token", data.refresh);
//   }

//   if (data.user_id) {
//     localStorage.setItem("user_id", data.user_id);
//   }

//   if (data.username) {
//     localStorage.setItem("username", data.username);
//   }

//   if (data.role) {
//     localStorage.setItem("role", data.role);
//   }
//     localStorage.getItem("access_token", data.access);

//    return {
//     ...data,
//     user_id: decoded.user_id,
//     username: decoded.username,
//     role: decoded.role,
//   };
// };


// export const changePassword = async (currentPassword,newPassword) => {

//   const token = localStorage.getItem("access_token");

//   console.log("CHANGE PASSWORD TOKEN:", token);

//   if (!token) {
//     throw new Error("Please login again.");
//   }

//   const response = await fetch(
//     `${API_URL}/accounts/change-password/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         current_password: currentPassword,
//         new_password: newPassword,
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message ||
//       data.detail ||
//       "Failed to change password"
//     );
//   }

//   return data;
// };


// export function logout() {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");
//   localStorage.removeItem("user_id");
//   localStorage.removeItem("username");
//   localStorage.removeItem("role");
// }





// import { jwtDecode } from "jwt-decode";
// import { apiRequest } from "../utils/apiRequest";

// const API_URL = "http://127.0.0.1:8000/api";

// // =====================================================
// // LOGIN
// // =====================================================
// export const login = async (username, password) => {
//   const response = await fetch(
//     `${API_URL}/auth/login/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username,
//         password,
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data?.detail ||
//         data?.message ||
//         "Invalid username or password"
//     );
//   }

//   // Access token check
//   if (!data?.access) {
//     throw new Error(
//       "Login successful but access token was not returned."
//     );
//   }

//   // ===================================================
//   // DECODE JWT
//   // ===================================================
//   const decoded = jwtDecode(data.access);

//   console.log("JWT DECODED:", decoded);

//   // ===================================================
//   // SAVE TOKENS
//   // ===================================================
//   localStorage.setItem(
//     "access_token",
//     data.access
//   );

//   if (data.refresh) {
//     localStorage.setItem(
//       "refresh_token",
//       data.refresh
//     );
//   }

//   // ===================================================
//   // USER DATA
//   // ===================================================
//   const userId =
//     data.user_id ||
//     data.user?.id ||
//     decoded.user_id ||
//     decoded.user_id;

//   const loggedUsername =
//     data.username ||
//     data.user?.username ||
//     decoded.username ||
//     username;

//   const role =
//     data.role ||
//     data.user?.role ||
//     decoded.role;

//   if (userId) {
//     localStorage.setItem(
//       "user_id",
//       userId
//     );
//   }

//   if (loggedUsername) {
//     localStorage.setItem(
//       "username",
//       loggedUsername
//     );
//   }

//   if (role) {
//     localStorage.setItem(
//       "role",
//       role
//     );
//   }

//   // ===================================================
//   // CURRENT USER
//   // ===================================================
//   const currentUser = {
//     id: userId,
//     username: loggedUsername,
//     role: role,
//   };

//   localStorage.setItem(
//     "current_user",
//     JSON.stringify(currentUser)
//   );

//   return {
//     ...data,
//     user_id: userId,
//     username: loggedUsername,
//     role: role,
//   };
// };


// // =====================================================
// // CHANGE PASSWORD
// // =====================================================
// export const changePassword = async (
//   currentPassword,
//   newPassword
// ) => {
//   return await apiRequest(
//     "/change-password/",
//     {
//       method: "POST",
//       body: JSON.stringify({
//         current_password: currentPassword,
//         new_password: newPassword,
//       }),
//     }
//   );
// };


// // =====================================================
// // LOGOUT
// // =====================================================
// export function logout() {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");

//   localStorage.removeItem("user_id");
//   localStorage.removeItem("username");
//   localStorage.removeItem("role");

//   localStorage.removeItem("current_user");
// };







import { jwtDecode } from "jwt-decode";
import { apiRequest } from "../utils/apiRequest";

const API_URL = "http://127.0.0.1:8000/api";

// =====================================================
// LOGIN
// =====================================================
export const login = async (username, password) => {
  const response = await fetch(
    `${API_URL}/auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        "Invalid username or password"
    );
  }

  // Access token check
  if (!data?.access) {
    throw new Error(
      "Login successful but access token was not returned."
    );
  }

  // ===================================================
  // DECODE JWT
  // ===================================================
  const decoded = jwtDecode(data.access);

  console.log("JWT DECODED:", decoded);

  // ===================================================
  // SAVE TOKENS
  // ===================================================
  localStorage.setItem(
    "access_token",
    data.access
  );

  if (data.refresh) {
    localStorage.setItem(
      "refresh_token",
      data.refresh
    );
  }

  // ===================================================
  // USER DATA
  // ===================================================
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

  // ===================================================
  // SAVE USER DATA
  // ===================================================
  if (userId) {
    localStorage.setItem(
      "user_id",
      String(userId)
    );
  }

  if (loggedUsername) {
    localStorage.setItem(
      "username",
      loggedUsername
    );
  }

  if (role) {
    localStorage.setItem(
      "role",
      role
    );
  }

  // ===================================================
  // CURRENT USER
  // ===================================================
  const currentUser = {
    id: userId,
    username: loggedUsername,
    role: role,
  };

  localStorage.setItem(
    "current_user",
    JSON.stringify(currentUser)
  );

  return {
    ...data,
    user_id: userId,
    username: loggedUsername,
    role: role,
  };
};


// =====================================================
// CHANGE PASSWORD
// =====================================================
export const changePassword = async (
  currentPassword,
  newPassword
) => {
  return await apiRequest(
    "/change-password/",
    {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );
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