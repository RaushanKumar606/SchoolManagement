
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("employee_id");

  const [allocations, setAllocations] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Dropdown states
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Assignment form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [pdfFile, setPdfFile] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingAssignment, setEditingAssignment] = useState(null);
const [viewingAssignment, setViewingAssignment] = useState(null);
const [removePdf, setRemovePdf] = useState(false);
const [deletingId, setDeletingId] = useState(null);

  // Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // RESPONSE HELPERS
  // ==========================================

  const getResponseData = (response) => {
    return response?.data !== undefined
      ? response.data
      : response;
  };

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === "string") return data;

    if (data?.detail) return data.detail;
    if (data?.error) return data.error;
    if (data?.message) return data.message;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(", ")
            : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);

          return `${key}: ${message}`;
        })
        .join(" | ");
    }

    return err?.message || "Something went wrong.";
  };

  // ==========================================
  // GET RELATED ID
  // ==========================================

  const getRelatedId = (value) => {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      return String(value.id ?? value.pk ?? "");
    }

    return String(value);
  };

  // ==========================================
  // ALLOCATION HELPERS
  // ==========================================

  const getClassId = (item) =>
    getRelatedId(
      item.school_class ??
      item.school_class_id ??
      item.class_id
    );

  const getSectionId = (item) =>
    getRelatedId(
      item.section ??
      item.section_id
    );

  const getSubjectId = (item) =>
    getRelatedId(
      item.subject ??
      item.subject_id
    );

  const getClassLabel = (item) =>
    item.class_name ||
    item.school_class_name ||
    (typeof item.school_class === "object"
      ? item.school_class?.name
      : "") ||
    `Class ${getClassId(item)}`;

  const getSectionLabel = (item) =>
    item.section_name ||
    (typeof item.section === "object"
      ? item.section?.name
      : "") ||
    `Section ${getSectionId(item)}`;

  const getSubjectLabel = (item) =>
    item.subject_name ||
    (typeof item.subject === "object"
      ? item.subject?.name
      : "") ||
    `Subject ${getSubjectId(item)}`;

  // ==========================================
  // RESET FORM
  // ==========================================

const resetForm = () => {
  setTitle("");
  setDescription("");
  setDueDate("");
  setTotalMarks("100");
  setPdfFile(null);
  setRemovePdf(false);
  setEditingAssignment(null);

  setError("");
  setSuccess("");

  const fileInput = document.getElementById("assignment-pdf");

  if (fileInput) {
    fileInput.value = "";
  }
};

  // ==========================================
  // LOAD ALLOCATIONS + ASSIGNMENTS
  // ==========================================

  const loadAssignmentPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [allocationRes, assignmentRes] = await Promise.all([
        teacherService.getSubjectAllocations(),
        teacherService.getAssignments(employeeId),
      ]);

      // Allocations
      const allocationData = getResponseData(allocationRes);

      const allocationList =
        allocationData?.results ||
        allocationData?.data?.results ||
        allocationData?.data ||
        (Array.isArray(allocationData)
          ? allocationData
          : []);

      if (!Array.isArray(allocationList)) {
        throw new Error("Invalid allocation response.");
      }

      setAllocations(allocationList);

      // Assignments
      const assignmentData = getResponseData(assignmentRes);

      const assignmentList =
        assignmentData?.results ||
        assignmentData?.assignments ||
        assignmentData?.data?.results ||
        (Array.isArray(assignmentData)
          ? assignmentData
          : []);

      if (!Array.isArray(assignmentList)) {
        throw new Error("Invalid assignments response.");
      }

      setAssignments(assignmentList);

    } catch (err) {
      console.error("Load assignments error:", err);

      setError(getErrorMessage(err));

      setAllocations([]);
      setAssignments([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }

    loadAssignmentPage();

  }, [employeeId, navigate]);

  // ==========================================
  // CLASS DROPDOWN
  // ==========================================

  const classOptions = useMemo(() => {
    const uniqueClasses = new Map();

    allocations.forEach((item) => {
      const id = getClassId(item);

      if (id && !uniqueClasses.has(id)) {
        uniqueClasses.set(id, {
          id,
          name: getClassLabel(item),
        });
      }
    });

    return Array.from(uniqueClasses.values());

  }, [allocations]);

  // ==========================================
  // SECTION DROPDOWN
  // ==========================================

  const sectionOptions = useMemo(() => {
    if (!selectedClass) return [];

    const uniqueSections = new Map();

    allocations
      .filter(
        (item) => getClassId(item) === selectedClass
      )
      .forEach((item) => {
        const id = getSectionId(item);

        if (id && !uniqueSections.has(id)) {
          uniqueSections.set(id, {
            id,
            name: getSectionLabel(item),
          });
        }
      });

    return Array.from(uniqueSections.values());

  }, [allocations, selectedClass]);

  // ==========================================
  // SUBJECT DROPDOWN
  // ==========================================

  const subjectOptions = useMemo(() => {
    if (!selectedClass || !selectedSection) return [];

    const uniqueSubjects = new Map();

    allocations
      .filter(
        (item) =>
          getClassId(item) === selectedClass &&
          getSectionId(item) === selectedSection
      )
      .forEach((item) => {
        const id = getSubjectId(item);

        if (id && !uniqueSubjects.has(id)) {
          uniqueSubjects.set(id, {
            id,
            name: getSubjectLabel(item),
          });
        }
      });

    return Array.from(uniqueSubjects.values());

  }, [allocations, selectedClass, selectedSection]);

  // ==========================================
  // SELECTED ALLOCATION
  // ==========================================

  const selectedAllocation = useMemo(() => {
    if (
      !selectedClass ||
      !selectedSection ||
      !selectedSubject
    ) {
      return null;
    }

    return (
      allocations.find(
        (item) =>
          getClassId(item) === selectedClass &&
          getSectionId(item) === selectedSection &&
          getSubjectId(item) === selectedSubject
      ) || null
    );

  }, [
    allocations,
    selectedClass,
    selectedSection,
    selectedSubject,
  ]);

  // ==========================================
  // DROPDOWN HANDLERS
  // ==========================================

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setSelectedSubject("");
    resetForm();
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setSelectedSubject("");
    resetForm();
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    resetForm();
  };

  // ==========================================
  // PDF FILE HANDLER
  // ==========================================

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setPdfFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setPdfFile(null);
      e.target.value = "";
      setError("Only PDF files are allowed.");
      return;
    }

    setPdfFile(file);
  };

  // ==========================================
  // REFRESH ASSIGNMENTS
  // ==========================================

  const refreshAssignments = async () => {
    const response = await teacherService.getAssignments(employeeId);

    const data = getResponseData(response);

    const list =
      data?.results ||
      data?.assignments ||
      data?.data?.results ||
      (Array.isArray(data) ? data : []);

    if (!Array.isArray(list)) {
      throw new Error("Invalid assignments response.");
    }

    setAssignments(list);
  };



  // ==========================================
  // CREATE ASSIGNMENT
  // ==========================================

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate allocation
    if (
      !selectedClass ||
      !selectedSection ||
      !selectedSubject
    ) {
      setError("Please select class, section and subject.");
      return;
    }

    if (!selectedAllocation) {
      setError("Selected allocation not found.");
      return;
    }

    // Validate title
    if (!title.trim()) {
      setError("Please enter assignment title.");
      return;
    }

    // Validate description
    if (!description.trim()) {
      setError("Please enter assignment description.");
      return;
    }

    // Validate due date
    if (!dueDate) {
      setError("Please select due date.");
      return;
    }

    // Validate marks
    const marks = Number(totalMarks);

    if (
      totalMarks.trim() === "" ||
      !Number.isFinite(marks) ||
      marks <= 0 ||
      marks > 999.99
    ) {
      setError(
        "Total marks must be greater than 0 and maximum 999.99."
      );
      return;
    }

    if (editingAssignment) {
  await handleUpdateAssignment(e);
  return;
}

    try {
      setSaving(true);

      // IMPORTANT:
      // PDF upload requires FormData (multipart/form-data).

      const formData = new FormData();

      formData.append("employee_id", employeeId);
      formData.append("class_id", selectedClass);
      formData.append("section_id", selectedSection);
      formData.append("subject_id", selectedSubject);

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("due_date", dueDate);
      formData.append("total_marks", String(marks));

      // Backend field name
      if (pdfFile) {
        formData.append("assignments_pdf", pdfFile);
      }

      const response = await teacherService.createAssignment(
        formData
      );

      const responseData = getResponseData(response);

      if (
        responseData?.success === false ||
        response?.success === false
      ) {
        throw new Error(
          responseData?.error ||
          responseData?.message ||
          "Failed to create assignment."
        );
      }

      setSuccess("Assignment created successfully.");

      resetForm();

      await refreshAssignments();

    } catch (err) {
      console.error("Create assignment error:", err);

      setError(getErrorMessage(err));

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
// EDIT ASSIGNMENT
// ==========================================

const handleEditAssignment = (assignment) => {
  setError("");
  setSuccess("");

  setEditingAssignment(assignment);

  setSelectedClass(
    getRelatedId(assignment.school_class)
  );

  setSelectedSection(
    getRelatedId(assignment.section)
  );

  setSelectedSubject(
    getRelatedId(assignment.subject)
  );

  setTitle(assignment.title || "");
  setDescription(assignment.description || "");

  setDueDate(
    assignment.due_date ||
    assignment.dueDate ||
    ""
  );

  setTotalMarks(
    String(assignment.total_marks ?? "100")
  );

  setPdfFile(null);
  setRemovePdf(false);

  const fileInput = document.getElementById("assignment-pdf");

  if (fileInput) {
    fileInput.value = "";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};


// ==========================================
// CANCEL EDIT
// ==========================================

const handleCancelEdit = () => {
  resetForm();

  setSelectedClass("");
  setSelectedSection("");
  setSelectedSubject("");
};


// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

const handleUpdateAssignment = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!editingAssignment) return;

  if (!selectedAllocation) {
    setError("Please select a valid class, section and subject.");
    return;
  }

  if (!title.trim()) {
    setError("Please enter assignment title.");
    return;
  }

  if (!description.trim()) {
    setError("Please enter assignment description.");
    return;
  }

  if (!dueDate) {
    setError("Please select due date.");
    return;
  }

  const marks = Number(totalMarks);

  if (
    !Number.isFinite(marks) ||
    marks <= 0 ||
    marks > 999.99
  ) {
    setError("Total marks must be between 0.01 and 999.99.");
    return;
  }

  try {
    setSaving(true);

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("due_date", dueDate);
    formData.append("total_marks", String(marks));

    formData.append("school_class", selectedClass);
    formData.append("section", selectedSection);
    formData.append("subject", selectedSubject);

    if (pdfFile) {
      formData.append("assignments_pdf", pdfFile);
    }

    if (removePdf) {
      formData.append("remove_pdf", "true");
    }

    const response = await teacherService.updateAssignment(
      editingAssignment.id,
      formData
    );

    const data = getResponseData(response);

    if (data?.success === false) {
      throw new Error(data.error || "Assignment update failed.");
    }

    setSuccess("Assignment updated successfully.");

    resetForm();

    setSelectedClass("");
    setSelectedSection("");
    setSelectedSubject("");

    await refreshAssignments();

  } catch (err) {
    console.error("Update assignment error:", err);
    setError(getErrorMessage(err));
  } finally {
    setSaving(false);
  }
};


// ==========================================
// DELETE ASSIGNMENT
// ==========================================

const handleDeleteAssignment = async (assignment) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${assignment.title}"?`
  );

  if (!confirmed) return;

  try {
    setDeletingId(assignment.id);
    setError("");
    setSuccess("");

    const response = await teacherService.deleteAssignment(
      assignment.id
    );

    const data = getResponseData(response);

    if (data?.success === false) {
      throw new Error(data.error || "Delete failed.");
    }

    setSuccess("Assignment deleted successfully.");

    if (viewingAssignment?.id === assignment.id) {
      setViewingAssignment(null);
    }

    if (editingAssignment?.id === assignment.id) {
      resetForm();
    }

    await refreshAssignments();

  } catch (err) {
    console.error("Delete assignment error:", err);
    setError(getErrorMessage(err));
  } finally {
    setDeletingId(null);
  }
};

  // ==========================================
  // ASSIGNMENT TABLE HELPERS
  // ==========================================

  const getClassName = (assignment) =>
    assignment.className ||
    assignment.class_name ||
    assignment.school_class?.name ||
    assignment.school_class_name ||
    assignment.schoolClass?.name ||
    (typeof assignment.school_class === "string"
      ? assignment.school_class
      : "-");

  const getSectionName = (assignment) =>
    assignment.section?.name ||
    assignment.section_name ||
    (typeof assignment.section === "string"
      ? assignment.section
      : "-");

  const getSubjectName = (assignment) =>
    assignment.subject?.name ||
    assignment.subject_name ||
    (typeof assignment.subject === "string"
      ? assignment.subject
      : "-");

  const getTotalMarks = (assignment) =>
    assignment.total_marks ??
    assignment.totalMarks ??
    assignment.marks ??
    "-";

  // ==========================================
  // PDF URL HELPER
  // ==========================================

  const getPdfUrl = (assignment) => {
    const pdf =
      assignment.assignments_pdf ||
      assignment.assignment_pdf ||
      assignment.pdf_file ||
      assignment.pdf ||
      null;

    if (!pdf) return "";

    if (typeof pdf === "object") {
      return pdf.url || pdf.file || "";
    }

    return pdf;
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="teacher-page">

        <div className="teacher-page-header">
          <div>
            <h2>Assignments</h2>
            <p>Create and manage student assignments.</p>
          </div>
        </div>

        <div className="teacher-loading">
          Loading assignments...
        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="teacher-page">

      {/* HEADER */}

      <div className="teacher-page-header">

        <div>
          <h2>Assignments</h2>

          <p>
            Create assignments for your allocated classes and subjects.
          </p>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/teacher/dashboard")}
        >
          ← Dashboard
        </button>

      </div>

      {/* ALERTS */}

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

      {/* ALLOCATION DROPDOWNS */}

      <section className="assignment-section">

        <h3>Select Class, Section & Subject</h3>

        {allocations.length === 0 ? (

          <div className="empty-state">
            No class or subject has been assigned to you.
          </div>

        ) : (

          <div className="assignment-form">

            {/* CLASS */}

            <div className="form-group">

              <label htmlFor="assignment-class">
                Select Class *
              </label>

              <select
                id="assignment-class"
                value={selectedClass}
                onChange={handleClassChange}
              >
                <option value="">
                  -- Select Class --
                </option>

                {classOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

            {/* SECTION */}

            <div className="form-group">

              <label htmlFor="assignment-section">
                Select Section *
              </label>

              <select
                id="assignment-section"
                value={selectedSection}
                onChange={handleSectionChange}
                disabled={!selectedClass}
              >
                <option value="">
                  -- Select Section --
                </option>

                {sectionOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

            {/* SUBJECT */}

            <div className="form-group">

              <label htmlFor="assignment-subject">
                Select Subject *
              </label>

              <select
                id="assignment-subject"
                value={selectedSubject}
                onChange={handleSubjectChange}
                disabled={!selectedSection}
              >
                <option value="">
                  -- Select Subject --
                </option>

                {subjectOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

          </div>
        )}

      </section>

      {/* CREATE ASSIGNMENT */}

      {selectedAllocation && (

        <section className="assignment-section">

          <div className="section-heading">

            <div>
              <h3>Create Assignment</h3>

              <p>
                {getClassLabel(selectedAllocation)} -{" "}
                {getSectionLabel(selectedAllocation)} -{" "}
                {getSubjectLabel(selectedAllocation)}
              </p>
            </div>

          </div>

          <form
            className="assignment-form"
            onSubmit={handleCreateAssignment}
          >

            {/* TITLE */}

            <div className="form-group">

              <label htmlFor="assignment-title">
                Assignment Title *
              </label>

              <input
                id="assignment-title"
                type="text"
                placeholder="e.g. Chapter 1 Homework"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="assignment-description">
                Description *
              </label>

              <textarea
                id="assignment-description"
                rows="5"
                placeholder="Write assignment instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

            </div>

            {/* PDF UPLOAD */}

            <div className="form-group">

              <label htmlFor="assignment-pdf">
                Assignment PDF (Optional)
              </label>

              <input
                id="assignment-pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              {pdfFile && (
                <p className="pdf-selected">
                  <span>📄</span> {pdfFile.name}
                </p>
              )}

              <small>
                Upload a PDF document containing assignment questions.
              </small>

              {editingAssignment && getPdfUrl(editingAssignment) && !removePdf && (
  <div className="current-assignment-pdf">
    <p>Current PDF: Available</p>

    <a
      href={getPdfUrl(editingAssignment)}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Current PDF
    </a>

    <button
      type="button"
      className="remove-pdf-btn"
      onClick={() => setRemovePdf(true)}
    >
      Remove PDF
    </button>
  </div>
)}

{removePdf && (
  <p className="pdf-removed-message">
    Existing PDF will be removed after updating.
  </p>
)}

            </div>

            {/* TOTAL MARKS */}

            <div className="form-group">

              <label htmlFor="assignment-marks">
                Total Marks *
              </label>

              <input
                id="assignment-marks"
                type="number"
                placeholder="Enter total marks"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min="0.01"
                max="999.99"
                step="0.01"
                required
              />

            </div>

            {/* DUE DATE */}

            <div className="form-group">

              <label htmlFor="assignment-due-date">
                Due Date *
              </label>

              <input
                id="assignment-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />

            </div>

            {/* ACTIONS */}

           <div className="form-actions">

  <button
    type="submit"
    className="create-assignment-btn"
    disabled={saving}
  >
    {saving
      ? editingAssignment
        ? "Updating..."
        : "Creating..."
      : editingAssignment
        ? "Update Assignment"
        : "Create Assignment"}
  </button>

  {editingAssignment && (
    <button
      type="button"
      className="cancel-edit-btn"
      onClick={handleCancelEdit}
      disabled={saving}
    >
      Cancel Edit
    </button>
  )}

</div>
          </form>

        </section>

      )}

      {/* MY ASSIGNMENTS */}

      <section className="assignment-section">

        <div className="section-heading">

          <div>
            <h3>My Assignments</h3>
            <p>Assignments created by you.</p>
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
                  <th>SR No</th>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Total Marks</th>
                  <th>Due Date</th>
                  <th>PDF</th>
                  <th>Actions</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>

                {assignments.map((assignment, index) => {

                  const pdfUrl = getPdfUrl(assignment);

                  return (

                    <tr key={assignment.id || index}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {assignment.title}
                        </strong>
                      </td>

                      <td>
                        {getClassName(assignment)}
                      </td>

                      <td>
                        {getSectionName(assignment)}
                      </td>

                      <td>
                        {getSubjectName(assignment)}
                      </td>

                      <td>
                        {getTotalMarks(assignment)}
                      </td>

                      <td>
                        {formatDate(
                          assignment.due_date ||
                          assignment.dueDate
                        )}
                      </td>

                      <td>
                        {pdfUrl ? (

                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="assignment-pdf-link"
                          >
                            📄 View PDF
                          </a>

                        ) : (

                          <span>-</span>

                        )}
                      </td>
                      <td>
  <div className="assignment-actions">

    <button
      type="button"
      className="view-assignment-btn"
      onClick={() => setViewingAssignment(assignment)}
    >
      View
    </button>

    <button
      type="button"
      className="edit-assignment-btn"
      onClick={() => handleEditAssignment(assignment)}
    >
      Edit
    </button>

    <button
      type="button"
      className="delete-assignment-btn"
      onClick={() => handleDeleteAssignment(assignment)}
      disabled={deletingId === assignment.id}
    >
      {deletingId === assignment.id ? "Deleting..." : "Delete"}
    </button>

  </div>
</td>

                      <td>
                        {formatDate(
                          assignment.created_at ||
                          assignment.createdAt
                        )}
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* VIEW ASSIGNMENT MODAL */}

{viewingAssignment && (
  <div
    className="assignment-modal-overlay"
    onClick={() => setViewingAssignment(null)}
  >
    <div
      className="assignment-view-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="assignment-modal-header">
        <div>
          <h3>Assignment Details</h3>
          <p>View your assignment information.</p>
        </div>

        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setViewingAssignment(null)}
        >
          ×
        </button>
      </div>

      <div className="assignment-modal-body">

        <div className="assignment-detail-item">
          <label>Title</label>
          <p>{viewingAssignment.title}</p>
        </div>

        <div className="assignment-detail-item">
          <label>Description</label>
          <p>{viewingAssignment.description}</p>
        </div>

        <div className="assignment-detail-grid">

          <div className="assignment-detail-item">
            <label>Class</label>
            <p>{getClassName(viewingAssignment)}</p>
          </div>

          <div className="assignment-detail-item">
            <label>Section</label>
            <p>{getSectionName(viewingAssignment)}</p>
          </div>

          <div className="assignment-detail-item">
            <label>Subject</label>
            <p>{getSubjectName(viewingAssignment)}</p>
          </div>

          <div className="assignment-detail-item">
            <label>Total Marks</label>
            <p>{getTotalMarks(viewingAssignment)}</p>
          </div>

          <div className="assignment-detail-item">
            <label>Due Date</label>
            <p>
              {formatDate(
                viewingAssignment.due_date ||
                viewingAssignment.dueDate
              )}
            </p>
          </div>

          <div className="assignment-detail-item">
            <label>Created At</label>
            <p>
              {formatDate(
                viewingAssignment.created_at ||
                viewingAssignment.createdAt
              )}
            </p>
          </div>

        </div>

        {getPdfUrl(viewingAssignment) && (
          <div className="assignment-detail-item">
            <label>Assignment PDF</label>

            <a
              href={getPdfUrl(viewingAssignment)}
              target="_blank"
              rel="noopener noreferrer"
              className="assignment-pdf-link"
            >
              View / Download PDF
            </a>
          </div>
        )}

      </div>

      <div className="assignment-modal-footer">

        <button
          type="button"
          className="edit-assignment-btn"
          onClick={() => {
            const assignment = viewingAssignment;
            setViewingAssignment(null);
            handleEditAssignment(assignment);
          }}
        >
          Edit Assignment
        </button>

        <button
          type="button"
          className="cancel-edit-btn"
          onClick={() => setViewingAssignment(null)}
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default Assignments;
