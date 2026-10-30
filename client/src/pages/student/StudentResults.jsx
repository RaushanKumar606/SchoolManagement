
import React, { useCallback, useEffect, useState } from "react";
import { getMyPublishedResults } from "../../services/exams";
import "./StudentResults.css";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyPublishedResults();

      const data = Array.isArray(response)
        ? response
        : response?.results ??
          response?.data ??
          response?.results_list ??
          [];

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message || "Results load nahi ho sake. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const getValue = (item, keys, fallback = "—") => {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return fallback;
  };

  const getMarks = (item) => {
    const obtained = Number(
      getValue(item, ["obtained_marks", "marks_obtained", "marks", "marks_obtained_total"], 0)
    );
    const total = Number(
      getValue(item, ["total_marks", "maximum_marks", "max_marks"], 0)
    );

    return { obtained, total };
  };

  const getStatus = (item) => {
    const status = getValue(item, ["status", "result_status", "grade"], "");
    if (status !== "") return String(status);

    const { obtained, total } = getMarks(item);
    if (!total) return "Not available";

    const passingMarks = Number(
      getValue(item, ["passing_marks", "pass_marks"], 0)
    );

    return obtained >= passingMarks ? "Pass" : "Fail";
  };

  const getPercentage = (item) => {
    const direct = item?.percentage;
    if (direct !== undefined && direct !== null && direct !== "") {
      return `${Number(direct).toFixed(2)}%`;
    }

    const { obtained, total } = getMarks(item);
    return total > 0
      ? `${((obtained / total) * 100).toFixed(2)}%`
      : "—";
  };

  const printResults = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="student-results-page">
        <div className="results-message">Loading your results...</div>
      </div>
    );
  }

  return (
    <main className="student-results-page">
      <section className="results-header">
        <div>
          <p className="results-eyebrow">ACADEMIC PERFORMANCE</p>
          <h1>My Results</h1>
          <p className="results-subtitle">
            View your published examination results and marks.
          </p>
        </div>

        <div className="results-actions">
          <button
            type="button"
            className="results-btn results-btn-secondary"
            onClick={loadResults}
          >
            Refresh
          </button>
          <button
            type="button"
            className="results-btn results-btn-primary"
            onClick={printResults}
            disabled={results.length === 0}
          >
            Print / Save PDF
          </button>
        </div>
      </section>

      {error && (
        <div className="results-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={loadResults}>
            Try Again
          </button>
        </div>
      )}

      {!error && results.length === 0 && (
        <section className="results-empty">
          <div className="results-empty-icon">📋</div>
          <h2>No published results yet</h2>
          <p>
            Your results will appear here after your school publishes them.
          </p>
        </section>
      )}

      {results.length > 0 && (
        <section className="results-content">
          <div className="results-summary">
            <div className="results-summary-card">
              <span>Published Records</span>
              <strong>{results.length}</strong>
            </div>
            <div className="results-summary-card">
              <span>Subjects Listed</span>
              <strong>{results.length}</strong>
            </div>
          </div>

          <div className="results-table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Obtained Marks</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => {
                  const { obtained, total } = getMarks(item);
                  const status = getStatus(item);
                  const isPass = status.toLowerCase().includes("pass") &&
                    !status.toLowerCase().includes("fail");

                  return (
                    <tr key={item.id ?? `${index}-${item.subject ?? "result"}`}>
                      <td>{index + 1}</td>
                      <td>
                        {getValue(item, [
                          "exam_name",
                          "exam",
                          "examination_name",
                        ])}
                      </td>
                      <td>
                        {getValue(item, [
                          "subject_name",
                          "subject",
                        ])}
                      </td>
                      <td>{obtained}</td>
                      <td>{total || "—"}</td>
                      <td>{getPercentage(item)}</td>
                      <td>
                        <span
                          className={`results-status ${
                            isPass ? "results-status-pass" : "results-status-other"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="results-note">
            Only results published by your school are displayed here.
          </p>
        </section>
      )}
    </main>
  );
}

export default StudentResults;
