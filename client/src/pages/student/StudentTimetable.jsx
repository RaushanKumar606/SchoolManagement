
import { useCallback, useEffect, useState } from "react";
import { getStudentDailyTimetable } from "../../services/timetableService";
import "./Timetable.css";

const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

const getList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  return [];
};

const relationName = (item, relation, fallback) => {
  const value = item?.[relation];

  if (value && typeof value === "object") {
    return (
      value.name ||
      value.display_name ||
      value.subject_name ||
      value.full_name ||
      value.employee_id ||
      ""
    );
  }

  return item?.[fallback] || "";
};

const formatTime = (time) => {
  if (!time) return "—";

  const [hours, minutes] = String(time).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTimetable = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getStudentDailyTimetable(
        selectedDay || undefined
      );
      setTimetable(getList(response));
    } catch (err) {
      console.error("Student timetable error:", err);
      setError(
        err?.message ||
          "Unable to load timetable. Please refresh and try again."
      );
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  return (
    <main className="school-timetable-page">
      <header className="school-timetable-header">
        <div>
          <p className="school-timetable-eyebrow">STUDENT PORTAL</p>
          <h1>My Timetable</h1>
          <p>Check your classes, subjects and daily schedule.</p>
        </div>

        <button
          type="button"
          className="school-timetable-button"
          onClick={loadTimetable}
          disabled={loading}
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </header>

      <section className="school-timetable-card">
        <div className="school-timetable-toolbar">
          <div>
            <h2>Class Schedule</h2>
            <p>Your assigned class and section timetable.</p>
          </div>

          <div className="school-timetable-day-filter">
            <label htmlFor="student-timetable-day">Select day</label>
            <select
              id="student-timetable-day"
              value={selectedDay}
              onChange={(event) => setSelectedDay(event.target.value)}
            >
              <option value="">All days</option>
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="school-timetable-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="school-timetable-message">
            Loading your timetable…
          </div>
        ) : timetable.length === 0 ? (
          <div className="school-timetable-empty">
            <div className="school-timetable-empty-icon">▦</div>
            <h3>No timetable available</h3>
            <p>
              Your school administrator may not have published your timetable
              yet.
            </p>
          </div>
        ) : (
          <>
            <div className="school-timetable-count">
              {timetable.length} class period
              {timetable.length !== 1 ? "s" : ""}
            </div>

            <div className="school-timetable-list">
              {timetable.map((item) => {
                const dayLabel =
                  DAYS.find((day) => day.value === item.day)?.label ||
                  item.day ||
                  "Class";

                const subject =
                  relationName(item, "subject", "subject_name") ||
                  "Subject";

                const teacher =
                  relationName(item, "teacher", "teacher_name") ||
                  "Teacher not assigned";

                const className =
                  relationName(item, "school_class", "class_name") ||
                  item.school_class_name ||
                  "";

                const section =
                  relationName(item, "section", "section_name") ||
                  item.section_name ||
                  "";

                return (
                  <article
                    className="school-timetable-entry"
                    key={item.id ?? `${item.day}-${item.start_time}-${subject}`}
                  >
                    <div className="school-timetable-time">
                      <strong>{formatTime(item.start_time)}</strong>
                      <span>to</span>
                      <strong>{formatTime(item.end_time)}</strong>
                    </div>

                    <div className="school-timetable-entry-content">
                      <span className="school-timetable-day">{dayLabel}</span>
                      <h3>{subject}</h3>
                      <p>{teacher}</p>
                      {(className || section) && (
                        <span className="school-timetable-meta">
                          {[className, section && `Section ${section}`]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      )}
                    </div>

                    <div className="school-timetable-room">
                      <span>ROOM</span>
                      <strong>{item.room_number || "—"}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default StudentTimetable;
