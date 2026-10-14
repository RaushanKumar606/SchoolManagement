// const API_URL = "http://127.0.0.1:8000/api";

// // =====================================================
// // AUTH HEADER
// // =====================================================

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("access_token");

//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// };

// // =====================================================
// // ACCOUNTANT SERVICE
// // =====================================================

// export const AccountantService = {

//   // ===================================================
//   // PAYROLL - EMPLOYEES
//   // ===================================================

//   getEmployees: async () => {
//     const response = await fetch(
//       `${API_URL}/payroll/employees/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load employees."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // PAYROLL - SALARY STRUCTURES
//   // ===================================================

//   getSalaryStructures: async () => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-structures/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load salary structures."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // CREATE SALARY STRUCTURE
//   // ===================================================

//   createSalaryStructure: async (salaryData) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-structures/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(salaryData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to create salary structure."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // GET SALARY STRUCTURE DETAIL
//   // ===================================================

//   getSalaryStructure: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-structures/${id}/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load salary structure."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // UPDATE SALARY STRUCTURE
//   // ===================================================

//   updateSalaryStructure: async (id, salaryData) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-structures/${id}/`,
//       {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(salaryData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to update salary structure."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // DELETE SALARY STRUCTURE
//   // ===================================================

//   deleteSalaryStructure: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-structures/${id}/`,
//       {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to delete salary structure."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // PAYROLL - SALARY SLIPS
//   // ===================================================

//   getSalarySlips: async () => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load salary slips."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // CREATE SALARY SLIP
//   // ===================================================

//   createSalarySlip: async (salarySlipData) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(salarySlipData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to create salary slip."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // SALARY SLIP DETAIL
//   // ===================================================

//   getSalarySlip: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/${id}/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load salary slip."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // UPDATE SALARY SLIP
//   // ===================================================

//   updateSalarySlip: async (id, salarySlipData) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/${id}/`,
//       {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(salarySlipData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to update salary slip."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // DELETE SALARY SLIP
//   // ===================================================

//   deleteSalarySlip: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/${id}/`,
//       {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to delete salary slip."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // APPROVE SALARY
//   // ===================================================

//   approveSalary: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/${id}/approve/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to approve salary."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // PAY SALARY
//   // ===================================================

//   paySalary: async (id) => {
//     const response = await fetch(
//       `${API_URL}/payroll/salary-slips/${id}/pay/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to pay salary."
//       );
//     }

//     return result;
//   },


//   // ===================================================
//   // MY SALARY
//   // ===================================================

//   getMySalary: async () => {
//     const response = await fetch(
//       `${API_URL}/payroll/my-salary/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load my salary."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // FEES - FEE STRUCTURES
//   // =====================================================

//   getFeeStructures: async (params = "") => {
//     const response = await fetch(
//       `${API_URL}/fees/structures/${params}`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load fee structures."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // CREATE FEE STRUCTURE
//   // =====================================================

//   createFeeStructure: async (feeData) => {
//     const response = await fetch(
//       `${API_URL}/fees/structures/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(feeData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to create fee structure."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // GET FEE STRUCTURE DETAIL
//   // =====================================================

//   getFeeStructure: async (id) => {
//     const response = await fetch(
//       `${API_URL}/fees/structures/${id}/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load fee structure."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // UPDATE FEE STRUCTURE
//   // =====================================================

//   updateFeeStructure: async (id, feeData) => {
//     const response = await fetch(
//       `${API_URL}/fees/structures/${id}/`,
//       {
//         method: "PATCH",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(feeData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to update fee structure."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // DELETE FEE STRUCTURE
//   // =====================================================

//   deleteFeeStructure: async (id) => {
//     const response = await fetch(
//       `${API_URL}/fees/structures/${id}/`,
//       {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to delete fee structure."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // FEES - INVOICES
//   // =====================================================

//   getFeeInvoices: async (params = "") => {
//     const response = await fetch(
//       `${API_URL}/fees/invoices/${params}`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load fee invoices."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // CREATE FEE INVOICE
//   // =====================================================

//   createFeeInvoice: async (invoiceData) => {
//     const response = await fetch(
//       `${API_URL}/fees/invoices/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(invoiceData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to create fee invoice."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // FEES - PAYMENTS
//   // =====================================================

//   getFeePayments: async (params = "") => {
//     const response = await fetch(
//       `${API_URL}/fees/payments/${params}`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load fee payments."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // CREATE OFFLINE FEE PAYMENT
//   // =====================================================

//   createFeePayment: async (paymentData) => {
//     const response = await fetch(
//       `${API_URL}/fees/payments/`,
//       {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(paymentData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to collect fee payment."
//       );
//     }

//     return result;
//   },


//   // =====================================================
//   // FEE DASHBOARD
//   // =====================================================

//   getFeeDashboard: async () => {
//     const response = await fetch(
//       `${API_URL}/fees/dashboard/`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//         result.detail ||
//         "Failed to load fee dashboard."
//       );
//     }

//     return result;
//   },

// };

// export default AccountantService;








import { apiRequest } from "./apiClient";

// =========================================================
// EMPLOYEES
// =========================================================

export const getPayrollEmployees = async () => {
  return await apiRequest("/payroll/employees/");
};

// =========================================================
// SALARY STRUCTURES
// =========================================================

export const getSalaryStructures = async () => {
  return await apiRequest("/payroll/salary-structures/");
};

export const createSalaryStructure = async (data) => {
  return await apiRequest("/payroll/salary-structures/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getSalaryStructure = async (id) => {
  return await apiRequest(`/payroll/salary-structures/${id}/`);
};

export const updateSalaryStructure = async (id, data) => {
  return await apiRequest(`/payroll/salary-structures/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteSalaryStructure = async (id) => {
  return await apiRequest(`/payroll/salary-structures/${id}/`, {
    method: "DELETE",
  });
};

// =========================================================
// SALARY SLIPS
// =========================================================

export const getSalarySlips = async () => {
  return await apiRequest("/payroll/salary-slips/");
};

export const createSalarySlip = async (data) => {
  return await apiRequest("/payroll/salary-slips/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getSalarySlip = async (id) => {
  return await apiRequest(`/payroll/salary-slips/${id}/`);
};

export const updateSalarySlip = async (id, data) => {
  return await apiRequest(`/payroll/salary-slips/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteSalarySlip = async (id) => {
  return await apiRequest(`/payroll/salary-slips/${id}/`, {
    method: "DELETE",
  });
};

// =========================================================
// SALARY APPROVAL
// =========================================================

export const approveSalarySlip = async (id) => {
  return await apiRequest(
    `/payroll/salary-slips/${id}/approve/`,
    {
      method: "POST",
    }
  );
};

// =========================================================
// SALARY PAYMENT
// =========================================================

export const paySalary = async (id, data) => {
  return await apiRequest(
    `/payroll/salary-slips/${id}/pay/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

// =========================================================
// MY SALARY
// =========================================================

export const getMySalary = async () => {
  return await apiRequest("/payroll/my-salary/");
};

// =========================================================
// EMPLOYEE BANK DETAILS
// =========================================================

export const getBankDetails = async () => {
  return await apiRequest("/payroll/bank-details/");
};

export const createBankDetails = async (data) => {
  return await apiRequest("/payroll/bank-details/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getBankDetail = async (id) => {
  return await apiRequest(`/payroll/bank-details/${id}/`);
};

export const updateBankDetails = async (id, data) => {
  return await apiRequest(
    `/payroll/bank-details/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
};

export const deleteBankDetails = async (id) => {
  return await apiRequest(
    `/payroll/bank-details/${id}/`,
    {
      method: "DELETE",
    }
  );
};

// =========================================================
// DEFAULT SERVICE
// =========================================================

const accountantService = {
  getPayrollEmployees,

  getSalaryStructures,
  createSalaryStructure,
  getSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,

  getSalarySlips,
  createSalarySlip,
  getSalarySlip,
  updateSalarySlip,
  deleteSalarySlip,

  approveSalarySlip,
  paySalary,

  getMySalary,

  getBankDetails,
  createBankDetails,
  getBankDetail,
  updateBankDetails,
  deleteBankDetails,
};

export default accountantService;