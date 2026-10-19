// function Teacher() {
//   return (
//     <div className="accountant-dashboard">

//       <div className="page-header">
//         <div>
//           <h1>Teacher  All Data </h1>
//           <p>
//             Manage payroll, salaries, employees and fees.

//             Ham isa me sabhi ka deta edika kar sakte hai  and all datilse dekha sakte hai 

//              mark exam,ect
//           </p>
//         </div>
//       </div>

     

//     </div>
//   );
// }

// export default Teacher;



import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService";
import "./Teacher.css";

function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await teacherService.getTeachers();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.teachers)
            ? data.teachers
            : [];

      setTeachers(list);
    } catch (err) {
      console.error("Teacher fetch error:", err);
      setError(err.message || "Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const searchText = search.toLowerCase();

    return [
      teacher.name,
      teacher.employee_id,
      teacher.email,
      teacher.phone,
      teacher.department,
      teacher.primary_subject,
      teacher.status,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="teacher-page">
      <div className="teacher-page-header">
        <div>
          <h1>Teacher Management</h1>
          <p>View and manage all school teachers.</p>
        </div>

        <button
          type="button"
          className="teacher-refresh-btn"
          onClick={fetchTeachers}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      <div className="teacher-stats">
        <div className="teacher-stat-card">
          <span>Total Teachers</span>
          <h2>{teachers.length}</h2>
        </div>

        <div className="teacher-stat-card">
          <span>Approved</span>
          <h2>
            {
              teachers.filter(
                (teacher) =>
                  String(teacher.status || "").toLowerCase() ===
                    "approved" ||
                  teacher.is_active === true
              ).length
            }
          </h2>
        </div>

        <div className="teacher-stat-card">
          <span>Pending</span>
          <h2>
            {
              teachers.filter(
                (teacher) =>
                  String(teacher.status || "").toLowerCase() ===
                  "pending"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="teacher-table-card">
        <div className="teacher-table-toolbar">
          <h2>All Teachers</h2>

          <input
            type="search"
            placeholder="Search name, ID, email, subject..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="teacher-message">Loading teacher data...</p>
        ) : error ? (
          <div className="teacher-error">
            <p>{error}</p>
            <button type="button" onClick={fetchTeachers}>
              Try Again
            </button>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <p className="teacher-message">
            {teachers.length === 0
              ? "No teachers found."
              : "No teachers match your search."}
          </p>
        ) : (
          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Teacher Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr
                    key={
                      teacher.id ||
                      teacher.employee_id ||
                      index
                    }
                  >
                    <td>
                      {teacher.employee_id || "—"}
                    </td>
                    <td>{teacher.name || "—"}</td>
                    <td>{teacher.email || "—"}</td>
                    <td>{teacher.phone || "—"}</td>
                    <td>{teacher.department || "—"}</td>
                    <td>{teacher.primary_subject || "—"}</td>
                    <td>
                      <span
                        className={`teacher-status ${
                          String(
                            teacher.status ||
                              (teacher.is_active
                                ? "Approved"
                                : "Unknown")
                          ).toLowerCase()
                        }`}
                      >
                        {teacher.status ||
                          (teacher.is_active
                            ? "Approved"
                            : "Unknown")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teacher;
