
import { apiRequest } from "../utils/apiRequest";


export const academicAdminService = {
  // =========================================
  // ACADEMIC YEARS
  // =========================================
  getAcademicYears() {
    return apiRequest(`/academics/admin/years/`, {
      method: "GET",
    });
  },

  createAcademicYear(payload) {
    return apiRequest(`/academics/admin/years/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAcademicYear(id, payload) {
    return apiRequest(`/academics/admin/years/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteAcademicYear(id) {
    return apiRequest(`/academics/admin/years/${id}/`, {
      method: "DELETE",
    });
  },

  // =========================================
  // CLASSES
  // =========================================
  getClasses(academicYearId = "") {
    const query = academicYearId
      ? `?academic_year=${encodeURIComponent(academicYearId)}`
      : "";

    return apiRequest(`/academics/admin/classes/${query}`, {
      method: "GET",
    });
  },

  createClass(payload) {
    return apiRequest(`/academics/admin/classes/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateClass(id, payload) {
    return apiRequest(`/academics/admin/classes/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteClass(id) {
    return apiRequest(`/academics/admin/classes/${id}/`, {
      method: "DELETE",
    });
  },

  // =========================================
  // SECTIONS
  // =========================================
  getSections(schoolClassId = "") {
    const query = schoolClassId
      ? `?school_class=${encodeURIComponent(schoolClassId)}`
      : "";

    return apiRequest(`/academics/admin/sections/${query}`, {
      method: "GET",
    });
  },

  createSection(payload) {
    return apiRequest(`/academics/admin/sections/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateSection(id, payload) {
    return apiRequest(`/academics/admin/sections/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteSection(id) {
    return apiRequest(`/academics/admin/sections/${id}/`, {
      method: "DELETE",
    });
  },

  // =========================================
  // SUBJECTS
  // =========================================
  getSubjects() {
    return apiRequest(`/academics/admin/subjects/`, {
      method: "GET",
    });
  },

  createSubject(payload) {
    return apiRequest(`/academics/admin/subjects/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateSubject(id, payload) {
    return apiRequest(`/academics/admin/subjects/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteSubject(id) {
    return apiRequest(`/academics/admin/subjects/${id}/`, {
      method: "DELETE",
    });
  },

  // =========================================
  // CLASS SUBJECT ASSIGNMENTS
  // =========================================
  getClassSubjects(schoolClassId = "") {
    const query = schoolClassId
      ? `?school_class=${encodeURIComponent(schoolClassId)}`
      : "";

    return apiRequest(`/academics/admin/class-subjects/${query}`, {
      method: "GET",
    });
  },

  createClassSubject(payload) {
    return apiRequest(`/academics/admin/class-subjects/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateClassSubject(id, payload) {
    return apiRequest(`/academics/admin/class-subjects/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteClassSubject(id) {
    return apiRequest(`/academics/admin/class-subjects/${id}/`, {
      method: "DELETE",
    });
  },

 // Single subject assign
createTeacherSubjectAllocation: (data) =>
  apiRequest("/academics/admin/teacher-allocations/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

// Bulk subject assign
createBulkTeacherSubjectAllocation: (data) =>
  apiRequest("/academics/admin/teacher-allocations/bulk/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

};
