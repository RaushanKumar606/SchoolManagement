
// const API_URL = "http://127.0.0.1:8000/api/auth";

// let refreshPromise = null;
// const refreshAccessToken = async () => {
//   const refreshToken =
//     localStorage.getItem("refresh_token");

//   if (!refreshToken) {
//     throw new Error("Refresh token not found");
//   }

//   console.log("🔄 REFRESH TOKEN REQUEST STARTED");

//   const response = await fetch(
//     `${API_URL}/token/refresh/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         refresh: refreshToken,
//       }),
//     }
//   );

//   let data = {};

//   try {
//     data = await response.json();
//   } catch {
//     data = {};
//   }

//   // =====================================================
//   // REFRESH FAILED
//   // =====================================================
//   if (!response.ok || !data?.access) {

//     console.error(
//       "❌ REFRESH TOKEN INVALID OR EXPIRED"
//     );

//     localStorage.removeItem(
//       "access_token"
//     );

//     localStorage.removeItem(
//       "refresh_token"
//     );

//     localStorage.removeItem(
//       "current_user"
//     );

//     localStorage.removeItem(
//       "user_id"
//     );

//     localStorage.removeItem(
//       "username"
//     );

//     localStorage.removeItem(
//       "role"
//     );

//     throw new Error(
//       data?.detail ||
//       "Session expired. Please login again."
//     );
//   }

//   // =====================================================
//   // SAVE NEW ACCESS TOKEN
//   // =====================================================
//   localStorage.setItem(
//     "access_token",
//     data.access
//   );

//   return data.access;
// };


// // =========================================================
// // GET / REFRESH TOKEN SAFELY
// // =========================================================
// const getFreshAccessToken = async () => {

//   // If refresh already running,
//   // wait for the same request.
//   if (!refreshPromise) {

//     refreshPromise =
//       refreshAccessToken();

//     try {

//       return await refreshPromise;

//     } finally {

//       // Reset after refresh finishes
//       refreshPromise = null;
//     }
//   }
//   return await refreshPromise;
// };


// // =========================================================
// // COMMON API REQUEST
// // =========================================================
// export const apiRequest = async (
//   endpoint,
//   options = {},
//   retry = true
// ) => {

//   let token =
//     localStorage.getItem(
//       "access_token"
//     );


//   // =======================================================
//   // MAKE REQUEST
//   // =======================================================
//   const makeRequest = async (
//     accessToken
//   ) => {

//     const headers = {
//       ...(accessToken
//         ? {
//             Authorization:
//               `Bearer ${accessToken}`,
//           }
//         : {}),

//       ...options.headers,
//     };


//     // =====================================================
//     // JSON CONTENT TYPE
//     // =====================================================
//     // Don't set JSON Content-Type
//     // when body is FormData.
//     if (
//       !(options.body instanceof FormData)
//     ) {
//       headers["Content-Type"] =
//         "application/json";
//     }


//     return fetch(
//       `${API_URL}${endpoint}`,
//       {
//         ...options,
//         headers,
//       }
//     );
//   };


//   // =======================================================
//   // FIRST REQUEST
//   // =======================================================
//   let response =
//     await makeRequest(token);


//   // =======================================================
//   // ACCESS TOKEN EXPIRED
//   // =======================================================
//   if (
//     response.status === 401 &&
//     retry
//   ) {

//     try {

//       // ===================================================
//       // GET NEW TOKEN
//       // ===================================================
//       token =
//         await getFreshAccessToken();

//       // ===================================================
//       // RETRY ORIGINAL REQUEST
//       // ===================================================
//       response =
//         await makeRequest(token);

//     } catch (refreshError) {
//       throw refreshError;
//     }
//   }


//   // =======================================================
//   // RESPONSE DATA
//   // =======================================================
//   const contentType =
//     response.headers.get(
//       "content-type"
//     );

//   let data;


//   if (
//     contentType?.includes(
//       "application/json"
//     )
//   ) {

//     data =
//       await response.json();

//   } else {

//     data =
//       await response.text();
//   }


//   // =======================================================
//   // API ERROR
//   // =======================================================
//   if (!response.ok) {
//   console.error("API REQUEST FAILED:", {
//     url: response.url,
//     status: response.status,
//     response: data,
//   });

//   throw new Error(
//     data?.detail ||
//     data?.message ||
//     (typeof data === "string" ? data : `API request failed (${response.status})`)
//   );
// }
//   return data;
// };





const API_URL = "http://127.0.0.1:8000/api/auth";

let refreshPromise = null;

// =====================================================
// CLEAR AUTH DATA
// =====================================================
const clearAuthData = () => {
  const keys = [
    "access_token",
    "refresh_token",
    "current_user",
    "user_id",
    "username",
    "role",
  ];

  keys.forEach((key) => localStorage.removeItem(key));
};

// =====================================================
// PARSE API RESPONSE
// =====================================================
const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (!text) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

// =====================================================
// CREATE API ERROR
// =====================================================
const createApiError = (response, data) => {
  const message =
    data?.detail ||
    data?.message ||
    (typeof data === "string" ? data : null) ||
    `API request failed (${response.status})`;

  const error = new Error(message);

  // Keep compatibility with existing Login.jsx
  // which checks error.response.status and error.response.data
  error.response = {
    status: response.status,
    data,
    url: response.url,
  };

  error.status = response.status;
  error.data = data;

  return error;
};

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================
const refreshAccessToken = async () => {
  const refreshToken =
    localStorage.getItem("refresh_token");

  if (!refreshToken) {
    clearAuthData();
    throw new Error("Refresh token not found. Please login again.");
  }

  let response;

  try {
    response = await fetch(
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
  } catch (error) {
    // Network error: do not destroy a potentially valid session.
    throw error;
  }

  const data = await parseResponse(response);

  // Refresh failed
  if (!response.ok || !data?.access) {
    clearAuthData();

    throw createApiError(response, data);
  }

  // Save new access token
  localStorage.setItem(
    "access_token",
    data.access
  );

  // Handle refresh rotation if enabled in Django
  if (data.refresh) {
    localStorage.setItem(
      "refresh_token",
      data.refresh
    );
  }

  return data.access;
};

// =====================================================
// SINGLE REFRESH REQUEST
// =====================================================
const getFreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  }

  return refreshPromise;
};

// =====================================================
// AUTH ENDPOINT CHECK
// =====================================================
const isAuthEndpoint = (endpoint) => {
  const normalized = endpoint.split("?")[0];

  return (
    /(^|\/)login\/?$/.test(normalized) ||
    /(^|\/)token\/refresh\/?$/.test(normalized)
  );
};

// =====================================================
// COMMON API REQUEST
// =====================================================
export const apiRequest = async (
  endpoint,
  options = {},
  retry = true
) => {
  const authEndpoint = isAuthEndpoint(endpoint);

  let token = authEndpoint
    ? null
    : localStorage.getItem("access_token");

  // ===================================================
  // MAKE REQUEST
  // ===================================================
  const makeRequest = async (accessToken) => {
    const headers = {
      ...options.headers,
    };

    // Do not send an old token to login endpoints
    if (accessToken && !authEndpoint) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete headers.Authorization;
    }

    const isFormData =
      typeof FormData !== "undefined" &&
      options.body instanceof FormData;

    // FormData must set its own multipart boundary
    if (isFormData) {
      delete headers["Content-Type"];
      delete headers["content-type"];
    } else if (options.body != null) {
      if (
        !headers["Content-Type"] &&
        !headers["content-type"]
      ) {
        headers["Content-Type"] = "application/json";
      }
    }

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  // ===================================================
  // FIRST REQUEST
  // ===================================================
  let response = await makeRequest(token);

  // ===================================================
  // TOKEN EXPIRED: REFRESH AND RETRY
  // ===================================================
  if (
    response.status === 401 &&
    retry &&
    token &&
    !authEndpoint
  ) {
    token = await getFreshAccessToken();

    // Retry only once
    response = await makeRequest(token);
  }

  // ===================================================
  // PARSE RESPONSE
  // ===================================================
  const data = await parseResponse(response);

  // ===================================================
  // HANDLE API ERROR
  // ===================================================
  if (!response.ok) {
    console.error("API REQUEST FAILED:", {
      url: response.url,
      status: response.status,
      response: data,
    });

    throw createApiError(response, data);
  }

  return data;
};
