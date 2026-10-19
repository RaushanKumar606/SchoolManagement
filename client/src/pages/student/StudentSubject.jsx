
// import { useEffect, useState } from "react";
// import  studentService  from "../../services/studentService";

// import "./Student.css";

// export default function StudentSubject() {
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function loadSubjects() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await studentService.getMyStudentSubjects();

//         const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.results)
//           ? data.results
//           : Array.isArray(data?.teachers)
//             ? data.teachers
//             : [];
//           console.log("Student subjects data:", data);
//         if (!cancelled) {
//           setSubjects(list);
//         }
//       } catch (err) {
//         console.error("Student subjects error:", err);

//         if (!cancelled) {
//           setError(
//             err?.message || "Subjects load nahi ho paaye."
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadSubjects();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <main className="student-subject-page">
//         <p className="subject-status">Loading your subjects...</p>
//       </main>
//     );
//   }

//   return (
//     <main className="student-subject-page">
//       <header className="subjects-header">
//         <div>
//           <span className="subjects-eyebrow">ACADEMICS</span>
//           <h1>My Subjects</h1>
//           <p>View your assigned subjects and teachers.</p>
//         </div>

//         <div className="subjects-count">
//           <span>{subjects.length}</span>
//           <small>Total Subjects</small>
//         </div>
//       </header>

//       {error && (
//         <div className="subject-error" role="alert">
//           {error}
//         </div>
//       )}

//       {!error && subjects.length === 0 && (
//         <div className="subject-empty">
//           <h2>No subjects assigned yet</h2>
//           <p>
//             Your subjects will appear here once the school admin
//             assigns them to your class and section.
//           </p>
//         </div>
//       )}

//       {subjects.length > 0 && (
//         <section className="subjects-grid">
//           {subjects.map((subject) => (
//             <article
//               className="subject-card"
//               key={subject.id}
//             >
//               <div className="subject-card-top">
//                 <div className="subject-icon">
//                   {subject.name?.charAt(0)?.toUpperCase() || "S"}
//                 </div>

//                 <span className="subject-badge">
//                   Assigned
//                 </span>
//               </div>

//               <h2>{subject.name || "Subject"}</h2>

//               <p className="subject-code">
//                 Code: {subject.code || "N/A"}
//               </p>

//               <div className="subject-divider" />

//               <div className="subject-teacher">
//                 <div className="teacher-avatar">
//                   <span aria-hidden="true">T</span>
//                 </div>

//                 {/* <div>
//                   <small>Subject Teacher</small>
//                   <p>{subject.teacher || "Not assigned"}</p>
//                 </div> */}
//                 <div className="student-subject-teacher">
//   <span className="teacher-label">Teacher</span>

//   {subject.teachers?.length > 0 ? (
//     <span className="teacher-name">
//       {subject.teachers.join(", ")}
//     </span>
//   ) : (
//     <span className="teacher-unassigned">
//       Not assigned
//     </span>
//   )}
// </div>
//               </div>
//             </article>
//           ))}
//         </section>
//       )}
//     </main>
//   );
// }



import { useEffect, useState } from "react";
import studentService from "../../services/studentService";
import "./Student.css";

// =====================================================
// REUSABLE SUBJECT CARD
// =====================================================
function SubjectCard({ subject }) {
  const teachers = Array.isArray(subject.teachers)
    ? subject.teachers
    : subject.teacher
      ? [subject.teacher]
      : [];

  return (
    <article className="subject-card">
      <div className="subject-card-top">
        <div className="subject-icon">
          {subject.name?.charAt(0)?.toUpperCase() || "S"}
        </div>

        <span className="subject-badge">Assigned</span>
      </div>

      <h2>{subject.name || "Subject"}</h2>

      <p className="subject-code">
        Code: {subject.code || "N/A"}
      </p>

      <div className="subject-divider" />

      <div className="subject-teacher">
        <div className="teacher-avatar" aria-hidden="true">
          T
        </div>

        <div className="student-subject-teacher">
          <span className="teacher-label">Subject Teacher</span>

          {teachers.length > 0 ? (
            <span className="teacher-name">
              {teachers.join(", ")}
            </span>
          ) : (
            <span className="teacher-unassigned">
              Not assigned
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// =====================================================
// STUDENT SUBJECT PAGE
// =====================================================
export default function StudentSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError("");

        const data = await studentService.getMyStudentSubjects();

        console.log("Student subjects data:", data);

        // Handle supported API response formats
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.subjects)
            ? data.subjects
            : Array.isArray(data?.results)
              ? data.results
              : [];

        if (!cancelled) {
          setSubjects(list);
        }
      } catch (err) {
        console.error("Student subjects error:", err);

        if (!cancelled) {
          setError(
            err?.message || "Subjects load nahi ho paaye."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // Core and optional subject grouping
  const coreSubjects = subjects.filter(
    (subject) => subject.is_optional !== true
  );

  const optionalSubjects = subjects.filter(
    (subject) => subject.is_optional === true
  );

  // Loading state
  if (loading) {
    return (
      <main className="student-subject-page">
        <p className="subject-status">
          Loading your subjects...
        </p>
      </main>
    );
  }

  return (
    <main className="student-subject-page">
      {/* PAGE HEADER */}
      <header className="subjects-header">
        <div>
          <span className="subjects-eyebrow">ACADEMICS</span>
          <h1>My Subjects</h1>
          <p>View your subjects and assigned teachers.</p>
        </div>

        <div className="subjects-count">
          <span>{subjects.length}</span>
          <small>Total Subjects</small>
        </div>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="subject-error" role="alert">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!error && subjects.length === 0 && (
        <div className="subject-empty">
          <h2>No subjects assigned yet</h2>
          <p>
            Your subjects will appear here once the school
            admin assigns them to your class and section.
          </p>
        </div>
      )}

      {/* SUBJECT GROUPS */}
      {!error && subjects.length > 0 && (
        <>
          {/* CORE SUBJECTS */}
          <section className="subject-section">
            <div className="subject-section-header">
              <div>
                <h2>Core Subjects</h2>
                <p>Your main academic subjects</p>
              </div>

              <span>{coreSubjects.length} Subjects</span>
            </div>

            {coreSubjects.length > 0 ? (
              <div className="subjects-grid">
                {coreSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                  />
                ))}
              </div>
            ) : (
              <p className="subject-status">
                No core subjects found.
              </p>
            )}
          </section>

          {/* OPTIONAL SUBJECTS */}
          <section className="subject-section">
            <div className="subject-section-header">
              <div>
                <h2>Optional Subjects</h2>
                <p>Your additional or elective subjects</p>
              </div>

              <span>{optionalSubjects.length} Subjects</span>
            </div>

            {optionalSubjects.length > 0 ? (
              <div className="subjects-grid">
                {optionalSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                  />
                ))}
              </div>
            ) : (
              <p className="subject-status">
                No optional subjects assigned.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
