// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { submitAdmission } from "../../services/admissionService";
// import "./admission.css";

// const initialForm = {
//   student_first_name: "",
//   student_middle_name: "",
//   student_last_name: "",
//   date_of_birth: "",
//   gender: "",
//   applying_for_class: "",
//   previous_school: "",

//   father_name: "",
//   mother_name: "",
//   parent_phone: "",
//   parent_email: "",

//   address: "",
//   city: "",
//   state: "",
//   postal_code: "",

//   message: "",
// };

// function AdmissionForm() {

//   const [form, setForm] = useState(initialForm);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess(null);
//     setLoading(true);

//     try {
//       const data = await submitAdmission(form);

//       setSuccess(data);
//       setForm(initialForm);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (err) {
//       setError(err.message || "Unable to submit application.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="admission-success-page">
//         <div className="admission-success-card">

//           <div className="success-icon">
//             ✓
//           </div>

//           <h1>Application Submitted</h1>

//           <p>
//             Your admission application has been successfully
//             submitted to the school.
//           </p>

//           <div className="application-number">
//             <span>Application Number</span>
//             <strong>{success.application_number}</strong>
//           </div>

//           <p>
//             Please keep this application number for future
//             reference.
//           </p>

//           <div className="success-actions">
//             <button
//               onClick={() => setSuccess(null)}
//               className="primary-button"
//             >
//               Submit Another Application
//             </button>

//             <Link to="/" className="secondary-button">
//               Back to Home
//             </Link>
//           </div>

//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admission-page">

//       {/* Header */}

//       <header className="admission-header">

//         <div className="admission-header-inner">

//           <Link to="/" className="back-home">
//             ← Back to Home
//           </Link>

//         </div>

//       </header>

//       {/* Hero */}

//       <section className="admission-hero">

//         <div>

//           <span className="hero-label">
//             ADMISSIONS 2026–27
//           </span>

//         </div>

//       </section>

//       {/* Form */}

//       <main className="admission-container">

//         <div className="admission-form-wrapper">

//           <div className="form-introduction">

//             <h2>Student Admission Application</h2>

//             <p>
//               Please provide accurate information. Our
//               admission team will review your application
//               and contact you.
//             </p>

//             <div className="application-steps">

//               <div className="step active">
//                 <span>1</span>
//                 <div>
//                   <strong>Application</strong>
//                   <small>Fill the form</small>
//                 </div>
//               </div>

//               <div className="step">
//                 <span>2</span>
//                 <div>
//                   <strong>Review</strong>
//                   <small>School reviews</small>
//                 </div>
//               </div>

//               <div className="step">
//                 <span>3</span>
//                 <div>
//                   <strong>Decision</strong>
//                   <small>Admission status</small>
//                 </div>
//               </div>

//             </div>

//           </div>

//           <form
//             className="admission-form"
//             onSubmit={handleSubmit}
//           >

//             {/* Student Information */}

//             <section className="form-section">

//               <h3>Student Information</h3>

//               <div className="form-grid">

//                 <div className="form-group">
//                   <label>First Name *</label>

//                   <input
//                     type="text"
//                     name="student_first_name"
//                     value={form.student_first_name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Middle Name</label>

//                   <input
//                     type="text"
//                     name="student_middle_name"
//                     value={form.student_middle_name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Last Name *</label>

//                   <input
//                     type="text"
//                     name="student_last_name"
//                     value={form.student_last_name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Date of Birth *</label>

//                   <input
//                     type="date"
//                     name="date_of_birth"
//                     value={form.date_of_birth}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Gender *</label>

//                   <select
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">
//                       Select Gender
//                     </option>

//                     <option value="MALE">
//                       Male
//                     </option>

//                     <option value="FEMALE">
//                       Female
//                     </option>

//                     <option value="OTHER">
//                       Other
//                     </option>
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label>Applying for Class *</label>

//                   <select
//                     name="applying_for_class"
//                     value={form.applying_for_class}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">
//                       Select Class
//                     </option>

//                     <option value="Nursery">Nursery</option>
//                     <option value="LKG">LKG</option>
//                     <option value="UKG">UKG</option>

//                     {Array.from(
//                       { length: 12 },
//                       (_, i) => (
//                         <option
//                           key={i + 1}
//                           value={`Class ${i + 1}`}
//                         >
//                           Class {i + 1}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </div>

//                 <div className="form-group full-width">
//                   <label>Previous School</label>

//                   <input
//                     type="text"
//                     name="previous_school"
//                     value={form.previous_school}
//                     onChange={handleChange}
//                     placeholder="Previous school name"
//                   />
//                 </div>

//               </div>

//             </section>

//             {/* Parent Information */}

//             <section className="form-section">

//               <h3>Parent / Guardian Information</h3>

//               <div className="form-grid">

//                 <div className="form-group">
//                   <label>Father's Name *</label>

//                   <input
//                     type="text"
//                     name="father_name"
//                     value={form.father_name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Mother's Name *</label>

//                   <input
//                     type="text"
//                     name="mother_name"
//                     value={form.mother_name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Parent Phone *</label>

//                   <input
//                     type="tel"
//                     name="parent_phone"
//                     value={form.parent_phone}
//                     onChange={handleChange}
//                     placeholder="9876543210"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Parent Email *</label>

//                   <input
//                     type="email"
//                     name="parent_email"
//                     value={form.parent_email}
//                     onChange={handleChange}
//                     placeholder="parent@example.com"
//                     required
//                   />
//                 </div>

//               </div>

//             </section>

//             {/* Address */}

//             <section className="form-section">

//               <h3>Address Information</h3>

//               <div className="form-grid">

//                 <div className="form-group full-width">
//                   <label>Address *</label>

//                   <textarea
//                     name="address"
//                     value={form.address}
//                     onChange={handleChange}
//                     rows="3"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>City *</label>

//                   <input
//                     type="text"
//                     name="city"
//                     value={form.city}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>State *</label>

//                   <input
//                     type="text"
//                     name="state"
//                     value={form.state}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Postal Code *</label>

//                   <input
//                     type="text"
//                     name="postal_code"
//                     value={form.postal_code}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//               </div>

//             </section>

//             {/* Message */}

//             <section className="form-section">

//               <h3>Additional Information</h3>

//               <div className="form-group">

//                 <label>
//                   Message / Additional Information
//                 </label>

//                 <textarea
//                   name="message"
//                   value={form.message}
//                   onChange={handleChange}
//                   rows="4"
//                   placeholder="Any additional information..."
//                 />

//               </div>

//             </section>

//             {/* Error */}

//             {error && (
//               <div className="admission-error">
//                 {error}
//               </div>
//             )}

//             {/* Submit */}

//             <div className="form-submit-area">

//               <p>
//                 By submitting this form, you confirm that
//                 the information provided is correct.
//               </p>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="submit-admission-button"
//               >
//                 {loading
//                   ? "Submitting..."
//                   : "Submit Admission Application"}
//               </button>

//             </div>

//           </form>

//         </div>

//       </main>

//     </div>
//   );
// }

// export default AdmissionForm;


import { useState } from "react";
import { Link } from "react-router-dom";
import { submitAdmission } from "../../services/admissionService";
import "./admission.css";

const initialForm = {
  student_first_name: "",
  student_middle_name: "",
  student_last_name: "",
  date_of_birth: "",
  gender: "",
  applying_for_class: "",
  previous_school: "",
  father_name: "",
  mother_name: "",
  parent_phone: "",
  parent_email: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  message: "",
  student_photo: null,
  previous_marksheet: null,
};

const steps = [
  "Basic Details",
  "Address",
  "Other Information",
  "Document Upload",
  "Review",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImages = ["image/jpeg", "image/png"];
const allowedDocuments = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

function AdmissionForm() {
  const [form, setForm] = useState({ ...initialForm });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Handle text, select, textarea and file inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));

    setError("");
  };

  // Validate current step
  const validateStep = () => {
    const requiredFields = {
      0: [
        "student_first_name",
        "student_last_name",
        "date_of_birth",
        "gender",
        "applying_for_class",
        "father_name",
        "mother_name",
        "parent_phone",
        "parent_email",
      ],
      1: ["address", "city", "state", "postal_code"],
    };

    const fields = requiredFields[currentStep] || [];

    for (const name of fields) {
      if (!String(form[name] || "").trim()) {
        setError("Please fill in all required fields.");
        return false;
      }
    }

    if (currentStep === 0) {
      if (!/^[6-9]\d{9}$/.test(form.parent_phone)) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.parent_email)) {
        setError("Please enter a valid email address.");
        return false;
      }

      const today = new Date().toISOString().split("T")[0];

      if (form.date_of_birth >= today) {
        setError("Date of birth must be in the past.");
        return false;
      }
    }

    // Document upload validation
    if (currentStep === 3) {
      const photo = form.student_photo;
      const marksheet = form.previous_marksheet;

      if (!photo) {
        setError("Please upload the student's photograph.");
        return false;
      }

      if (!allowedImages.includes(photo.type)) {
        setError("Student photo must be JPG, JPEG or PNG.");
        return false;
      }

      if (photo.size > MAX_FILE_SIZE) {
        setError("Student photo must not exceed 5 MB.");
        return false;
      }

      if (marksheet) {
        if (!allowedDocuments.includes(marksheet.type)) {
          setError("Marksheet must be PDF, JPG, JPEG or PNG.");
          return false;
        }

        if (marksheet.size > MAX_FILE_SIZE) {
          setError("Marksheet must not exceed 5 MB.");
          return false;
        }
      }
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    setError("");

    setCurrentStep((prev) => Math.max(prev - 1, 0));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit application
  const handleSubmit = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await submitAdmission(form);

      setSuccess(data);

      setForm({ ...initialForm });
      setCurrentStep(0);
      setFileInputKey((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable input field
  const field = (
    label,
    name,
    type = "text",
    required = false,
    placeholder = ""
  ) => (
    <div className="admission-field">
      <label htmlFor={name}>
        {label} {required && <span>*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  // Reusable select field
  const selectField = (label, name, options) => (
    <div className="admission-field">
      <label htmlFor={name}>
        {label} <span>*</span>
      </label>

      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Review application details
  const renderReview = () => {
    const sections = [
      {
        title: "Student Information",
        fields: [
          [
            "Student Name",
            [
              form.student_first_name,
              form.student_middle_name,
              form.student_last_name,
            ].filter(Boolean).join(" "),
          ],
          ["Date of Birth", form.date_of_birth],
          ["Gender", form.gender],
          ["Applying for Class", form.applying_for_class],
          ["Previous School", form.previous_school || "Not provided"],
        ],
      },
      {
        title: "Parent Information",
        fields: [
          ["Father's Name", form.father_name],
          ["Mother's Name", form.mother_name],
          ["Phone", form.parent_phone],
          ["Email", form.parent_email],
        ],
      },
      {
        title: "Address Information",
        fields: [
          ["Address", form.address],
          ["City", form.city],
          ["State", form.state],
          ["Postal Code", form.postal_code],
        ],
      },
      {
        title: "Other Information",
        fields: [
          ["Message", form.message || "Not provided"],
        ],
      },
      {
        title: "Uploaded Documents",
        fields: [
          ["Student Photo", form.student_photo?.name || "Not uploaded"],
          [
            "Previous Marksheet",
            form.previous_marksheet?.name || "Not uploaded",
          ],
        ],
      },
    ];

    return sections.map((section) => (
      <div className="review-section" key={section.title}>
        <h4>{section.title}</h4>

        <div className="review-grid">
          {section.fields.map(([label, value]) => (
            <div className="review-item" key={label}>
              <small>{label}</small>
              <strong>{value || "—"}</strong>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Success screen
  if (success) {
    return (
      <div className="admission-page">
        <div className="admission-success-card">
          <div className="success-icon">✓</div>

          <h2>Application Submitted Successfully!</h2>

          <p>
            Your admission application has been received by the school.
          </p>

          <div className="application-number">
            <span>Application Number</span>
            <strong>{success.application_number}</strong>
          </div>

          <p>Please save your application number.</p>

          <Link to="/" className="admission-next-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admission-page">
      {/* Header */}
      <header className="portal-header">
        <div className="portal-brand">
          <div className="portal-logo">S</div>

          <div>
            <strong>YOUR SCHOOL NAME</strong>
            <small>School Education Portal</small>
          </div>
        </div>

        <div className="portal-title">
          STUDENT ADMISSION PORTAL
        </div>

        <Link to="/" className="portal-home">
          Home
        </Link>
      </header>

      {/* Progress Steps */}
      <div className="admission-progress">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${
              index === currentStep ? "active" : ""
            } ${index < currentStep ? "completed" : ""}`}
          >
            <div className="progress-circle">
              {index < currentStep ? "✓" : index + 1}
            </div>

            <span>{step}</span>
          </div>
        ))}
      </div>

      <main className="admission-main">
        <div className="admission-session">
          <strong>Online Admission Registration</strong>
          <span>Academic Session 2026–27</span>
        </div>

        <div className="admission-panel">
          <div className="panel-heading">
            <span>{steps[currentStep]}</span>
            <span className="panel-arrow">⌄</span>
          </div>

          <div className="panel-body">
            {/* STEP 1: BASIC DETAILS */}
            {currentStep === 0 && (
              <>
                <div className="field-heading">
                  Student & Parent Details
                </div>

                <div className="admission-grid">
                  {field("Student First Name", "student_first_name", "text", true)}
                  {field("Student Middle Name", "student_middle_name")}
                  {field("Student Last Name", "student_last_name", "text", true)}
                  {field("Date of Birth", "date_of_birth", "date", true)}

                  {selectField("Gender", "gender", [
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ])}

                  {selectField("Applying for Class", "applying_for_class", [
                    { value: "Nursery", label: "Nursery" },
                    { value: "LKG", label: "LKG" },
                    { value: "UKG", label: "UKG" },
                    ...Array.from({ length: 12 }, (_, i) => ({
                      value: `Class ${i + 1}`,
                      label: `Class ${i + 1}`,
                    })),
                  ])}

                  {field("Father's Name", "father_name", "text", true)}
                  {field("Mother's Name", "mother_name", "text", true)}

                  {field(
                    "Parent Mobile Number",
                    "parent_phone",
                    "tel",
                    true,
                    "10-digit mobile number"
                  )}

                  {field(
                    "Parent Email ID",
                    "parent_email",
                    "email",
                    true,
                    "parent@example.com"
                  )}
                </div>
              </>
            )}

            {/* STEP 2: ADDRESS */}
            {currentStep === 1 && (
              <>
                <div className="field-heading">
                  Permanent Address Details
                </div>

                <div className="admission-grid">
                  <div className="admission-field full">
                    <label htmlFor="address">
                      Full Address <span>*</span>
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                    />
                  </div>

                  {field("City", "city", "text", true)}
                  {field("State", "state", "text", true)}
                  {field("Postal Code", "postal_code", "text", true)}
                </div>
              </>
            )}

            {/* STEP 3: OTHER INFORMATION */}
            {currentStep === 2 && (
              <>
                <div className="field-heading">
                  Other Information
                </div>

                <div className="admission-grid">
                  {field(
                    "Previous School",
                    "previous_school",
                    "text",
                    false,
                    "Enter previous school name"
                  )}

                  <div className="admission-field full">
                    <label htmlFor="message">
                      Additional Information / Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter any additional information..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 4: DOCUMENT UPLOAD */}
            {currentStep === 3 && (
              <>
                <div className="field-heading">
                  Upload Required Documents
                </div>

                <div className="document-upload-grid">
                  <div className="document-upload-card">
                    <div className="document-icon">📷</div>

                    <h3>Student Photograph</h3>

                    <p>
                      Upload recent passport-size student photograph.
                    </p>

                    <label className="upload-label">
                      Choose Student Photo *
                      <input
                        key={`photo-${fileInputKey}`}
                        type="file"
                        name="student_photo"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handleChange}
                      />
                    </label>

                    {form.student_photo && (
                      <div className="selected-file">
                        ✓ {form.student_photo.name}
                      </div>
                    )}

                    <small>JPG, JPEG, PNG | Maximum 5 MB</small>
                  </div>

                  <div className="document-upload-card">
                    <div className="document-icon">📄</div>

                    <h3>Previous Marksheet</h3>

                    <p>
                      Upload previous class marksheet, if available.
                    </p>

                    <label className="upload-label">
                      Choose Marksheet
                      <input
                        key={`marksheet-${fileInputKey}`}
                        type="file"
                        name="previous_marksheet"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={handleChange}
                      />
                    </label>

                    {form.previous_marksheet && (
                      <div className="selected-file">
                        ✓ {form.previous_marksheet.name}
                      </div>
                    )}

                    <small>PDF, JPG, JPEG, PNG | Maximum 5 MB</small>
                  </div>
                </div>
              </>
            )}

            {/* STEP 5: REVIEW */}
            {currentStep === 4 && (
              <>
                <div className="field-heading">
                  Review Your Application
                </div>

                {renderReview()}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="admission-error" role="alert">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="admission-navigation">
              <button
                type="button"
                className="admission-prev-btn"
                onClick={handlePrevious}
                disabled={currentStep === 0 || loading}
              >
                ← Previous
              </button>

              <span>
                Step {currentStep + 1} of {steps.length}
              </span>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  className="admission-next-btn"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className="admission-next-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="admission-footer">
          © 2026 Your School Name. All Rights Reserved.
        </p>
      </main>
    </div>
  );
}

export default AdmissionForm;
