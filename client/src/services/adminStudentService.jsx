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
    `/api/auth/students/admin/students/${
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

  const endpoint = `/api/auth/students/admin/students/${studentId}/`;

  return await apiRequest(endpoint, {
    method: "GET",
  });
};


// Get student admission documents
const getAdmissionDocuments = async (admissionId) => {
  if (!admissionId) {
    throw new Error("Admission ID is required");
  }

  return await apiRequest(
    `/api/auth/admissions/${admissionId}/documents/`
  );
};


// Update student

const updateStudent = async (studentId, studentData) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const endpoint = `/api/auth/students/admin/students/${studentId}/`;

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

  const endpoint = `/api/auth/students/admin/students/${studentId}/`;

  await apiRequest(endpoint, {
    method: "DELETE",
  });

  return true;
};


const getClasses = async () => {
  return await apiRequest("/api/auth/academics/classes/", {
    method: "GET",
  });
};


const getSections = async (classId = "") => {
  const query = new URLSearchParams();

  if (classId) {
    query.append("school_class", classId);
  }

  const endpoint =
    `/api/auth/academics/sections/${
      query.toString() ? `?${query.toString()}` : ""
    }`;

  return await apiRequest(endpoint, {
    method: "GET",
  });
};




export const adminService = {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getClasses,
  getSections,
  getAdmissionDocuments,
};