
import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService";
import "./ExamMarks.css";

function getList(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.error ||
    error?.data?.error ||
    error?.message ||
    "Something went wrong."
  );
}

function ExamMarks() {
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocationId, setSelectedAllocationId] = useState("");

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  const [loadingAllocations, setLoadingAllocations] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [savingStudentId, setSavingStudentId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedAllocation = allocations.find(
    (item) => String(item.id) === String(selectedAllocationId)
  );

  const selectedExam = exams.find(
    (item) => String(item.id) === String(selectedExamId)
  );

  const isPublished = Boolean(selectedExam?.is_result_published);

  // 1. Load teacher allocations
  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    try {
      setLoadingAllocations(true);
      setError("");

      const response = await teacherService.getSubjectAllocations();
      const list = getList(response, "allocations");

      setAllocations(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingAllocations(false);
    }
  };

  // 2. Load exams when allocation changes
  useEffect(() => {
    if (!selectedAllocation) {
      setExams([]);
      setSelectedExamId("");
      setStudents([]);
      setMarks({});
      return;
    }

    loadAvailableExams();
  }, [selectedAllocationId]);

  const loadAvailableExams = async () => {
    try {
      setLoadingExams(true);
      setError("");
      setSuccess("");

      setExams([]);
      setSelectedExamId("");
      setStudents([]);
      setMarks({});

      const response = await teacherService.getAvailableExams(
        selectedAllocation.school_class,
        selectedAllocation.section,
        selectedAllocation.subject
      );

      const list = getList(response, "exams");
      setExams(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingExams(false);
    }
  };

  // 3. Load students and marks when exam changes
  useEffect(() => {
    if (!selectedAllocation || !selectedExamId) {
      setStudents([]);
      setMarks({});
      return;
    }

    loadExamMarks();
  }, [selectedExamId]);

  const loadExamMarks = async () => {
    try {
      setLoadingStudents(true);
      setError("");
      setSuccess("");

      setStudents([]);
      setMarks({});

      const response = await teacherService.getExamMarks(
        selectedAllocation.school_class,
        selectedAllocation.section,
        selectedAllocation.subject,
        selectedExamId
      );

      const studentList = getList(response, "students");

      setStudents(studentList);

      const initialMarks = {};

      studentList.forEach((student) => {
        initialMarks[student.studentId] =
          student.marksObtained === null ||
          student.marksObtained === undefined
            ? ""
            : String(student.marksObtained);
      });

      setMarks(initialMarks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingStudents(false);
    }
  };

  // 4. Update marks input
  const handleMarksChange = (studentId, value) => {
    setMarks((previous) => ({
      ...previous,
      [studentId]: value,
    }));

    setError("");
    setSuccess("");
  };

  // 5. Save one student's marks
  const handleSaveMarks = async (student) => {
    if (!selectedAllocation || !selectedExam) {
      setError("Please select class, section, subject and exam.");
      return;
    }

    if (isPublished) {
      setError("Published exam results cannot be edited.");
      return;
    }

    const enteredMarks = marks[student.studentId];

    if (enteredMarks === "" || enteredMarks === undefined) {
      setError(`Please enter marks for ${student.name}.`);
      return;
    }

    const marksObtained = Number(enteredMarks);
    const totalMarks = Number(selectedExam.total_marks);

    if (!Number.isFinite(marksObtained)) {
      setError("Please enter valid numeric marks.");
      return;
    }

    if (
      !Number.isFinite(totalMarks) ||
      totalMarks <= 0 ||
      marksObtained < 0 ||
      marksObtained > totalMarks
    ) {
      setError(`Marks must be between 0 and ${totalMarks}.`);
      return;
    }

    try {
      setSavingStudentId(student.studentId);
      setError("");
      setSuccess("");

      await teacherService.saveExamMark(
        selectedAllocation.school_class,
        selectedAllocation.section,
        selectedAllocation.subject,
        {
          exam_id: selectedExam.id,
          student_id: student.studentId,
          marks_obtained: marksObtained,
          total_marks: totalMarks,
        }
      );

      setSuccess(`Marks saved successfully for ${student.name}.`);

      // Refresh the marks list after saving
      await loadExamMarks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingStudentId(null);
    }
  };

  if (loadingAllocations) {
    return (
      <div className="exam-marks-page">
        <div className="exam-marks-message">Loading teacher allocations...</div>
      </div>
    );
  }

  return (
    <div className="exam-marks-page">
      <div className="exam-marks-header">
        <div>
          <h2>Exam Marks Entry</h2>
          <p>Enter and manage student examination marks.</p>
        </div>
      </div>

      {error && (
        <div className="exam-marks-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="exam-marks-alert success">
          {success}
        </div>
      )}

      {/* Allocation selection */}
      <div className="exam-marks-filters">
        <div className="exam-marks-field">
          <label>Class / Section / Subject</label>

          <select
            value={selectedAllocationId}
            onChange={(e) => {
              setSelectedAllocationId(e.target.value);
              setError("");
              setSuccess("");
            }}
          >
            <option value="">Select allocation</option>

            {allocations.map((allocation) => (
              <option key={allocation.id} value={allocation.id}>
                {allocation.class_name} - {allocation.section_name} -{" "}
                {allocation.subject_name}
              </option>
            ))}
          </select>
        </div>

        {/* Exam selection */}
        <div className="exam-marks-field">
          <label>Examination</label>

          <select
            value={selectedExamId}
            disabled={!selectedAllocation || loadingExams}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              setError("");
              setSuccess("");
            }}
          >
            <option value="">
              {loadingExams ? "Loading exams..." : "Select exam"}
            </option>

            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
                {exam.is_result_published ? " (Published)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!loadingAllocations && allocations.length === 0 && (
        <div className="exam-marks-message">
          No subject allocations found for your account.
        </div>
      )}

      {selectedAllocation && !loadingExams && exams.length === 0 && (
        <div className="exam-marks-message">
          No timetable-published exams found for this allocation.
        </div>
      )}

      {loadingExams && (
        <div className="exam-marks-message">Loading available exams...</div>
      )}

      {/* Selected exam information */}
      {selectedExam && (
        <div className="exam-marks-info">
          <div>
            <span>Exam</span>
            <strong>{selectedExam.name}</strong>
          </div>

          <div>
            <span>Total Marks</span>
            <strong>{selectedExam.total_marks}</strong>
          </div>

          <div>
            <span>Passing Marks</span>
            <strong>{selectedExam.passing_marks}</strong>
          </div>

          <div>
            <span>Exam Date</span>
            <strong>{selectedExam.exam_date || "Not available"}</strong>
          </div>

          {isPublished && (
            <div className="published-label">
              Results Published - Read Only
            </div>
          )}
        </div>
      )}

      {/* Student marks table */}
      {loadingStudents && (
        <div className="exam-marks-message">
          Loading students and marks...
        </div>
      )}

      {!loadingStudents && selectedExam && students.length > 0 && (
        <div className="exam-marks-table-wrapper">
          <table className="exam-marks-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Admission ID</th>
                <th>Student Name</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => {
                const hasMarks =
                  student.hasMarks ||
                  (student.marksObtained !== null &&
                    student.marksObtained !== undefined);

                const obtained = marks[student.studentId];

                return (
                  <tr key={student.studentId}>
                    <td>{index + 1}</td>

                    <td>{student.admissionId}</td>

                    <td>{student.name}</td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max={selectedExam.total_marks}
                        step="0.01"
                        value={obtained ?? ""}
                        disabled={isPublished}
                        placeholder="Enter marks"
                        onChange={(e) =>
                          handleMarksChange(
                            student.studentId,
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>{selectedExam.total_marks}</td>

                    <td>
                      <span
                        className={
                          hasMarks
                            ? "marks-status saved"
                            : "marks-status pending"
                        }
                      >
                        {hasMarks ? "Saved" : "Pending"}
                      </span>
                    </td>

                    <td>
                      {!isPublished && (
                        <button
                          type="button"
                          className="save-marks-btn"
                          disabled={
                            savingStudentId === student.studentId
                          }
                          onClick={() => handleSaveMarks(student)}
                        >
                          {savingStudentId === student.studentId
                            ? "Saving..."
                            : hasMarks
                            ? "Update"
                            : "Save"}
                        </button>
                      )}

                      {isPublished && (
                        <span className="readonly-text">Read only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loadingStudents && selectedExam && students.length === 0 && (
        <div className="exam-marks-message">
          No active students found in this class and section.
        </div>
      )}
    </div>
  );
}

export default ExamMarks;
