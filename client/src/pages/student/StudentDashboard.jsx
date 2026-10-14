
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStudentProfile } from "../../services/studentService";
// import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);

  // -----------------------------------
  // Load only student profile
  // -----------------------------------
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

      setError(
        err.message || "Unable to load student information."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Open feature popup
  // -----------------------------------
  const openFeaturePopup = (feature) => {
    setSelectedFeature(feature);
  };

  // -----------------------------------
  // Close popup
  // -----------------------------------
  const closeFeaturePopup = () => {
    setSelectedFeature(null);
  };

  // -----------------------------------
  // Open selected page
  // API will be called by that page
  // -----------------------------------
  const handleOpenFeature = () => {
    if (!selectedFeature?.path) return;

    const path = selectedFeature.path;

    setSelectedFeature(null);

    navigate(path);
  };

  // -----------------------------------
  // Loading
  // -----------------------------------
  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading student dashboard...</p>
      </div>
    );
  }

  // -----------------------------------
  // Error
  // -----------------------------------
  if (error) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">⚠️</div>

        <h2>Unable to Load Dashboard</h2>

        <p>{error}</p>

        <button
          className="retry-btn"
          onClick={loadStudentProfile}
        >
          Try Again
        </button>
      </div>
    );
  }

  // -----------------------------------
  // No student data
  // -----------------------------------
  if (!student) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">👤</div>

        <h2>Student Information Not Found</h2>

        <p>
          We could not find your student profile.
        </p>

        <button
          className="retry-btn"
          onClick={loadStudentProfile}
        >
          Try Again
        </button>
      </div>
    );
  }

  // -----------------------------------
  // Student name
  // -----------------------------------
  const fullName =
    `${student.first_name || ""} ${
      student.last_name || ""
    }`.trim() ||
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
            DASHBOARD HEADER
        ====================================== */}
        <section className="dashboard-header">
          <div className="dashboard-header-content">
            <p className="dashboard-welcome">
              Welcome back 👋
            </p>

            <h1>{fullName}</h1>

            <p className="dashboard-subtitle">
              Manage your academic activities from
              your student portal.
            </p>
          </div>

          {/* <button
            className="profile-btn"
            onClick={() =>
              openFeaturePopup({
                title: "My Profile",
                description:
                  "View your personal and academic profile information.",
                icon: "👤",
                path: "/student/profile",
              })
            }
          >
            View Profile h
          </button> */}
        </section>

        {/* =====================================
            STUDENT OVERVIEW
        ====================================== */}
        <section className="student-overview">

          <div className="student-avatar">
            {firstLetter}
          </div>

          <div className="student-basic-info">
            <h2>{fullName}</h2>

            <div className="student-meta">

              <span>
                Student ID:
                <strong>
                  {student.student_id || "N/A"}
                </strong>
              </span>

              <span>
                Class:
                <strong>
                  {student.school_class || "N/A"}
                </strong>
              </span>

              <span>
                Section:
                <strong>
                  {student.section || "N/A"}
                </strong>
              </span>

            </div>
          </div>
        </section>

        {/* =====================================
            ACADEMIC OVERVIEW
        ====================================== */}
        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Academic Overview</h2>

              <p>
                Access your academic information
              </p>
            </div>
          </div>

          <div className="dashboard-cards">

            {/* Attendance */}
            <DashboardCard
              icon="📅"
              title="Attendance"
              description="View your attendance record"
              className="attendance-card"
              onClick={() =>
                openFeaturePopup({
                  title: "Attendance",
                  description:
                    "View your complete attendance record, present days and absent days.",
                  icon: "📅",
                  path: "/student/attendance",
                })
              }
            />

            {/* Timetable */}
            <DashboardCard
              icon="🕐"
              title="Timetable"
              description="Check your class schedule"
              className="timetable-card"
              onClick={() =>
                openFeaturePopup({
                  title: "Timetable",
                  description:
                    "Check your daily and weekly class timetable.",
                  icon: "🕐",
                  path: "/student/timetable",
                })
              }
            />

            {/* Homework */}
            <DashboardCard
              icon="📝"
              title="Homework"
              description="View your assignments"
              className="homework-card"
              onClick={() =>
                openFeaturePopup({
                  title: "Homework",
                  description:
                    "View your assignments, due dates and submit your homework.",
                  icon: "📝",
                  path: "/student/homework",
                })
              }
            />

            {/* Results */}
            <DashboardCard
              icon="📊"
              title="Results"
              description="Check your exam results"
              className="results-card"
              onClick={() =>
                openFeaturePopup({
                  title: "Results",
                  description:
                    "View your examination marks, subjects and result details.",
                  icon: "📊",
                  path: "/student/results",
                })
              }
            />

            {/* Fees */}
            <DashboardCard
              icon="💳"
              title="Fees"
              description="View fees and payments"
              className="fees-card"
              onClick={() =>
                openFeaturePopup({
                  title: "Fees",
                  description:
                    "View your fee details, payments and payment history.",
                  icon: "💳",
                  path: "/student/fees",
                })
              }
            />

            {/* Profile */}
            <DashboardCard
              icon="👤"
              title="My Profile"
              description="View your profile"
              className="profile-card"
              onClick={() =>
                openFeaturePopup({
                  title: "My Profile",
                  description:
                    "View your personal and academic information.",
                  icon: "👤",
                  path: "/student/profile",
                })
              }
            />

          </div>
        </section>

        {/* =====================================
            QUICK ACCESS + STUDENT INFORMATION
        ====================================== */}
        <section className="dashboard-grid">

          {/* Quick Access */}
          <div className="dashboard-panel">

            <div className="panel-header">
              <div>
                <h2>Quick Access</h2>

                <p>
                  Frequently used student services
                </p>
              </div>
            </div>

            <div className="quick-actions">

              <button
                onClick={() =>
                  openFeaturePopup({
                    title: "Attendance",
                    description:
                      "View your complete attendance record.",
                    icon: "📅",
                    path: "/student/attendance",
                  })
                }
              >
                <span>📅</span>
                <div>
                  <strong>Attendance</strong>
                  <small>View attendance</small>
                </div>
                <b>→</b>
              </button>

              <button
                onClick={() =>
                  openFeaturePopup({
                    title: "Timetable",
                    description:
                      "Check your class schedule.",
                    icon: "🕐",
                    path: "/student/timetable",
                  })
                }
              >
                <span>🕐</span>
                <div>
                  <strong>Timetable</strong>
                  <small>View schedule</small>
                </div>
                <b>→</b>
              </button>

              <button
                onClick={() =>
                  openFeaturePopup({
                    title: "Homework",
                    description:
                      "View and submit your assignments.",
                    icon: "📝",
                    path: "/student/homework",
                  })
                }
              >
                <span>📝</span>
                <div>
                  <strong>Homework</strong>
                  <small>View assignments</small>
                </div>
                <b>→</b>
              </button>

              <button
                onClick={() =>
                  openFeaturePopup({
                    title: "Results",
                    description:
                      "View your examination results.",
                    icon: "📊",
                    path: "/student/results",
                  })
                }
              >
                <span>📊</span>
                <div>
                  <strong>Results</strong>
                  <small>View marks</small>
                </div>
                <b>→</b>
              </button>

            </div>
          </div>

          {/* Student Information */}
          <div className="dashboard-panel">

            <div className="panel-header">
              <div>
                <h2>Student Information</h2>

                <p>
                  Your basic academic details
                </p>
              </div>
            </div>

            <div className="information-list">

              <InfoRow
                label="Student ID"
                value={
                  student.student_id || "N/A"
                }
              />

              <InfoRow
                label="Class"
                value={
                  student.school_class || "N/A"
                }
              />

              <InfoRow
                label="Section"
                value={
                  student.section || "N/A"
                }
              />

              <InfoRow
                label="Email"
                value={
                  student.email || "N/A"
                }
              />

              <InfoRow
                label="Phone"
                value={
                  student.phone || "N/A"
                }
              />

            </div>

            {/*  */}

          </div>

        </section>

        {/* =====================================
            NOTICE
        ====================================== */}
        <section className="dashboard-notice">

          <div className="notice-icon">
            🔔
          </div>

          <div>
            <h3>Stay Updated</h3>

            <p>
              Check your timetable, homework,
              attendance and examination results
              regularly.
            </p>
          </div>

        </section>

      </div>

      {/* =====================================
          FEATURE POPUP / MODAL
      ====================================== */}
      {selectedFeature && (
        <div
          className="feature-modal-overlay"
          onClick={closeFeaturePopup}
        >
          <div
            className="feature-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close */}
            <button
              className="modal-close"
              onClick={closeFeaturePopup}
              aria-label="Close"
            >
              ×
            </button>

            {/* Icon */}
            <div className="modal-icon">
              {selectedFeature.icon}
            </div>

            {/* Title */}
            <h2>
              {selectedFeature.title}
            </h2>

            {/* Description */}
            <p>
              {selectedFeature.description}
            </p>

            {/* Actions */}
            <div className="modal-actions">

              <button
                className="modal-cancel-btn"
                onClick={closeFeaturePopup}
              >
                Cancel
              </button>

              <button
                className="modal-view-btn"
                onClick={handleOpenFeature}
              >
                View Details →
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* =========================================
   DASHBOARD CARD
========================================= */

function DashboardCard({
  icon,
  title,
  description,
  onClick,
  className = "",
}) {
  return (
    <button
      className={`dashboard-card ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className="card-icon">
        {icon}
      </div>

      <div className="card-content">
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <span className="card-arrow">
        →
      </span>
    </button>
  );
}

/* =========================================
   INFORMATION ROW
========================================= */

function InfoRow({ label, value }) {
  return (
    <div className="information-row">

      <span>{label}</span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default StudentDashboard;