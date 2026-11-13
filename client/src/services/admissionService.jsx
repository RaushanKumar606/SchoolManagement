// // admissionService.js

// const API_URL = "http://127.0.0.1:8000/api/auth";

// export async function submitAdmission(applicationData) {
//   const response = await fetch(
//     `${API_URL}/admissions/apply/`,
//     {
//       method: "POST",
//       headers: {
// "Content-Type": "application/json",      },
// body: JSON.stringify(applicationData),    }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.detail || "Admission application failed"
//     );
//   }

//   return data;
// }




const API_URL = "http://127.0.0.1:8000/api/auth";

export async function submitAdmission(applicationData) {
  const formData = new FormData();

  Object.entries(applicationData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/admissions/apply/`, {
    method: "POST",
    body: formData,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response received from server.");
  }

  if (!response.ok) {
    const message =
      data.detail ||
      Object.entries(data)
        .map(([field, errors]) => {
          const errorText = Array.isArray(errors)
            ? errors.join(", ")
            : String(errors);

          return `${field}: ${errorText}`;
        })
        .join("\n") ||
      "Admission application failed.";

    throw new Error(message);
  }

  return data;
}
