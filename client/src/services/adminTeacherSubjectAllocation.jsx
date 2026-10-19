
import { apiRequest } from "../utils/apiRequest";

export const TEACHER_SUBJECT_ALLOCATION_API = {

    createBulkTeacherSubjectAllocation: (data) =>
  apiRequest("/academics/admin/teacher-allocations/bulk/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  single: `${API}/academics/admin/teacher-allocations/`,
};
