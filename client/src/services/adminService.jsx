
const API_URL = "http://127.0.0.1:8000/api";


const fetchApplications = async () => {
try {
  setLoading(true);
  setError("");

  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in. Access token not found.");
  }

  const response = await fetch(`${API_URL}/auth/admissions/list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Failed to load applications"
    );
  }

  if (Array.isArray(data)) {
    setApplications(data);
  } else if (Array.isArray(data.results)) {
    setApplications(data.results);
  } else {
    setApplications([]);
    setError("Unexpected data format received from server.");
  }
} catch (err) {
  console.error("Admission Error:", err);
  setError(err.message);
  setApplications([]);
} finally {
  setLoading(false);
}
  };


// =====================================================
// AUTH HEADER
// =====================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =====================================================
// ADMIN SERVICE
// =====================================================

export const AdminService = {




  // getAdmissionsList: async () => {
  //   try {
      
  //     const token = localStorage.getItem("access_token");

     
  //     const response = await fetch(`${API_URL}/admissions/list/`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //   } catch (err) {
  //     console.error("Admission Error:", err);
  //   } 
  // },


  // createStudentFromAdmission: async (
  //   admissionId,
  //   academicYearId,
  //   classId,
  //   sectionId
  // ) => {
  //   const token = localStorage.getItem("access_token");

  //   const response = await fetch(
  //     `${API_URL}/admissions/${admissionId}/create-student/`,
  //     {
  //       method: "POST",

  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },

  //       body: JSON.stringify({
  //         academic_year_id: parseInt(academicYearId),
  //         class_id: parseInt(classId),
  //         section_id: parseInt(sectionId),
  //       }),
  //     }
  //   );

  //   const data = await response.json();

  //   if (!response.ok) {
  //     throw new Error(
  //       data.detail ||
  //       data.error ||
  //       "Failed to create student"
  //     );
  //   }

  //   return data;
  // },

  //   =============================================

  // Academic Years
  getAcademicYears: async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/auth/years/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to load academic years");
    }

    return data;
  },

  // Classes by Academic Year
  getClasses: async (academicYearId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_URL}/auth/classes/?academic_year=${academicYearId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to load classes");
    }

    return data;
  },

  // Sections by Class
  getSections: async (classId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_URL}/section/?school_class=${classId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to load sections");
    }

    return data;
  },

  // Create Student
  createStudentFromAdmission: async (
    admissionId,
    academicYearId,
    classId,
    sectionId
  ) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_URL}/auth/admissions/${admissionId}/create-student/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          academic_year_id: parseInt(academicYearId),
          class_id: parseInt(classId),
          section_id: parseInt(sectionId),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.error ||
        "Failed to create student"
      );
    }

    return data;
  },





  // ===================================================
  // PAYROLL - EMPLOYEES
  // ===================================================

  getPayrollEmployees: async () => {
    const response = await fetch(
      `${API_URL}/auth/payroll/employees/`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.detail ||
        "Failed to load employees."
      );
    }

    return result;
  },

  // ===================================================
  // PAYROLL - SALARY STRUCTURES
  // ===================================================

  getSalaryStructures: async () => {
    const response = await fetch(
      `${API_URL}/auth/payroll/salary-structures/`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.detail ||
        "Failed to load salary structures."
      );
    }

    return result;
  },

  // ===================================================
  // CREATE SALARY STRUCTURE
  // ===================================================

  createSalaryStructure: async (salaryData) => {
    const response = await fetch(
      `${API_URL}/auth/payroll/salary-structures/`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(salaryData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.detail ||
        "Failed to create salary structure."
      );
    }

    return result;
  },

  // ===================================================
  // UPDATE SALARY STRUCTURE
  // ===================================================

  updateSalaryStructure: async (id, salaryData) => {
    const response = await fetch(
      `${API_URL}/auth/payroll/salary-structures/${id}/`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(salaryData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.detail ||
        "Failed to update salary structure."
      );
    }

    return result;
  },

  // ===================================================
  // DELETE SALARY STRUCTURE
  // ===================================================

  deleteSalaryStructure: async (id) => {
    const response = await fetch(
      `${API_URL}/auth/payroll/salary-structures/${id}/`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    // DELETE API kabhi-kabhi empty response deta hai
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.detail ||
        "Failed to delete salary structure."
      );
    }

    return result;
  },
};

export default AdminService;