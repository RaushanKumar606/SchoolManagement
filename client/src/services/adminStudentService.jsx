// ===============================
// STUDENTS APIs
// ===============================
import { apiRequest } from "../utils/apiRequest";
const API_URL = "http://127.0.0.1:8000/api/auth";

// Get all students
const getStudents = async (params = {}) => {
  const token = getToken();

  const query = new URLSearchParams();

  if (params.school_class) {
    query.append(
      "school_class",
      params.school_class
    );
  }

  if (params.section) {
    query.append(
      "section",
      params.section
    );
  }

  if (params.search) {
    query.append(
      "search",
      params.search
    );
  }

  if (params.is_active !== undefined) {
    query.append(
      "is_active",
      params.is_active
    );
  }

  if (params.page) {
    query.append(
      "page",
      params.page
    );
  }

  // const url =
  //   `${API_URL}/students/admin/students/` +
  //   `${query.toString() ? `?${query.toString()}` : ""}`;

  const response = await apiRequest(`$/api/auth/students/admin/students/` +
    `${query.toString() ? `?${query.toString()}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to fetch students"
    );
  }

  return data;
};


// Get single student
const getStudentById = async (studentId) => {
  const token = getToken();
      
  const response = await fetch(
    `${API_URL}/students/admin/students/${studentId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch student"
    );
  }

  return data;
};


// Update student
const updateStudent = async (studentId, studentData) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/students/admin/students/${studentId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to update student"
    );
  }

  return data;
};


// Delete student
const deleteStudent = async (studentId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/students/admin/students/${studentId}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch {
      // DELETE response may have no JSON body
    }

    throw new Error(
      data?.detail || "Failed to delete student"
    );
  }

  return true;
};


const getClasses = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/academics/classes/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch classes"
    );
  }

  return data;
};


const getSections = async (classId = "") => {
  const token = getToken();

  const url = classId
    ? `${API_URL}/academics/sections/?school_class=${classId}`
    : `${API_URL}/academics/sections/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch sections"
    );
  }

  return data;
};

export const adminService = {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
   getClasses,
  getSections,
};