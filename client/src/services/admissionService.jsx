// admissionService.js

const API_URL = "http://127.0.0.1:8000/api";

export async function submitAdmission(applicationData) {
  const response = await fetch(
    `${API_URL}/admissions/apply/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Admission application failed"
    );
  }

  return data;
}