
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
// import { getMyStudentProfile } from "../../services/studentService"; 

// function StudentProfile() {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadStudentProfile();
//   }, []);

//   const loadStudentProfile = async () => {
//     try {
//       const data = await getMyStudentProfile();
//       setStudent(data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <p className="text-gray-500 font-medium">Loading profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 mx-auto max-w-lg mt-6 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
//         {error}
//       </div>
//     );
//   }

//   if (!student) {
//     return <p className="text-center text-gray-500 mt-6">Profile not found.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 font-sans">
//       {/* Back Link */}
//       <Link to="/student/dashboard" className="text-sm font-medium text-blue-600 hover:underline mb-4 inline-block">
//         ← Back to Dashboard
//       </Link>
      
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Full Student Profile</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Personal Details Card */}
//         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
//           <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Personal Information</h3>
//           <div className="space-y-2 text-sm text-gray-600">
//             <p><span className="font-medium text-gray-700">Name:</span> {student.first_name} {student.middle_name} {student.last_name}</p>
//             <p><span className="font-medium text-gray-700">Student ID:</span> {student.student_id}</p>
//             <p><span className="font-medium text-gray-700">Date of Birth:</span> {student.date_of_birth}</p>
//             <p><span className="font-medium text-gray-700">Gender:</span> {student.gender}</p>
//           </div>
//         </div>

//         {/* Academic Details Card */}
//         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
//           <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Academic Information</h3>
//           <div className="space-y-2 text-sm text-gray-600">
//             <p><span className="font-medium text-gray-700">Class:</span> {student.school_class}</p>
//             <p><span className="font-medium text-gray-700">Section:</span> {student.section}</p>
//             <p><span className="font-medium text-gray-700">Academic Year:</span> {student.academic_year}</p>
//           </div>
//         </div>

//         {/* Family Details Card */}
//         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm md:col-span-2">
//           <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Family & Contact Information</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
//             <p><span className="font-medium text-gray-700">Father's Name:</span> {student.father_name || "N/A"}</p>
//             <p><span className="font-medium text-gray-700">Mother's Name:</span> {student.mother_name || "N/A"}</p>
//             <p><span className="font-medium text-gray-700">Parent Phone:</span> {student.parent_phone || "N/A"}</p>
//             <p><span className="font-medium text-gray-700">Parent Email:</span> {student.parent_email || "N/A"}</p>
//             <p className="sm:col-span-2"><span className="font-medium text-gray-700">Address:</span> {student.address || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StudentProfile;







import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyStudentProfile } from "../../services/studentService";
import "./Student.css";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStudentProfile();
      setStudent(data);
    } catch (err) {
      console.error("Student profile error:", err);
      setError(err.message || "Unable to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-state">
        <div className="profile-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-state">
        <div className="profile-state-icon">⚠️</div>
        <h2>Unable to load profile</h2>
        <p>{error}</p>
        <button className="profile-retry-btn" onClick={loadStudentProfile}>
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="profile-state">
        <div className="profile-state-icon">👤</div>
        <h2>Profile not found</h2>
        <p>Your student profile could not be found.</p>
      </div>
    );
  }

  const fullName = [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ") || student.username || "Student";

  const firstLetter = fullName.charAt(0).toUpperCase();

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }
    return value;
  };

  const formatDate = (value) => {
    if (!value) return "Not provided";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="student-profile-page">
      <div className="student-profile-container">
        {/* Breadcrumb */}
        <nav className="profile-breadcrumb" aria-label="Breadcrumb">
          <Link to="/student/dashboard">Dashboard</Link>
          <span>/</span>
          <span>My Profile</span>
        </nav>

        {/* Profile Header */}
        <section className="profile-hero">
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {firstLetter}
            </div>

            <div className="profile-hero-info">
              <span className="profile-eyebrow">STUDENT PORTAL</span>
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
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </Link>
        </section>

        {/* Summary Cards */}
        <section className="profile-summary-grid">
          <div className="profile-summary-card">
            <div className="profile-summary-icon academic-icon">🎓</div>
            <div>
              <span>Class</span>
              <strong>{displayValue(student.school_class)}</strong>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-summary-icon section-icon">📚</div>
            <div>
              <span>Section</span>
              <strong>{displayValue(student.section)}</strong>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-summary-icon year-icon">📅</div>
            <div>
              <span>Academic Year</span>
              <strong>{displayValue(student.academic_year)}</strong>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="profile-info-card">
          <div className="profile-section-heading">
            <div className="profile-heading-icon personal-heading-icon">
              👤
            </div>
            <div>
              <h2>Personal Information</h2>
              <p>Your personal and identification details</p>
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
              value={student.parent_phone || "N/A"}
            />
          </div>
        </section>

        {/* Academic Information */}
        <section className="profile-info-card">
          <div className="profile-section-heading">
            <div className="profile-heading-icon academic-heading-icon">
              🎓
            </div>
            <div>
              <h2>Academic Information</h2>
              <p>Your current school and class details</p>
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

        {/* Family and Contact Information */}
        <section className="profile-info-card">
          <div className="profile-section-heading">
            <div className="profile-heading-icon family-heading-icon">
              👨‍👩‍👧
            </div>
            <div>
              <h2>Family & Contact Information</h2>
              <p>Parent and registered contact details</p>
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
              value={student.address}
              wide
            />
          </div>
        </section>

        <footer className="profile-footer">
          <span>🎓</span>
          Keep your profile information accurate and up to date.
        </footer>
      </div>
    </main>
  );
}

function ProfileField({ label, value, wide = false }) {
  const hasValue =
    value !== null && value !== undefined && value !== "";

  return (
    <div className={`profile-field ${wide ? "profile-field-wide" : ""}`}>
      <span className="profile-field-label">{label}</span>
      <strong className={hasValue ? "" : "profile-value-missing"}>
        {hasValue ? value : "Not provided"}
      </strong>
    </div>
  );
}

export default StudentProfile;
