
import { useCallback, useEffect, useMemo, useState } from "react";
import { teacherService } from "../../services/teacherService";
import "./TeacherAttendance.css";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getResponseData(response) {
  return response?.data ?? response;
}

function getCourses(response) {
  const data = getResponseData(response);
  if (Array.isArray(data)) return data;
  return data?.courses ?? data?.results ?? [];
}

function getStudents(response) {
  const data = getResponseData(response);
  if (Array.isArray(data)) return data;
  return data?.students ?? data?.results ?? [];
}

function getAttendanceRecords(response) {
  const data = getResponseData(response);
  if (Array.isArray(data)) return data;
  return data?.attendance ?? data?.records ?? [];
}

function getStudentId(record) {
  // Backend attendance response mein studentId database primary key hai.
  return record?.studentId ?? record?.student_id ?? null;
}

export default function TeacherAttendance() {
  const employeeId = localStorage.getItem("employee_id");

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getLocalDate());

  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedCourse = useMemo(
    () =>
      courses.find(
        (course) => String(course.id) === String(selectedCourseId)
      ) ?? null,
    [courses, selectedCourseId]
  );

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setError("");

    try {
      if (!employeeId) {
        throw new Error(
          "Employee ID nahi mila. Logout karke teacher login dobara karein."
        );
      }

      const response = await teacherService.getMyCourses();
      const list = getCourses(response);

      setCourses(list);

      setSelectedCourseId((previous) => {
        if (list.some((course) => String(course.id) === String(previous))) {
          return previous;
        }

        return list.length ? String(list[0].id) : "";
      });
    } catch (err) {
      setError(err.message || "Assigned courses load nahi ho sake.");
    } finally {
      setLoadingCourses(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const loadAttendance = useCallback(async () => {
    if (!selectedCourse || !attendanceDate || !employeeId) {
      setStudents([]);
      setStatuses({});
      return;
    }

    setLoadingStudents(true);
    setError("");

    try {
      const className = selectedCourse.class_name;
      const sectionName = selectedCourse.section_name;

      if (
        selectedCourse.class_id == null ||
        selectedCourse.section_id == null ||
        selectedCourse.subject_id == null ||
        !className ||
        !sectionName
      ) {
        throw new Error(
          "Selected course ki class, section ya subject details missing hain."
        );
      }

      // Roster aur selected date ki saved attendance load karo.
      const [studentResponse, attendanceResponse] = await Promise.all([
        teacherService.getClassStudents(
          employeeId,
          className,
          sectionName
        ),
        teacherService.getClassAttendance(
          employeeId,
          selectedCourse.class_id,
          selectedCourse.section_id,
          selectedCourse.subject_id,
          attendanceDate
        ),
      ]);

      const studentList = getStudents(studentResponse);
      const attendanceList = getAttendanceRecords(attendanceResponse);

      // Saved attendance ko database student ID se map karo.
      const savedStatuses = {};

      attendanceList.forEach((record) => {
        const studentId = getStudentId(record);
        const status = record?.status;

        if (
          studentId != null &&
          (status === "Present" || status === "Absent")
        ) {
          savedStatuses[String(studentId)] = status;
        }
      });

      // Student roster ko consistent format mein rakho.
      const normalizedStudents = studentList
        .map((student) => ({
          id: student.id,
          studentCode:
            student.studentId ?? student.studentCode ?? "",
          name:
            student.name ||
            [
              student.firstName,
              student.middleName,
              student.lastName,
            ]
              .filter(Boolean)
              .join(" "),
          gender: student.gender ?? "",
          parentName: student.parentName ?? "",
          parentPhone: student.parentPhone ?? "",
        }))
        .filter((student) => student.id != null);

      // Har student ke liye saved status restore karo.
      // Naye/unmarked students ka status blank rahega.
      const nextStatuses = {};

      normalizedStudents.forEach((student) => {
        nextStatuses[String(student.id)] =
          savedStatuses[String(student.id)] ?? "";
      });

      setStudents(normalizedStudents);
      setStatuses(nextStatuses);

      setMessage("");
    } catch (err) {
      setStudents([]);
      setStatuses({});
      setError(
        err.message || "Students ki saved attendance load nahi ho saki."
      );
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedCourse, attendanceDate, employeeId]);

  // Course ya date change hone par attendance dobara load karo.
  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const markStudent = (studentId, status) => {
    setStatuses((previous) => ({
      ...previous,
      [String(studentId)]: status,
    }));

    setMessage("");
    setError("");
  };

  const markAll = (status) => {
    const nextStatuses = {};

    students.forEach((student) => {
      nextStatuses[String(student.id)] = status;
    });

    setStatuses(nextStatuses);
    setMessage("");
    setError("");
  };

  const presentCount = students.filter(
    (student) => statuses[String(student.id)] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => statuses[String(student.id)] === "Absent"
  ).length;

  const unmarkedCount = students.length - presentCount - absentCount;

  const saveAttendance = async () => {
    if (!employeeId || !selectedCourse) {
      setError("Teacher ya course details missing hain.");
      return;
    }

    if (!students.length) {
      setError("Attendance save karne ke liye students available nahi hain.");
      return;
    }

    if (unmarkedCount > 0) {
      setError(
        `${unmarkedCount} students ki attendance abhi mark nahi hui hai.`
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const attendance = students.map((student) => ({
        studentId: student.id,
        status: statuses[String(student.id)],
      }));

      const response = await teacherService.markBulkAttendance({
        employeeId,
        classId: selectedCourse.class_id,
        sectionId: selectedCourse.section_id,
        subjectId: selectedCourse.subject_id,
        date: attendanceDate,
        attendance,
      });

      const data = getResponseData(response);

      if (data?.success === false) {
        throw new Error(data.error || "Attendance save nahi hui.");
      }

      setMessage(
        data?.message || "Attendance save ho gayi. Saved records reload ho rahe hain..."
      );

      // Database se dobara fetch karo; local state par depend mat karo.
      await loadAttendance();

      setMessage("Attendance save ho gayi aur saved statuses reload ho gaye.");
    } catch (err) {
      setError(err.message || "Attendance save karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setMessage("");
    await loadAttendance();
  };

  return (
    <main className="teacher-attendance">
      <header className="attendance-header">
        <div>
          <p className="attendance-eyebrow">TEACHER PORTAL</p>
          <h1>Student Attendance</h1>
          <p className="attendance-subtitle">
            Apni assigned class aur subject ki daily attendance manage karein.
          </p>
        </div>

        <button
          type="button"
          className="attendance-refresh"
          onClick={handleRefresh}
          disabled={loadingStudents || saving || !selectedCourse}
        >
          {loadingStudents ? "Loading..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="attendance-alert attendance-alert-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div
          className="attendance-alert attendance-alert-success"
          role="status"
        >
          {message}
        </div>
      )}

      <section className="attendance-filters">
        <div className="attendance-field">
          <label htmlFor="attendance-course">Assigned Class / Subject</label>
          <select
            id="attendance-course"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            disabled={loadingCourses || courses.length === 0}
          >
            {courses.length === 0 && (
              <option value="">No assigned courses</option>
            )}

            {courses.map((course) => (
              <option key={course.id} value={String(course.id)}>
                {course.class_name} - {course.section_name} |{" "}
                {course.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="attendance-field">
          <label htmlFor="attendance-date">Attendance Date</label>
          <input
            id="attendance-date"
            type="date"
            value={attendanceDate}
            max={getLocalDate()}
            onChange={(event) => setAttendanceDate(event.target.value)}
          />
        </div>
      </section>

      {loadingCourses ? (
        <div className="attendance-empty">
          Assigned courses load ho rahe hain...
        </div>
      ) : courses.length === 0 ? (
        <div className="attendance-empty">
          Aapko abhi koi class ya subject assign nahi hua hai.
        </div>
      ) : (
        <>
          {selectedCourse && (
            <section className="attendance-course-info">
              <div>
                <span>CLASS</span>
                <strong>{selectedCourse.class_name}</strong>
              </div>
              <div>
                <span>SECTION</span>
                <strong>{selectedCourse.section_name}</strong>
              </div>
              <div>
                <span>SUBJECT</span>
                <strong>{selectedCourse.subject_name}</strong>
              </div>
              <div>
                <span>ACADEMIC YEAR</span>
                <strong>{selectedCourse.academic_year || "—"}</strong>
              </div>
            </section>
          )}

          <section className="attendance-stats">
            <div className="attendance-stat">
              <span>Total Students</span>
              <strong>{students.length}</strong>
            </div>
            <div className="attendance-stat present-stat">
              <span>Present</span>
              <strong>{presentCount}</strong>
            </div>
            <div className="attendance-stat absent-stat">
              <span>Absent</span>
              <strong>{absentCount}</strong>
            </div>
            <div className="attendance-stat unmarked-stat">
              <span>Unmarked</span>
              <strong>{unmarkedCount}</strong>
            </div>
          </section>

          <section className="attendance-roster">
            <div className="attendance-roster-header">
              <div>
                <h2>Students List</h2>
                <p>
                  Har student ke liye Present ya Absent select karein.
                </p>
              </div>

              <div className="attendance-bulk-actions">
                <button
                  type="button"
                  className="attendance-bulk-present"
                  onClick={() => markAll("Present")}
                  disabled={loadingStudents || students.length === 0}
                >
                  Mark All Present
                </button>

                <button
                  type="button"
                  className="attendance-bulk-absent"
                  onClick={() => markAll("Absent")}
                  disabled={loadingStudents || students.length === 0}
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {loadingStudents ? (
              <div className="attendance-empty">
                Students aur saved attendance load ho rahi hai...
              </div>
            ) : students.length === 0 ? (
              <div className="attendance-empty">
                Is class aur section mein active students nahi mile.
              </div>
            ) : (
              <>
                <div className="attendance-table-wrap">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Attendance Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student, index) => {
                        const currentStatus = statuses[String(student.id)];

                        return (
                          <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td>{student.studentCode || student.id}</td>
                            <td>
                              <div className="attendance-student-name">
                                <span className="attendance-avatar">
                                  {(student.name || "S")
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                                <span>
                                  {student.name || "Unnamed Student"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="attendance-status-buttons">
                                <button
                                  type="button"
                                  className={`attendance-status-btn status-present ${
                                    currentStatus === "Present" ? "selected" : ""
                                  }`}
                                  aria-pressed={currentStatus === "Present"}
                                  onClick={() =>
                                    markStudent(student.id, "Present")
                                  }
                                  disabled={loadingStudents || saving}
                                >
                                  Present
                                </button>

                                <button
                                  type="button"
                                  className={`attendance-status-btn status-absent ${
                                    currentStatus === "Absent" ? "selected" : ""
                                  }`}
                                  aria-pressed={currentStatus === "Absent"}
                                  onClick={() =>
                                    markStudent(student.id, "Absent")
                                  }
                                  disabled={loadingStudents || saving}
                                >
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <footer className="attendance-save-footer">
                  <span>
                    {unmarkedCount > 0
                      ? `${unmarkedCount} students pending`
                      : "All students marked"}
                  </span>

                  <button
                    type="button"
                    className="attendance-save-btn"
                    onClick={saveAttendance}
                    disabled={
                      saving ||
                      loadingStudents ||
                      students.length === 0 ||
                      unmarkedCount > 0
                    }
                  >
                    {saving ? "Saving Attendance..." : "Save Attendance"}
                  </button>
                </footer>
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}
