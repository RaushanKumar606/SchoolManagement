import { apiRequest } from "../utils/apiRequest";

// Public API
export const getPublicApplicationSettings = async () => {
  return apiRequest("/application-settings/", {
    method: "GET",
    auth: false,
  });
};

// Admin API
export const getAdminApplicationSettings = async () => {
  return apiRequest("/application-settings/admin/", {
    method: "GET",
  });
};

// Update settings
export const updateApplicationSettings = async (data) => {
  return apiRequest("/application-settings/admin/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};