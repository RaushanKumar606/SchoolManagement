
import { apiRequest } from "../utils/apiRequest";


// =====================================
// GET ALL FEE STRUCTURES
// =====================================
export const getFeeStructures = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.academic_year) {
    params.append("academic_year", filters.academic_year);
  }

  if (filters.school_class) {
    params.append("school_class", filters.school_class);
  }

  if (filters.is_active !== undefined && filters.is_active !== "") {
    params.append("is_active", filters.is_active);
  }

  const query = params.toString();

  return apiRequest(
    `/fees/structures/${query ? `?${query}` : ""}`,
    { method: "GET" }
  );
};

// =====================================
// CREATE FEE STRUCTURE
// =====================================
export const createFeeStructure = async (feeData) => {
  return apiRequest(`/fees/structures/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feeData),
  });
};

// =====================================
// UPDATE FEE STRUCTURE
// =====================================
export const updateFeeStructure = async (id, feeData) => {
  return apiRequest(`/fees/structures/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feeData),
  });
};

// =====================================
// DELETE FEE STRUCTURE
// =====================================
export const deleteFeeStructure = async (id) => {
  return apiRequest(`/fees/structures/${id}/`, {
    method: "DELETE",
  });
};
