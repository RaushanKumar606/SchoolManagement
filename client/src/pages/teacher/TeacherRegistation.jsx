
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { teacherService } from "../../services/teacherService";
// import "./TeacherRegistation.css";
// const initialForm = {
//   name: "",
//   email: "",
//   phone: "",
//   department: "",
//   primary_subject: "",
//   qualification: "",
//   password: "",

//   // message: "",
// };

// function TeacherRegistation() {

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
//      const data = await teacherService.register(form);

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

//           {/* <div className="application-number">
//             <span>Application Number</span>
//             <strong>{success.application_number}</strong>
//           </div> */}

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

//           <Link to="/" className="school-brand">
//             <div className="school-logo">
//               S
//             </div>

//             <div>
//               <strong>Springfield School</strong>
//               <span>Admission Portal</span>
//             </div>
//           </Link>

//           <Link to="/" className="back-home">
//             ← Back to Home
//           </Link>

//         </div>

//       </header>

//       {/* Hero */}

//       <section className="admission-hero">

//         <div>

//           <p>
//             Complete the application form below to begin
//             the Hiring process at Springfield School.
//           </p>

//         </div>

//       </section>

//       {/* Form */}

//       <main className="admission-container">

//         <div className="admission-form-wrapper">

//           <div className="form-introduction">

//             <h2>Teacher Hiring Process</h2>

//             <p>
//               Please provide accurate information. Our
//               Hiring team will review your Process
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
//                   <small>Hiring status</small>
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

//               <h3>Teacher Information</h3>

//               <div className="form-grid">

//                 <div className="form-group">
//                   <label>First Name *</label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* <div className="form-group">
//                   <label>Middle Name</label>

//                   <input
//                     type="text"
//                     name="middle_name"
//                     value={form.middle_name}
//                     onChange={handleChange}
//                   />
//                 </div> */}

//                 <div className="form-group">
//                   <label>Email</label>

//                   <input
//                     type="text"
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 {/* <div className="form-group">
//                   <label>Date of Birth *</label>

//                   <input
//                     type="date"
//                     name="date_of_birth"
//                     value={form.date_of_birth}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div> */}

//                 {/* USED TO GENDER */}

//                 {/* <div className="form-group">
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
//                 </div> */}

//                  <div className="form-group">
//                   <label>Department *</label>

//                   <input
//                     type="text"
//                     name="department"
//                     value={form.department}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label> Primary_Subject *</label>

//                   <select
//                     name="primary_subject"
//                     value={form.primary_subject}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">
//                       Select Class
//                     </option>

//                     <option value="Math">Math</option>
//                     <option value="Physice">Physice</option>
//                     <option value="Computer">Computer</option>

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

//                 <div className="form-group">
//                   <label>Qualification *</label>

//                   <input
//                     type="text"
//                     name="qualification"
//                     value={form.qualification}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Phone Number</label>

//                   <input
//                     type=""
//                     name="phone"                    value={form.phone}
//                     onChange={handleChange}
//                    required
//                   />
//                 </div>

//               </div>
//             </section>

//             <div className="form-group">
//                   <label>Password *</label>

//                   <input
//                     type="password"
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
            

//             {/* Message */}

//             {/* <section className="form-section">

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

//             </section> */}

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
//                   {loading ? "Submitting..." : "Register"}
//               </button>

//             </div>

//           </form>

//         </div>

//       </main>

//     </div>
//   );
// }

// export default TeacherRegistation;



import { useState } from "react";
import { Link } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import "./TeacherRegistation.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  department: "",
  primary_subject: "",
  qualification: "",
};

const steps = [
  "Basic Details",
  "Professional Details",
  "Document Upload",
  "Review",
];

function TeacherRegistation() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({
    profile_photo: null,
    resume: null,
    qualification_certificate: null,
    experience_certificate: null,
  });

  const [step, setStep] = useState(0);
  const [openSection, setOpenSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles?.[0];

    if (!file) return;

    const isPhoto = name === "profile_photo";
    const allowedTypes = isPhoto
      ? ["image/jpeg", "image/png"]
      : ["application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setError(
        isPhoto
          ? "Profile photo must be JPG or PNG."
          : "Please upload a PDF file."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Each file must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setError("");
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.password
      ) {
        setError("Please complete all required basic details.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (step === 1) {
      if (
        !form.department.trim() ||
        !form.primary_subject ||
        !form.qualification.trim()
      ) {
        setError("Please complete all professional details.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !files.profile_photo ||
        !files.resume ||
        !files.qualification_certificate
      ) {
        setError(
          "Profile photo, resume and qualification certificate are required."
        );
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
    setOpenSection((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 0));
    setOpenSection((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      const response = await teacherService.register(formData);
      setSuccess(response);
      setForm(initialForm);
      setFiles({
        profile_photo: null,
        resume: null,
        qualification_certificate: null,
        experience_certificate: null,
      });
      setStep(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Unable to submit teacher application.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="teacher-portal-page">
        <div className="teacher-success-card">
          <div className="teacher-success-icon">✓</div>
          <h1>Application Submitted</h1>
          <p>
            Your teacher registration application has been submitted
            successfully. The school administration will review it.
          </p>
          <div className="teacher-success-actions">
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="teacher-primary-button"
            >
              Submit Another Application
            </button>
            <Link to="/" className="teacher-secondary-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderBasicDetails = () => (
    <div className="teacher-form-grid">
      <div className="teacher-form-group">
        <label>Full Name <span>*</span></label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="teacher-form-group">
        <label>Email Address <span>*</span></label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />
      </div>

      <div className="teacher-form-group">
        <label>Mobile Number <span>*</span></label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter mobile number"
          required
        />
      </div>

      <div className="teacher-form-group">
        <label>Password <span>*</span></label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />
      </div>
    </div>
  );

  const renderProfessionalDetails = () => (
    <div className="teacher-form-grid">
      <div className="teacher-form-group">
        <label>Department <span>*</span></label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="e.g. Science, Commerce"
          required
        />
      </div>

      <div className="teacher-form-group">
        <label>Primary Subject <span>*</span></label>
        <select
          name="primary_subject"
          value={form.primary_subject}
          onChange={handleChange}
          required
        >
          <option value="">Select Subject</option>
          <option value="Math">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Computer">Computer</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Social Science">Social Science</option>
        </select>
      </div>

      <div className="teacher-form-group">
        <label>Highest Qualification <span>*</span></label>
        <input
          type="text"
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          placeholder="e.g. B.Ed, M.Sc, M.A"
          required
        />
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="teacher-form-grid">
      <div className="teacher-form-group teacher-file-group">
        <label>Profile Photo <span>*</span></label>
        <input
          type="file"
          name="profile_photo"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleFileChange}
        />
        <small>JPG or PNG, maximum 5 MB</small>
        {files.profile_photo && (
          <small className="teacher-file-selected">
            Selected: {files.profile_photo.name}
          </small>
        )}
      </div>

      <div className="teacher-form-group teacher-file-group">
        <label>Resume / CV <span>*</span></label>
        <input
          type="file"
          name="resume"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />
        <small>PDF only, maximum 5 MB</small>
        {files.resume && (
          <small className="teacher-file-selected">
            Selected: {files.resume.name}
          </small>
        )}
      </div>

      <div className="teacher-form-group teacher-file-group">
        <label>Qualification Certificate <span>*</span></label>
        <input
          type="file"
          name="qualification_certificate"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />
        <small>PDF only, maximum 5 MB</small>
        {files.qualification_certificate && (
          <small className="teacher-file-selected">
            Selected: {files.qualification_certificate.name}
          </small>
        )}
      </div>

      <div className="teacher-form-group teacher-file-group">
        <label>Experience Certificate</label>
        <input
          type="file"
          name="experience_certificate"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />
        <small>Optional for freshers. PDF only, maximum 5 MB</small>
        {files.experience_certificate && (
          <small className="teacher-file-selected">
            Selected: {files.experience_certificate.name}
          </small>
        )}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="teacher-review">
      <h3>Review Your Information</h3>
      <p>Please verify your details before submitting the application.</p>

      <div className="teacher-review-section">
        <h4>Basic Details</h4>
        <div className="teacher-review-grid">
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Mobile:</strong> {form.phone}</p>
        </div>
      </div>

      <div className="teacher-review-section">
        <h4>Professional Details</h4>
        <div className="teacher-review-grid">
          <p><strong>Department:</strong> {form.department}</p>
          <p><strong>Subject:</strong> {form.primary_subject}</p>
          <p><strong>Qualification:</strong> {form.qualification}</p>
        </div>
      </div>

      <div className="teacher-review-section">
        <h4>Uploaded Documents</h4>
        <ul>
          <li>Profile Photo: {files.profile_photo?.name || "Not uploaded"}</li>
          <li>Resume: {files.resume?.name || "Not uploaded"}</li>
          <li>
            Qualification Certificate:{" "}
            {files.qualification_certificate?.name || "Not uploaded"}
          </li>
          <li>
            Experience Certificate:{" "}
            {files.experience_certificate?.name || "Not uploaded (optional)"}
          </li>
        </ul>
      </div>
    </div>
  );

  const sectionContent = [
    renderBasicDetails,
    renderProfessionalDetails,
    renderDocumentUpload,
    renderReview,
  ];

  return (
    <div className="teacher-portal-page">
      <header className="teacher-portal-header">
        <div className="teacher-portal-header-inner">
          <Link to="/" className="teacher-portal-brand">
            <div className="teacher-portal-logo">S</div>
            <div>
              <strong>Springfield School</strong>
              <span>TEACHER REGISTRATION PORTAL</span>
            </div>
          </Link>

          <div className="teacher-portal-contact">
            <span>Teacher Hiring</span>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="teacher-portal-main">
        <div className="teacher-portal-title">
          <h1>Online Teacher Registration Form</h1>
          <p>Complete all required details to apply for a teaching position.</p>
        </div>

        <div className="teacher-registration-card">
          <div className="teacher-progress">
            {steps.map((label, index) => (
              <div
                className={`teacher-progress-step ${
                  index <= step ? "active" : ""
                } ${index === step ? "current" : ""}`}
                key={label}
              >
                <div className="teacher-progress-circle">
                  {index < step ? "✓" : index + 1}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="teacher-accordion">
              {steps.map((label, index) => (
                <section className="teacher-accordion-section" key={label}>
                  <button
                    type="button"
                    className={`teacher-accordion-header ${
                      openSection === index ? "expanded" : ""
                    }`}
                    onClick={() => {
                      if (index <= step) {
                        setOpenSection(index);
                        setStep(index);
                        setError("");
                      }
                    }}
                    aria-expanded={openSection === index}
                  >
                    <span className="teacher-accordion-icon">
                      {index < step ? "✓" : index + 1}
                    </span>
                    <span>{label}</span>
                    <span className="teacher-accordion-arrow">
                      {openSection === index ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {openSection === index && (
                    <div className="teacher-accordion-content">
                      {sectionContent[index]()}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {error && <div className="teacher-form-error">{error}</div>}

            <div className="teacher-form-footer">
              <button
                type="button"
                className="teacher-previous-button"
                onClick={handlePrevious}
                disabled={step === 0 || loading}
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="teacher-next-button"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="teacher-next-button"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TeacherRegistation;

