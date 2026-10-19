

import { apiRequest } from "../utils/apiRequest";

export const getMyStudentProfile = async () => {
  return await apiRequest("/students/me/");
};




export const getStudentDashboard = async () => {
  return await apiRequest("/students/dashboard/");
};




export const getMyStudentSubjects = async () => {
  return await apiRequest("/students/my-subjects/");
};




export const getMyStudentAssignments = async () => {
  return await apiRequest("/students/my-assignments/");
};

export const submitAssignment = async (
  assignmentId,
  { answerText = "", file = null } = {}
) => {
  const formData = new FormData();

  if (answerText) {
    formData.append("answer_text", answerText);
  }

  if (file) {
    formData.append("file", file);
  }

  return await apiRequest(
    `/students/assignments/${assignmentId}/submit/`,
    {
      method: "POST",
      body: formData,
    }
  );
};


export const getMyExamResults = async () => {
  return await apiRequest("/students/my-exam-results/");
};




export const getMyExamResultDetail = async (examName) => {
  if (!examName) {
    throw new Error("Exam name is required.");
  }

  const encodedExamName = encodeURIComponent(examName);

  return await apiRequest(
    `/students/my-exam-result/${encodedExamName}/`
  );
};

export const getMyDailyAttendance =async (date) => {
  return await apiRequest(
    `/students/my-attendance/?date=${encodeURIComponent(date)}`
  );
};



export const getMyAttendance = async () => {
  return await apiRequest("/students/my-attendance/");
};




export const getMyStudentTimetable = async (day = null) => {
  let endpoint = "/students/my-timetable/";

  if (day) {
    endpoint += `?day=${encodeURIComponent(day.toUpperCase())}`;
  }

  return await apiRequest(endpoint);
};



export const getTodayTimetable = async () => {
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

  return await getMyStudentTimetable(today);
};



export const getTimetableByDay = async (day) => {
  if (!day) {
    throw new Error("Day is required.");
  }

  return await getMyStudentTimetable(day);
};



export const createFeeOnlineOrder = async (invoiceId, amount) => {
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

  return await apiRequest(
    "/fees/online-payment/create-order/",
    {
      method: "POST",
      body: JSON.stringify({
        invoice: invoiceId,
        amount: Number(amount),
      }),
    }
  );
};



export const verifyFeeOnlinePayment = async (paymentData) => {
  if (!paymentData) {
    throw new Error("Payment data is required.");
  }

  return await apiRequest(
    "/fees/online-payment/verify/",
    {
      method: "POST",
      body: JSON.stringify(paymentData),
    }
  );
};


export const getMyFeeInvoice = async () => {
  return await apiRequest("/fees/my-invoice/");
};

export const getMyFeePayments = async () => {
  return await apiRequest("/fees/my-payments/");
};

// Get fee structure for the logged-in student
export const getMyFeeStructure = async () => {
  return await apiRequest("/fees/my-structure/", {
    method: "GET",
  });
};


const studentService = {
  getMyStudentProfile,
  getStudentDashboard,
  getMyDailyAttendance,

  getMyStudentSubjects,
  getMyStudentAssignments,
  submitAssignment,

  getMyExamResults,
  getMyExamResultDetail,

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

