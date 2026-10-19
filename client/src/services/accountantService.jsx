
import { apiRequest } from "../utils/apiRequest";


// =========================================================
// FEE DASHBOARD
// =========================================================

export const getFeeDashboard = async () => {
  return await apiRequest("/fees/dashboard/");
};


// ==========================================
// ACCOUNTANT - FEE COLLECTION
// ==========================================

// Get all fee invoices
export const getFeeInvoices = async (filters = {}) => {
  const query = new URLSearchParams(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  ).toString();

  return await apiRequest(
    `/fees/invoices/${query ? `?${query}` : ""}`
  );
};

// Get fee payments
export const getFeePayments = async () => {
  return await apiRequest("/fees/payments/");
};

// Collect student's fee (Cash / UPI / Bank etc.)
export const collectStudentFee = async (paymentData) => {
  return await apiRequest("/fees/payments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });
};

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


  getFeeDashboard,
  getFeeInvoices,
  getFeePayments,
  collectStudentFee,
};

export default accountantService;