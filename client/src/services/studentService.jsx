
import { apiRequest } from "../utils/apiRequest";

// ==========================================
// STUDENT PROFILE
// ==========================================

export const getMyStudentProfile = () => {
  return apiRequest("/api/auth/students/me/");
};

// ==========================================
// STUDENT ADMISSION DOCUMENTS
// ==========================================

export const getMyStudentDocuments = (admissionId) => {
  if (!admissionId) {
    throw new Error("Admission ID is required.");
  }

  return apiRequest(
    `/api/auth/admissions/${encodeURIComponent(admissionId)}/documents/`
  );
};

// ==========================================
// STUDENT DASHBOARD
// ==========================================

export const getStudentDashboard = () => {
  return apiRequest("/api/auth/students/dashboard/");
};

// ==========================================
// STUDENT SUBJECTS
// ==========================================

export const getMyStudentSubjects = () => {
  return apiRequest("/api/auth/students/my-subjects/");
};

// ==========================================
// STUDENT ASSIGNMENTS
// ==========================================

export const getMyStudentAssignments = () => {
  return apiRequest("/api/auth/students/my-assignments/");
};

// ==========================================
// SUBMIT ASSIGNMENT
// ==========================================

export const submitAssignment = (
  assignmentId,
  { answerText = "", file = null } = {}
) => {
  if (!assignmentId) {
    throw new Error("Assignment ID is required.");
  }

  const formData = new FormData();

  if (answerText.trim()) {
    formData.append("answer_text", answerText);
  }

  if (file) {
    formData.append("file", file);
  }

  return apiRequest(
    `/api/auth/students/assignments/${encodeURIComponent(assignmentId)}/submit/`,
    {
      method: "POST",
      body: formData,
    }
  );
};

// ==========================================
// EXAM RESULTS
// ==========================================

export const getMyExamResults = () => {
  return apiRequest("/api/auth/students/my-exam-results/");
};

export const getMyExamResultDetail = (examName) => {
  if (!examName) {
    throw new Error("Exam name is required.");
  }

  return apiRequest(
    `/api/auth/students/my-exam-result/${encodeURIComponent(examName)}/`
  );
};

// ==========================================
// STUDENT ATTENDANCE
// ==========================================

export const getMyDailyAttendance = (date) => {
  if (!date) {
    throw new Error("Date is required.");
  }

  return apiRequest(
    `/api/auth/students/my-attendance/?date=${encodeURIComponent(date)}`
  );
};

export const getMyAttendance = () => {
  return apiRequest("/api/auth/students/my-attendance/");
};

// ==========================================
// STUDENT TIMETABLE
// ==========================================

export const getMyStudentTimetable = (day = null) => {
  let endpoint = "/api/auth/students/my-timetable/";

  if (day) {
    endpoint += `?day=${encodeURIComponent(day.toUpperCase())}`;
  }

  return apiRequest(endpoint);
};

export const getTodayTimetable = () => {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const today = days[new Date().getDay()];

  return getMyStudentTimetable(today);
};

export const getTimetableByDay = (day) => {
  if (!day) {
    throw new Error("Day is required.");
  }

  return getMyStudentTimetable(day);
};

// ==========================================
// ONLINE FEE PAYMENT
// ==========================================

export const createFeeOnlineOrder = (invoiceId, amount) => {
  if (!invoiceId) {
    throw new Error("Invoice ID is required.");
  }

  if (
    amount === undefined ||
    amount === null ||
    String(amount).trim() === "" ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    throw new Error("Enter a valid payment amount.");
  }

  return apiRequest(
    "/api/auth/fees/online-payment/create-order/",
    {
      method: "POST",
      body: JSON.stringify({
        invoice: invoiceId,
        amount: Number(amount),
      }),
    }
  );
};

export const verifyFeeOnlinePayment = (paymentData) => {
  if (!paymentData) {
    throw new Error("Payment data is required.");
  }

  return apiRequest(
    "/api/auth/fees/online-payment/verify/",
    {
      method: "POST",
      body: JSON.stringify(paymentData),
    }
  );
};

// ==========================================
// STUDENT FEE INFORMATION
// ==========================================

export const getMyFeeInvoice = () => {
  return apiRequest("/api/auth/fees/my-invoice/");
};

export const getMyFeePayments = () => {
  return apiRequest("/api/auth/fees/my-payments/");
};

export const getMyFeeStructure = () => {
  return apiRequest("/api/auth/fees/my-structure/");
};

// ==========================================
// DEFAULT STUDENT SERVICE
// ==========================================

const studentService = {
  getMyStudentProfile,
  getMyStudentDocuments,

  getStudentDashboard,

  getMyStudentSubjects,
  getMyStudentAssignments,
  submitAssignment,

  getMyExamResults,
  getMyExamResultDetail,

  getMyDailyAttendance,
  getMyAttendance,

  getMyStudentTimetable,
  getTodayTimetable,
  getTimetableByDay,

  createFeeOnlineOrder,
  verifyFeeOnlinePayment,

  getMyFeeInvoice,
  getMyFeePayments,
  getMyFeeStructure,
};

export default studentService;
