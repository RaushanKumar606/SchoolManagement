import { useEffect, useState } from "react";
import { getMyAttendance } from "../../services/studentService";


function StudentAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyAttendance();

      if (data?.success === false) {
        throw new Error(
          data?.error || "Failed to load attendance"
        );
      }

      setAttendance(data);
    } catch (err) {
      console.error("Attendance error:", err);

      setError(
        err.message || "Unable to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="attendance-spinner"></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-error">
        <div className="attendance-error-icon">⚠️</div>

        <h2>Unable to Load Attendance</h2>

        <p>{error}</p>

        <button
          onClick={loadAttendance}
          className="attendance-retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="attendance-empty">
        <div>📅</div>
        <h2>No Attendance Data</h2>
        <p>
          Attendance information is not available.
        </p>
      </div>
    );
  }

  const percentage = Number(
    attendance.percentage || 0
  );

  return (
    <div className="student-attendance-page">

      {/* ==============================
          HEADER
      ============================== */}
      <div className="attendance-page-header">
        <div>
          <p className="attendance-breadcrumb">
            Student Portal / Attendance
          </p>

          <h1>Attendance</h1>

          <p>
            View your attendance summary and
            subject-wise attendance.
          </p>
        </div>
      </div>

      {/* ==============================
          SUMMARY CARDS
      ============================== */}
      <div className="attendance-summary">

        {/* Overall */}
        <div className="attendance-stat-card overall">
          <div className="stat-icon">📊</div>

          <div className="stat-content">
            <span>Overall Attendance</span>

            <strong>
              {percentage.toFixed(1)}%
            </strong>
          </div>
        </div>

        {/* Total */}
        <div className="attendance-stat-card total">
          <div className="stat-icon">📚</div>

          <div className="stat-content">
            <span>Total Classes</span>

            <strong>
              {attendance.total || 0}
            </strong>
          </div>
        </div>

        {/* Present */}
        <div className="attendance-stat-card present">
          <div className="stat-icon">✓</div>

          <div className="stat-content">
            <span>Present</span>

            <strong>
              {attendance.present || 0}
            </strong>
          </div>
        </div>

        {/* Absent */}
        <div className="attendance-stat-card absent">
          <div className="stat-icon">×</div>

          <div className="stat-content">
            <span>Absent</span>

            <strong>
              {attendance.absent || 0}
            </strong>
          </div>
        </div>

      </div>

      {/* ==============================
          ATTENDANCE PROGRESS
      ============================== */}
      <div className="attendance-main-grid">

        <div className="attendance-panel">

          <div className="attendance-panel-header">
            <div>
              <h2>Overall Attendance</h2>

              <p>
                Your attendance performance
              </p>
            </div>

            <span className="attendance-percentage">
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="attendance-progress-wrapper">

            <div className="attendance-progress">
              <div
                className="attendance-progress-bar"
                style={{
                  width: `${Math.min(
                    Math.max(percentage, 0),
                    100
                  )}%`,
                }}
              ></div>
            </div>

            <div className="attendance-progress-info">
              <span>
                Present: {attendance.present || 0}
              </span>

              <span>
                Absent: {attendance.absent || 0}
              </span>
            </div>

          </div>

        </div>

        {/* Attendance Status */}
        <div className="attendance-panel status-panel">

          <div className="attendance-panel-header">
            <div>
              <h2>Attendance Status</h2>

              <p>
                Current attendance status
              </p>
            </div>
          </div>

          <AttendanceStatus
            percentage={percentage}
          />

        </div>

      </div>

      {/* ==============================
          SUBJECT-WISE ATTENDANCE
      ============================== */}
      <div className="attendance-panel subject-panel">

        <div className="attendance-panel-header">
          <div>
            <h2>Subject-wise Attendance</h2>

            <p>
              Attendance performance for each subject
            </p>
          </div>
        </div>

        {attendance.subjects?.length > 0 ? (
          <div className="subject-table-wrapper">

            <table className="subject-attendance-table">

              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.subjects.map(
                  (subject, index) => {

                    const subjectPercentage =
                      Number(
                        subject.percentage || 0
                      );

                    return (
                      <tr
                        key={
                          subject.id ||
                          subject.subject_id ||
                          index
                        }
                      >
                        <td>
                          <div className="subject-name">
                            <div className="subject-icon">
                              📖
                            </div>

                            <strong>
                              {subject.subject ||
                                subject.subject_name ||
                                "Unknown Subject"}
                            </strong>
                          </div>
                        </td>

                        <td>
                          {subject.total || 0}
                        </td>

                        <td className="present-text">
                          {subject.present || 0}
                        </td>

                        <td className="absent-text">
                          {subject.absent || 0}
                        </td>

                        <td>
                          <div className="subject-percentage-wrapper">

                            <div className="mini-progress">
                              <div
                                className="mini-progress-bar"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      subjectPercentage,
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>

                            <span>
                              {subjectPercentage.toFixed(
                                1
                              )}
                              %
                            </span>

                          </div>
                        </td>

                        <td>
                          <AttendanceBadge
                            percentage={
                              subjectPercentage
                            }
                          />
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        ) : (
          <div className="no-subject-attendance">
            <div>📚</div>

            <h3>
              No Subject Attendance
            </h3>

            <p>
              Subject-wise attendance data is
              not available yet.
            </p>
          </div>
        )}

      </div>

      {/* ==============================
          RECENT ATTENDANCE
      ============================== */}
      {attendance.recent?.length > 0 && (
        <div className="attendance-panel recent-panel">

          <div className="attendance-panel-header">
            <div>
              <h2>Recent Attendance</h2>

              <p>
                Your recent attendance records
              </p>
            </div>
          </div>

          <div className="recent-attendance-list">

            {attendance.recent.map(
              (record, index) => {

                const isPresent =
                  record.status === "PRESENT" ||
                  record.present === true ||
                  record.is_present === true;

                return (
                  <div
                    className="recent-attendance-item"
                    key={
                      record.id || index
                    }
                  >
                    <div className="recent-date">
                      <span>
                        {formatDate(
                          record.date ||
                            record.attendance_date
                        )}
                      </span>
                    </div>

                    <div className="recent-subject">
                      <strong>
                        {record.subject ||
                          record.subject_name ||
                          "Attendance"}
                      </strong>

                      {record.day && (
                        <small>
                          {record.day}
                        </small>
                      )}
                    </div>

                    <div
                      className={`recent-status ${
                        isPresent
                          ? "status-present"
                          : "status-absent"
                      }`}
                    >
                      {isPresent
                        ? "Present"
                        : "Absent"}
                    </div>
                  </div>
                );
              }
            )}

          </div>
        </div>
      )}

    </div>
  );
}

/* =====================================
   ATTENDANCE STATUS
===================================== */

function AttendanceStatus({ percentage }) {
  let status = "";
  let description = "";

  if (percentage >= 75) {
    status = "Good";
    description =
      "Your attendance is above the required level.";
  } else if (percentage >= 60) {
    status = "Needs Attention";
    description =
      "Try to attend more classes regularly.";
  } else {
    status = "Low Attendance";
    description =
      "Your attendance is below the required level.";
  }

  return (
    <div className="attendance-status-content">

      <div className="status-circle">
        {percentage.toFixed(0)}%
      </div>

      <div>
        <h3>{status}</h3>

        <p>{description}</p>
      </div>

    </div>
  );
}

/* =====================================
   ATTENDANCE BADGE
===================================== */

function AttendanceBadge({ percentage }) {
  if (percentage >= 75) {
    return (
      <span className="attendance-badge good">
        Good
      </span>
    );
  }

  if (percentage >= 60) {
    return (
      <span className="attendance-badge warning">
        Attention
      </span>
    );
  }

  return (
    <span className="attendance-badge danger">
      Low
    </span>
  );
}

/* =====================================
   DATE FORMAT
===================================== */

function formatDate(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default StudentAttendance;