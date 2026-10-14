
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

function Assignments() {
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("employee_id");

  const [allocations, setAllocations] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedAllocation, setSelectedAllocation] =
    useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Initial Load
  // ==========================================
  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }

    loadAssignmentPage();
  }, [employeeId, navigate]);

  // ==========================================
  // Load Allocations + Assignments
  // ==========================================
  const loadAssignmentPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [allocationRes, assignmentRes] =
        await Promise.all([
          teacherService.getSubjectAllocations(),
          teacherService.getAssignments(employeeId),
        ]);

      // Allocations
      if (allocationRes.success) {
        const allocationData =
          allocationRes.data?.results ||
          allocationRes.data ||
          allocationRes.results ||
          [];

        setAllocations(
          Array.isArray(allocationData)
            ? allocationData
            : []
        );
      } else {
        setError(
          allocationRes.message ||
            "Unable to load class allocations."
        );
      }

      // Assignments
      if (assignmentRes.success) {
        const assignmentData =
          assignmentRes.data?.results ||
          assignmentRes.data ||
          assignmentRes.assignments ||
          [];

        setAssignments(
          Array.isArray(assignmentData)
            ? assignmentData
            : []
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load assignment data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Select Allocation
  // ==========================================
  const handleSelectAllocation = (allocation) => {
    setSelectedAllocation(allocation);

    setTitle("");
    setDescription("");
    setDueDate("");

    setError("");
    setSuccess("");
  };

  // ==========================================
  // Get Allocation Data
  // ==========================================
  const getAllocationData = () => {
    if (!selectedAllocation) {
      return null;
    }

    const schoolClass =
      selectedAllocation.school_class ||
      selectedAllocation.schoolClass ||
      selectedAllocation.class;

    const section =
      selectedAllocation.section;

    const subject =
      selectedAllocation.subject;

    return {
      classId:
        typeof schoolClass === "object"
          ? schoolClass.id
          : selectedAllocation.school_class_id ||
            selectedAllocation.class_id,

      sectionId:
        typeof section === "object"
          ? section.id
          : selectedAllocation.section_id,

      subjectId:
        typeof subject === "object"
          ? subject.id
          : selectedAllocation.subject_id ||
            subject,

      className:
        typeof schoolClass === "object"
          ? schoolClass.name
          : schoolClass,

      sectionName:
        typeof section === "object"
          ? section.name
          : section,

      subjectName:
        typeof subject === "object"
          ? subject.name
          : subject,
    };
  };

  // ==========================================
  // Create Assignment
  // ==========================================
  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedAllocation) {
      setError(
        "Please select a class, section and subject."
      );
      return;
    }

    if (!title.trim()) {
      setError("Please enter assignment title.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter assignment description."
      );
      return;
    }

    if (!dueDate) {
      setError("Please select due date.");
      return;
    }

    const data = getAllocationData();

    if (
      !data?.classId ||
      !data?.sectionId ||
      !data?.subjectId
    ) {
      setError(
        "Invalid class, section or subject allocation."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        employee_id: employeeId,
        school_class: data.classId,
        section: data.sectionId,
        subject: data.subjectId,
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
      };

      const res =
        await teacherService.createAssignment(
          payload
        );

      if (res.success) {
        setSuccess(
          "Assignment created successfully."
        );

        setTitle("");
        setDescription("");
        setDueDate("");

        // Refresh assignments
        const assignmentRes =
          await teacherService.getAssignments(
            employeeId
          );

        if (assignmentRes.success) {
          const assignmentData =
            assignmentRes.data?.results ||
            assignmentRes.data ||
            assignmentRes.assignments ||
            [];

          setAssignments(
            Array.isArray(assignmentData)
              ? assignmentData
              : []
          );
        }
      } else {
        setError(
          res.message ||
            "Failed to create assignment."
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to create assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Helpers
  // ==========================================
  const getClassName = (assignment) =>
    assignment.school_class?.name ||
    assignment.schoolClass?.name ||
    assignment.class_name ||
    assignment.school_class ||
    "-";

  const getSectionName = (assignment) =>
    assignment.section?.name ||
    assignment.section_name ||
    assignment.section ||
    "-";

  const getSubjectName = (assignment) =>
    assignment.subject?.name ||
    assignment.subject_name ||
    assignment.subject ||
    "-";

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="teacher-page">
        <div className="teacher-page-header">
          <div>
            <h2>Assignments</h2>
            <p>
              Create and manage student assignments.
            </p>
          </div>
        </div>

        <div className="teacher-loading">
          Loading assignments...
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page">
      {/* =====================================
          Header
      ====================================== */}
      <div className="teacher-page-header">
        <div>
          <h2>Assignments</h2>
          <p>
            Create assignments for your assigned
            classes and subjects.
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

      {/* =====================================
          Alerts
      ====================================== */}
      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success-alert">
          {success}
        </div>
      )}

      {/* =====================================
          Select Class / Subject
      ====================================== */}
      <section className="assignment-section">
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

              const selectedId =
                selectedAllocation?.id ||
                selectedAllocation?.allocationId;

              const isSelected =
                selectedId === allocationId;

              return (
                <button
                  type="button"
                  key={allocationId}
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

      {/* =====================================
          Create Assignment Form
      ====================================== */}
      {selectedAllocation && (
        <section className="assignment-section">
          <div className="section-heading">
            <div>
              <h3>Create Assignment</h3>

              <p>
                {getAllocationData()?.className} -
                Section{" "}
                {getAllocationData()?.sectionName} -
                {getAllocationData()?.subjectName}
              </p>
            </div>
          </div>

          <form
            className="assignment-form"
            onSubmit={handleCreateAssignment}
          >
            <div className="form-group">
              <label>
                Assignment Title
              </label>

              <input
                type="text"
                placeholder="e.g. Chapter 1 Homework"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Write assignment instructions..."
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="create-assignment-btn"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Assignment"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =====================================
          Existing Assignments
      ====================================== */}
      <section className="assignment-section">
        <div className="section-heading">
          <div>
            <h3>My Assignments</h3>

            <p>
              Assignments created by you.
            </p>
          </div>

          <span className="student-count">
            {assignments.length} Assignments
          </span>
        </div>

        {assignments.length === 0 ? (
          <div className="empty-state">
            You have not created any assignments yet.
          </div>
        ) : (
          <div className="assignment-table-wrapper">
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map(
                  (assignment, index) => (
                    <tr
                      key={
                        assignment.id ||
                        index
                      }
                    >
                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {assignment.title}
                        </strong>
                      </td>

                      <td>
                        {getClassName(
                          assignment
                        )}
                      </td>

                      <td>
                        {getSectionName(
                          assignment
                        )}
                      </td>

                      <td>
                        {getSubjectName(
                          assignment
                        )}
                      </td>

                      <td>
                        {assignment.due_date ||
                          assignment.dueDate ||
                          "-"}
                      </td>

                      <td>
                        {assignment.created_at
                          ? new Date(
                              assignment.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Assignments;


