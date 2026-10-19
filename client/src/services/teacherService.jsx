
const API_BASE_URL ="http://127.0.0.1:8000/api/auth/teacher";
import { apiRequest } from "../utils/apiRequest";


export const teacherService = {

  register: async (formData) => {
    return await apiRequest(
      `/teacher/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
  },

  
login: async (credentials) => {
  const data = await apiRequest("/teacher/login/",
   {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );
  if (!data?.access || !data?.refresh) {
    throw new Error(
      "Login response is missing access or refresh token."
    );
  }

  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);

  if (data.user_id != null) {
    localStorage.setItem("user_id", data.user_id);
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
    localStorage.setItem("role", data.role);
  }

  return data;
},


//  TEACHER DETAILS,  
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

// DASHBOARD,

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

 // TIMETABLE, 
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

  // CLASS STUDENTS
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



 // SUBJECT 

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

    return await apiRequest(
      `/teacher/${encodeURIComponent(employeeId)}/class/${classId}/${sectionId}/subject/${subjectId}/students/`,
      {
        method: "GET",
      }
    );
  },
   
 getMyCourses: async () => {
  return await apiRequest("/teacher/my-courses/", {
    method: "GET",
  });
},
  getSubjectAllocations: async () => {

    return await apiRequest(
      `/teacher/subject-allocations/`
    );
  },
// ALLOCATIONS
  createSubjectAllocation: async (
    allocationData
  ) => {

    return await apiRequest(
      `/teacher/subject-allocations/`,
      {
        method: "POST",
        body: JSON.stringify(
          allocationData
        ),
      }
    );
  },

  //  , MARKS,

  addMarks: async (marksData) => {

    return await apiRequest(
      `/teacher/marks/add/`,
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

    return await apiRequest(
      `/teacher/marks/add-bulk/`,
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

    return await apiRequest(
      `/teacher/${encodeURIComponent(
        employeeId
      )}/exam-marks/${classId}/${sectionId}/${subjectId}/`
    );
  },

 // MARK BULK ATTENDANCE
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
// ATTENDANCE,
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

    return await apiRequest(
      `/teacher/attendance/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/attendance-history/${encodeURIComponent(
        employeeId
      )}/${classId}/${sectionId}/${subjectId}/`
    );
  },

   //ASSIGNMENTS
  createAssignment: async ({
    employee_id,
    class_name,
    section,
    subject,
    title,
    description,
    due_date,
  }) => {

    return await apiRequest(
      `teacher/assignment/create/`,
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

    return await apiRequest(
      `/teacher/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/admin/pending-teacher/`
    );
  },


  // ===================================================
  // ADMIN - ALL APPROVED TEACHERS
  // ===================================================

  getTeachers: async () => {

    return await apiRequest(
      `/teacher/admin/teachers/`
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

    return await apiRequest(
      `/teacher/admin/teachers/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/admin/teachers/${encodeURIComponent(
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

    return await apiRequest(
      `/teacher/admin/approve-teacher/${encodeURIComponent(teacherId)}/`,
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