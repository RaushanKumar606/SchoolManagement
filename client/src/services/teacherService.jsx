
const API_BASE_URL =
  "http://127.0.0.1:8000/api/auth/teacher";


const getToken = () => {
  return localStorage.getItem("access_token");
};


const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (!contentType.includes("application/json")) {
    console.error(
      "Non-JSON response:",
      response.status,
      text
    );

    throw new Error(
      `Server returned HTML instead of JSON. Status: ${response.status}`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(
      "Invalid JSON response from server."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        data.error ||
        `Request failed: ${response.status}`
    );
  }

  return data;
};


const authenticatedFetch = async (
  url,
  options = {}
) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Access token not found. Please login again."
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return await parseResponse(response);
};

export const teacherService = {

  register: async (formData) => {
    const response = await fetch(
      `${API_BASE_URL}/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    return await parseResponse(response);
  },


  login: async (credentials) => {
    const response = await fetch(
      `${API_BASE_URL}/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await parseResponse(response);


    // Save Access Token
    if (data.access) {
      localStorage.setItem(
        "access_token",
        data.access
      );
    }


    // Save Refresh Token
    if (data.refresh) {
      localStorage.setItem(
        "refresh_token",
        data.refresh
      );
    }


    // Save User ID
    if (data.user_id) {
      localStorage.setItem(
        "user_id",
        data.user_id
      );
    }


    // Save Username
    if (data.username) {
      localStorage.setItem(
        "username",
        data.username
      );
    }


    // Save Employee ID
    if (data.employee_id) {
      localStorage.setItem(
        "employee_id",
        data.employee_id
      );
    }


    // Save Role
    if (data.role) {
      localStorage.setItem(
        "role",
        data.role
      );
    }


    console.log(
      "EMPLOYEE ID SAVED:",
      localStorage.getItem("employee_id")
    );

    return data;
  },


  getTeacherDetails: async (employeeId) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/`
    );
  },


  getTeacherDashboard: async (employeeId) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/dashboard/`
    );
  },


  getTeacherTimetable: async (employeeId) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/timetable/`
    );
  },


  getClassStudents: async (
    employeeId,
    className,
    section,
    page = 1
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/class/${encodeURIComponent(
        className
      )}/${encodeURIComponent(
        section
      )}/students/?page=${page}`
    );
  },



  getSubjectStudents: async (
    employeeId,
    classId,
    sectionId,
    subjectId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    if (!classId || !sectionId || !subjectId) {
      throw new Error(
        "Class, section and subject are required."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/class/${classId}/${sectionId}/subject/${subjectId}/students/`
    );
  },

  getSubjectAllocations: async () => {

    return await authenticatedFetch(
      `${API_BASE_URL}/subject-allocations/`
    );
  },

  createSubjectAllocation: async (
    allocationData
  ) => {

    return await authenticatedFetch(
      `${API_BASE_URL}/subject-allocations/`,
      {
        method: "POST",
        body: JSON.stringify(
          allocationData
        ),
      }
    );
  },

  addMarks: async (marksData) => {

    return await authenticatedFetch(
      `${API_BASE_URL}/marks/add/`,
      {
        method: "POST",
        body: JSON.stringify(
          marksData
        ),
      }
    );
  },

  addBulkExamMarks: async (
    marksData
  ) => {

    return await authenticatedFetch(
      `${API_BASE_URL}/marks/add-bulk/`,
      {
        method: "POST",
        body: JSON.stringify(
          marksData
        ),
      }
    );
  },

  getExamMarks: async (
    employeeId,
    classId,
    sectionId,
    subjectId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/exam-marks/${classId}/${sectionId}/${subjectId}/`
    );
  },

  markBulkAttendance: async ({
    employee_id,
    class_name,
    section,
    date,
    attendance,
  }) => {

    return await authenticatedFetch(
      `${API_BASE_URL}/attendance/mark-bulk/`,
      {
        method: "POST",
        body: JSON.stringify({
          employee_id,
          class_name,
          section,
          date,
          attendance,
        }),
      }
    );
  },

  getClassAttendance: async (
    employeeId,
    classId,
    sectionId,
    subjectId,
    date
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/attendance/${encodeURIComponent(
        employeeId
      )}/${classId}/${sectionId}/${subjectId}/?date=${encodeURIComponent(
        date
      )}`
    );
  },

  getAttendanceHistory: async (
    employeeId,
    classId,
    sectionId,
    subjectId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/attendance-history/${encodeURIComponent(
        employeeId
      )}/${classId}/${sectionId}/${subjectId}/`
    );
  },

  createAssignment: async ({
    employee_id,
    class_name,
    section,
    subject,
    title,
    description,
    due_date,
  }) => {

    return await authenticatedFetch(
      `${API_BASE_URL}/assignment/create/`,
      {
        method: "POST",
        body: JSON.stringify({
          employee_id,
          class_name,
          section,
          subject,
          title,
          description,
          due_date,
        }),
      }
    );
  },


  getAssignments: async (
    employeeId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/assignments/`
    );
  },

  getAssignmentSubmissions: async (
    employeeId,
    assignmentId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    if (!assignmentId) {
      throw new Error(
        "Assignment ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/assignments/${assignmentId}/submissions/`
    );
  },

  reviewAssignmentSubmission: async (
    employeeId,
    assignmentId,
    submissionId,
    reviewData
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/${encodeURIComponent(
        employeeId
      )}/assignments/${assignmentId}/submissions/${submissionId}/review/`,
      {
        method: "PATCH",
        body: JSON.stringify(
          reviewData
        ),
      }
    );
  },


  // ===================================================
  // ADMIN - PENDING TEACHERS
  // ===================================================

  getPendingTeachers: async () => {

    return await authenticatedFetch(
      `${API_BASE_URL}/admin/pending-teacher/`
    );
  },


  // ===================================================
  // ADMIN - ALL APPROVED TEACHERS
  // ===================================================

  getTeachers: async () => {

    return await authenticatedFetch(
      `${API_BASE_URL}/admin/teachers/`
    );
  },


  // ===================================================
  // ADMIN - VIEW TEACHER
  // ===================================================

  getAdminTeacherDetails: async (
    employeeId
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/admin/teachers/${encodeURIComponent(
        employeeId
      )}/`
    );
  },


  // ===================================================
  // ADMIN - UPDATE TEACHER
  // ===================================================

  updateTeacher: async (
    employeeId,
    data
  ) => {

    if (!employeeId) {
      throw new Error(
        "Employee ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/admin/teachers/${encodeURIComponent(
        employeeId
      )}/update/`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },


  // ===================================================
  // ADMIN - APPROVE TEACHER
  // ===================================================

  approveTeacher: async (
    teacherId
  ) => {

    if (!teacherId) {
      throw new Error(
        "Teacher ID not found."
      );
    }

    return await authenticatedFetch(
      `${API_BASE_URL}/admin/approve-teacher/${teacherId}/`,
      {
        method: "POST",
      }
    );
  },

  logout: () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user_id"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "employee_id"
    );

    localStorage.removeItem(
      "role"
    );
  },
};