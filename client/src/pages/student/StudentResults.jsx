import { useEffect, useState } from "react";
import { getMyExamResults } from "../../services/studentService";


function StudentResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyExamResults();

      setResults(data);
    } catch (err) {
      console.error("Result error:", err);

      setError(
        err?.message ||
          "Failed to load examination results."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="student-results-page">
        <div className="result-loading">
          <div className="result-spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="student-results-page">
        <div className="result-error">
          <h3>Unable to load results</h3>

          <p>{error}</p>

          <button
            className="result-retry-btn"
            onClick={loadResults}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const student =
    results?.student ||
    results?.student_details ||
    {};

  const examResults =
    results?.results ||
    results?.exam_results ||
    results?.exams ||
    [];

  const statistics =
    results?.statistics ||
    results?.stats ||
    {};

  /* =========================
     EMPTY
  ========================= */

  if (examResults.length === 0) {
    return (
      <div className="student-results-page">
        <div className="result-header no-print">
          <div>
            <h1>My Results</h1>
            <p>
              View your examination results.
            </p>
          </div>
        </div>

        <div className="result-empty">
          <div className="result-empty-icon">
            📊
          </div>

          <h3>No Results Found</h3>

          <p>
            Your examination results have not
            been published yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-results-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="result-header no-print">

        <div>
          <h1>My Results</h1>

          <p>
            View and print your examination
            report card.
          </p>
        </div>

        <button
          className="print-result-btn"
          onClick={() => window.print()}
        >
          🖨 Print Result
        </button>

      </div>


      {/* =========================
          A4 RESULT SHEET
      ========================= */}

      <div className="a4-result-sheet">

        {/* SCHOOL HEADER */}

        <div className="school-result-header">

          <div className="school-logo">
            S
          </div>

          <div className="school-heading">

            <h1>
              YOUR SCHOOL NAME
            </h1>

            <p>
              School Management System
            </p>

            <p>
              Address, City, State, India
            </p>

          </div>

        </div>


        <div className="result-title">
          <h2>
            STUDENT REPORT CARD
          </h2>

          <p>
            Academic Examination Result
          </p>
        </div>


        {/* =========================
            STUDENT INFORMATION
        ========================= */}

        <div className="student-info-section">

          <div className="student-info-row">

            <InfoItem
              label="Student Name"
              value={
                student.name ||
                student.full_name ||
                `${student.first_name || ""} ${
                  student.last_name || ""
                }`.trim() ||
                "--"
              }
            />

            <InfoItem
              label="Student ID"
              value={
                student.student_id ||
                student.admission_number ||
                student.id ||
                "--"
              }
            />

          </div>


          <div className="student-info-row">

            <InfoItem
              label="Class"
              value={
                student.class_name ||
                student.class ||
                "--"
              }
            />

            <InfoItem
              label="Section"
              value={
                student.section_name ||
                student.section ||
                "--"
              }
            />

          </div>


          <div className="student-info-row">

            <InfoItem
              label="Roll Number"
              value={
                student.roll_number ||
                student.roll_no ||
                "--"
              }
            />

            <InfoItem
              label="Academic Year"
              value={
                student.academic_year ||
                results?.academic_year ||
                "--"
              }
            />

          </div>

        </div>


        {/* =========================
            EXAM RESULTS
        ========================= */}

        {examResults.map(
          (exam, examIndex) => {

            const subjects =
              exam.subjects ||
              exam.marks ||
              exam.results ||
              [];

            const examName =
              exam.exam_name ||
              exam.name ||
              exam.exam ||
              `Examination ${examIndex + 1}`;

            return (
              <div
                className="exam-section"
                key={
                  exam.id ||
                  examIndex
                }
              >

                <div className="exam-heading">
                  <h3>
                    {examName}
                  </h3>
                </div>


                <table className="result-table">

                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Subject</th>
                      <th>Max Marks</th>
                      <th>Obtained</th>
                      <th>Grade</th>
                    </tr>
                  </thead>

                  <tbody>

                    {subjects.map(
                      (subject, index) => {

                        const maxMarks =
                          Number(
                            subject.max_marks ||
                            subject.maximum_marks ||
                            subject.total_marks ||
                            100
                          );

                        const obtained =
                          Number(
                            subject.obtained_marks ||
                            subject.marks_obtained ||
                            subject.marks ||
                            0
                          );

                        const grade =
                          subject.grade ||
                          calculateGrade(
                            obtained,
                            maxMarks
                          );

                        return (
                          <tr
                            key={
                              subject.id ||
                              index
                            }
                          >

                            <td>
                              {index + 1}
                            </td>

                            <td className="subject-name">
                              {subject.subject_name ||
                                subject.subject?.name ||
                                subject.subject ||
                                "Subject"}
                            </td>

                            <td>
                              {maxMarks}
                            </td>

                            <td>
                              {obtained}
                            </td>

                            <td>
                              <span className="grade">
                                {grade}
                              </span>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>


                {/* EXAM SUMMARY */}

                <div className="exam-summary">

                  <SummaryItem
                    label="Total Marks"
                    value={
                      exam.total_marks ||
                      exam.maximum_marks ||
                      calculateTotalMax(
                        subjects
                      )
                    }
                  />

                  <SummaryItem
                    label="Obtained Marks"
                    value={
                      exam.obtained_marks ||
                      exam.total_obtained ||
                      calculateTotalObtained(
                        subjects
                      )
                    }
                  />

                  <SummaryItem
                    label="Percentage"
                    value={`${formatPercentage(
                      exam.percentage ||
                        calculatePercentage(
                          subjects
                        )
                    )}%`}
                  />

                  <SummaryItem
                    label="Result"
                    value={
                      exam.result ||
                      exam.status ||
                      getResultStatus(
                        exam,
                        subjects
                      )
                    }
                  />

                </div>

              </div>
            );
          }
        )}


        {/* =========================
            OVERALL SUMMARY
        ========================= */}

        <div className="overall-section">

          <h3>
            Overall Performance
          </h3>

          <div className="overall-grid">

            <SummaryItem
              label="Overall Percentage"
              value={`${formatPercentage(
                statistics.percentage ||
                  results?.percentage ||
                  calculateOverallPercentage(
                    examResults
                  )
              )}%`}
            />

            <SummaryItem
              label="Overall Grade"
              value={
                statistics.grade ||
                results?.grade ||
                calculateOverallGrade(
                  examResults
                )
              }
            />

            <SummaryItem
              label="Final Result"
              value={
                statistics.result ||
                results?.result ||
                "PASS"
              }
            />

          </div>

        </div>


        {/* =========================
            SIGNATURES
        ========================= */}

        <div className="signature-section">

          <div className="signature-box">
            <div className="signature-line"></div>
            <p>Class Teacher</p>
          </div>

          <div className="signature-box">
            <div className="signature-line"></div>
            <p>Principal</p>
          </div>

          <div className="signature-box">
            <div className="signature-line"></div>
            <p>Parent / Guardian</p>
          </div>

        </div>


        {/* FOOTER */}

        <div className="result-footer">
          <p>
            This is a computer-generated report
            card.
          </p>

          <p>
            Generated on{" "}
            {new Date().toLocaleDateString(
              "en-IN"
            )}
          </p>
        </div>

      </div>

    </div>
  );
}


/* =========================
   INFO ITEM
========================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


/* =========================
   SUMMARY ITEM
========================= */

function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


/* =========================
   CALCULATIONS
========================= */

function calculateTotalMax(
  subjects
) {
  return subjects.reduce(
    (total, subject) =>
      total +
      Number(
        subject.max_marks ||
          subject.maximum_marks ||
          subject.total_marks ||
          100
      ),
    0
  );
}


function calculateTotalObtained(
  subjects
) {
  return subjects.reduce(
    (total, subject) =>
      total +
      Number(
        subject.obtained_marks ||
          subject.marks_obtained ||
          subject.marks ||
          0
      ),
    0
  );
}


function calculatePercentage(
  subjects
) {
  const max =
    calculateTotalMax(subjects);

  const obtained =
    calculateTotalObtained(subjects);

  if (!max) return 0;

  return (obtained / max) * 100;
}


function calculateOverallPercentage(
  exams
) {
  if (!exams.length) return 0;

  let totalMax = 0;
  let totalObtained = 0;

  exams.forEach((exam) => {
    const subjects =
      exam.subjects ||
      exam.marks ||
      exam.results ||
      [];

    totalMax +=
      calculateTotalMax(subjects);

    totalObtained +=
      calculateTotalObtained(subjects);
  });

  if (!totalMax) return 0;

  return (
    (totalObtained / totalMax) *
    100
  );
}


function calculateGrade(
  obtained,
  max
) {
  if (!max) return "--";

  const percentage =
    (obtained / max) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";

  return "F";
}


function calculateOverallGrade(
  exams
) {
  const percentage =
    calculateOverallPercentage(
      exams
    );

  return calculateGrade(
    percentage,
    100
  );
}


function getResultStatus(
  exam,
  subjects
) {
  if (
    String(
      exam.result ||
        exam.status ||
        ""
    ).toLowerCase() === "fail"
  ) {
    return "FAIL";
  }

  const hasFailedSubject =
    subjects.some((subject) => {
      const max =
        Number(
          subject.max_marks ||
            subject.maximum_marks ||
            subject.total_marks ||
            100
        );

      const obtained =
        Number(
          subject.obtained_marks ||
            subject.marks_obtained ||
            subject.marks ||
            0
        );

      return (
        calculatePercentage([
          {
            max_marks: max,
            marks: obtained,
          },
        ]) < 33
      );
    });

  return hasFailedSubject
    ? "FAIL"
    : "PASS";
}


function formatPercentage(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}


export default StudentResults;