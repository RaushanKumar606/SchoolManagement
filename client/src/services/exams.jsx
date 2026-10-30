
import { apiRequest } from "../utils/apiRequest";



export const publishExamTimetable = (examId) => {
  if (!examId) {
    throw new Error("Exam ID is required.");
  }

  return apiRequest(`/exams/${examId}/timetable/publish/`, {
    method: "POST",
  });
};



// Exam list
export const getExams = () => {
  return apiRequest("/exams/");
};



// Create exam (Admin)
export const createExam = (examData) => {
  return apiRequest("/exams/", {
    method: "POST",
    body: JSON.stringify(examData),
  });
};

// Publish exam results (Admin)
export const publishExamResults = (examId) => {
  return apiRequest(`/exams/${examId}/publish/`, {
    method: "POST",
  });
};

// Get published results (Student)
export const getMyPublishedResults = () => {
  return apiRequest("/exams/student/results/");
};

// Get teacher marks for a class/section/subject
export const getTeacherExamMarks = (
  classId,
  sectionId,
  subjectId,
  examName
) => {
  const params = new URLSearchParams({ exam_name: examName });

  return apiRequest(
    `/exams/teacher/class/${classId}/section/${sectionId}/subject/${subjectId}/marks/?${params}`
  );
};



export const getExamSchedules = (examId) => {
  if (!examId) {
    throw new Error("Exam ID is required.");
  }

  return apiRequest(`/exams/${examId}/schedules/`);
};

export const createExamSchedule = (examId, scheduleData) => {
  if (!examId) throw new Error("Exam ID is required.");

  return apiRequest(`/exams/${examId}/schedules/`, {
    method: "POST",
    body: JSON.stringify(scheduleData),
  });
};

export const getExamAvailableSubjects = (examId) => {
  if (!examId) {
    throw new Error("Exam ID is required.");
  }

  return apiRequest(`/exams/${examId}/available-subjects/`);
};
