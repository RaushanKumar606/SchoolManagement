
import { apiRequest } from "../utils/apiRequest";



function unwrap(response) {
  return response?.data ?? response;
}

function getList(response) {
  const result = unwrap(response);

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.results)) return result.results;
  if (Array.isArray(result?.data)) return result.data;

  return [];
}

export async function getFeeInvoices() {
  return getList(await apiRequest(`/fees/invoices/`));
}

export async function getFeePayments() {
  return getList(await apiRequest(`/fees/payments/`));
}

export async function getFeeStructures() {
  return getList(await apiRequest(`/fees/structures/`));
}

export async function getFeeDashboard() {
  return unwrap(await apiRequest(`/fees/dashboard/`));
}
