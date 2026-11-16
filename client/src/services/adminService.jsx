
const API_URL = "http://127.0.0.1:8000/api";

import { apiRequest } from "../utils/apiRequest";

const fetchApplications = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await apiRequest("/api/auth/admissions/list/", {
      method: "GET",
    });

    if (Array.isArray(data)) {
      setApplications(data);
    } else if (Array.isArray(data?.results)) {
      setApplications(data.results);
    } else if (Array.isArray(data?.data)) {
      setApplications(data.data);
    } else {
      setApplications([]);
      setError("Unexpected data format received from server.");
    }
  } catch (err) {
    console.error("Admission Error:", err);
    setError(err?.message || "Failed to load applications.");
    setApplications([]);
  } finally {
    setLoading(false);
  }
};


// =====================================================
// ADMIN SERVICE
// =====================================================

export const AdminService = {




  //   =============================================

  // Academic Years
   getAcademicYears: async () => {
    return await apiRequest("/years/", {
      method: "GET",
    });
  },

  // Classes by Academic Year
  getClasses: async (academicYearId) => {
    const query = academicYearId
      ? `?academic_year=${encodeURIComponent(academicYearId)}`
      : "";

    return await apiRequest(`/classes/${query}`, {
      method: "GET",
    });
  },

  // Sections by Class
   getSections: async (classId) => {
    const query = classId
      ? `?school_class=${encodeURIComponent(classId)}`
      : "";

    return await apiRequest(`/section/${query}`, {
      method: "GET",
    });
  },

  // Create Student
  createStudentFromAdmission: async (
    admissionId,
    academicYearId,
    classId,
    sectionId
  ) => {
    if (!admissionId || !academicYearId || !classId || !sectionId) {
      throw new Error(
        "Admission, academic year, class and section are required."
      );
    }

    return await apiRequest(
      `/admissions/${admissionId}/create-student/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year_id: Number(academicYearId),
          class_id: Number(classId),
          section_id: Number(sectionId),
        }),
      }
    );
  },






  // ===================================================
  // PAYROLL - EMPLOYEES
  // ===================================================

  getPayrollEmployees: async () => {
    return await apiRequest("/payroll/employees/", {
      method: "GET",
    });
  },
  // ===================================================
  // PAYROLL - SALARY STRUCTURES
  // ===================================================

  getSalaryStructures: async () => {
    return await apiRequest("/payroll/salary-structures/", {
      method: "GET",
    });
  },

  // ===================================================
  // CREATE SALARY STRUCTURE
  // ===================================================

 createSalaryStructure: async (salaryData) => {
    return await apiRequest("/payroll/salary-structures/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salaryData),
    });
  },
  // ===================================================
  // UPDATE SALARY STRUCTURE
  // ===================================================
 updateSalaryStructure: async (id, salaryData) => {
    return await apiRequest(
      `/payroll/salary-structures/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      }
    );
  },

  // ===================================================
  // DELETE SALARY STRUCTURE
  // ===================================================

    deleteSalaryStructure: async (id) => {
    return await apiRequest(
      `/payroll/salary-structures/${id}/`,
      {
        method: "DELETE",
      }
    );
  },
};

export default AdminService;