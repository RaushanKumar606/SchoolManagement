
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMyStudentProfile } from "../../services/studentService";
// // import "./StudentDashboard.css";

// function StudentDashboard() {
//   const navigate = useNavigate();

//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedFeature, setSelectedFeature] = useState(null);

//   // -----------------------------------
//   // Load only student profile
//   // -----------------------------------
//   useEffect(() => {
//     loadStudentProfile();
//   }, []);

//   const loadStudentProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getMyStudentProfile();

//       setStudent(data);
//     } catch (err) {
//       console.error("Student profile error:", err);

//       setError(
//         err.message || "Unable to load student information."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------------------
//   // Open feature popup
//   // -----------------------------------
//   const openFeaturePopup = (feature) => {
//     setSelectedFeature(feature);
//   };

//   // -----------------------------------
//   // Close popup
//   // -----------------------------------
//   const closeFeaturePopup = () => {
//     setSelectedFeature(null);
//   };

//   // -----------------------------------
//   // Open selected page
//   // API will be called by that page
//   // -----------------------------------
//   const handleOpenFeature = () => {
//     if (!selectedFeature?.path) return;

//     const path = selectedFeature.path;

//     setSelectedFeature(null);

//     navigate(path);
//   };

//   // -----------------------------------
//   // Loading
//   // -----------------------------------
//   if (loading) {
//     return (
//       <div className="student-dashboard-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading student dashboard...</p>
//       </div>
//     );
//   }

//   // -----------------------------------
//   // Error
//   // -----------------------------------
//   if (error) {
//     return (
//       <div className="student-dashboard-error">
//         <div className="error-icon">⚠️</div>

//         <h2>Unable to Load Dashboard</h2>

//         <p>{error}</p>

//         <button
//           className="retry-btn"
//           onClick={loadStudentProfile}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // -----------------------------------
//   // No student data
//   // -----------------------------------
//   if (!student) {
//     return (
//       <div className="student-dashboard-error">
//         <div className="error-icon">👤</div>

//         <h2>Student Information Not Found</h2>

//         <p>
//           We could not find your student profile.
//         </p>

//         <button
//           className="retry-btn"
//           onClick={loadStudentProfile}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // -----------------------------------
//   // Student name
//   // -----------------------------------
//   const fullName =
//     `${student.first_name || ""} ${
//       student.last_name || ""
//     }`.trim() ||
//     student.username ||
//     "Student";

//   const firstLetter =
//     student.first_name?.charAt(0)?.toUpperCase() ||
//     student.username?.charAt(0)?.toUpperCase() ||
//     "S";

//   return (
//     <>
//       <div className="student-dashboard">

//         {/* =====================================
//             DASHBOARD HEADER
//         ====================================== */}
//         <section className="dashboard-header">
//           <div className="dashboard-header-content">
//             <p className="dashboard-welcome">
//               Welcome back 👋
//             </p>

//             <h1>{fullName}</h1>

//             <p className="dashboard-subtitle">
//               Manage your academic activities from
//               your student portal.
//             </p>
//           </div>

//           {/* <button
//             className="profile-btn"
//             onClick={() =>
//               openFeaturePopup({
//                 title: "My Profile",
//                 description:
//                   "View your personal and academic profile information.",
//                 icon: "👤",
//                 path: "/student/profile",
//               })
//             }
//           >
//             View Profile h
//           </button> */}
//         </section>

//         {/* =====================================
//             STUDENT OVERVIEW
//         ====================================== */}
//         <section className="student-overview">

//           <div className="student-avatar">
//             {firstLetter}
//           </div>

//           <div className="student-basic-info">
//             <h2>{fullName}</h2>

//             <div className="student-meta">

//               <span>
//                 Student ID:
//                 <strong>
//                   {student.student_id || "N/A"}
//                 </strong>
//               </span>

//               <span>
//                 Class:
//                 <strong>
//                   {student.school_class || "N/A"}
//                 </strong>
//               </span>

//               <span>
//                 Section:
//                 <strong>
//                   {student.section || "N/A"}
//                 </strong>
//               </span>

//             </div>
//           </div>
//         </section>

//         {/* =====================================
//             ACADEMIC OVERVIEW
//         ====================================== */}
//         <section className="dashboard-section">

//           <div className="section-heading">
//             <div>
//               <h2>Academic Overview</h2>

//               <p>
//                 Access your academic information
//               </p>
//             </div>
//           </div>

//           <div className="dashboard-cards">

//             {/* Attendance */}
//             <DashboardCard
//               icon="📅"
//               title="Attendance"
//               description="View your attendance record"
//               className="attendance-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "Attendance",
//                   description:
//                     "View your complete attendance record, present days and absent days.",
//                   icon: "📅",
//                   path: "/student/attendance",
//                 })
//               }
//             />

//             {/* Timetable */}
//             <DashboardCard
//               icon="🕐"
//               title="Timetable"
//               description="Check your class schedule"
//               className="timetable-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "Timetable",
//                   description:
//                     "Check your daily and weekly class timetable.",
//                   icon: "🕐",
//                   path: "/student/timetable",
//                 })
//               }
//             />

//             {/* Homework */}
//             <DashboardCard
//               icon="📝"
//               title="Homework"
//               description="View your assignments"
//               className="homework-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "Homework",
//                   description:
//                     "View your assignments, due dates and submit your homework.",
//                   icon: "📝",
//                   path: "/student/homework",
//                 })
//               }
//             />

//             {/* Results */}
//             <DashboardCard
//               icon="📊"
//               title="Results"
//               description="Check your exam results"
//               className="results-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "Results",
//                   description:
//                     "View your examination marks, subjects and result details.",
//                   icon: "📊",
//                   path: "/student/results",
//                 })
//               }
//             />

//             {/* Fees */}
//             <DashboardCard
//               icon="💳"
//               title="Fees"
//               description="View fees and payments"
//               className="fees-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "Fees",
//                   description:
//                     "View your fee details, payments and payment history.",
//                   icon: "💳",
//                   path: "/student/fees",
//                 })
//               }
//             />

//             {/* Profile */}
//             <DashboardCard
//               icon="👤"
//               title="My Profile"
//               description="View your profile"
//               className="profile-card"
//               onClick={() =>
//                 openFeaturePopup({
//                   title: "My Profile",
//                   description:
//                     "View your personal and academic information.",
//                   icon: "👤",
//                   path: "/student/profile",
//                 })
//               }
//             />

//           </div>
//         </section>

//         {/* =====================================
//             QUICK ACCESS + STUDENT INFORMATION
//         ====================================== */}
//         <section className="dashboard-grid">

//           {/* Quick Access */}
//           <div className="dashboard-panel">

//             <div className="panel-header">
//               <div>
//                 <h2>Quick Access</h2>

//                 <p>
//                   Frequently used student services
//                 </p>
//               </div>
//             </div>

//             <div className="quick-actions">

//               <button
//                 onClick={() =>
//                   openFeaturePopup({
//                     title: "Attendance",
//                     description:
//                       "View your complete attendance record.",
//                     icon: "📅",
//                     path: "/student/attendance",
//                   })
//                 }
//               >
//                 <span>📅</span>
//                 <div>
//                   <strong>Attendance</strong>
//                   <small>View attendance</small>
//                 </div>
//                 <b>→</b>
//               </button>

//               <button
//                 onClick={() =>
//                   openFeaturePopup({
//                     title: "Timetable",
//                     description:
//                       "Check your class schedule.",
//                     icon: "🕐",
//                     path: "/student/timetable",
//                   })
//                 }
//               >
//                 <span>🕐</span>
//                 <div>
//                   <strong>Timetable</strong>
//                   <small>View schedule</small>
//                 </div>
//                 <b>→</b>
//               </button>

//               <button
//                 onClick={() =>
//                   openFeaturePopup({
//                     title: "Homework",
//                     description:
//                       "View and submit your assignments.",
//                     icon: "📝",
//                     path: "/student/homework",
//                   })
//                 }
//               >
//                 <span>📝</span>
//                 <div>
//                   <strong>Homework</strong>
//                   <small>View assignments</small>
//                 </div>
//                 <b>→</b>
//               </button>

//               <button
//                 onClick={() =>
//                   openFeaturePopup({
//                     title: "Results",
//                     description:
//                       "View your examination results.",
//                     icon: "📊",
//                     path: "/student/results",
//                   })
//                 }
//               >
//                 <span>📊</span>
//                 <div>
//                   <strong>Results</strong>
//                   <small>View marks</small>
//                 </div>
//                 <b>→</b>
//               </button>

//             </div>
//           </div>

//           {/* Student Information */}
//           <div className="dashboard-panel">

//             <div className="panel-header">
//               <div>
//                 <h2>Student Information</h2>

//                 <p>
//                   Your basic academic details
//                 </p>
//               </div>
//             </div>

//             <div className="information-list">

//               <InfoRow
//                 label="Student ID"
//                 value={
//                   student.student_id || "N/A"
//                 }
//               />

//               <InfoRow
//                 label="Class"
//                 value={
//                   student.school_class || "N/A"
//                 }
//               />

//               <InfoRow
//                 label="Section"
//                 value={
//                   student.section || "N/A"
//                 }
//               />

//               <InfoRow
//                 label="Email"
//                 value={
//                   student.email || "N/A"
//                 }
//               />

//               <InfoRow
//                 label="Phone"
//                 value={
//                   student.phone || "N/A"
//                 }
//               />

//             </div>

//             {/*  */}

//           </div>

//         </section>

//         {/* =====================================
//             NOTICE
//         ====================================== */}
//         <section className="dashboard-notice">

//           <div className="notice-icon">
//             🔔
//           </div>

//           <div>
//             <h3>Stay Updated</h3>

//             <p>
//               Check your timetable, homework,
//               attendance and examination results
//               regularly.
//             </p>
//           </div>

//         </section>

//       </div>

//       {/* =====================================
//           FEATURE POPUP / MODAL
//       ====================================== */}
//       {selectedFeature && (
//         <div
//           className="feature-modal-overlay"
//           onClick={closeFeaturePopup}
//         >
//           <div
//             className="feature-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             {/* Close */}
//             <button
//               className="modal-close"
//               onClick={closeFeaturePopup}
//               aria-label="Close"
//             >
//               ×
//             </button>

//             {/* Icon */}
//             <div className="modal-icon">
//               {selectedFeature.icon}
//             </div>

//             {/* Title */}
//             <h2>
//               {selectedFeature.title}
//             </h2>

//             {/* Description */}
//             <p>
//               {selectedFeature.description}
//             </p>

//             {/* Actions */}
//             <div className="modal-actions">

//               <button
//                 className="modal-cancel-btn"
//                 onClick={closeFeaturePopup}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="modal-view-btn"
//                 onClick={handleOpenFeature}
//               >
//                 View Details →
//               </button>

//             </div>

//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* =========================================
//    DASHBOARD CARD
// ========================================= */

// function DashboardCard({
//   icon,
//   title,
//   description,
//   onClick,
//   className = "",
// }) {
//   return (
//     <button
//       className={`dashboard-card ${className}`}
//       onClick={onClick}
//       type="button"
//     >
//       <div className="card-icon">
//         {icon}
//       </div>

//       <div className="card-content">
//         <h3>{title}</h3>

//         <p>{description}</p>
//       </div>

//       <span className="card-arrow">
//         →
//       </span>
//     </button>
//   );
// }

// /* =========================================
//    INFORMATION ROW
// ========================================= */

// function InfoRow({ label, value }) {
//   return (
//     <div className="information-row">

//       <span>{label}</span>

//       <strong>
//         {value}
//       </strong>

//     </div>
//   );
// }

// export default StudentDashboard;









import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStudentProfile } from "../../services/studentService";
import "./Student.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);

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
      setError(err.message || "Unable to load student information.");
    } finally {
      setLoading(false);
    }
  };

  const openFeaturePopup = (feature) => {
    setSelectedFeature(feature);
  };

  const closeFeaturePopup = () => {
    setSelectedFeature(null);
  };

  const handleOpenFeature = () => {
    if (!selectedFeature?.path) return;
    const path = selectedFeature.path;
    setSelectedFeature(null);
    navigate(path);
  };

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Dashboard</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={loadStudentProfile}>
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">👤</div>
        <h2>Student Information Not Found</h2>
        <p>We could not find your student profile.</p>
        <button className="retry-btn" onClick={loadStudentProfile}>
          Try Again
        </button>
      </div>
    );
  }

  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    student.username ||
    "Student";

  const firstLetter =
    student.first_name?.charAt(0)?.toUpperCase() ||
    student.username?.charAt(0)?.toUpperCase() ||
    "S";

  return (
    <>
      <div className="student-dashboard">

        {/* =====================================
            TOP BAR / BANNER HEADER
        ====================================== */}
        <section className="dashboard-header">
          <div className="dashboard-header-content">
            <h1>
              Hello, {student.first_name || fullName}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Welcome back to your student dashboard
            </p>
          </div>

          <div className="dashboard-date-badge">
            <span className="badge-icon">📅</span>
            <div>
              <strong>Thu, 9 Oct 2025</strong>
              <small>Academic Year : 2025 - 2026</small>
            </div>
          </div>
        </section>

        {/* =====================================
            TOP METRICS CARDS GRID (4 CARDS)
        ====================================== */}
        <section className="metrics-grid">

           {/* Student Profile Box */}
          <div className="dashboard-panel student-profile-panel">
            <div className="student-card-banner">
              <div className="student-avatar-lg">{firstLetter}</div>
              <div className="student-banner-info">
                <h2>{fullName}</h2>
                <span className="student-id-tag">{student.student_id || "STU-00006"}</span>
                <span className="status-pill active-pill">● Active</span>
              </div>
            </div>

            <div className="student-details-grid">
              <div><span>Class</span><strong>{student.school_class || "Class 10"} | Section {student.section || "A"}</strong></div>
              <div><span>Academic Year</span><strong>{student.academic_year || "2026-2027"} </strong></div>
              <div><span>Parent</span><strong>{student.father_name || "N/A"}</strong></div>
              <div><span>Phone</span><strong>{student.parent_phone || "N/A"}</strong></div>
            </div>

            <button 
              className="view-full-profile-btn"
              onClick={() => openFeaturePopup({ title: "My Profile", description: "View your personal and academic information.", icon: "👤", path: "/student/profile" })}
            >
              View Full Profile →
            </button>
          </div>
          
          {/* Attendance Metric Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Attendance", description: "View your complete attendance record, present days and absent days.", icon: "📅", path: "/student/attendance" })}>
            <div className="metric-card-top">
              <div className="metric-icon attendance-bg">📅</div>
              <span className="metric-trend success">↑ 2% vs. last month</span>
            </div>
            <h3>Attendance</h3>
            <div className="metric-value">92%</div>
            <p className="metric-subtext">Present Days: 46 / 50</p>
          </div>

          {/* Pending Fees Metric Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Fees", description: "View your fee details, payments and payment history.", icon: "💳", path: "/student/fees" })}>
            <div className="metric-card-top">
              <div className="metric-icon fees-bg">₹</div>
              <button className="pay-now-badge-btn">Pay Now →</button>
            </div>
            <h3>Pending Fees</h3>
            <div className="metric-value">₹ 5,000</div>
            <p className="metric-subtext">Next Due: 15 Oct 2025</p>
          </div>

          {/* Pending Assignments Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Homework", description: "View your assignments, due dates and submit your homework.", icon: "📝", path: "/student/homework" })}>
            <div className="metric-card-top">
              <div className="metric-icon homework-bg">📝</div>
              <span className="link-text">View All →</span>
            </div>
            <h3>Pending Assignments</h3>
            <div className="metric-value">2</div>
            <p className="metric-subtext invisible">Active assignments</p>
          </div>

          {/* Latest Result Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Results", description: "View your examination marks, subjects and result details.", icon: "📊", path: "/student/results" })}>
            <div className="metric-card-top">
              <div className="metric-icon results-bg">🏆</div>
              <span className="link-text">View Result →</span>
            </div>
            <h3>Latest Result</h3>
            <div className="metric-value">84.5%</div>
            <p className="metric-subtext">Class 10 - Annual Exam</p>
          </div>

        </section>

        {/* =====================================
            STUDENT PROFILE SUMMARY & LIVE CLASSES / NOTICES
        ====================================== */}
        <section className="dashboard-middle-grid">

          {/* Today's Classes Panel */}
          <div className="dashboard-panel todays-classes-panel">
            <div className="panel-header-inline">
              <h2>Today's Classes</h2>
              <button className="text-btn" onClick={() => navigate("/student/timetable")}>View Timetable →</button>
            </div>

            <div className="classes-list">
              <div className="class-row">
                <span className="class-no">1</span>
                <span className="class-time">08:00 - 09:00</span>
                <span className="class-name">Mathematics</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge live-badge">● Live</span>
              </div>
              <div className="class-row">
                <span className="class-no">2</span>
                <span className="class-time">09:00 - 10:00</span>
                <span className="class-name">Science</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">3</span>
                <span className="class-time">10:00 - 11:00</span>
                <span className="class-name">English</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">4</span>
                <span className="class-time">11:00 - 12:00</span>
                <span className="class-name">Social Science</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">5</span>
                <span className="class-time">12:00 - 01:00</span>
                <span className="class-name">Computer</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge pending-badge">Pending</span>
              </div>
            </div>
          </div>

          {/* Recent Notices Panel */}
          <div className="dashboard-panel notices-panel">
            <div className="panel-header-inline">
              <h2>Recent Notices</h2>
              <span className="text-btn">View All →</span>
            </div>

            <div className="notices-list">
              <div className="notice-item">
                <span className="notice-dot blue"></span>
                <div>
                  <p>School will remain closed on 12 Oct 2025 due to local holiday.</p>
                  <small>09 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot orange"></span>
                <div>
                  <p>Internal exam schedule has been updated.</p>
                  <small>08 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot red"></span>
                <div>
                  <p>Fee payment reminder for October 2025.</p>
                  <small>05 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot blue"></span>
                <div>
                  <p>PTM will be held on 18 Oct 2025.</p>
                  <small>03 Oct 2025</small>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* =====================================
            ANALYTICS, FEES & QUICK LINKS GRID
        ====================================== */}
        <section className="dashboard-lower-grid">

          {/* Academic Performance Table */}
          <div className="dashboard-panel performance-panel">
            <div className="panel-header-inline">
              <h2>Academic Performance</h2>
              <button className="text-btn" onClick={() => navigate("/student/results")}>View All Results →</button>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Mathematics</td><td><strong>85</strong> / 100</td><td><span className="grade-pill green">A</span></td></tr>
                <tr><td>Science</td><td><strong>78</strong> / 100</td><td><span className="grade-pill yellow">B+</span></td></tr>
                <tr><td>English</td><td><strong>88</strong> / 100</td><td><span className="grade-pill green">A</span></td></tr>
                <tr><td>Social Science</td><td><strong>82</strong> / 100</td><td><span className="grade-pill green">A-</span></td></tr>
                <tr><td>Computer</td><td><strong>90</strong> / 100</td><td><span className="grade-pill green">A+</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* Fees & Payments Table */}
          <div className="dashboard-panel fees-panel">
            <div className="panel-header-inline">
              <h2>Fees & Payments</h2>
              <button className="text-btn" onClick={() => navigate("/student/fees")}>View All →</button>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tuition Fee (July 2025)</td><td>₹ 5,000</td><td><span className="status-badge paid">Paid</span></td></tr>
                <tr><td>Tuition Fee (Aug 2025)</td><td>₹ 5,000</td><td><span className="status-badge paid">Paid</span></td></tr>
                <tr><td>Tuition Fee (Sep 2025)</td><td>₹ 5,000</td><td><span className="status-badge paid">Paid</span></td></tr>
                <tr><td>Tuition Fee (Oct 2025)</td><td>₹ 5,000</td><td><span className="status-badge pending">Pending</span></td></tr>
              </tbody>
            </table>
            <button className="primary-pay-btn" onClick={() => navigate("/student/fees")}>💳 Pay Now</button>
          </div>

          {/* Quick Links Grid */}
          <div className="dashboard-panel quick-links-panel">
            <div className="panel-header">
              <h2>Quick Links</h2>
            </div>
            <div className="quick-links-grid">
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Library", description: "Access school library books and digital resources.", icon: "📚", path: "/student/library" })}>
                <span className="tile-icon">📚</span>
                <span>Library</span>
              </button>
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Transport", description: "View bus routes, pickup points and vehicle details.", icon: "🚌", path: "/student/transport" })}>
                <span className="tile-icon">🚌</span>
                <span>Transport</span>
              </button>
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Timetable", description: "Check your daily and weekly class timetable.", icon: "📅", path: "/student/timetable" })}>
                <span className="tile-icon">📅</span>
                <span>Timetable</span>
              </button>
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Messages", description: "Communicate with teachers and school administration.", icon: "💬", path: "/student/messages" })}>
                <span className="tile-icon">💬</span>
                <span>Messages</span>
              </button>
            </div>
          </div>

        </section>

      </div>

      {/* =====================================
          FEATURE POPUP / MODAL
      ====================================== */}
      {selectedFeature && (
        <div className="feature-modal-overlay" onClick={closeFeaturePopup}>
          <div className="feature-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={closeFeaturePopup} aria-label="Close">×</button>
            <div className="modal-icon">{selectedFeature.icon}</div>
            <h2>{selectedFeature.title}</h2>
            <p>{selectedFeature.description}</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={closeFeaturePopup}>Cancel</button>
              <button className="modal-view-btn" onClick={handleOpenFeature}>View Details →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;