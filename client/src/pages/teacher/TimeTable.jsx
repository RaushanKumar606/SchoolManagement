
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

function TimeTable() {
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("employee_id");

  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // ==========================================
  // Load Teacher Timetable
  // ==========================================
  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }

    fetchTimetable();
  }, [employeeId, navigate]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const res =
        await teacherService.getTeacherTimetable(
          employeeId
        );

      if (res.success) {
        const data =
          res.data?.results ||
          res.data ||
          res.timetable ||
          res.results ||
          [];

        setTimetable(
          Array.isArray(data) ? data : []
        );
      } else {
        setError(
          res.message ||
            "Unable to load timetable."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Helpers
  // ==========================================
  const getDay = (item) =>
    item.day ||
    item.day_name ||
    item.weekday ||
    "";

  const getClassName = (item) =>
    item.school_class?.name ||
    item.schoolClass?.name ||
    item.class_name ||
    item.class ||
    "-";

  const getSectionName = (item) =>
    item.section?.name ||
    item.section_name ||
    item.section ||
    "-";

  const getSubjectName = (item) =>
    item.subject?.name ||
    item.subject_name ||
    item.subject ||
    "-";

  const getStartTime = (item) =>
    item.start_time ||
    item.startTime ||
    item.start ||
    "-";

  const getEndTime = (item) =>
    item.end_time ||
    item.endTime ||
    item.end ||
    "-";

  const getRoom = (item) =>
    item.room ||
    item.room_number ||
    item.roomNumber ||
    "-";

  // ==========================================
  // Filter Timetable
  // ==========================================
  const filteredTimetable =
    selectedDay === "All"
      ? timetable
      : timetable.filter(
          (item) =>
            getDay(item).toLowerCase() ===
            selectedDay.toLowerCase()
        );

  // ==========================================
  // Sort By Day & Time
  // ==========================================
  const sortedTimetable = [...filteredTimetable].sort(
    (a, b) => {
      const timeA = getStartTime(a);
      const timeB = getStartTime(b);

      return String(timeA).localeCompare(
        String(timeB)
      );
    }
  );

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="teacher-page">
        <div className="teacher-page-header">
          <div>
            <h2>My Timetable</h2>
            <p>
              View your assigned classes and subjects.
            </p>
          </div>
        </div>

        <div className="teacher-loading">
          Loading timetable...
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
          <h2>My Timetable</h2>
          <p>
            View your daily class and subject
            schedule.
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
          Error
      ====================================== */}
      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {/* =====================================
          Day Filter
      ====================================== */}
      <section className="timetable-section">
        <div className="section-heading">
          <div>
            <h3>Class Schedule</h3>
            <p>
              Select a day to view your classes.
            </p>
          </div>

          <span className="student-count">
            {timetable.length} Classes
          </span>
        </div>

        <div className="day-filter">
          <button
            type="button"
            className={`day-btn ${
              selectedDay === "All"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedDay("All")
            }
          >
            All
          </button>

          {days.map((day) => (
            <button
              type="button"
              key={day}
              className={`day-btn ${
                selectedDay === day
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedDay(day)
              }
            >
              {day}
            </button>
          ))}
        </div>

        {/* =====================================
            Timetable
        ====================================== */}
        {sortedTimetable.length === 0 ? (
          <div className="empty-state">
            {selectedDay === "All"
              ? "No timetable has been assigned to you."
              : `No classes scheduled for ${selectedDay}.`}
          </div>
        ) : (
          <div className="timetable-table-wrapper">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Room</th>
                </tr>
              </thead>

              <tbody>
                {sortedTimetable.map(
                  (item, index) => (
                    <tr
                      key={
                        item.id ||
                        item.timetable_id ||
                        index
                      }
                    >
                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {getDay(item) || "-"}
                        </strong>
                      </td>

                      <td>
                        <div className="time-cell">
                          <span>
                            {getStartTime(item)}
                          </span>
                          <span> - </span>
                          <span>
                            {getEndTime(item)}
                          </span>
                        </div>
                      </td>

                      <td>
                        {getClassName(item)}
                      </td>

                      <td>
                        {getSectionName(item)}
                      </td>

                      <td>
                        <strong>
                          {getSubjectName(item)}
                        </strong>
                      </td>

                      <td>
                        {getRoom(item)}
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

export default TimeTable;
