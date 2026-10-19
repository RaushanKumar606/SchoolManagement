// ===============================
// STUDENTS APIs For ADMIN
// ===============================


import { apiRequest } from "../utils/apiRequest";

// Get all students

const getStudents = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.school_class) {
    query.append("school_class", params.school_class);
  }

  if (params.section) {
    query.append("section", params.section);
  }

  if (params.search) {
    query.append("search", params.search);
  }

  if (params.is_active !== undefined) {
    query.append("is_active", params.is_active);
  }

  if (params.page) {
    query.append("page", params.page);
  }

  const endpoint =
    `/students/admin/students/${
      query.toString() ? `?${query.toString()}` : ""
    }`;

  return await apiRequest(endpoint, {
    method: "GET",
  });
};


const getStudentById = async (studentId) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const endpoint = `/students/admin/students/${studentId}/`;

  return await apiRequest(endpoint, {
    method: "GET",
  });
};



// Update student

const updateStudent = async (studentId, studentData) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const endpoint = `/students/admin/students/${studentId}/`;

  return await apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(studentData),
  });
};


// Delete student

const deleteStudent = async (studentId) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const endpoint = `/students/admin/students/${studentId}/`;

  await apiRequest(endpoint, {
    method: "DELETE",
  });

  return true;
};


const getClasses = async () => {
  return await apiRequest("/academics/classes/", {
    method: "GET",
  });
};


const getSections = async (classId = "") => {
  const query = new URLSearchParams();

  if (classId) {
    query.append("school_class", classId);
  }

  const endpoint =
    `/academics/sections/${
      query.toString() ? `?${query.toString()}` : ""
    }`;

  return await apiRequest(endpoint, {
    method: "GET",
  });
};



// const getSections = async (classId = "") => {
//   const token = getToken();

//   const url = classId
//     ? `${API_URL}/academics/sections/?school_class=${classId}`
//     : `${API_URL}/academics/sections/`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data?.detail || "Failed to fetch sections"
//     );
//   }

//   return data;
// };

export const adminService = {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getClasses,
  getSections,
};