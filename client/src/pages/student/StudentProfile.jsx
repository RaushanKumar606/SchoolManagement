

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   getMyStudentProfile,
//   getMyStudentDocuments,
// } from "../../services/studentService";

// import "./Student.css";

// function StudentProfile() {
//   const [student, setStudent] = useState(null);
//   const [documents, setDocuments] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [documentLoading, setDocumentLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [documentError, setDocumentError] = useState("");

//   useEffect(() => {
//     loadStudentProfile();
//   }, []);

  
//   const loadStudentProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getMyStudentProfile();
//       setStudent(data);

//       // Fetch documents only when admission is linked
//       if (data.admission_id) {
//         try {
//           setDocumentLoading(true);

//           const documentData = await getMyStudentDocuments(
//             data.admission_id
//           );

//           setDocuments(documentData);
//         } catch (err) {
//           console.error("Student documents error:", err);
//           setDocumentError(
//             "Unable to load admission documents."
//           );
//         } finally {
//           setDocumentLoading(false);
//         }
//       }
//     } catch (err) {
//       console.error("Student profile error:", err);
//       setError(err.message || "Unable to load student profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const displayValue = (value) => {
//     if (value === null || value === undefined || value === "") {
//       return "Not provided";
//     }

//     return value;
//   };

//   const formatDate = (value) => {
//     if (!value) return "Not provided";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return value;

//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="profile-state">
//         <div className="profile-spinner" />
//         <p>Loading your profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="profile-state">
//         <div className="profile-state-icon">⚠️</div>
//         <h2>Unable to load profile</h2>
//         <p>{error}</p>

//         <button
//           className="profile-retry-btn"
//           onClick={loadStudentProfile}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="profile-state">
//         <div className="profile-state-icon">👤</div>
//         <h2>Profile not found</h2>
//         <p>Your student profile could not be found.</p>
//       </div>
//     );
//   }

//   const fullName = [
//     student.first_name,
//     student.middle_name,
//     student.last_name,
//   ]
//     .filter(Boolean)
//     .join(" ") || student.username || "Student";

//   const firstLetter = fullName.charAt(0).toUpperCase();

//   return (
//     <main className="student-profile-page">
//       <div className="student-profile-container">

//         {/* Breadcrumb */}
//         <nav className="profile-breadcrumb">
//           <Link to="/student/dashboard">Dashboard</Link>
//           <span>/</span>
//           <span>My Profile</span>
//         </nav>

//         {/* Profile Header */}
//         <section className="profile-hero">

//           <div className="profile-hero-content">

//             <div className="profile-avatar">
//               {documents?.student_photo_url ? (
//                 <img
//                   src={documents.student_photo_url}
//                   alt={`${fullName} profile`}
//                   className="profile-avatar-image"
//                 />
//               ) : (
//                 firstLetter
//               )}
//             </div>

//             <div className="profile-hero-info">
//               <span className="profile-eyebrow">
//                 STUDENT PORTAL
//               </span>

//               <h1>{fullName}</h1>

//               <div className="profile-hero-meta">
//                 <span>
//                   ID: {displayValue(student.student_id)}
//                 </span>

//                 <span className="profile-active-status">
//                   <i />
//                   Student Profile
//                 </span>
//               </div>
//             </div>

//           </div>

//           <Link
//             to="/student/dashboard"
//             className="profile-back-btn"
//           >
//             ← Back to Dashboard
//           </Link>

//         </section>

//         {/* Summary Cards */}
//         <section className="profile-summary-grid">

//           <div className="profile-summary-card">
//             <div className="profile-summary-icon academic-icon">
//               🎓
//             </div>
//             <div>
//               <span>Class</span>
//               <strong>
//                 {displayValue(student.school_class)}
//               </strong>
//             </div>
//           </div>

//           <div className="profile-summary-card">
//             <div className="profile-summary-icon section-icon">
//               📚
//             </div>
//             <div>
//               <span>Section</span>
//               <strong>
//                 {displayValue(student.section)}
//               </strong>
//             </div>
//           </div>

//           <div className="profile-summary-card">
//             <div className="profile-summary-icon year-icon">
//               📅
//             </div>
//             <div>
//               <span>Academic Year</span>
//               <strong>
//                 {displayValue(student.academic_year)}
//               </strong>
//             </div>
//           </div>

//         </section>

//         {/* Personal Information */}
//         <section className="profile-info-card">

//           <div className="profile-section-heading">
//             <div className="profile-heading-icon personal-heading-icon">
//               👤
//             </div>

//             <div>
//               <h2>Personal Information</h2>
//               <p>Your personal and identification details</p>
//             </div>
//           </div>

//           <div className="profile-details-grid">

//             <ProfileField label="Full Name" value={fullName} />

//             <ProfileField
//               label="Student ID"
//               value={student.student_id}
//             />

//             <ProfileField
//               label="Date of Birth"
//               value={formatDate(student.date_of_birth)}
//             />

//             <ProfileField
//               label="Gender"
//               value={student.gender}
//             />

//             <ProfileField
//               label="Email Address"
//               value={student.parent_email}
//             />

//             <ProfileField
//               label="Phone Number"
//               value={student.parent_phone}
//             />

//           </div>
//         </section>

//         {/* Academic Information */}
//         <section className="profile-info-card">

//           <div className="profile-section-heading">
//             <div className="profile-heading-icon academic-heading-icon">
//               🎓
//             </div>

//             <div>
//               <h2>Academic Information</h2>
//               <p>Your current school and class details</p>
//             </div>
//           </div>

//           <div className="profile-details-grid">

//             <ProfileField
//               label="Class"
//               value={student.school_class}
//             />

//             <ProfileField
//               label="Section"
//               value={student.section}
//             />

//             <ProfileField
//               label="Academic Year"
//               value={student.academic_year}
//             />

//             <ProfileField
//               label="Admission / Student ID"
//               value={student.student_id}
//             />

//           </div>
//         </section>

//         {/* Family Information */}
//         <section className="profile-info-card">

//           <div className="profile-section-heading">
//             <div className="profile-heading-icon family-heading-icon">
//               👨‍👩‍👧
//             </div>

//             <div>
//               <h2>Family & Contact Information</h2>
//               <p>Parent and registered contact details</p>
//             </div>
//           </div>

//           <div className="profile-details-grid">

//             <ProfileField
//               label="Father's Name"
//               value={student.father_name}
//             />

//             <ProfileField
//               label="Mother's Name"
//               value={student.mother_name}
//             />

//             <ProfileField
//               label="Parent Phone"
//               value={student.parent_phone}
//             />

//             <ProfileField
//               label="Parent Email"
//               value={student.parent_email}
//             />

//             <ProfileField
//               label="Address"
//               value={[
//                 student.address,
//                 student.city,
//                 student.state,
//                 student.postal_code,
//               ]
//                 .filter(Boolean)
//                 .join(", ")}
//               wide
//             />

//           </div>
//         </section>

//         {/* Admission Documents */}
//         <section className="profile-info-card">

//           <div className="profile-section-heading">
//             <div className="profile-heading-icon personal-heading-icon">
//               📁
//             </div>

//             <div>
//               <h2>Admission Documents</h2>
//               <p>Your securely stored admission documents</p>
//             </div>
//           </div>

//           {documentLoading && (
//             <p className="document-message">
//               Loading admission documents...
//             </p>
//           )}

//           {documentError && (
//             <p className="document-error">
//               {documentError}
//             </p>
//           )}

//           {!documentLoading && !documentError && (
//             <div className="profile-documents-grid">

//               {/* Student Photo */}
//               <div className="profile-document-card">

//                 <div className="document-icon">
//                   🖼️
//                 </div>

//                 <div className="document-content">
//                   <h3>Student Photograph</h3>

//                   {documents?.student_photo_url ? (
//                     <>
//                       <p>Admission photo available</p>

//                       <a
//                         href={documents.student_photo_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="document-action"
//                       >
//                         View Photo
//                       </a>
//                     </>
//                   ) : (
//                     <p>Photo not available</p>
//                   )}
//                 </div>

//               </div>

//               {/* Previous Marksheet */}
//               <div className="profile-document-card">

//                 <div className="document-icon pdf-icon">
//                   📄
//                 </div>

//                 <div className="document-content">
//                   <h3>Previous Marksheet</h3>

//                   {documents?.previous_marksheet_url ? (
//                     <>
//                       <p>PDF document available</p>

//                       <div className="document-actions">

//                         <a
//                           href={documents.previous_marksheet_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="document-action"
//                         >
//                           View PDF
//                         </a>

//                         <a
//                           href={documents.previous_marksheet_url}
//                           download="previous-marksheet.pdf"
//                           className="document-download"
//                         >
//                           Download
//                         </a>

//                       </div>
//                     </>
//                   ) : (
//                     <p>Marksheet not available</p>
//                   )}
//                 </div>

//               </div>

//             </div>
//           )}

//           {!student.admission_id && (
//             <p className="document-message">
//               No admission application is linked to this profile.
//             </p>
//           )}

//         </section>

//         <footer className="profile-footer">
//           🎓 Keep your profile information accurate and up to date.
//         </footer>

//       </div>
//     </main>
//   );
// }


// function ProfileField({ label, value, wide = false }) {
//   const hasValue =
//     value !== null &&
//     value !== undefined &&
//     value !== "";

//   return (
//     <div className={`profile-field ${wide ? "profile-field-wide" : ""}`}>
//       <span className="profile-field-label">
//         {label}
//       </span>

//       <strong className={hasValue ? "" : "profile-value-missing"}>
//         {hasValue ? value : "Not provided"}
//       </strong>
//     </div>
//   );
// }

// export default StudentProfile;




import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyStudentProfile,
  getMyStudentDocuments,
} from "../../services/studentService";

import "./Student.css";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState(null);

  const [loading, setLoading] = useState(true);
  const [documentLoading, setDocumentLoading] = useState(false);

  const [error, setError] = useState("");
  const [documentError, setDocumentError] = useState("");

  // ==========================================
  // LOAD STUDENT DOCUMENTS
  // ==========================================

  const loadDocuments = useCallback(async (admissionId) => {
    if (!admissionId) {
      setDocuments(null);
      setDocumentLoading(false);
      return;
    }

    setDocumentLoading(true);
    setDocumentError("");

    try {
      const documentData = await getMyStudentDocuments(
        admissionId
      );

      setDocuments(documentData);

    } catch (err) {
      console.error("Student documents error:", err);

      setDocumentError(
        "Unable to load admission documents."
      );

    } finally {
      setDocumentLoading(false);
    }
  }, []);

  // ==========================================
  // LOAD STUDENT PROFILE
  // ==========================================

  const loadStudentProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    setStudent(null);
    setDocuments(null);

    setDocumentError("");
    setDocumentLoading(false);

    try {
      // First fetch student profile
      const data = await getMyStudentProfile();

      setStudent(data);

      // Start documents request independently.
      // Do not wait for documents API to finish.
      if (data?.admission_id) {
        void loadDocuments(data.admission_id);
      }

    } catch (err) {
      console.error("Student profile error:", err);

      setError(
        err.message || "Unable to load student profile."
      );

      setStudent(null);

    } finally {
      setLoading(false);
    }
  }, [loadDocuments]);

  // ==========================================
  // INITIAL API CALL
  // ==========================================

  useEffect(() => {
    loadStudentProfile();
  }, [loadStudentProfile]);

  // ==========================================
  // DISPLAY VALUE
  // ==========================================

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    return value;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (value) => {
    if (!value) return "Not provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // PROFILE LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-state">
        <div className="profile-spinner" />

        <p>Loading your profile...</p>
      </div>
    );
  }

  // ==========================================
  // PROFILE ERROR
  // ==========================================

  if (error) {
    return (
      <div className="profile-state">
        <div className="profile-state-icon">
          ⚠️
        </div>

        <h2>Unable to load profile</h2>

        <p>{error}</p>

        <button
          type="button"
          className="profile-retry-btn"
          onClick={loadStudentProfile}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!student) {
    return (
      <div className="profile-state">
        <div className="profile-state-icon">
          👤
        </div>

        <h2>Profile not found</h2>

        <p>
          Your student profile could not be found.
        </p>
      </div>
    );
  }

  // ==========================================
  // STUDENT DETAILS
  // ==========================================

  const fullName = [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ") || student.username || "Student";

  const firstLetter = fullName.charAt(0).toUpperCase();

  // ==========================================
  // MAIN PROFILE UI
  // ==========================================

  return (
    <main className="student-profile-page">

      <div className="student-profile-container">

        {/* BREADCRUMB */}

        <nav className="profile-breadcrumb">

          <Link to="/student/dashboard">
            Dashboard
          </Link>

          <span>/</span>

          <span>My Profile</span>

        </nav>

        {/* PROFILE HEADER */}

        <section className="profile-hero">

          <div className="profile-hero-content">

            {/* STUDENT AVATAR */}

            <div className="profile-avatar">

              {documents?.student_photo_url ? (

                <img
                  src={documents.student_photo_url}
                  alt={`${fullName} profile`}
                  className="profile-avatar-image"
                  loading="lazy"
                  decoding="async"
                />

              ) : (

                firstLetter

              )}

            </div>

            {/* STUDENT NAME */}

            <div className="profile-hero-info">

              <span className="profile-eyebrow">
                STUDENT PORTAL
              </span>

              <h1>{fullName}</h1>

              <div className="profile-hero-meta">

                <span>
                  ID: {displayValue(student.student_id)}
                </span>

                <span className="profile-active-status">
                  <i />
                  Student Profile
                </span>

              </div>

            </div>

          </div>

          <Link
            to="/student/dashboard"
            className="profile-back-btn"
          >
            ← Back to Dashboard
          </Link>

        </section>

        {/* SUMMARY CARDS */}

        <section className="profile-summary-grid">

          {/* CLASS */}

          <div className="profile-summary-card">

            <div className="profile-summary-icon academic-icon">
              🎓
            </div>

            <div>
              <span>Class</span>

              <strong>
                {displayValue(student.school_class)}
              </strong>
            </div>

          </div>

          {/* SECTION */}

          <div className="profile-summary-card">

            <div className="profile-summary-icon section-icon">
              📚
            </div>

            <div>
              <span>Section</span>

              <strong>
                {displayValue(student.section)}
              </strong>
            </div>

          </div>

          {/* ACADEMIC YEAR */}

          <div className="profile-summary-card">

            <div className="profile-summary-icon year-icon">
              📅
            </div>

            <div>
              <span>Academic Year</span>

              <strong>
                {displayValue(student.academic_year)}
              </strong>
            </div>

          </div>

        </section>

        {/* PERSONAL INFORMATION */}

        <section className="profile-info-card">

          <div className="profile-section-heading">

            <div className="profile-heading-icon personal-heading-icon">
              👤
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Your personal and identification details
              </p>
            </div>

          </div>

          <div className="profile-details-grid">

            <ProfileField
              label="Full Name"
              value={fullName}
            />

            <ProfileField
              label="Student ID"
              value={student.student_id}
            />

            <ProfileField
              label="Date of Birth"
              value={formatDate(student.date_of_birth)}
            />

            <ProfileField
              label="Gender"
              value={student.gender}
            />

            <ProfileField
              label="Email Address"
              value={student.parent_email}
            />

            <ProfileField
              label="Phone Number"
              value={student.parent_phone}
            />

          </div>

        </section>

        {/* ACADEMIC INFORMATION */}

        <section className="profile-info-card">

          <div className="profile-section-heading">

            <div className="profile-heading-icon academic-heading-icon">
              🎓
            </div>

            <div>
              <h2>Academic Information</h2>

              <p>
                Your current school and class details
              </p>
            </div>

          </div>

          <div className="profile-details-grid">

            <ProfileField
              label="Class"
              value={student.school_class}
            />

            <ProfileField
              label="Section"
              value={student.section}
            />

            <ProfileField
              label="Academic Year"
              value={student.academic_year}
            />

            <ProfileField
              label="Admission / Student ID"
              value={student.student_id}
            />

          </div>

        </section>

        {/* FAMILY AND CONTACT INFORMATION */}

        <section className="profile-info-card">

          <div className="profile-section-heading">

            <div className="profile-heading-icon family-heading-icon">
              👨‍👩‍👧
            </div>

            <div>
              <h2>Family & Contact Information</h2>

              <p>
                Parent and registered contact details
              </p>
            </div>

          </div>

          <div className="profile-details-grid">

            <ProfileField
              label="Father's Name"
              value={student.father_name}
            />

            <ProfileField
              label="Mother's Name"
              value={student.mother_name}
            />

            <ProfileField
              label="Parent Phone"
              value={student.parent_phone}
            />

            <ProfileField
              label="Parent Email"
              value={student.parent_email}
            />

            <ProfileField
              label="Address"
              value={[
                student.address,
                student.city,
                student.state,
                student.postal_code,
              ]
                .filter(Boolean)
                .join(", ")}
              wide
            />

          </div>

        </section>

        {/* ADMISSION DOCUMENTS */}

        <section className="profile-info-card">

          <div className="profile-section-heading">

            <div className="profile-heading-icon personal-heading-icon">
              📁
            </div>

            <div>
              <h2>Admission Documents</h2>

              <p>
                Your securely stored admission documents
              </p>
            </div>

          </div>

          {/* DOCUMENT LOADING */}

          {documentLoading && (

            <p className="document-message">
              Loading admission documents...
            </p>

          )}

          {/* DOCUMENT ERROR */}

          {documentError && (

            <div className="document-error">

              <p>{documentError}</p>

              <button
                type="button"
                className="profile-retry-btn"
                onClick={() => loadDocuments(student.admission_id)}
              >
                Retry Documents
              </button>

            </div>

          )}

          {/* DOCUMENTS */}

          {!documentLoading && !documentError && (

            <div className="profile-documents-grid">

              {/* STUDENT PHOTOGRAPH */}

              <div className="profile-document-card">

                <div className="document-icon">
                  🖼️
                </div>

                <div className="document-content">

                  <h3>Student Photograph</h3>

                  {documents?.student_photo_url ? (

                    <>
                      <p>
                        Admission photo available
                      </p>

                      <a
                        href={documents.student_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-action"
                      >
                        View Photo
                      </a>
                    </>

                  ) : (

                    <p>Photo not available</p>

                  )}

                </div>

              </div>

              {/* PREVIOUS MARKSHEET */}

              <div className="profile-document-card">

                <div className="document-icon pdf-icon">
                  📄
                </div>

                <div className="document-content">

                  <h3>Previous Marksheet</h3>

                  {documents?.previous_marksheet_url ? (

                    <>
                      <p>
                        PDF document available
                      </p>

                      <div className="document-actions">

                        <a
                          href={documents.previous_marksheet_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-action"
                        >
                          View PDF
                        </a>

                        <a
                          href={documents.previous_marksheet_url}
                          download="previous-marksheet.pdf"
                          className="document-download"
                        >
                          Download
                        </a>

                      </div>
                    </>

                  ) : (

                    <p>Marksheet not available</p>

                  )}

                </div>

              </div>

            </div>

          )}

          {/* NO ADMISSION LINKED */}

          {!student.admission_id && (

            <p className="document-message">
              No admission application is linked to this profile.
            </p>

          )}

        </section>

        {/* FOOTER */}

        <footer className="profile-footer">

          🎓 Keep your profile information accurate and up to date.

        </footer>

      </div>

    </main>
  );
}

// ==========================================
// REUSABLE PROFILE FIELD
// ==========================================

function ProfileField({ label, value, wide = false }) {

  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (

    <div
      className={`profile-field ${
        wide ? "profile-field-wide" : ""
      }`}
    >

      <span className="profile-field-label">
        {label}
      </span>

      <strong
        className={
          hasValue ? "" : "profile-value-missing"
        }
      >
        {hasValue ? value : "Not provided"}
      </strong>

    </div>

  );
}

export default StudentProfile;
