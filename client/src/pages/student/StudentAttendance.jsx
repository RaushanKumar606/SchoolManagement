
import { useCallback, useEffect, useState } from "react";
import studentService  from "../../services/studentService";
import "./Attendance.css";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "—";

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StudentAttendance() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [attendance, setAttendance] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await studentService.getMyDailyAttendance(selectedDate);

      // API response direct object ya wrapped response ho sakta hai.
      const data = response?.data ?? response;

      if (data?.success === false) {
        throw new Error(
          data.error || "Attendance load nahi ho payi."
        );
      }

      setAttendance(
        Array.isArray(data?.attendance) ? data.attendance : []
      );

      setStudentId(data?.studentId || "");
    } catch (err) {
      console.error("Student attendance error:", err);
      setAttendance([]);
      setError(
        err?.message || "Attendance load nahi ho payi. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const presentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const totalCount = attendance.length;

  const attendancePercentage =
    totalCount > 0
      ? Math.round((presentCount / totalCount) * 100)
      : 0;

  return (
    <div className="student-attendance-page">
      <div className="attendance-page-header">
        <div>
          <h1>My Attendance</h1>

          <p>
            Apni daily subject-wise attendance aur attendance status check karein.
          </p>
        </div>

        <button
          type="button"
          className="attendance-refresh-btn"
          onClick={loadAttendance}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="attendance-filter-card">
        <div className="attendance-date-control">
          <label htmlFor="attendance-date">
            Select Attendance Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            max={getTodayDate()}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        {studentId && (
          <div className="attendance-student-id">
            <span>Student ID</span>
            <strong>{studentId}</strong>
          </div>
        )}
      </div>

      {error && (
        <div className="attendance-error" role="alert">
          <strong>Unable to load attendance</strong>
          <p>{error}</p>

          <button type="button" onClick={loadAttendance}>
            Try Again
          </button>
        </div>
      )}

      <div className="attendance-summary-grid">
        <div className="attendance-summary-card total">
          <div className="attendance-summary-icon">📋</div>
          <div>
            <span>Total Records</span>
            <h2>{loading ? "—" : totalCount}</h2>
            <small>Selected date</small>
          </div>
        </div>

        <div className="attendance-summary-card present">
          <div className="attendance-summary-icon">✓</div>
          <div>
            <span>Present</span>
            <h2>{loading ? "—" : presentCount}</h2>
            <small>Present records</small>
          </div>
        </div>

        <div className="attendance-summary-card absent">
          <div className="attendance-summary-icon">✕</div>
          <div>
            <span>Absent</span>
            <h2>{loading ? "—" : absentCount}</h2>
            <small>Absent records</small>
          </div>
        </div>

        <div className="attendance-summary-card percentage">
          <div className="attendance-summary-icon">%</div>
          <div>
            <span>Daily Attendance</span>
            <h2>{loading ? "—" : `${attendancePercentage}%`}</h2>
            <small>Present / total records</small>
          </div>
        </div>
      </div>

      <div className="attendance-table-card">
        <div className="attendance-table-header">
          <div>
            <h2>Attendance Details</h2>
            <p>{formatDate(selectedDate)}</p>
          </div>

          <span className="attendance-record-count">
            {totalCount} {totalCount === 1 ? "record" : "records"}
          </span>
        </div>

        {loading ? (
          <div className="attendance-state">
            <div className="attendance-spinner" />
            <p>Attendance load ho rahi hai...</p>
          </div>
        ) : error ? (
          <div className="attendance-state">
            <p>Data display nahi ho raha hai.</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="attendance-empty">
            <div className="attendance-empty-icon">📅</div>
            <h3>No Attendance Records</h3>
            <p>
              {formatDate(selectedDate)} ke liye attendance record nahi mila.
              Ho sakta hai teacher ne abhi attendance mark na ki ho.
            </p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Teacher</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((record, index) => {
                  const isPresent =
                    record.status?.toLowerCase() === "present";

                  return (
                    <tr key={record.id ?? `${record.subjectId}-${index}`}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {record.subject || "Subject not available"}
                        </strong>
                      </td>

                      <td>{formatDate(record.date || selectedDate)}</td>

                      <td>{record.teacher || "—"}</td>

                      <td>
                        <span
                          className={`attendance-status ${
                            isPresent ? "status-present" : "status-absent"
                          }`}
                        >
                          <span className="attendance-status-dot" />
                          {record.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="attendance-page-note">
        Note: Attendance records teacher ke dwara mark kiye gaye data par based hain.
      </p>
    </div>
  );
}

export default StudentAttendance;
