
// import { useCallback, useEffect, useState } from "react";
// import { getStudentDailyTimetable } from "../../services/timetableService";
// import "./Timetable.css";

// const DAYS = [
//   { value: "MONDAY", label: "Monday" },
//   { value: "TUESDAY", label: "Tuesday" },
//   { value: "WEDNESDAY", label: "Wednesday" },
//   { value: "THURSDAY", label: "Thursday" },
//   { value: "FRIDAY", label: "Friday" },
//   { value: "SATURDAY", label: "Saturday" },
// ];

// const getList = (response) => {
//   if (Array.isArray(response)) return response;
//   if (Array.isArray(response?.results)) return response.results;
//   if (Array.isArray(response?.data)) return response.data;
//   if (Array.isArray(response?.data?.results)) return response.data.results;
//   return [];
// };

// const relationName = (item, relation, fallback) => {
//   const value = item?.[relation];

//   if (value && typeof value === "object") {
//     return (
//       value.name ||
//       value.display_name ||
//       value.subject_name ||
//       value.full_name ||
//       value.employee_id ||
//       ""
//     );
//   }

//   return item?.[fallback] || "";
// };

// const formatTime = (time) => {
//   if (!time) return "—";

//   const [hours, minutes] = String(time).split(":");
//   const date = new Date();
//   date.setHours(Number(hours), Number(minutes), 0, 0);

//   return date.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// function StudentTimetable() {
//   const [timetable, setTimetable] = useState([]);
//   const [selectedDay, setSelectedDay] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadTimetable = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await getStudentDailyTimetable(
//         selectedDay || undefined
//       );
//       setTimetable(getList(response));
//     } catch (err) {
//       console.error("Student timetable error:", err);
//       setError(
//         err?.message ||
//           "Unable to load timetable. Please refresh and try again."
//       );
//       setTimetable([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedDay]);

//   useEffect(() => {
//     loadTimetable();
//   }, [loadTimetable]);

//   return (
//     <main className="school-timetable-page">
//       <header className="school-timetable-header">
//         <div>
//           <p className="school-timetable-eyebrow">STUDENT PORTAL</p>
//           <h1>My Timetable</h1>
//           <p>Check your classes, subjects and daily schedule.</p>
//         </div>

//         <button
//           type="button"
//           className="school-timetable-button"
//           onClick={loadTimetable}
//           disabled={loading}
//         >
//           {loading ? "Loading…" : "↻ Refresh"}
//         </button>
//       </header>

//       <section className="school-timetable-card">
//         <div className="school-timetable-toolbar">
//           <div>
//             <h2>Class Schedule</h2>
//             <p>Your assigned class and section timetable.</p>
//           </div>

//           <div className="school-timetable-day-filter">
//             <label htmlFor="student-timetable-day">Select day</label>
//             <select
//               id="student-timetable-day"
//               value={selectedDay}
//               onChange={(event) => setSelectedDay(event.target.value)}
//             >
//               <option value="">All days</option>
//               {DAYS.map((day) => (
//                 <option key={day.value} value={day.value}>
//                   {day.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {error && (
//           <div className="school-timetable-error" role="alert">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="school-timetable-message">
//             Loading your timetable…
//           </div>
//         ) : timetable.length === 0 ? (
//           <div className="school-timetable-empty">
//             <div className="school-timetable-empty-icon">▦</div>
//             <h3>No timetable available</h3>
//             <p>
//               Your school administrator may not have published your timetable
//               yet.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="school-timetable-count">
//               {timetable.length} class period
//               {timetable.length !== 1 ? "s" : ""}
//             </div>

//             <div className="school-timetable-list">
//               {timetable.map((item) => {
//                 const dayLabel =
//                   DAYS.find((day) => day.value === item.day)?.label ||
//                   item.day ||
//                   "Class";

//                 const subject =
//                   relationName(item, "subject", "subject_name") ||
//                   "Subject";

//                 const teacher =
//                   relationName(item, "teacher", "teacher_name") ||
//                   "Teacher not assigned";

//                 const className =
//                   relationName(item, "school_class", "class_name") ||
//                   item.school_class_name ||
//                   "";

//                 const section =
//                   relationName(item, "section", "section_name") ||
//                   item.section_name ||
//                   "";

//                 return (
//                   <article
//                     className="school-timetable-entry"
//                     key={item.id ?? `${item.day}-${item.start_time}-${subject}`}
//                   >
//                     <div className="school-timetable-time">
//                       <strong>{formatTime(item.start_time)}</strong>
//                       <span>to</span>
//                       <strong>{formatTime(item.end_time)}</strong>
//                     </div>

//                     <div className="school-timetable-entry-content">
//                       <span className="school-timetable-day">{dayLabel}</span>
//                       <h3>{subject}</h3>
//                       <p>{teacher}</p>
//                       {(className || section) && (
//                         <span className="school-timetable-meta">
//                           {[className, section && `Section ${section}`]
//                             .filter(Boolean)
//                             .join(" • ")}
//                         </span>
//                       )}
//                     </div>

//                     <div className="school-timetable-room">
//                       <span>ROOM</span>
//                       <strong>{item.room_number || "—"}</strong>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </section>
//     </main>
//   );
// }

// export default StudentTimetable;





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
        "Unable to load timetable. Please try again."
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

      {/* HEADER */}
      <header className="school-timetable-header">
        <div className="timetable-header-content">
          <span className="school-timetable-eyebrow">
            STUDENT ACADEMIC PORTAL
          </span>

          <h1>My Timetable</h1>

          <p>
            Stay organized and keep track of your daily
            classes, subjects and teachers.
          </p>
        </div>

        <div className="timetable-header-right">
          <div className="timetable-header-icon">📅</div>

          <button
            type="button"
            className="school-timetable-button"
            onClick={loadTimetable}
            disabled={loading}
          >
            <span className={loading ? "refresh-loading" : ""}>
              ↻
            </span>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="timetable-header-decoration"></div>
      </header>

      {/* MAIN SCHEDULE */}
      <section className="school-timetable-card">

        {/* TOOLBAR */}
        <div className="school-timetable-toolbar">
          <div className="timetable-title">
            <span className="timetable-section-eyebrow">
              YOUR WEEKLY PLAN
            </span>

            <h2>Class Schedule</h2>

            <p>
              View your assigned classes and daily schedule.
            </p>
          </div>

          <div className="school-timetable-day-filter">
            <label htmlFor="student-timetable-day">
              Filter by day
            </label>

            <select
              id="student-timetable-day"
              value={selectedDay}
              onChange={(event) =>
                setSelectedDay(event.target.value)
              }
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

        {/* DAY QUICK FILTER */}
        <div className="timetable-day-tabs">
          <button
            type="button"
            className={!selectedDay ? "active" : ""}
            onClick={() => setSelectedDay("")}
          >
            All Days
          </button>

          {DAYS.map((day) => (
            <button
              type="button"
              key={day.value}
              className={selectedDay === day.value ? "active" : ""}
              onClick={() => setSelectedDay(day.value)}
            >
              {day.label.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="school-timetable-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="school-timetable-loading">
            <div className="timetable-spinner"></div>
            <h3>Loading timetable</h3>
            <p>Preparing your daily class schedule...</p>
          </div>
        ) : timetable.length === 0 ? (

          /* EMPTY STATE */
          <div className="school-timetable-empty">
            <div className="school-timetable-empty-icon">
              📚
            </div>

            <h3>No Timetable Available</h3>

            <p>
              Your school administrator may not have
              published your timetable yet.
            </p>

            <button
              type="button"
              onClick={loadTimetable}
              className="timetable-empty-button"
            >
              Try Again
            </button>
          </div>

        ) : (

          /* TIMETABLE LIST */
          <>
            <div className="school-timetable-summary">
              <div>
                <span className="summary-number">
                  {timetable.length}
                </span>

                <span className="summary-label">
                  {timetable.length === 1
                    ? "Class Period"
                    : "Class Periods"}
                </span>
              </div>

              <span className="schedule-status">
                <span></span>
                Published Schedule
              </span>
            </div>

            <div className="school-timetable-list">

              {timetable.map((item, index) => {
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
                    key={
                      item.id ??
                      `${item.day}-${item.start_time}-${subject}`
                    }
                  >
                    {/* PERIOD NUMBER */}
                    <div className="timetable-period">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>

                    {/* TIME */}
                    <div className="school-timetable-time">
                      <strong>{formatTime(item.start_time)}</strong>
                      <span>TO</span>
                      <strong>{formatTime(item.end_time)}</strong>
                    </div>

                    {/* SUBJECT DETAILS */}
                    <div className="school-timetable-entry-content">
                      <span className="school-timetable-day">
                        {dayLabel}
                      </span>

                      <h3>{subject}</h3>

                      <p>
                        <span className="teacher-small-icon">👨‍🏫</span>
                        {teacher}
                      </p>

                      {(className || section) && (
                        <span className="school-timetable-meta">
                          {[className, section && `Section ${section}`]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      )}
                    </div>

                    {/* ROOM */}
                    <div className="school-timetable-room">
                      <span>CLASSROOM</span>
                      <strong>
                        {item.room_number || "Not assigned"}
                      </strong>
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
