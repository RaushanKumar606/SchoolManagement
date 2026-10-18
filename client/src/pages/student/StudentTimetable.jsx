import { useEffect, useState } from "react";
import {
  getMyStudentTimetable,
} from "../../services/studentService";

function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStudentTimetable();

      /*
        Backend response ko handle karne ke liye
        common response formats support kiye gaye hain.
      */
      const timetableData =
        Array.isArray(data)
          ? data
          : data?.timetable ||
            data?.data ||
            data?.results ||
            [];

      setTimetable(timetableData);
    } catch (err) {
      console.error("Timetable error:", err);

      setError(
        err?.message ||
          "Failed to load timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GROUP BY DAY
  ========================= */

 const groupedTimetable = timetable.reduce((groups, item) => {
  const rawDay = item.day || item.day_name || "OTHER";
  const day = String(rawDay).trim().toUpperCase();

  if (!groups[day]) {
    groups[day] = [];
  }

  groups[day].push(item);
  return groups;
}, {});

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="student-timetable-page">
        <div className="timetable-loading">
          <div className="timetable-spinner"></div>
          <p>Loading timetable...</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="student-timetable-page">
        <div className="timetable-error">
          <h3>Unable to load timetable</h3>

          <p>{error}</p>

          <button
            onClick={loadTimetable}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="student-timetable-page">

      {/* HEADER */}

      <div className="timetable-header">
        <div>
          <h1>My Timetable</h1>

          <p>
            View your weekly class schedule.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadTimetable}
        >
          ↻ Refresh
        </button>
      </div>


      {/* EMPTY */}

      {timetable.length === 0 ? (
        <div className="timetable-empty">
          <div className="empty-icon">📅</div>

          <h3>No Timetable Found</h3>

          <p>
            Your class timetable has not been
            assigned yet.
          </p>
        </div>
      ) : (
        <div className="timetable-container">

          {days.map((day) => {

            const dayClasses =
              groupedTimetable[day] || [];

            return (
              <div
                className="timetable-day"
                key={day}
              >

                {/* DAY HEADER */}

                <div className="day-header">
                  <h2>
                    {formatDay(day)}
                  </h2>

                  <span>
                    {dayClasses.length}{" "}
                    {dayClasses.length === 1
                      ? "Class"
                      : "Classes"}
                  </span>
                </div>


                {/* CLASSES */}

                {dayClasses.length === 0 ? (
                  <div className="no-class">
                    No classes scheduled
                  </div>
                ) : (
                  <div className="class-list">

                    {dayClasses.map(
                      (item, index) => (
                        <TimetableCard
                          key={
                            item.id || index
                          }
                          item={item}
                        />
                      )
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}


/* =========================
   TIMETABLE CARD
========================= */

function TimetableCard({ item }) {

  const subject =
    item.subject_name ||
    item.subject?.name ||
    item.subject ||
    "Subject";

  const teacher =
    item.teacher_name ||
    item.teacher?.name ||
    item.teacher ||
    "Teacher not assigned";

  const startTime =
    item.start_time ||
    item.start ||
    "";

  const endTime =
    item.end_time ||
    item.end ||
    "";

  const room =
    item.room ||
    item.room_number ||
    item.classroom ||
    "";

  const period =
    item.period ||
    item.period_number ||
    "";

  return (
    <div className="class-card">

      <div className="class-time">

        <strong>
          {formatTime(startTime)}
        </strong>

        {endTime && (
          <>
            <span>to</span>

            <strong>
              {formatTime(endTime)}
            </strong>
          </>
        )}

      </div>


      <div className="class-details">

        <h3>{subject}</h3>

        <p>
          👨‍🏫 {teacher}
        </p>

        {room && (
          <p>
            🏫 Room: {room}
          </p>
        )}

      </div>


      {period && (
        <div className="period-badge">
          Period {period}
        </div>
      )}

    </div>
  );
}


/* =========================
   HELPERS
========================= */

function formatDay(day) {
  if (!day) return "";

  return day
    .toLowerCase()
    .replace(
      /^\w/,
      (letter) =>
        letter.toUpperCase()
    );
}


function formatTime(time) {
  if (!time) return "--";

  /*
    24-hour time ko readable format
    mein convert karta hai.
  */

  const [hours, minutes] =
    String(time).split(":");

  if (
    hours === undefined ||
    minutes === undefined
  ) {
    return time;
  }

  let hour = Number(hours);

  const ampm =
    hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minutes} ${ampm}`;
}


export default StudentTimetable;