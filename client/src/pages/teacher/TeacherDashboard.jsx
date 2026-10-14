
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const employeeId = localStorage.getItem("employee_id");
    const token = localStorage.getItem("access_token");

    if (!token || !employeeId) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await teacherService.getTeacherDashboard(employeeId);


        setDashboard(response.data || response);
      } catch (error) {


        setError(
          error.message || "Unable to load teacher dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // -----------------------------------------------
  // LOADING
  // -----------------------------------------------

  if (loading) {
    return (
      <div style={styles.center}>
        <h3>Loading Teacher Dashboard...</h3>
      </div>
    );
  }

  // -----------------------------------------------
  // ERROR
  // -----------------------------------------------

  if (error) {
    return (
      <div style={styles.errorBox}>
        <h3>Something went wrong</h3>
        <p>{error}</p>

        <button
          onClick={() => window.location.reload()}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------------------
  // DATA
  // -----------------------------------------------

  const statistics = dashboard?.statistics || {};

  const attendance = statistics.todayAttendance || {};

  const assignments = statistics.assignmentSubmissions || {};

  const examMarks = statistics.examMarks || {};

  const assignedClasses = dashboard?.assignedClasses || [];

  // -----------------------------------------------
  // DASHBOARD
  // -----------------------------------------------

  return (
    <div style={styles.container}>

      {/* ============================================
          HEADER
      ============================================ */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Teacher Dashboard
          </h1>

          <p style={styles.subtitle}>
            Welcome back,{" "}
            <strong>
              {dashboard?.teacher?.name ||
                localStorage.getItem("username") ||
                "Teacher"}
            </strong>
          </p>
        </div>

        <div style={styles.dateBox}>
          <span>Today</span>
          <strong>
            {dashboard?.date || "-"}
          </strong>
        </div>
      </div>

      {/* ============================================
          STAT CARDS
      ============================================ */}

      <div style={styles.cardGrid}>

        <DashboardCard
          title="Assigned Classes"
          value={statistics.totalAssignedClasses ?? 0}
        />

        <DashboardCard
          title="Total Students"
          value={statistics.totalStudents ?? 0}
        />

        <DashboardCard
          title="Assignments"
          value={statistics.totalAssignments ?? 0}
        />

        <DashboardCard
          title="Students Marked"
          value={examMarks.studentsMarked ?? 0}
        />

      </div>

      {/* ============================================
          ATTENDANCE
      ============================================ */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Today's Attendance
        </h2>

        <div style={styles.attendanceGrid}>

          <InfoCard
            title="Present"
            value={attendance.present ?? 0}
          />

          <InfoCard
            title="Absent"
            value={attendance.absent ?? 0}
          />

          <InfoCard
            title="Total"
            value={attendance.total ?? 0}
          />

          <InfoCard
            title="Attendance"
            value={`${attendance.percentage ?? 0}%`}
          />

        </div>

      </div>

      {/* ============================================
          QUICK ACTIONS
      ============================================ */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Quick Actions
        </h2>

        <div style={styles.actionGrid}>

          <button
            style={styles.actionButton}
            onClick={() =>
              navigate("/teacher/classes")
            }
          >
            <span style={styles.actionIcon}>
              👨‍🎓
            </span>
            My Classes
          </button>

          <button
            style={styles.actionButton}
            onClick={() =>
              navigate("/teacher/attendance")
            }
          >
            <span style={styles.actionIcon}>
              ✓
            </span>
            Mark Attendance
          </button>

          <button
            style={styles.actionButton}
            onClick={() =>
              navigate("/teacher/marks")
            }
          >
            <span style={styles.actionIcon}>
              📝
            </span>
            Upload Marks
          </button>

          <button
            style={styles.actionButton}
            onClick={() =>
              navigate("/teacher/assignments")
            }
          >
            <span style={styles.actionIcon}>
              📚
            </span>
            Assignments
          </button>

          <button
            style={styles.actionButton}
            onClick={() =>
              navigate("/teacher/timetable")
            }
          >
            <span style={styles.actionIcon}>
              🗓
            </span>
            Timetable
          </button>

        </div>

      </div>

      {/* ============================================
          ASSIGNED CLASSES
      ============================================ */}

      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <h2 style={styles.sectionTitle}>
            My Assigned Classes
          </h2>

          <span style={styles.countBadge}>
            {assignedClasses.length} Classes
          </span>

        </div>

        {assignedClasses.length === 0 ? (

          <div style={styles.emptyBox}>
            No classes assigned yet.
          </div>

        ) : (

          <div style={styles.classGrid}>

            {assignedClasses.map((item) => (

              <div
                key={item.allocationId}
                style={styles.classCard}
              >

                <div style={styles.classHeader}>

                  <div>
                    <h3 style={styles.className}>
                      {item.class?.name || "-"}
                    </h3>

                    <p style={styles.sectionName}>
                      Section {item.section?.name || "-"}
                    </p>
                  </div>

                  <span style={styles.subjectBadge}>
                    {item.subject?.code || "-"}
                  </span>

                </div>

                <div style={styles.divider} />

                <div style={styles.detailRow}>
                  <span>Subject</span>

                  <strong>
                    {item.subject?.name || "-"}
                  </strong>
                </div>

                <div style={styles.detailRow}>
                  <span>Students</span>

                  <strong>
                    {item.studentCount ?? 0}
                  </strong>
                </div>

                <div style={styles.detailRow}>
                  <span>Present Today</span>

                  <strong>
                    {item.todayAttendance?.present ?? 0}
                  </strong>
                </div>

                <div style={styles.detailRow}>
                  <span>Absent Today</span>

                  <strong>
                    {item.todayAttendance?.absent ?? 0}
                  </strong>
                </div>

                <button
                  style={styles.viewButton}
                  onClick={() =>
                    navigate("/teacher/classes")
                  }
                >
                  View Students
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ============================================
          ASSIGNMENT & EXAM SUMMARY
      ============================================ */}

      <div style={styles.summaryGrid}>

        {/* Assignments */}

        <div style={styles.summaryCard}>

          <h2 style={styles.summaryTitle}>
            Assignment Summary
          </h2>

          <div style={styles.summaryRows}>

            <div style={styles.summaryRow}>
              <span>Total Submissions</span>
              <strong>
                {assignments.total ?? 0}
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Pending Review</span>
              <strong>
                {assignments.pending ?? 0}
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Reviewed</span>
              <strong>
                {assignments.reviewed ?? 0}
              </strong>
            </div>

          </div>

          <button
            style={styles.secondaryButton}
            onClick={() =>
              navigate("/teacher/assignments")
            }
          >
            Manage Assignments
          </button>

        </div>

        {/* Exam Marks */}

        <div style={styles.summaryCard}>

          <h2 style={styles.summaryTitle}>
            Exam Marks
          </h2>

          <div style={styles.summaryRows}>

            <div style={styles.summaryRow}>
              <span>Total Marks Entries</span>
              <strong>
                {examMarks.totalMarks ?? 0}
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Students Marked</span>
              <strong>
                {examMarks.studentsMarked ?? 0}
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Exams</span>
              <strong>
                {examMarks.exams ?? 0}
              </strong>
            </div>

          </div>

          <button
            style={styles.secondaryButton}
            onClick={() =>
              navigate("/teacher/marks")
            }
          >
            Manage Marks
          </button>

        </div>

      </div>

      {/* ============================================
          RECENT ASSIGNMENTS
      ============================================ */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Recent Assignments
        </h2>

        {dashboard?.recentAssignments?.length > 0 ? (

          <div style={styles.assignmentList}>

            {dashboard.recentAssignments.map(
              (assignment) => (

                <div
                  key={assignment.id}
                  style={styles.assignmentItem}
                >

                  <div>

                    <h3 style={styles.assignmentTitle}>
                      {assignment.title}
                    </h3>

                    <p style={styles.assignmentMeta}>
                      {assignment.school_class__name ||
                        "-"}{" "}
                      • Section{" "}
                      {assignment.section__name ||
                        "-"}{" "}
                      •{" "}
                      {assignment.subject__name ||
                        "-"}
                    </p>

                  </div>

                  <span style={styles.dueDate}>
                    Due: {assignment.due_date || "-"}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <div style={styles.emptyBox}>
            No assignments created yet.
          </div>

        )}

      </div>

    </div>
  );
}


// ==================================================
// DASHBOARD CARD
// ==================================================

function DashboardCard({ title, value }) {
  return (
    <div style={styles.card}>

      <p style={styles.cardTitle}>
        {title}
      </p>

      <h2 style={styles.cardValue}>
        {value}
      </h2>

    </div>
  );
}


// ==================================================
// INFO CARD
// ==================================================

function InfoCard({ title, value }) {
  return (
    <div style={styles.infoCard}>

      <p style={styles.infoTitle}>
        {title}
      </p>

      <h3 style={styles.infoValue}>
        {value}
      </h3>

    </div>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = {

  container: {
    width: "100%",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },

  errorBox: {
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    color: "#dc3545",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  retryButton: {
    marginTop: "15px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },

  header: {
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#212529",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6c757d",
  },

  dateBox: {
    backgroundColor: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
    color: "#6c757d",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    margin: 0,
    color: "#6c757d",
    fontSize: "14px",
  },

  cardValue: {
    marginTop: "10px",
    marginBottom: 0,
    fontSize: "30px",
    color: "#212529",
  },

  section: {
    marginTop: "30px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  sectionTitle: {
    fontSize: "20px",
    margin: 0,
    color: "#212529",
  },

  countBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#f1f3f5",
    color: "#495057",
    fontSize: "13px",
    fontWeight: "600",
  },

  attendanceGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  infoTitle: {
    margin: 0,
    color: "#6c757d",
    fontSize: "14px",
  },

  infoValue: {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "24px",
    color: "#212529",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  actionButton: {
    padding: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
    cursor: "pointer",
    fontWeight: "600",
    color: "#343a40",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  actionIcon: {
    fontSize: "18px",
  },

  classGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  classCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  classHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  className: {
    margin: 0,
    fontSize: "18px",
    color: "#212529",
  },

  sectionName: {
    margin: "5px 0 0",
    color: "#6c757d",
    fontSize: "14px",
  },

  subjectBadge: {
    padding: "5px 9px",
    borderRadius: "5px",
    backgroundColor: "#f1f3f5",
    fontSize: "12px",
    fontWeight: "700",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e9ecef",
    margin: "15px 0",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 0",
    fontSize: "14px",
    color: "#6c757d",
  },

  viewButton: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#212529",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#6c757d",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  summaryGrid: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  summaryTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "18px",
    color: "#212529",
  },

  summaryRows: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#6c757d",
    fontSize: "14px",
  },

  secondaryButton: {
    width: "100%",
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  assignmentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  assignmentItem: {
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "8px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  assignmentTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#212529",
  },

  assignmentMeta: {
    margin: "6px 0 0",
    color: "#6c757d",
    fontSize: "13px",
  },

  dueDate: {
    fontSize: "13px",
    color: "#6c757d",
    whiteSpace: "nowrap",
  },
};

