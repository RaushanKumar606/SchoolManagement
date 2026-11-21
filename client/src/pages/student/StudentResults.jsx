
import { useEffect, useMemo, useState } from "react";
import { getMyPublishedResults } from "../../services/exams";
import schoolLogo from "../../assets/schoolLogo.png";
import "./StudentResults.css";

const SCHOOL = {
  name: "Springfield School",
  motto: "Knowledge • Character • Excellence",
  connected: "Affiliated to CBSE, New Delhi | School Code: 57842",
  address: "School Road, Sikati Parsa, Saran, India 841219",
  otherInfo: "Phone: +91 8102891606 | info@springfieldschool.edu",
  leftLogo: schoolLogo,
  rightLogo: schoolLogo,
};

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
}

function SchoolLogo({ src }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="report-logo-placeholder">SCHOOL</div>;
  }

  return (
    <img
      className="report-logo"
      src={src}
      alt="School Logo"
      onError={() => setImageError(true)}
    />
  );
}

function getGradeClass(grade) {
  if (grade === "A+" || grade === "A") return "grade-excellent";
  if (grade === "B" || grade === "C") return "grade-good";
  if (grade === "D" || grade === "E") return "grade-average";
  if (grade === "F") return "grade-fail";
  return "";
}

function getStatusClass(status) {
  if (status === "PASS") return "status-pass";
  if (status === "FAIL") return "status-fail";
  return "status-na";
}

function StudentResults() {
  const [data, setData] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await getMyPublishedResults();
        const payload = response?.data ?? response;

        if (!mounted) return;

        const examResults = Array.isArray(payload?.results)
          ? payload.results
          : [];

        setData({
          studentId: payload?.studentId,
          studentName: payload?.studentName,
          fatherName: payload?.fatherName,
          motherName: payload?.motherName,
          rollNumber: payload?.rollNumber,
          stream: payload?.stream,
          dateOfBirth: payload?.dateOfBirth,
          studentImage: payload?.studentImage,
          results: examResults,
        });

        if (examResults.length > 0) {
          setSelectedExamId(String(examResults[0].examId));
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.error ||
            err?.message ||
            "Unable to load student results."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedExam = useMemo(() => {
    if (!data?.results?.length) return null;

    return (
      data.results.find(
        (exam) => String(exam.examId) === selectedExamId
      ) || data.results[0]
    );
  }, [data, selectedExamId]);

  const subjects = selectedExam?.subjects || [];

  if (loading) {
    return (
      <div className="student-results-page">
        <div className="results-message">Loading student results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-results-page">
        <div className="results-message results-error">{error}</div>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="student-results-page">
        <div className="results-message">
          No published results available.
        </div>
      </div>
    );
  }

  return (
    <div className="student-results-page">

      {/* TOOLBAR */}
      <div className="report-toolbar">
        <div>
          <label htmlFor="exam-select">Select Examination</label>

          <select
            id="exam-select"
            value={selectedExam?.examId ?? ""}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {data.results.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="print-result-btn"
          onClick={() => window.print()}
        >
          Print Report Card
        </button>
      </div>

      <div className="report-card">

        {/* SCHOOL HEADER */}
        <header className="report-header">

          <SchoolLogo src={SCHOOL.leftLogo} />

          <div className="report-school-info">
            <h1>{SCHOOL.name}</h1>
            <p>{SCHOOL.motto}</p>
            {/* <p>{SCHOOL.address}</p>
            <p>{SCHOOL.otherInfo}</p> */}

            <h2>
              MARK SHEET FOR EXAMINATION SESSION{" "}
              {formatValue(selectedExam.academicYear)}
              {" "}({selectedExam.examName})
            </h2>
          </div>

          <SchoolLogo src={SCHOOL.rightLogo} />

        </header>

{/* STUDENT INFORMATION */}
<section className="report-section">
  <h3>STUDENT INFORMATION</h3>

  <div className="report-student-container">

    {/* STUDENT DETAILS TABLE */}
    <div className="student-information-left">

      <table className="student-information-table">
        <tbody>

          <tr>
            <th>Student ID</th>
            <td>{formatValue(data.studentId)}</td>
          

            <th>Student Name</th>
            <td>{formatValue(data.studentName)}</td>
          </tr>

          <tr>
            <th>Father Name</th>
            <td>{formatValue(data.fatherName)}</td>

            <th>Mother Name</th>
            <td>{formatValue(data.motherName)}</td>
          </tr>

          <tr>
            <th>Name of School</th>
            <td colSpan={3}>Springfield School</td>
          </tr>

          <tr>
            <th>Roll Number</th>
            <td>{formatValue(data.rollNumber)}</td>

            <th>Class</th>
            <td>{formatValue(selectedExam.class)}</td>
          </tr>

          <tr>
            <th>Stream</th>
            <td>{formatValue(data.stream)}</td>

            {/* <th>Date of Birth</th>
            <td>{formatValue(data.dateOfBirth)}</td> */}
          </tr>

          <tr>
            <th>Section</th>
            <td>{formatValue(selectedExam.section)}</td>

            <th>Academic Year</th>
            <td>{formatValue(selectedExam.academicYear)}</td>
          </tr>
{/* 
          <tr>
  <th>Roll Number</th>
  <td>{formatValue(data.rollNumber)}</td>
  <th>Class</th>
  <td>{formatValue(selectedExam.class)}</td>
  <th>Date of Birth</th>
  <td>{formatValue(data.dateOfBirth)}</td>
</tr> */}

        </tbody>
      </table>

    </div>

    {/* STUDENT PHOTO */}
    <div className="report-student-photo">
      <img
        src={data.studentImage || "/default-student.png"}
        alt="Student Photograph"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default-student.png";
        }}
      />
      <span>Student Photograph</span>
    </div>

  </div>
</section>


      
{/* ACADEMIC PERFORMANCE */}
<section className="report-section">
  <h3>ACADEMIC PERFORMANCE</h3>

  <div className="report-table-wrapper">

    <table className="report-marks-table">

      <thead>
        <tr>
          <th>Subject</th>
          <th>Maximum Marks</th>
          <th>Passing Marks</th>
          <th>Obtained Marks</th>
          <th>Percentage</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>

        {subjects.map((subject, index) => (
          <tr key={`${subject.subject}-${index}`}>

            <td className="subject-name">
              {formatValue(subject.subject)}
            </td>

            <td>{formatValue(subject.totalMarks)}</td>

            <td>{formatValue(subject.passingMarks)}</td>

            <td>{formatValue(subject.marksObtained)}</td>

            <td>{formatValue(subject.percentage)}%</td>

            <td>
              <span className={`grade-badge ${getGradeClass(subject.grade)}`}>
                {formatValue(subject.grade)}
              </span>
            </td>

            <td>
              <span className={`status-badge ${
                subject.status === "PASS"
                  ? "status-pass"
                  : subject.status === "FAIL"
                  ? "status-fail"
                  : "status-na"
              }`}>
                {formatValue(subject.status)}
              </span>
            </td>

          </tr>
        ))}

        {subjects.length === 0 && (
          <tr>
            <td colSpan={7}>No subject marks available.</td>
          </tr>
        )}

      </tbody>

      {/* SUMMARY */}
      {subjects.length > 0 && (
        <tfoot>

          {/* TOTAL MARKS */}
          <tr>
            <th colSpan={2}>Total Maximum Marks</th>
            <td>
              <strong>{formatValue(selectedExam.totalMarks)}</strong>
            </td>

            <th colSpan={2}>Total Obtained Marks</th>
            <td colSpan={2}>
              <strong>{formatValue(selectedExam.totalObtained)}</strong>
            </td>
          </tr>

          {/* PERCENTAGE AND GRADE */}
          <tr>
            <th colSpan={2}>Overall Percentage</th>
            <td>
              <strong>{formatValue(selectedExam.percentage)}%</strong>
            </td>

            <th colSpan={2}>Overall Grade</th>
            <td colSpan={2}>
              <span className={`grade-badge ${getGradeClass(selectedExam.overallGrade)}`}>
                {formatValue(selectedExam.overallGrade)}
              </span>
            </td>
          </tr>

          {/* FINAL RESULT */}
          <tr>
            <th colSpan={2}>Final Result</th>
            <td colSpan={2}>
              <span className={`status-badge ${
                selectedExam.finalStatus === "PASS"
                  ? "status-pass"
                  : selectedExam.finalStatus === "FAIL"
                  ? "status-fail"
                  : "status-na"
              }`}>
                {formatValue(selectedExam.finalStatus)}
              </span>
            </td>

            <th colSpan={2}>Examination</th>
            <td>{formatValue(selectedExam.examName)}</td>
          </tr>

        </tfoot>
      )}

    </table>

  </div>
</section>


        {/* SIGNATURES */}
        <section className="report-signatures">

          <div>
            <div className="signature-line"></div>
            <strong>Class Teacher</strong>
          </div>

          <div>
            <div className="signature-line"></div>
            <strong>Office In-charge</strong>
          </div>

          <div>
            <div className="signature-line"></div>
            <strong>Principal's Signature</strong>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="report-footer">
          This is a computer-generated student report card.
        </footer>

      </div>

    </div>
  );
}

export default StudentResults;
