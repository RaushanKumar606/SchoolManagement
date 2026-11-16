
import { apiRequest } from "../utils/apiRequest";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const TEACHER_SUBJECT_ALLOCATION_API = {

    createBulkTeacherSubjectAllocation: (data) =>
  apiRequest("/api/auth/academics/admin/teacher-allocations/bulk/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  single: `${API_URL}/api/auth/academics/admin/teacher-allocations/`,
};
