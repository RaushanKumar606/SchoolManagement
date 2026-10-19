
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

function TeacherClasses() {
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentError, setStudentError] = useState("");

  // ==================================================
  // LOAD ASSIGNED CLASSES AND SUBJECTS
  // ==================================================

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const employeeId = localStorage.getItem("employee_id");

    if (!token || !employeeId) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const loadClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await teacherService.getMyCourses();
        const data = response?.data ?? response;

        // API response: { success: true, count: 2, courses: [...] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.courses)
          ? data.courses
          : Array.isArray(data?.data?.courses)
          ? data.data.courses
          : Array.isArray(data?.allocations)
          ? data.allocations
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (data?.success === false) {
          throw new Error(
            data?.error || data?.message || "Unable to load assigned courses."
          );
        }

        if (active) {
          setAllocations(list);
        }
      } catch (err) {
        console.error("Teacher Classes Error:", err);

        if (active) {
          setError(
            err.message || "Unable to load assigned classes."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadClasses();

    return () => {
      active = false;
    };
  }, [navigate]);

  // ==================================================
  // GET CLASS / SECTION / SUBJECT VALUES
  // ==================================================

  const getClassName = (item) =>
    item?.school_class?.name ||
    item?.class?.name ||
    item?.class_name ||
    "-";

  const getSectionName = (item) =>
    item?.section?.name ||
    item?.section_name ||
    (typeof item?.section === "string" ? item.section : "") ||
    "-";

  const getSubjectName = (item) =>
    item?.subject?.name ||
    item?.subject_name ||
    (typeof item?.subject === "string" ? item.subject : "") ||
    "-";

  const getAcademicYear = (item) =>
    item?.academic_year?.name ||
    item?.academic_year ||
    item?.school_class?.academic_year?.name ||
    "Not specified";

  // ==================================================
  // LOAD STUDENTS
  // ==================================================

  const handleViewStudents = async (allocation) => {
    try {
      setSelectedClass(allocation);
      setStudents([]);
      setStudentsLoading(true);
      setStudentError("");

      const employeeId = localStorage.getItem("employee_id");

      if (!employeeId) {
        throw new Error("Employee ID not found. Please log in again.");
      }

      const className = getClassName(allocation);
      const sectionName = getSectionName(allocation);

      if (className === "-" || sectionName === "-") {
        throw new Error("Class or section information is missing.");
      }

      const response = await teacherService.getClassStudents(
        employeeId,
        className,
        sectionName
      );

      console.log("Class Students:", response);

      const data = response?.data ?? response;

      const studentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.students)
        ? data.students
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.data?.students)
        ? data.data.students
        : [];

      if (data?.success === false) {
        throw new Error(
          data?.error || data?.message || "Unable to load students."
        );
      }

      setStudents(studentList);
    } catch (err) {
      console.error("Load Students Error:", err);

      setStudentError(
        err.message || "Unable to load students."
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingSpinner} />
        <h3>Loading My Classes...</h3>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div style={styles.errorBox}>
        <h3>Unable to load courses</h3>
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

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Classes</h1>
          <p style={styles.subtitle}>
            Classes, sections and subjects assigned by the school admin.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/teacher/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryIcon}>📚</div>
        <div>
          <strong style={styles.summaryNumber}>
            {allocations.length}
          </strong>
          <p style={styles.summaryLabel}>Assigned Subjects</p>
        </div>
      </div>

      {/* COURSE CARDS */}
      {allocations.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📘</div>
          <h3>No Subjects Assigned</h3>
          <p>
            The school admin has not assigned any classes or subjects to you yet.
          </p>
        </div>
      ) : (
        <div style={styles.classGrid}>
          {allocations.map((item) => {
            const className = getClassName(item);
            const sectionName = getSectionName(item);
            const subjectName = getSubjectName(item);
            const academicYear = getAcademicYear(item);
            const subjectCode =
              item?.subject?.code || item?.subject_code || "";

            return (
              <article
                key={item.id}
                style={styles.classCard}
              >
                <div style={styles.cardTop}>
                  <div style={styles.courseIcon}>📖</div>

                  {subjectCode && (
                    <span style={styles.subjectCode}>
                      {subjectCode}
                    </span>
                  )}
                </div>

                <p style={styles.subjectLabel}>ASSIGNED SUBJECT</p>

                <h2 style={styles.subjectName}>
                  {subjectName}
                </h2>

                <div style={styles.divider} />

                <div style={styles.infoRow}>
                  <span>Class</span>
                  <strong>{className}</strong>
                </div>

                <div style={styles.infoRow}>
                  <span>Section</span>
                  <strong>{sectionName}</strong>
                </div>

                <div style={styles.infoRow}>
                  <span>Academic Year</span>
                  <strong>{academicYear}</strong>
                </div>

                <button
                  type="button"
                  style={styles.viewButton}
                  onClick={() => handleViewStudents(item)}
                >
                  View Students <span>→</span>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* STUDENT SECTION */}
      {selectedClass && (
        <section style={styles.studentSection}>
          <div style={styles.studentHeader}>
            <div>
              <p style={styles.studentEyebrow}>CLASS ROSTER</p>

              <h2 style={styles.sectionTitle}>Students</h2>

              <p style={styles.selectedInfo}>
                {getClassName(selectedClass)} · Section{" "}
                {getSectionName(selectedClass)} ·{" "}
                {getSubjectName(selectedClass)}
              </p>
            </div>

            <button
              type="button"
              style={styles.closeButton}
              onClick={() => {
                setSelectedClass(null);
                setStudents([]);
                setStudentError("");
              }}
            >
              Close
            </button>
          </div>

          {studentsLoading && (
            <div style={styles.loadingBox}>
              Loading students...
            </div>
          )}

          {studentError && (
            <div style={styles.studentError}>
              <strong>Could not load students</strong>
              <p>{studentError}</p>
              <button
                type="button"
                style={styles.retryButton}
                onClick={() => handleViewStudents(selectedClass)}
              >
                Try Again
              </button>
            </div>
          )}

          {!studentsLoading &&
            !studentError &&
            students.length === 0 && (
              <div style={styles.emptyStudentBox}>
                <h3>No Students Found</h3>
                <p>
                  No active students were returned for this class and section.
                </p>
              </div>
            )}

          {!studentsLoading &&
            !studentError &&
            students.length > 0 && (
              <>
                <p style={styles.studentCount}>
                  Total Students: <strong>{students.length}</strong>
                </p>

                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>#</th>
                        <th style={styles.th}>Student ID</th>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Gender</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student, index) => {
                        const studentName =
                          student.name ||
                          [
                            student.first_name,
                            student.middle_name,
                            student.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                          "-";

                        const isActive =
                          student.is_active ??
                          student.isActive ??
                          true;

                        return (
                          <tr
                            key={
                              student.id ||
                              student.student_id ||
                              index
                            }
                          >
                            <td style={styles.td}>{index + 1}</td>

                            <td style={styles.td}>
                              {student.student_id ||
                                student.studentId ||
                                "-"}
                            </td>

                            <td style={styles.nameCell}>
                              {studentName}
                            </td>

                            <td style={styles.td}>
                              {student.gender || "-"}
                            </td>

                            <td style={styles.td}>
                              <span
                                style={
                                  isActive
                                    ? styles.activeBadge
                                    : styles.inactiveBadge
                                }
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        </section>
      )}
    </div>
  );
}

// ==================================================
// RESPONSIVE STYLES
// ==================================================

const styles = {
  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "clamp(12px, 2vw, 28px)",
    boxSizing: "border-box",
    color: "#1e293b",
  },

  center: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  },

  loadingSpinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(24px, 3vw, 32px)",
    fontWeight: 750,
    letterSpacing: "-0.7px",
    color: "#0f172a",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  backButton: {
    padding: "10px 16px",
    border: "1px solid #dbe3ef",
    borderRadius: "9px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontWeight: 600,
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "fit-content",
    minWidth: "190px",
    padding: "16px 22px",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    background: "#fff",
    boxShadow: "0 4px 16px rgba(15,23,42,0.04)",
    boxSizing: "border-box",
  },

  summaryIcon: {
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    borderRadius: "12px",
    fontSize: "23px",
  },

  summaryNumber: {
    display: "block",
    fontSize: "24px",
    color: "#0f172a",
  },

  summaryLabel: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  classGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
    gap: "20px",
    alignItems: "stretch",
  },

  classCard: {
    minWidth: 0,
    padding: "22px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 5px 20px rgba(15,23,42,0.045)",
    boxSizing: "border-box",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  courseIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    background: "#eff6ff",
    fontSize: "24px",
  },

  subjectCode: {
    padding: "6px 9px",
    borderRadius: "7px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: 700,
  },

  subjectLabel: {
    margin: "20px 0 7px",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: 750,
    letterSpacing: "1px",
  },

  subjectName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "23px",
    fontWeight: 750,
    overflowWrap: "anywhere",
  },

  divider: {
    height: "1px",
    background: "#e8edf4",
    margin: "20px 0 12px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    padding: "10px 0",
    color: "#64748b",
    fontSize: "13px",
  },

  infoValue: {
    color: "#0f172a",
  },

  viewButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "18px",
    padding: "12px 15px",
    border: "none",
    borderRadius: "9px",
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 650,
  },

  emptyBox: {
    padding: "40px 20px",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    background: "#fff",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "32px",
  },

  studentSection: {
    marginTop: "32px",
    padding: "clamp(14px, 2vw, 24px)",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },

  studentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "22px",
  },

  studentEyebrow: {
    margin: "0 0 6px",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: 750,
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "23px",
  },

  selectedInfo: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  closeButton: {
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontWeight: 600,
  },

  loadingBox: {
    padding: "28px",
    textAlign: "center",
    color: "#64748b",
  },

  studentError: {
    padding: "16px",
    borderRadius: "10px",
    background: "#fff1f2",
    color: "#be123c",
    overflowWrap: "anywhere",
  },

  retryButton: {
    marginTop: "10px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  emptyStudentBox: {
    padding: "30px 15px",
    textAlign: "center",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#64748b",
  },

  studentCount: {
    margin: "0 0 12px",
    color: "#475569",
    fontSize: "13px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    minWidth: "600px",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  th: {
    padding: "14px 12px",
    background: "#f8fafc",
    color: "#475569",
    textAlign: "left",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "13px 12px",
    color: "#475569",
    borderBottom: "1px solid #eef2f7",
    whiteSpace: "nowrap",
  },

  nameCell: {
    padding: "13px 12px",
    color: "#0f172a",
    fontWeight: 600,
    borderBottom: "1px solid #eef2f7",
  },

  activeBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "11px",
    fontWeight: 700,
  },

  inactiveBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "11px",
    fontWeight: 700,
  },
};

export default TeacherClasses;
