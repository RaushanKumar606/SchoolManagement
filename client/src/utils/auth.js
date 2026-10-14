// =====================================================
// GET ACCESS TOKEN
// =====================================================
export const getAccessToken = () => {
  return localStorage.getItem(
    "access_token"
  );
};


// =====================================================
// GET REFRESH TOKEN
// =====================================================
export const getRefreshToken = () => {
  return localStorage.getItem(
    "refresh_token"
  );
};


// =====================================================
// GET CURRENT USER
// =====================================================
export const getCurrentUser = () => {
  const storedUser =
    localStorage.getItem("current_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid current user:",
      error
    );

    localStorage.removeItem(
      "current_user"
    );

    return null;
  }
};


// =====================================================
// CHECK AUTHENTICATION
// =====================================================
export const isAuthenticated = () => {
  return !!getAccessToken();
};



// =====================================================
// CLEAR AUTH DATA
// =====================================================
export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("current_user");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
};