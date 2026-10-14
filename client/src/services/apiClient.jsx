

import { refreshAccessToken } from "../utils/apiRequest";

const apiClient = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");

  const makeRequest = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });
  };

  // =====================================================
  // FIRST REQUEST
  // =====================================================

  let response = await makeRequest(accessToken);

  // =====================================================
  // ACCESS TOKEN EXPIRED
  // =====================================================

  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();

      // =================================================
      // RETRY ORIGINAL REQUEST
      // =================================================

      response = await makeRequest(accessToken);

    } catch (error) {
      // Refresh token bhi invalid/expired
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");

      window.location.href = "/login";

      throw error;
    }
  }

  return response;
};

export default apiClient;