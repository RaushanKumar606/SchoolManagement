
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

function ExamMarks() {
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedAllocation, setSelectedAllocation] = useState(null);

  const [examName, setExamName] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);

  const [marks, setMarks] = useState({});

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const employeeId = localStorage.getItem("employee_id");

  // ================================
  // Load Teacher Allocations
  // ================================
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
        const allocationData =
          res.data?.results ||
          res.data ||
          res.results ||
          [];

        setAllocations(
          Array.isArray(allocationData)
            ? allocationData
            : []
        );
      } else {
        setError(res.message || "Unable to load class allocations.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load class allocations.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Select Class / Subject
  // ================================
  const handleSelectAllocation = async (allocation) => {
    setSelectedAllocation(allocation);
    setStudents([]);
    setMarks({});
    setSuccess("");
    setError("");

    const schoolClass =
      allocation.school_class ||
      allocation.schoolClass ||
      allocation.class;

    const section =
      allocation.section;

    const subject =
      allocation.subject;

    if (!schoolClass || !section || !subject) {
      setError("Invalid class, section or subject allocation.");
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

      const res = await teacherService.getSubjectStudents(
        employeeId,
        className,
        sectionName,
        subjectId
      );

      if (res.success) {
        const studentData =
          res.data?.results ||
          res.data ||
          res.students ||
          [];

        setStudents(
          Array.isArray(studentData)
            ? studentData
            : []
        );
      } else {
        setError(res.message || "Unable to load students.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    } finally {
      setStudentsLoading(false);
    }
  };

  // ================================
  // Marks Input
  // ================================
  const handleMarksChange = (studentId, value) => {
    if (value === "") {
      setMarks((prev) => ({
        ...prev,
        [studentId]: "",
      }));
      return;
    }

    const numericValue = Number(value);

    if (numericValue < 0) return;

    if (numericValue > Number(totalMarks)) {
      return;
    }

    setMarks((prev) => ({
      ...prev,
      [studentId]: numericValue,
    }));
  };

  // ================================
  // Save Bulk Marks
  // ================================
  const handleSaveMarks = async () => {
    setError("");
    setSuccess("");

    if (!selectedAllocation) {
      setError("Please select a class and subject.");
      return;
    }

    if (!examName.trim()) {
      setError("Please enter exam name.");
      return;
    }

    if (!totalMarks || Number(totalMarks) <= 0) {
      setError("Please enter valid total marks.");
      return;
    }

    if (students.length === 0) {
      setError("No students found in this class.");
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

    const examMarks = students
      .filter((student) => {
        const studentId =
          student.id || student.student_id;

        return (
          marks[studentId] !== undefined &&
          marks[studentId] !== ""
        );
      })
      .map((student) => {
        const studentId =
          student.id || student.student_id;

        return {
          student_id: student.id,
          subject_id: subjectId,
          exam_name: examName.trim(),
          marks_obtained: Number(marks[studentId]),
          total_marks: Number(totalMarks),
        };
      });

    if (examMarks.length === 0) {
      setError("Please enter marks for at least one student.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        employee_id: employeeId,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        exam_name: examName.trim(),
        total_marks: Number(totalMarks),
        marks: examMarks,
      };

      const res =
        await teacherService.addBulkExamMarks(payload);

      if (res.success) {
        setSuccess(
          `Marks saved successfully for ${examMarks.length} student(s).`
        );
      } else {
        setError(
          res.message || "Failed to save exam marks."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save exam marks.");
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // Student Helpers
  // ================================
  const getStudentId = (student) =>
    student.id || student.student_id;

  const getStudentName = (student) => {
    if (student.name) return student.name;

    return [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div className="teacher-page">
        <div className="teacher-page-header">
          <h2>Exam Marks</h2>
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
          <h2>Exam Marks</h2>
          <p>
            Enter and manage examination marks for your
            assigned classes.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/teacher/dashboard")}
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

      {/* Class Allocation */}
      <section className="exam-section">
        <h3>Select Class & Subject</h3>

        {allocations.length === 0 ? (
          <div className="empty-state">
            No class or subject has been assigned to you.
          </div>
        ) : (
          <div className="allocation-grid">
            {allocations.map((allocation) => {
              const schoolClass =
                allocation.school_class ||
                allocation.schoolClass ||
                allocation.class;

              const section = allocation.section;
              const subject = allocation.subject;

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
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleSelectAllocation(allocation)
                  }
                >
                  <div className="allocation-class">
                    {typeof schoolClass === "object"
                      ? schoolClass.name
                      : schoolClass}
                  </div>

                  <div className="allocation-section">
                    Section:{" "}
                    {typeof section === "object"
                      ? section.name
                      : section}
                  </div>

                  <div className="allocation-subject">
                    Subject:{" "}
                    {typeof subject === "object"
                      ? subject.name
                      : subject}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Exam Details */}
      {selectedAllocation && (
        <section className="exam-section">
          <h3>Exam Details</h3>

          <div className="exam-form">
            <div className="form-group">
              <label>Exam Name</label>

              <input
                type="text"
                placeholder="e.g. Unit Test 1"
                value={examName}
                onChange={(e) =>
                  setExamName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Total Marks</label>

              <input
                type="number"
                min="1"
                value={totalMarks}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setTotalMarks(value);

                  setMarks({});
                }}
              />
            </div>
          </div>
        </section>
      )}
    </div>

)
}

export default ExamMarks;

