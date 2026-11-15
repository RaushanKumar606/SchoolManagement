

import { apiRequest } from "../utils/apiRequest";

export const teacherService = {

  // ===================================================
  // TEACHER REGISTRATION
  // ===================================================

  register: async (formData) => {
    return await apiRequest("/teacher/register/", {
      method: "POST",
      body: formData,
    });
  },

  // ===================================================
  // TEACHER LOGIN
  // ===================================================

  // login: async (credentials) => {
  //   const data = await apiRequest("/teacher/login/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(credentials),
  //   });

  //   if (!data?.access || !data?.refresh) {
  //     throw new Error(
  //       "Login response is missing access or refresh token."
  //     );
  //   }

  //   localStorage.setItem("access_token", data.access);
  //   localStorage.setItem("refresh_token", data.refresh);

  //   if (data.user_id != null) {
  //     localStorage.setItem("user_id", data.user_id);
  //   }

  //   if (data.username) {
  //     localStorage.setItem("username", data.username);
  //   }

  //   if (data.employee_id) {
  //     localStorage.setItem("employee_id", data.employee_id);
  //   } else {
  //     localStorage.removeItem("employee_id");
  //   }

  //   if (data.role) {
  //     localStorage.setItem("role", data.role);
  //   }

  //   return data;
  // },


  // ===================================================
  // TEACHER LOGIN
  // ===================================================

  login: async (credentials) => {
    const employeeId = credentials?.employee_id?.trim();
    const password = credentials?.password;

    if (!employeeId || !password) {
      throw new Error("Employee ID and password are required.");
    }

    const data = await apiRequest("/teacher/login/", {
      method: "POST",
      body: JSON.stringify({
        employee_id: employeeId,
        password,
      }),
    });

    // Validate login response
    if (!data?.access || !data?.refresh) {
      throw new Error(
        "Teacher login response is missing access or refresh token."
      );
    }

    // Save authentication tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // Save teacher information
    if (data.user_id != null) {
      localStorage.setItem("user_id", String(data.user_id));
    }

    if (data.username) {
      localStorage.setItem("username", data.username);
    }

    if (data.employee_id) {
      localStorage.setItem("employee_id", data.employee_id);
    } else {
      localStorage.setItem("employee_id", employeeId);
    }

    if (data.role) {
      localStorage.setItem(
        "role",
        String(data.role).trim().toUpperCase()
      );
    }

    return data;
  },



  // ===================================================
  // TEACHER DETAILS
  // ===================================================

  getTeacherDetails: async (employeeId) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // TEACHER DASHBOARD
  // ===================================================

  getTeacherDashboard: async (employeeId) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/dashboard/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // TEACHER TIMETABLE
  // ===================================================

  getTeacherTimetable: async (employeeId) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/timetable/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // CLASS STUDENTS
  // ===================================================

  getClassStudents: async (employeeId, className, section) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    if (!className || !section) {
      throw new Error("Class name or section is missing.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/class/${encodeURIComponent(className)}/${encodeURIComponent(section)}/students/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // SUBJECT STUDENTS
  // ===================================================

  getSubjectStudents: async (
    employeeId,
    classId,
    sectionId,
    subjectId
  ) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    if (!classId || !sectionId || !subjectId) {
      throw new Error(
        "Class, section and subject are required."
      );
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/class/${classId}/${sectionId}/subject/${subjectId}/students/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // MY COURSES
  // ===================================================

  getMyCourses: async () => {
    return await apiRequest("/teacher/my-courses/", {
      method: "GET",
    });
  },

  // ===================================================
  // SUBJECT ALLOCATIONS
  // ===================================================

  getSubjectAllocations: async () => {
    return await apiRequest("/teacher/subject-allocations/", {
      method: "GET",
    });
  },

  createSubjectAllocation: async (allocationData) => {
    return await apiRequest("/teacher/subject-allocations/", {
      method: "POST",
      body: JSON.stringify(allocationData),
    });
  },

  // ===================================================
  // ADD EXAM MARKS
  // ===================================================

  addMarks: async (marksData) => {
    return await apiRequest("/teacher/marks/add/", {
      method: "POST",
      body: JSON.stringify(marksData),
    });
  },

  // ===================================================
  // ADD BULK EXAM MARKS
  // ===================================================

  addBulkExamMarks: async (marksData) => {
    return await apiRequest("/teacher/marks/add-bulk/", {
      method: "POST",
      body: JSON.stringify(marksData),
    });
  },

  // ===================================================
  // GET EXAM MARKS
  // ===================================================

 // Get exam-wise students and their existing marks
getExamMarks: async (classId, sectionId, subjectId, examId) => {
  if (!classId || !sectionId || !subjectId || !examId) {
    throw new Error("Class, section, subject and exam are required.");
  }

  return await apiRequest(
    `/exams/teacher/class/${classId}/section/${sectionId}/subject/${subjectId}/marks/?exam_id=${examId}`,
    {
      method: "GET",
    }
  );
},

// Save one student's marks
saveExamMark: async (classId, sectionId, subjectId, payload) => {
  if (!classId || !sectionId || !subjectId) {
    throw new Error("Class, section and subject are required.");
  }
  return await apiRequest(
    `/exams/teacher/class/${classId}/section/${sectionId}/subject/${subjectId}/marks/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
},


getAvailableExams: async (classId, sectionId, subjectId) => {
  if (!classId || !sectionId || !subjectId) {
    throw new Error("Class, section and subject are required.");
  }

  return await apiRequest(
    `/exams/teacher/class/${classId}/section/${sectionId}/subject/${subjectId}/available-exams/`,
    {
      method: "GET",
    }
  );
},
  // ===================================================
  // MARK BULK ATTENDANCE
  // ===================================================

  markBulkAttendance: async ({
    employeeId,
    classId,
    sectionId,
    subjectId,
    date,
    attendance,
  }) => {
    return await apiRequest("/teacher/attendance/mark-bulk/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        classId,
        sectionId,
        subjectId,
        date,
        attendance,
      }),
    });
  },

  // ===================================================
  // GET CLASS ATTENDANCE
  // ===================================================

  getClassAttendance: async (
    employeeId,
    classId,
    sectionId,
    subjectId,
    date
  ) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/attendance/${encodeURIComponent(employeeId)}/${classId}/${sectionId}/${subjectId}/?date=${encodeURIComponent(date)}`
    );
  },

  // ===================================================
  // ATTENDANCE HISTORY
  // ===================================================

  getAttendanceHistory: async (
    employeeId,
    classId,
    sectionId,
    subjectId
  ) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/attendance-history/${encodeURIComponent(employeeId)}/${classId}/${sectionId}/${subjectId}/`
    );
  },

  // ===================================================
  // CREATE ASSIGNMENT
  // ===================================================

  createAssignment: async ({
    employee_id,
    class_name,
    section,
    subject,
    title,
    description,
    due_date,
  }) => {
    return await apiRequest("/teacher/assignment/create/", {
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
    });
  },

  // ===================================================
  // GET ASSIGNMENTS
  // ===================================================

  getAssignments: async (employeeId) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/assignments/`
    );
  },

  // ===================================================
  // GET ASSIGNMENT SUBMISSIONS
  // ===================================================

  getAssignmentSubmissions: async (
    employeeId,
    assignmentId
  ) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    if (!assignmentId) {
      throw new Error("Assignment ID not found.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/assignments/${assignmentId}/submissions/`
    );
  },

  // ===================================================
  // REVIEW ASSIGNMENT SUBMISSION
  // ===================================================

  reviewAssignmentSubmission: async (
    employeeId,
    assignmentId,
    submissionId,
    reviewData
  ) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    if (!assignmentId || !submissionId) {
      throw new Error("Assignment ID and submission ID are required.");
    }

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/assignments/${assignmentId}/submissions/${submissionId}/review/`,
      {
        method: "PATCH",
        body: JSON.stringify(reviewData),
      }
    );
  },

  // ===================================================
  // ADMIN - PENDING TEACHERS
  // ===================================================

  getPendingTeachers: async () => {
    return await apiRequest(
      "/teacher/admin/pending-teacher/",
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // ADMIN - PENDING TEACHER DETAILS
  // ===================================================

  getPendingTeacherDetails: async (teacherId) => {
    if (!teacherId) {
      throw new Error("Teacher application ID not found.");
    }

    return await apiRequest(
      `/teacher/admin/pending-teacher/${encodeURIComponent(teacherId)}/`,
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // ADMIN - REJECT TEACHER
  // ===================================================

  rejectTeacher: async (teacherId, rejectionReason) => {
    if (!teacherId || !rejectionReason?.trim()) {
      throw new Error(
        "Teacher ID and rejection reason are required."
      );
    }

    return await apiRequest(
      `/teacher/admin/reject-teacher/${encodeURIComponent(teacherId)}/`,
      {
        method: "POST",
        body: JSON.stringify({
          rejection_reason: rejectionReason.trim(),
        }),
      }
    );
  },

  // ===================================================
  // ADMIN - ALL APPROVED TEACHERS
  // ===================================================

  getTeachers: async () => {
    return await apiRequest(
      "/teacher/admin/teachers/",
      {
        method: "GET",
      }
    );
  },

  // ===================================================
  // ADMIN - VIEW APPROVED TEACHER
  // ===================================================

  getAdminTeacherDetails: async (employeeId) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/admin/teachers/${encodeURIComponent(employeeId)}/`
    );
  },

  // ===================================================
  // ADMIN - UPDATE TEACHER
  // ===================================================

  updateTeacher: async (employeeId, data) => {
    if (!employeeId) {
      throw new Error("Employee ID not found.");
    }

    return await apiRequest(
      `/teacher/admin/teachers/${encodeURIComponent(employeeId)}/update/`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // ===================================================
  // ADMIN - APPROVE TEACHER
  // ===================================================

  approveTeacher: async (teacherId) => {
    if (!teacherId) {
      throw new Error("Teacher ID not found.");
    }

    return await apiRequest(
      `/teacher/admin/approve-teacher/${encodeURIComponent(teacherId)}/`,
      {
        method: "POST",
      }
    );
  },

  // ===================================================
  // LOGOUT
  // ===================================================

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("role");
  },

};
