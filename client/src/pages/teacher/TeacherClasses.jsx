
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
  // LOAD ASSIGNED CLASSES
  // ==================================================

  useEffect(() => {
    const employeeId = localStorage.getItem("employee_id");
    const token = localStorage.getItem("access_token");

    if (!token || !employeeId) {
      navigate("/login", { replace: true });
      return;
    }

    const loadClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await teacherService.getSubjectAllocations();

        console.log(
          "Teacher Allocations:",
          response
        );

        const data = response.data || response;

        /*
          API response may be:

          [
            ...
          ]

          OR

          {
            success: true,
            data: [...]
          }
        */

        const list =
          Array.isArray(data)
            ? data
            : data?.data || data?.allocations || [];

        setAllocations(list);

      } catch (err) {
        console.error(
          "Teacher Classes Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load assigned classes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [navigate]);

  // ==================================================
  // LOAD STUDENTS
  // ==================================================

  const handleViewStudents = async (allocation) => {
    try {
      setSelectedClass(allocation);
      setStudents([]);
      setStudentsLoading(true);
      setStudentError("");

      const employeeId =
        localStorage.getItem("employee_id");

      /*
        Your teacherService should call:

        /{employeeId}/class/{className}/{section}/students/
      */

      const className =
        allocation.class?.name ||
        allocation.school_class?.name ||
        allocation.class_name;

      const sectionName =
        allocation.section?.name ||
        allocation.section_name ||
        allocation.section;

      const response =
        await teacherService.getClassStudents(
          employeeId,
          className,
          sectionName
        );

      console.log(
        "Class Students:",
        response
      );

      const data = response.data || response;

      const studentList =
        Array.isArray(data)
          ? data
          : data?.students || data?.results || [];

      setStudents(studentList);

    } catch (err) {
      console.error(
        "Load Students Error:",
        err
      );

      setStudentError(
        err.message ||
          "Unable to load students."
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

  // ==================================================
  // MAIN
  // ==================================================

  return (
    <div style={styles.container}>

      {/* ============================================
          HEADER
      ============================================ */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            My Classes
          </h1>

          <p style={styles.subtitle}>
            Classes, sections and subjects assigned
            by administrator
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/teacher/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>

      {/* ============================================
          CLASS CARDS
      ============================================ */}

      {allocations.length === 0 ? (

        <div style={styles.emptyBox}>
          <h3>No Classes Assigned</h3>

          <p>
            No class, section or subject has been
            assigned to you by the administrator yet.
          </p>
        </div>

      ) : (

        <div style={styles.classGrid}>

          {allocations.map((item, index) => {

            const className =
              item.class?.name ||
              item.school_class?.name ||
              item.class_name ||
              "-";

            const sectionName =
              item.section?.name ||
              item.section_name ||
              item.section ||
              "-";

            const subjectName =
              item.subject?.name ||
              item.subject_name ||
              item.subject ||
              "-";

            const subjectCode =
              item.subject?.code ||
              item.subject_code ||
              "";

            const studentCount =
              item.studentCount ??
              item.student_count ??
              0;

            const allocationId =
              item.allocationId ||
              item.id ||
              index;

            return (

              <div
                key={allocationId}
                style={styles.classCard}
              >

                <div style={styles.cardHeader}>

                  <div>
                    <h2 style={styles.className}>
                      {className}
                    </h2>

                    <p style={styles.sectionName}>
                      Section {sectionName}
                    </p>
                  </div>

                  {subjectCode && (
                    <span style={styles.subjectCode}>
                      {subjectCode}
                    </span>
                  )}

                </div>

                <div style={styles.divider} />

                <div style={styles.infoRow}>

                  <span>
                    Subject
                  </span>

                  <strong>
                    {subjectName}
                  </strong>

                </div>

                <div style={styles.infoRow}>

                  <span>
                    Students
                  </span>

                  <strong>
                    {studentCount}
                  </strong>

                </div>

                <button
                  style={styles.viewButton}
                  onClick={() =>
                    handleViewStudents(item)
                  }
                >
                  View Students
                </button>

              </div>

            );
          })}

        </div>
      )}

      {/* ============================================
          STUDENT SECTION
      ============================================ */}

      {selectedClass && (

        <div style={styles.studentSection}>

          <div style={styles.studentHeader}>

            <div>

              <h2 style={styles.sectionTitle}>
                Students
              </h2>

              <p style={styles.selectedInfo}>
                {selectedClass.class?.name ||
                  selectedClass.school_class?.name ||
                  selectedClass.class_name}{" "}
                • Section{" "}
                {selectedClass.section?.name ||
                  selectedClass.section_name ||
                  selectedClass.section}{" "}
                •{" "}
                {selectedClass.subject?.name ||
                  selectedClass.subject_name ||
                  selectedClass.subject}
              </p>

            </div>

            <button
              style={styles.closeButton}
              onClick={() => {
                setSelectedClass(null);
                setStudents([]);
              }}
            >
              Close
            </button>

          </div>

          {/* STUDENT LOADING */}

          {studentsLoading && (

            <div style={styles.loadingBox}>
              Loading students...
            </div>

          )}

          {/* STUDENT ERROR */}

          {studentError && (

            <div style={styles.studentError}>
              {studentError}
            </div>

          )}

          {/* STUDENTS */}

          {!studentsLoading &&
            !studentError &&
            students.length === 0 && (

              <div style={styles.emptyStudentBox}>
                No students found in this class
                and section.
              </div>

            )}

          {!studentsLoading &&
            students.length > 0 && (

              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>

                    <tr>

                      <th style={styles.th}>
                        #
                      </th>

                      <th style={styles.th}>
                        Student ID
                      </th>

                      <th style={styles.th}>
                        Student Name
                      </th>

                      <th style={styles.th}>
                        Gender
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map(
                      (student, index) => (

                        <tr
                          key={
                            student.id ||
                            student.student_id ||
                            index
                          }
                        >

                          <td style={styles.td}>
                            {index + 1}
                          </td>

                          <td style={styles.td}>
                            {student.student_id ||
                              student.studentId ||
                              "-"}
                          </td>

                          <td
                            style={{
                              ...styles.td,
                              fontWeight: "600",
                            }}
                          >
                            {student.name ||
                              `${student.first_name || ""} ${
                                student.middle_name || ""
                              } ${
                                student.last_name || ""
                              }`.trim() ||
                              "-"}
                          </td>

                          <td style={styles.td}>
                            {student.gender || "-"}
                          </td>

                          <td style={styles.td}>

                            <span
                              style={
                                student.is_active
                                  ? styles.activeBadge
                                  : styles.inactiveBadge
                              }
                            >
                              {student.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </div>
      )}

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
    minHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  errorBox: {
    backgroundColor: "#fff",
    padding: "30px",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
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

  backButton: {
    padding: "10px 16px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  classGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  classCard: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  className: {
    margin: 0,
    fontSize: "20px",
    color: "#212529",
  },

  sectionName: {
    margin: "6px 0 0",
    color: "#6c757d",
  },

  subjectCode: {
    padding: "5px 9px",
    borderRadius: "5px",
    backgroundColor: "#f1f3f5",
    fontSize: "12px",
    fontWeight: "700",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e9ecef",
    margin: "18px 0",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#6c757d",
    fontSize: "14px",
  },

  viewButton: {
    width: "100%",
    marginTop: "18px",
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#212529",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#6c757d",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  studentSection: {
    marginTop: "35px",
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  studentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#212529",
  },

  selectedInfo: {
    margin: "6px 0 0",
    color: "#6c757d",
    fontSize: "14px",
  },

  closeButton: {
    padding: "8px 14px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  loadingBox: {
    padding: "30px",
    textAlign: "center",
    color: "#6c757d",
  },

  studentError: {
    padding: "15px",
    borderRadius: "6px",
    backgroundColor: "#fff3f3",
    color: "#dc3545",
  },

  emptyStudentBox: {
    padding: "30px",
    textAlign: "center",
    color: "#6c757d",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
    color: "#495057",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e9ecef",
    color: "#495057",
  },

  activeBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "15px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontSize: "12px",
    fontWeight: "600",
  },

  inactiveBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default TeacherClasses;

