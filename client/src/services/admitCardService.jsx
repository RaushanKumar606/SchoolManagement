
import { apiRequest } from "../utils/apiRequest";


export const admitCardService = {
  // Student: released admit cards fetch karna
  async getStudentAdmitCards() {
    return apiRequest(
      `/exams/student/admit-cards/`,
      {
        method: "GET",
      }
    );
  },

  // School Admin: kisi exam ke admit cards release karna
  async releaseAdmitCard(examId) {
    if (!examId) {
      throw new Error("Exam ID is required.");
    }

    return apiRequest(
      `/exams/${examId}/admit-card/release/`,
      {
        method: "POST",
      }
    );
  },
};

export default admitCardService;
