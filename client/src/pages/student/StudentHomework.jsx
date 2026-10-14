import { useEffect, useState } from "react";
import {
  getMyStudentAssignments,
  submitAssignment,
} from "../../services/studentService";


function StudentHomework() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [answerText, setAnswerText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  /* =========================
     LOAD HOMEWORK
  ========================= */

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStudentAssignments();

      const assignmentData =
        Array.isArray(data)
          ? data
          : data?.assignments ||
            data?.data ||
            data?.results ||
            [];

      setAssignments(assignmentData);
    } catch (err) {
      console.error("Homework error:", err);

      setError(
        err?.message ||
          "Failed to load homework."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN SUBMISSION MODAL
  ========================= */

  const openSubmission = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswerText("");
    setSelectedFile(null);
    setSubmitMessage("");
    setSubmitError("");
  };

  const closeSubmission = () => {
    if (submitting) return;

    setSelectedAssignment(null);
    setAnswerText("");
    setSelectedFile(null);
    setSubmitMessage("");
    setSubmitError("");
  };

  /* =========================
     SUBMIT ASSIGNMENT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) return;

    if (
      !answerText.trim() &&
      !selectedFile
    ) {
      setSubmitError(
        "Please enter an answer or select a file."
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage("");
      setSubmitError("");

      await submitAssignment(
        selectedAssignment.id,
        {
          answerText: answerText.trim(),
          file: selectedFile,
        }
      );

      setSubmitMessage(
        "Assignment submitted successfully."
      );

      /*
        Refresh assignments so submitted/pending
        status is updated from backend.
      */
      await loadAssignments();

      setTimeout(() => {
        closeSubmission();
      }, 1000);
    } catch (err) {
      console.error(
        "Assignment submission error:",
        err
      );

      setSubmitError(
        err?.message ||
          "Failed to submit assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="student-homework-page">
        <div className="homework-loading">
          <div className="homework-spinner"></div>

          <p>
            Loading homework...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="student-homework-page">
        <div className="homework-error">

          <h3>
            Unable to load homework
          </h3>

          <p>{error}</p>

          <button
            className="retry-btn"
            onClick={loadAssignments}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="student-homework-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="homework-header">

        <div>
          <h1>
            My Homework
          </h1>

          <p>
            View and submit your assignments.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadAssignments}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =========================
          EMPTY
      ========================= */}

      {assignments.length === 0 ? (
        <div className="homework-empty">

          <div className="empty-icon">
            📚
          </div>

          <h3>
            No Homework Found
          </h3>

          <p>
            There are no assignments available
            for your class.
          </p>

        </div>
      ) : (

        /* =========================
           ASSIGNMENT LIST
        ========================= */

        <div className="assignment-grid">

          {assignments.map(
            (assignment, index) => (
              <AssignmentCard
                key={
                  assignment.id ||
                  index
                }
                assignment={assignment}
                onSubmit={() =>
                  openSubmission(
                    assignment
                  )
                }
              />
            )
          )}

        </div>
      )}


      {/* =========================
          SUBMISSION MODAL
      ========================= */}

      {selectedAssignment && (
        <div
          className="homework-modal-overlay"
          onClick={closeSubmission}
        >

          <div
            className="homework-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Submit Assignment
                </h2>

                <p>
                  {getAssignmentTitle(
                    selectedAssignment
                  )}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeSubmission}
                disabled={submitting}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="submission-form"
            >

              {/* ANSWER */}

              <div className="form-group">

                <label>
                  Your Answer
                </label>

                <textarea
                  value={answerText}
                  onChange={(e) =>
                    setAnswerText(
                      e.target.value
                    )
                  }
                  placeholder="Write your answer here..."
                  rows="7"
                />

              </div>


              {/* FILE */}

              <div className="form-group">

                <label>
                  Attachment
                </label>

                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />

                {selectedFile && (
                  <small>
                    Selected:{" "}
                    {selectedFile.name}
                  </small>
                )}

              </div>


              {/* SUCCESS */}

              {submitMessage && (
                <div className="submit-success">
                  {submitMessage}
                </div>
              )}


              {/* ERROR */}

              {submitError && (
                <div className="submit-error">
                  {submitError}
                </div>
              )}


              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeSubmission}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Assignment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================
   ASSIGNMENT CARD
========================= */

function AssignmentCard({
  assignment,
  onSubmit,
}) {
  const title =
    getAssignmentTitle(
      assignment
    );

  const subject =
    assignment.subject_name ||
    assignment.subject?.name ||
    assignment.subject ||
    "Subject";

  const description =
    assignment.description ||
    assignment.instructions ||
    assignment.details ||
    "";

  const dueDate =
    assignment.due_date ||
    assignment.deadline ||
    assignment.end_date ||
    "";

  const status =
    assignment.status ||
    assignment.submission_status ||
    "";

  const isSubmitted =
    String(status).toLowerCase() ===
      "submitted" ||
    String(status).toLowerCase() ===
      "completed";

  return (
    <div className="assignment-card">

      <div className="assignment-top">

        <div className="assignment-icon">
          📖
        </div>

        <div className="assignment-title">

          <h3>
            {title}
          </h3>

          <span>
            {subject}
          </span>

        </div>

      </div>


      {description && (
        <p className="assignment-description">
          {description}
        </p>
      )}


      <div className="assignment-meta">

        {dueDate && (
          <div>
            <span className="meta-label">
              Due Date
            </span>

            <strong>
              {formatDate(dueDate)}
            </strong>
          </div>
        )}

        {status && (
          <div>
            <span className="meta-label">
              Status
            </span>

            <span
              className={`status-badge ${
                isSubmitted
                  ? "submitted"
                  : "pending"
              }`}
            >
              {formatStatus(status)}
            </span>
          </div>
        )}

      </div>


      <button
        className={
          isSubmitted
            ? "view-btn"
            : "submit-assignment-btn"
        }
        onClick={onSubmit}
      >
        {isSubmitted
          ? "View / Resubmit"
          : "Submit Assignment"}
      </button>

    </div>
  );
}


/* =========================
   HELPERS
========================= */

function getAssignmentTitle(
  assignment
) {
  return (
    assignment?.title ||
    assignment?.name ||
    assignment?.assignment_name ||
    "Assignment"
  );
}


function formatDate(date) {
  if (!date) return "--";

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function formatStatus(status) {
  if (!status) return "";

  return String(status)
    .toLowerCase()
    .replace(
      /^\w/,
      (letter) =>
        letter.toUpperCase()
    );
}


export default StudentHomework;