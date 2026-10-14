
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

function Attendence() {
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const employeeId = localStorage.getItem("employee_id");

  // ==========================================
  // Load Teacher Allocations
  // ==========================================
  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }

    fetchAllocations();
  }, [employeeId, navigate]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await teacherService.getSubjectAllocations();

      if (res.success) {
        const data =
          res.data?.results ||
          res.data ||
          res.results ||
          [];

        setAllocations(
          Array.isArray(data) ? data : []
        );
      } else {
        setError(
          res.message ||
            "Unable to load teacher allocations."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load teacher allocations.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Select Class / Section / Subject
  // ==========================================
  const handleSelectAllocation = async (allocation) => {
    setSelectedAllocation(allocation);
    setStudents([]);
    setAttendance({});
    setSuccess("");
    setError("");

    const schoolClass =
      allocation.school_class ||
      allocation.schoolClass ||
      allocation.class;

    const section = allocation.section;
    const subject = allocation.subject;

    if (!schoolClass || !section || !subject) {
      setError(
        "Invalid class, section or subject allocation."
      );
      return;
    }

    try {
      setStudentsLoading(true);

      const className =
        typeof schoolClass === "object"
          ? schoolClass.name
          : schoolClass;

      const sectionName =
        typeof section === "object"
          ? section.name
          : section;

      const subjectId =
        typeof subject === "object"
          ? subject.id
          : subject;

      const res =
        await teacherService.getSubjectStudents(
          employeeId,
          className,
          sectionName,
          subjectId
        );

      if (res.success) {
        const data =
          res.data?.results ||
          res.data ||
          res.students ||
          [];

        const studentList = Array.isArray(data)
          ? data
          : [];

        setStudents(studentList);

        // Default every student to Present
        const initialAttendance = {};

        studentList.forEach((student) => {
          const id =
            student.id || student.student_id;

          initialAttendance[id] = "Present";
        });

        setAttendance(initialAttendance);
      } else {
        setError(
          res.message ||
            "Unable to load students."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    } finally {
      setStudentsLoading(false);
    }
  };

  // ==========================================
  // Change Individual Attendance
  // ==========================================
  const handleAttendanceChange = (
    studentId,
    status
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setSuccess("");
  };

  // ==========================================
  // Mark All Present
  // ==========================================
  const markAllPresent = () => {
    const updatedAttendance = {};

    students.forEach((student) => {
      const id =
        student.id || student.student_id;

      updatedAttendance[id] = "Present";
    });

    setAttendance(updatedAttendance);
    setSuccess("");
  };

  // ==========================================
  // Mark All Absent
  // ==========================================
  const markAllAbsent = () => {
    const updatedAttendance = {};

    students.forEach((student) => {
      const id =
        student.id || student.student_id;

      updatedAttendance[id] = "Absent";
    });

    setAttendance(updatedAttendance);
    setSuccess("");
  };

  // ==========================================
  // Save Attendance
  // ==========================================
  const handleSaveAttendance = async () => {
    setError("");
    setSuccess("");

    if (!selectedAllocation) {
      setError(
        "Please select a class and subject."
      );
      return;
    }

    if (!selectedDate) {
      setError("Please select attendance date.");
      return;
    }

    if (students.length === 0) {
      setError(
        "No students found in this class."
      );
      return;
    }

    const schoolClass =
      selectedAllocation.school_class ||
      selectedAllocation.schoolClass ||
      selectedAllocation.class;

    const section =
      selectedAllocation.section;

    const subject =
      selectedAllocation.subject;

    const classId =
      typeof schoolClass === "object"
        ? schoolClass.id
        : selectedAllocation.school_class_id ||
          selectedAllocation.class_id;

    const sectionId =
      typeof section === "object"
        ? section.id
        : selectedAllocation.section_id;

    const subjectId =
      typeof subject === "object"
        ? subject.id
        : selectedAllocation.subject_id ||
          subject;

    const attendanceList = students.map(
      (student) => {
        const studentId =
          student.id || student.student_id;

        return {
          student_id: student.id,
          status:
            attendance[studentId] ||
            "Present",
        };
      }
    );

    try {
      setSaving(true);

      const payload = {
        employee_id: employeeId,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        date: selectedDate,
        attendance: attendanceList,
      };

      const res =
        await teacherService.markBulkAttendance(
          payload
        );

      if (res.success) {
        setSuccess(
          `Attendance saved successfully for ${students.length} student(s).`
        );
      } else {
        setError(
          res.message ||
            "Failed to save attendance."
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Helpers
  // ==========================================
  const getStudentId = (student) =>
    student.id || student.student_id;

  const getStudentName = (student) => {
    if (student.name) {
      return student.name;
    }

    return [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const presentCount = students.filter(
    (student) =>
      attendance[getStudentId(student)] ===
      "Present"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[getStudentId(student)] ===
      "Absent"
  ).length;

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="teacher-page">
        <div className="teacher-page-header">
          <div>
            <h2>Attendance</h2>
            <p>
              Mark attendance for your assigned
              students.
            </p>
          </div>
        </div>

        <div className="teacher-loading">
          Loading class allocations...
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page">
      {/* Header */}
      <div className="teacher-page-header">
        <div>
          <h2>Student Attendance</h2>
          <p>
            Mark attendance for your assigned
            Class, Section and Subject.
          </p>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/teacher/dashboard")
          }
        >
          ← Dashboard
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="alert success-alert">
          {success}
        </div>
      )}

      {/* Class Selection */}
      <section className="attendance-section">
        <h3>Select Class & Subject</h3>

        {allocations.length === 0 ? (
          <div className="empty-state">
            No class or subject has been assigned
            to you.
          </div>
        ) : (
          <div className="allocation-grid">
            {allocations.map((allocation) => {
              const schoolClass =
                allocation.school_class ||
                allocation.schoolClass ||
                allocation.class;

              const section =
                allocation.section;

              const subject =
                allocation.subject;

              const allocationId =
                allocation.id ||
                allocation.allocationId;

              const isSelected =
                selectedAllocation &&
                (
                  selectedAllocation.id ||
                  selectedAllocation.allocationId
                ) === allocationId;

              return (
                <button
                  key={allocationId}
                  type="button"
                  className={`allocation-card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectAllocation(
                      allocation
                    )
                  }
                >
                  <div className="allocation-class">
                    {typeof schoolClass ===
                    "object"
                      ? schoolClass.name
                      : schoolClass}
                  </div>

                  <div className="allocation-section">
                    Section:{" "}
                    {typeof section ===
                    "object"
                      ? section.name
                      : section}
                  </div>

                  <div className="allocation-subject">
                    Subject:{" "}
                    {typeof subject ===
                    "object"
                      ? subject.name
                      : subject}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Date */}
      {selectedAllocation && (
        <section className="attendance-section">
          <div className="attendance-top">
            <div>
              <h3>Attendance Date</h3>
              <p>
                Select the date for which attendance
                should be recorded.
              </p>
            </div>

            <input
              type="date"
              className="attendance-date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSuccess("");
              }}
            />
          </div>
        </section>
      )}

      {/* Students */}
      {selectedAllocation && (
        <section className="attendance-section">
          <div className="section-heading">
            <div>
              <h3>Student Attendance</h3>

              <p>
                Select Present or Absent for each
                student.
              </p>
            </div>

            <div className="attendance-summary">
              <span>
                Total: {students.length}
              </span>

              <span>
                Present: {presentCount}
              </span>

              <span>
                Absent: {absentCount}
              </span>
            </div>
          </div>

          {studentsLoading ? (
            <div className="teacher-loading">
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              No students found in this class and
              section.
            </div>
          ) : (
            <>
              {/* Bulk Buttons */}
              <div className="bulk-attendance-actions">
                <button
                  type="button"
                  className="present-all-btn"
                  onClick={markAllPresent}
                >
                  Mark All Present
                </button>

                <button
                  type="button"
                  className="absent-all-btn"
                  onClick={markAllAbsent}
                >
                  Mark All Absent
                </button>
              </div>

              {/* Table */}
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(
                      (student, index) => {
                        const studentId =
                          getStudentId(
                            student
                          );

                        const currentStatus =
                          attendance[
                            studentId
                          ] || "Present";

                        return (
                          <tr key={studentId}>
                            <td>{index + 1}</td>

                            <td>
                              {student.student_id ||
                                studentId}
                            </td>

                            <td>
                              {getStudentName(
                                student
                              )}
                            </td>

                            <td>
                              <div className="attendance-status">
                                <button
                                  type="button"
                                  className={`status-btn present ${
                                    currentStatus ===
                                    "Present"
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      studentId,
                                      "Present"
                                    )
                                  }
                                >
                                  Present
                                </button>

                                <button
                                  type="button"
                                  className={`status-btn absent ${
                                    currentStatus ===
                                    "Absent"
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      studentId,
                                      "Absent"
                                    )
                                  }
                                >
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Save */}
              <div className="attendance-save-actions">
                <button
                  type="button"
                  className="save-attendance-btn"
                  onClick={
                    handleSaveAttendance
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving Attendance..."
                    : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default Attendence;

