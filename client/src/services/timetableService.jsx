
import { apiRequest } from "../utils/apiRequest";



// Build query parameters for filtering timetable records
const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};

// Admin: Get timetable list with optional filters
export const getAdminTimetables = (filters = {}) => {
  return apiRequest(
    `/academics/admin/timetables/${buildQuery(filters)}`,
    { method: "GET" }
  );
};

// Admin: Get one timetable record
export const getAdminTimetableById = (id) => {
  if (!id) {
    throw new Error("Timetable ID is required.");
  }

  return apiRequest(`/academics/admin/timetables/${id}/`, {
    method: "GET",
  });
};

// Admin: Create timetable
export const createTimetable = (data) => {
  return apiRequest(`/academics/admin/timetables/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Admin: Update timetable completely
export const updateTimetable = (id, data) => {
  if (!id) {
    throw new Error("Timetable ID is required.");
  }

  return apiRequest(`/academics/admin/timetables/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Admin: Update selected timetable fields
export const patchTimetable = (id, data) => {
  if (!id) {
    throw new Error("Timetable ID is required.");
  }

  return apiRequest(`/academics/admin/timetables/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Admin: Delete timetable
export const deleteTimetable = (id) => {
  if (!id) {
    throw new Error("Timetable ID is required.");
  }

  return apiRequest(`/academics/admin/timetables/${id}/`, {
    method: "DELETE",
  });
};

// Teacher/Student: Read-only timetable
export const getMyTimetable = (filters = {}) => {
  return apiRequest(
    `/academics/timetables/${buildQuery(filters)}`,
    { method: "GET" }
  );
};

// Teacher: Filter timetable by day
export const getTeacherDailyTimetable = (day) => {
  return getMyTimetable({ day });
};

// Student: Filter timetable by day
export const getStudentDailyTimetable = (day) => {
  return getMyTimetable({ day });
};

const timetableService = {
  getAdminTimetables,
  getAdminTimetableById,
  createTimetable,
  updateTimetable,
  patchTimetable,
  deleteTimetable,
  getMyTimetable,
  getTeacherDailyTimetable,
  getStudentDailyTimetable,
};

export default timetableService;
