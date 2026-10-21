
import { useCallback, useEffect, useState } from "react";
import { admitCardService } from "../../services/admitCardService";
import "./StudentAdmitCards.css";

function StudentAdmitCards() {
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdmitCards = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await admitCardService.getStudentAdmitCards();

      // Support the actual API response and common wrapped responses.
      const data =
        response?.admitCards ??
        response?.data?.admitCards ??
        response?.data?.data?.admitCards ??
        (Array.isArray(response) ? response : []);

      setAdmitCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admit cards loading error:", err);
      setError(err.message || "Unable to load admit cards.");
      setAdmitCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmitCards();
  }, [loadAdmitCards]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}`.slice(0, 10) + "T00:00:00");

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const parts = String(time).split(":");
    if (parts.length < 2) return time;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const printAdmitCard = (examId) => {
  document
    .querySelectorAll(".admit-card")
    .forEach((card) => {
      card.classList.toggle(
        "print-this-admit-card",
        String(card.dataset.examId) === String(examId)
      );
    });

  window.print();
};

  return (
    <main className="student-admit-page">
      <header className="student-admit-header">
        <div>
          <p className="student-admit-eyebrow">EXAMINATION</p>
          <h1>My Admit Cards</h1>
          <p>View your released examination admit cards.</p>
        </div>

        <button
          type="button"
          className="admit-refresh-btn no-print"
          onClick={loadAdmitCards}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {loading && (
        <div className="admit-message">
          Loading admit cards...
        </div>
      )}

      {!loading && error && (
        <div className="admit-error">
          <h2>Unable to Load Admit Cards</h2>
          <p>{error}</p>
          <button type="button" onClick={loadAdmitCards}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && admitCards.length === 0 && (
        <section className="admit-empty">
          <div className="admit-empty-icon">🎫</div>
          <h2>No Admit Cards Available</h2>
          <p>
            Your admit card will appear here after the school releases it.
          </p>
        </section>
      )}

      {!loading && !error && admitCards.length > 0 && (
        <section className="admit-list">
          {admitCards.map((card, index) => (
            <article
              className="admit-card"
               data-exam-id={card.examId}
              key={`${card.examId ?? "exam"}-${card.studentId ?? index}`}
            >
              <div className="admit-card-top">
                <div className="admit-school-icon">🎓</div>

                <div className="admit-school-info">
                  <h2>Examination Admit Card</h2>
                  <p>School Management System</p>
                </div>

                <span className="admit-released">Released</span>
              </div>

              <div className="admit-exam-title">
                {card.examName || "Examination"}
              </div>

              <div className="admit-details-grid">
                <div>
                  <span>Student Name</span>
                  <strong>{card.studentName || "—"}</strong>
                </div>

                <div>
                  <span>Student ID</span>
                  <strong>{card.studentId || "—"}</strong>
                </div>

                <div>
                  <span>Class</span>
                  <strong>{card.class || "—"}</strong>
                </div>

                <div>
                  <span>Section</span>
                  <strong>{card.section || "—"}</strong>
                </div>

                <div>
                  <span>Academic Year</span>
                  <strong>{card.academicYear || "—"}</strong>
                </div>

                <div>
                  <span>Exam Start Date</span>
                  <strong>{formatDate(card.startDate)}</strong>
                </div>

                <div>
                  <span>Exam End Date</span>
                  <strong>{formatDate(card.endDate)}</strong>
                </div>
              </div>

              <div className="admit-schedule">
                <h3>Examination Schedule</h3>

                {Array.isArray(card.timetable) &&
                card.timetable.length > 0 ? (
                  <div className="admit-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Total Marks</th>
                          <th>Passing Marks</th>
                        </tr>
                      </thead>

                      <tbody>
                        {card.timetable.map((schedule, scheduleIndex) => (
                          <tr
                            key={`${schedule.subjectId ?? "subject"}-${scheduleIndex}`}
                          >
                            <td>{schedule.subject || "—"}</td>
                            <td>{formatDate(schedule.examDate)}</td>
                            <td>{formatTime(schedule.startTime)}</td>
                            <td>{formatTime(schedule.endTime)}</td>
                            <td>{schedule.totalMarks ?? "—"}</td>
                            <td>{schedule.passingMarks ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admit-schedule-note">
                    No examination schedule is available for this exam.
                  </p>
                )}
              </div>

              <div className="admit-card-footer">
                <span>
                  Please bring this admit card to the examination.
                </span>

                <button
                  type="button"
                  className="admit-print-btn no-print"
                 onClick={() => printAdmitCard(card.examId)}
                >
                  Print / Save PDF
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default StudentAdmitCards;
