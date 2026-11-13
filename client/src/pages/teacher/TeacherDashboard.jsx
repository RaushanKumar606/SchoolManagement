

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import "./TeacherDashboard.css";

// =============================================
// QUICK ACTION CONFIGURATION
// =============================================

const QUICK_ACTIONS = [
  {
    title: "My Classes",
    description: "View students and subjects",
    icon: "👨‍🎓",
    path: "/teacher/my-courses",
    color: "blue",
  },
  {
    title: "Attendance",
    description: "Mark student attendance",
    icon: "✓",
    path: "/teacher/attendance",
    color: "green",
  },
  {
    title: "Upload Marks",
    description: "Manage exam marks",
    icon: "📝",
    path: "/teacher/marks",
    color: "purple",
  },
  {
    title: "Assignments",
    description: "Create and review work",
    icon: "📚",
    path: "/teacher/assignments",
    color: "orange",
  },
  {
    title: "Timetable",
    description: "Check your class schedule",
    icon: "🗓️",
    path: "/teacher/timetable",
    color: "cyan",
  },
];

// =============================================
// STAT CARD
// =============================================

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <article className={`teacher-stat-card ${color}`}>
      <div className="teacher-stat-top">
        <div className="teacher-stat-icon">{icon}</div>
        <span className="teacher-stat-indicator">Overview</span>
      </div>

      <div className="teacher-stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{subtitle}</span>
      </div>
    </article>
  );
}

// =============================================
// ATTENDANCE CARD
// =============================================

function AttendanceCard({ title, value, color, icon }) {
  return (
    <article className={`teacher-attendance-card ${color}`}>
      <div className="teacher-attendance-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </article>
  );
}

// =============================================
// EMPTY STATE
// =============================================

function EmptyState({ title, description }) {
  return (
    <div className="teacher-empty-state">
      <div className="teacher-empty-icon">📂</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// =============================================
// MAIN TEACHER DASHBOARD
// =============================================

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================================
  // LOAD DASHBOARD
  // =============================================

  const fetchDashboard = useCallback(async () => {
    const employeeId = localStorage.getItem("employee_id");
    const token = localStorage.getItem("access_token");

    if (!token || !employeeId) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await teacherService.getTeacherDashboard(employeeId);

      setDashboard(response?.data || response);
    } catch (err) {
      console.error("Teacher dashboard error:", err);

      setError(
        err?.message || "Unable to load teacher dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // =============================================
  // LOADING
  // =============================================

  if (loading) {
    return (
      <main className="teacher-dashboard-page">
        <div className="teacher-dashboard-loading">
          <div className="teacher-loader"></div>
          <h3>Loading Teacher Dashboard</h3>
          <p>Preparing your academic overview...</p>
        </div>
      </main>
    );
  }

  // =============================================
  // ERROR
  // =============================================

  if (error) {
    return (
      <main className="teacher-dashboard-page">
        <div className="teacher-dashboard-error">
          <div className="teacher-error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={fetchDashboard}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // =============================================
  // DASHBOARD DATA
  // =============================================

  const statistics = dashboard?.statistics || {};

  const attendance = statistics.todayAttendance || {};
  const assignments = statistics.assignmentSubmissions || {};
  const examMarks = statistics.examMarks || {};

  const assignedClasses = Array.isArray(dashboard?.assignedClasses)
    ? dashboard.assignedClasses
    : [];

  const recentAssignments = Array.isArray(
    dashboard?.recentAssignments
  )
    ? dashboard.recentAssignments
    : [];

  const teacherName =
    dashboard?.teacher?.name ||
    localStorage.getItem("username") ||
    "Teacher";

  const attendancePercentage = Math.min(
    100,
    Math.max(0, Number(attendance.percentage) || 0)
  );

  // =============================================
  // DASHBOARD UI
  // =============================================

  return (
    <main className="teacher-dashboard-page">

      {/* =========================================
          WELCOME HEADER
      ========================================= */}

      <section className="teacher-welcome-header">
        <div className="teacher-welcome-content">
          <span className="teacher-welcome-eyebrow">
            TEACHER ACADEMIC PORTAL
          </span>

          <h1>
            Welcome back, {teacherName}!
          </h1>

          <p>
            Here's what's happening in your classroom today.
            Manage your classes, attendance and academic activities.
          </p>
        </div>

        <div className="teacher-welcome-right">
          <div className="teacher-welcome-avatar">
            {teacherName.charAt(0).toUpperCase()}
          </div>

          <div className="teacher-date-box">
            <span>Today's Date</span>
            <strong>{dashboard?.date || "—"}</strong>
          </div>
        </div>

        <div className="teacher-header-decoration"></div>
      </section>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="teacher-stats-grid">

        <StatCard
          title="Assigned Classes"
          value={statistics.totalAssignedClasses ?? 0}
          icon="🏫"
          color="blue"
          subtitle="Your teaching classes"
        />

        <StatCard
          title="Total Students"
          value={statistics.totalStudents ?? 0}
          icon="👨‍🎓"
          color="purple"
          subtitle="Across assigned classes"
        />

        <StatCard
          title="Assignments"
          value={statistics.totalAssignments ?? 0}
          icon="📚"
          color="orange"
          subtitle="Created assignments"
        />

        <StatCard
          title="Students Marked"
          value={examMarks.studentsMarked ?? 0}
          icon="📝"
          color="green"
          subtitle="Exam marks entered"
        />

      </section>

      {/* =========================================
          ATTENDANCE OVERVIEW
      ========================================= */}

      <section className="teacher-dashboard-section">

        <div className="teacher-section-heading">
          <div>
            <span className="teacher-section-eyebrow">
              CLASSROOM MANAGEMENT
            </span>
            <h2>Today's Attendance</h2>
            <p>Overview of your students' attendance.</p>
          </div>

          <button
            className="teacher-section-link"
            onClick={() => navigate("/teacher/attendance")}
          >
            Manage Attendance →
          </button>
        </div>

        <div className="teacher-attendance-layout">

          <div className="teacher-attendance-grid">

            <AttendanceCard
              title="Present Students"
              value={attendance.present ?? 0}
              color="green"
              icon="✓"
            />

            <AttendanceCard
              title="Absent Students"
              value={attendance.absent ?? 0}
              color="red"
              icon="✕"
            />

            <AttendanceCard
              title="Total Students"
              value={attendance.total ?? 0}
              color="blue"
              icon="👥"
            />

          </div>

          <div className="teacher-attendance-progress-card">
            <div className="teacher-progress-heading">
              <div>
                <span>Attendance Rate</span>
                <h3>{attendancePercentage}%</h3>
              </div>
              <span className="teacher-progress-icon">📊</span>
            </div>

            <div className="teacher-progress-track">
              <div
                className="teacher-progress-fill"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>

            <p>
              {attendancePercentage}% of recorded students are present today.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <section className="teacher-dashboard-section">

        <div className="teacher-section-heading">
          <div>
            <span className="teacher-section-eyebrow">
              SHORTCUTS
            </span>
            <h2>Quick Actions</h2>
            <p>Access your frequently used modules.</p>
          </div>
        </div>

        <div className="teacher-quick-actions">

          {QUICK_ACTIONS.map((action) => (
            <button
              type="button"
              key={action.title}
              className={`teacher-action-card ${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <div className="teacher-action-top">
                <span className="teacher-action-icon">
                  {action.icon}
                </span>

                <span className="teacher-action-arrow">
                  ↗
                </span>
              </div>

              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </button>
          ))}

        </div>
      </section>

      {/* =========================================
          ASSIGNED CLASSES
      ========================================= */}

      <section className="teacher-dashboard-section">

        <div className="teacher-section-heading">
          <div>
            <span className="teacher-section-eyebrow">
              MY CLASSROOMS
            </span>
            <h2>My Assigned Classes</h2>
            <p>Classes and subjects assigned to you.</p>
          </div>

          <span className="teacher-count-badge">
            {assignedClasses.length} Classes
          </span>
        </div>

        {assignedClasses.length === 0 ? (

          <EmptyState
            title="No Classes Assigned"
            description="Your assigned classes will appear here once the school administrator allocates them."
          />

        ) : (

          <div className="teacher-class-grid">

            {assignedClasses.map((item) => (

              <article
                key={item.allocationId}
                className="teacher-class-card"
              >

                <div className="teacher-class-card-header">

                  <div className="teacher-class-symbol">
                    {item.class?.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <span className="teacher-subject-badge">
                    {item.subject?.code || "SUB"}
                  </span>

                </div>

                <h3>
                  {item.class?.name || "Class"}
                </h3>

                <p className="teacher-class-section">
                  Section {item.section?.name || "—"}
                </p>

                <div className="teacher-class-subject">
                  <span>SUBJECT</span>
                  <strong>{item.subject?.name || "—"}</strong>
                </div>

                <div className="teacher-class-divider"></div>

                <div className="teacher-class-stat-row">
                  <div>
                    <span>Total Students</span>
                    <strong>{item.studentCount ?? 0}</strong>
                  </div>

                  <div>
                    <span>Present Today</span>
                    <strong className="present-value">
                      {item.todayAttendance?.present ?? 0}
                    </strong>
                  </div>

                  <div>
                    <span>Absent Today</span>
                    <strong className="absent-value">
                      {item.todayAttendance?.absent ?? 0}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="teacher-view-class-button"
                  onClick={() => navigate("/teacher/classes")}
                >
                  View Students
                  <span>→</span>
                </button>

              </article>

            ))}

          </div>

        )}
      </section>

      {/* =========================================
          ASSIGNMENT AND EXAM SUMMARY
      ========================================= */}

      <section className="teacher-summary-grid">

        {/* ASSIGNMENT SUMMARY */}

        <article className="teacher-summary-card">

          <div className="teacher-summary-heading">
            <div className="teacher-summary-icon orange">
              📚
            </div>

            <div>
              <h2>Assignment Summary</h2>
              <p>Submission and review overview</p>
            </div>
          </div>

          <div className="teacher-summary-rows">

            <div>
              <span>Total Submissions</span>
              <strong>{assignments.total ?? 0}</strong>
            </div>

            <div>
              <span>Pending Review</span>
              <strong className="pending-value">
                {assignments.pending ?? 0}
              </strong>
            </div>

            <div>
              <span>Reviewed</span>
              <strong className="reviewed-value">
                {assignments.reviewed ?? 0}
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="teacher-summary-button"
            onClick={() => navigate("/teacher/assignments")}
          >
            Manage Assignments →
          </button>

        </article>

        {/* EXAM MARKS SUMMARY */}

        <article className="teacher-summary-card">

          <div className="teacher-summary-heading">
            <div className="teacher-summary-icon purple">
              📝
            </div>

            <div>
              <h2>Exam Marks</h2>
              <p>Examination marks overview</p>
            </div>
          </div>

          <div className="teacher-summary-rows">

            <div>
              <span>Total Marks Entries</span>
              <strong>{examMarks.totalMarks ?? 0}</strong>
            </div>

            <div>
              <span>Students Marked</span>
              <strong>{examMarks.studentsMarked ?? 0}</strong>
            </div>

            <div>
              <span>Total Exams</span>
              <strong>{examMarks.exams ?? 0}</strong>
            </div>

          </div>

          <button
            type="button"
            className="teacher-summary-button"
            onClick={() => navigate("/teacher/marks")}
          >
            Manage Marks →
          </button>

        </article>

      </section>

      {/* =========================================
          RECENT ASSIGNMENTS
      ========================================= */}

      <section className="teacher-dashboard-section">

        <div className="teacher-section-heading">
          <div>
            <span className="teacher-section-eyebrow">
              RECENT ACTIVITY
            </span>
            <h2>Recent Assignments</h2>
            <p>Your recently created assignments.</p>
          </div>

          <button
            className="teacher-section-link"
            onClick={() => navigate("/teacher/assignments")}
          >
            View All →
          </button>
        </div>

        {recentAssignments.length === 0 ? (

          <EmptyState
            title="No Recent Assignments"
            description="Your recently created assignments will appear here."
          />

        ) : (

          <div className="teacher-recent-assignment-list">

            {recentAssignments.map((assignment) => (

              <article
                className="teacher-recent-assignment"
                key={assignment.id}
              >

                <div className="teacher-assignment-icon">
                  📄
                </div>

                <div className="teacher-assignment-details">
                  <h3>{assignment.title || "Untitled Assignment"}</h3>

                  <p>
                    {assignment.school_class__name || "—"}
                    {" • "}
                    Section {assignment.section__name || "—"}
                    {" • "}
                    {assignment.subject__name || "—"}
                  </p>
                </div>

                <div className="teacher-assignment-due">
                  <span>Due Date</span>
                  <strong>{assignment.due_date || "—"}</strong>
                </div>

                <button
                  type="button"
                  className="teacher-assignment-arrow"
                  onClick={() => navigate("/teacher/assignments")}
                  aria-label="View assignments"
                >
                  →
                </button>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}

      <footer className="teacher-dashboard-footer">
        <span>Teacher Academic Portal</span>
        <span>School Management System</span>
      </footer>

    </main>
  );
}

