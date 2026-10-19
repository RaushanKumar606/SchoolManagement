

const API_URL = "http://127.0.0.1:8000/api/auth";

// =========================================================
// TOKEN REFRESH STATE
// =========================================================
let refreshPromise = null;


// =========================================================
// REFRESH ACCESS TOKEN
// =========================================================
const refreshAccessToken = async () => {
  const refreshToken =
    localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  console.log("🔄 REFRESH TOKEN REQUEST STARTED");

  const response = await fetch(
    `${API_URL}/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  );

  console.log(
    "REFRESH STATUS:",
    response.status
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  console.log(
    "REFRESH RESPONSE:",
    data
  );

  // =====================================================
  // REFRESH FAILED
  // =====================================================
  if (!response.ok || !data?.access) {

    console.error(
      "❌ REFRESH TOKEN INVALID OR EXPIRED"
    );

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "current_user"
    );

    localStorage.removeItem(
      "user_id"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "role"
    );

    throw new Error(
      data?.detail ||
      "Session expired. Please login again."
    );
  }

  // =====================================================
  // SAVE NEW ACCESS TOKEN
  // =====================================================
  localStorage.setItem(
    "access_token",
    data.access
  );

  console.log(
    "✅ NEW ACCESS TOKEN SAVED"
  );

  return data.access;
};


// =========================================================
// GET / REFRESH TOKEN SAFELY
// =========================================================
const getFreshAccessToken = async () => {

  // If refresh already running,
  // wait for the same request.
  if (!refreshPromise) {

    refreshPromise =
      refreshAccessToken();

    try {

      return await refreshPromise;

    } finally {

      // Reset after refresh finishes
      refreshPromise = null;
    }
  }

  // Another request is already refreshing.
  console.log(
    "⏳ TOKEN REFRESH ALREADY RUNNING → WAITING"
  );

  return await refreshPromise;
};


// =========================================================
// COMMON API REQUEST
// =========================================================
export const apiRequest = async (
  endpoint,
  options = {},
  retry = true
) => {

  let token =
    localStorage.getItem(
      "access_token"
    );


  // =======================================================
  // MAKE REQUEST
  // =======================================================
  const makeRequest = async (
    accessToken
  ) => {

    const headers = {
      ...(accessToken
        ? {
            Authorization:
              `Bearer ${accessToken}`,
          }
        : {}),

      ...options.headers,
    };


    // =====================================================
    // JSON CONTENT TYPE
    // =====================================================
    // Don't set JSON Content-Type
    // when body is FormData.
    if (
      !(options.body instanceof FormData)
    ) {
      headers["Content-Type"] =
        "application/json";
    }


    return fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };


  // =======================================================
  // FIRST REQUEST
  // =======================================================
  let response =
    await makeRequest(token);


  // =======================================================
  // ACCESS TOKEN EXPIRED
  // =======================================================
  if (
    response.status === 401 &&
    retry
  ) {

    console.log(
      "⚠️ 401 RECEIVED → REFRESHING ACCESS TOKEN"
    );


    try {

      // ===================================================
      // GET NEW TOKEN
      // ===================================================
      token =
        await getFreshAccessToken();


      console.log(
        "🔑 NEW ACCESS TOKEN RECEIVED"
      );


      // ===================================================
      // RETRY ORIGINAL REQUEST
      // ===================================================
      response =
        await makeRequest(token);


      console.log(
        "🔁 RETRY STATUS:",
        response.status
      );

    } catch (refreshError) {

      console.error(
        "❌ TOKEN REFRESH FAILED:",
        refreshError
      );

      // Let application handle session expiry
      throw refreshError;
    }
  }


  // =======================================================
  // RESPONSE DATA
  // =======================================================
  const contentType =
    response.headers.get(
      "content-type"
    );

  let data;


  if (
    contentType?.includes(
      "application/json"
    )
  ) {

    data =
      await response.json();

  } else {

    data =
      await response.text();
  }


  // =======================================================
  // API ERROR
  // =======================================================
  if (!response.ok) {

    throw new Error(
      data?.detail ||
      data?.message ||
      "API request failed"
    );
  }


  // =======================================================
  // RETURN DATA
  // =======================================================
  return data;
};