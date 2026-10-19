
// // import { useCallback, useEffect, useState } from "react";
// // import { academicAdminService } from "../../services/academicAdminService";
// // import { teacherService } from "../../services/teacherService";

// // function getList(data) {
// //   if (Array.isArray(data)) return data;
// //   if (Array.isArray(data?.results)) return data.results;
// //   if (Array.isArray(data?.data)) return data.data;
// //   return [];
// // }

// // export default function AdminTeacherAssin() {
// //   const [years, setYears] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [sections, setSections] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [teachers, setTeachers] = useState([]);
// //   const [allocations, setAllocations] = useState([]);

// //   const [yearId, setYearId] = useState("");
// //   const [classId, setClassId] = useState("");
// //   const [sectionId, setSectionId] = useState("");
// //   const [subjectId, setSubjectId] = useState("");
// //   const [teacherId, setTeacherId] = useState("");

// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");
// //   const [message, setMessage] = useState("");

// //   // Academic years
// //   const loadYears = useCallback(async () => {
// //     try {
// //       const data = await academicAdminService.getAcademicYears();
// //       const list = getList(data);

// //       setYears(list);

// //       const activeYear = list.find((year) => year.is_active);
// //       const defaultYear = activeYear || list[0];

// //       if (defaultYear) {
// //         setYearId(String(defaultYear.id));
// //       }
// //     } catch (err) {
// //       console.error("Academic years error:", err);
// //       setError("Academic years load nahi ho paaye.");
// //     }
// //   }, []);

// //   // Approved teachers
// //   const loadTeachers = useCallback(async () => {
// //     try {
// //       const data = await teacherService.getTeachers();
// //       const list = Array.isArray(data)
// //         ? data
// //         : Array.isArray(data?.results)
// //           ? data.results
// //           : Array.isArray(data?.teachers)
// //             ? data.teachers
// //             : [];

// //       setTeachers((list));
// //     } catch (err) {
// //       console.error("Teachers error:", err);
// //       setError("Teachers load nahi ho paaye.");
// //     }
// //   }, []);

// //   // Existing teacher assignments
// //   const loadAllocations = useCallback(async () => {
// //     try {
// //       // const params = new URLSearchParams();

// //       // if (classId) params.set("school_class", classId);
// //       // if (sectionId) params.set("section", sectionId);

// //       // const query = params.toString();
// //       // const endpoint = `/academics/admin/teacher-allocations/${
// //       //   query ? `?${query}` : ""
// //       // }`;

// //       // const data = await apiRequest(endpoint, {
// //       //   method: "GET",
// //       // });


// //      const data= await academicAdminService.createTeacherSubjectAllocation({
// //   teacher: Number(teacherId),
// //   school_class: Number(classId),
// //   section: Number(sectionId),
// //   subject: Number(subjectId),
// // });

// //       setAllocations(data);
// //     } catch (err) {
// //       console.error("Teacher allocations error:", err);
// //       setError("Teacher assignments load nahi ho paaye.");
// //     }
// //   }, [classId, sectionId]);

// //   useEffect(() => {
// //     loadYears();
// //     loadTeachers();
// //   }, [loadYears, loadTeachers]);

// //   // Load classes when academic year changes
// //   useEffect(() => {
// //     let cancelled = false;

// //     async function loadClasses() {
// //       setClasses([]);
// //       setSections([]);
// //       setSubjects([]);
// //       setClassId("");
// //       setSectionId("");
// //       setSubjectId("");
// //       setAllocations([]);

// //       if (!yearId) return;

// //       try {
// //         setLoading(true);
// //         setError("");

// //         const data = await academicAdminService.getClasses(yearId);

// //         if (cancelled) return;

// //         setClasses(getList(data));
// //       } catch (err) {
// //         if (!cancelled) {
// //           console.error("Classes error:", err);
// //           setError("Classes load nahi ho paayi.");
// //         }
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     }

// //     loadClasses();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [yearId]);

// //   // Load sections and subjects when class changes
// //   useEffect(() => {
// //     let cancelled = false;

// //     async function loadClassData() {
// //       setSections([]);
// //       setSubjects([]);
// //       setSectionId("");
// //       setSubjectId("");

// //       if (!classId) return;

// //       try {
// //         setError("");
// //         setLoading(true);

// //         const [sectionData, subjectData] = await Promise.all([
// //           academicAdminService.getSections(classId),
// //           academicAdminService.getClassSubjects(classId),
// //         ]);

// //         if (cancelled) return;

// //         const sectionList = getList(sectionData);
// //         const classSubjects = getList(subjectData);

// //         // API response:
// //         // { id: 1, subject: 1, subject_name: "Mathmathics" }
// //         const mappedSubjects = classSubjects
// //           .map((item) => ({
// //             id: String(
// //               typeof item.subject === "object"
// //                 ? item.subject?.id
// //                 : item.subject
// //             ),
// //             name:
// //               item.subject_name ||
// //               (typeof item.subject === "object"
// //                 ? item.subject?.name
// //                 : "") ||
// //               "",
// //           }))
// //           .filter((subject) => subject.id && subject.name);

// //         setSections(sectionList);
// //         setSubjects(mappedSubjects);
// //       } catch (err) {
// //         if (!cancelled) {
// //           console.error("Class data loading error:", err);
// //           setError(err?.message || "Sections ya subjects load nahi ho paaye.");
// //         }
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     }

// //     loadClassData();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [classId]);

// //   // Refresh assignment table
// //   useEffect(() => {
// //     loadAllocations();
// //   }, [loadAllocations]);

// //   // Assign teacher
// //   async function handleAssign(event) {
// //     event.preventDefault();

// //     if (!teacherId || !classId || !sectionId || !subjectId) {
// //       setError("Teacher, class, section aur subject select karein.");
// //       return;
// //     }

// //     try {
// //       setSaving(true);
// //       setError("");
// //       setMessage("");

// //       await apiRequest("/academics/admin/teacher-allocations/", {
// //         method: "POST",
// //         body: JSON.stringify({
// //           teacher: Number(teacherId),
// //           school_class: Number(classId),
// //           section: Number(sectionId),
// //           subject: Number(subjectId),
// //         }),
// //       });

// //       setMessage("Teacher assignment successfully create ho gaya.");
// //       setTeacherId("");
// //       setSubjectId("");

// //       await loadAllocations();
// //     } catch (err) {
// //       console.error("Assign teacher error:", err);
// //       setError(err?.message || "Teacher assign nahi hua.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   // Delete assignment
// //   async function handleDelete(id) {
// //     if (
// //       !window.confirm(
// //         "Kya aap is teacher assignment ko delete karna chahte hain?"
// //       )
// //     ) {
// //       return;
// //     }

// //     try {
// //       setError("");
// //       setMessage("");

// //       await apiRequest(
// //         `/academics/admin/teacher-allocations/${id}/`,
// //         { method: "DELETE" }
// //       );

// //       setMessage("Teacher assignment delete ho gaya.");
// //       await loadAllocations();
// //     } catch (err) {
// //       console.error("Delete assignment error:", err);
// //       setError(err?.message || "Assignment delete nahi hua.");
// //     }
// //   }

// //   return (
// //     <main className="teacher-assignment-page">
// //       <header className="page-header">
// //         <h1>Teacher Assignment</h1>
// //         <p>
// //           Academic year, class, section aur subject ke according
// //           teacher assign karein.
// //         </p>
// //       </header>

// //       {error && (
// //         <div className="assignment-alert error" role="alert">
// //           {error}
// //         </div>
// //       )}

// //       {message && (
// //         <div className="assignment-alert success" role="status">
// //           {message}
// //         </div>
// //       )}

// //       <section className="assignment-card">
// //         <h2>Assign Teacher</h2>

// //         <form onSubmit={handleAssign} className="assignment-form">
// //           <label>
// //             Academic Year
// //             <select
// //               value={yearId}
// //               onChange={(e) => setYearId(e.target.value)}
// //               required
// //             >
// //               <option value="">Select Academic Year</option>
// //               {years.map((year) => (
// //                 <option key={year.id} value={String(year.id)}>
// //                   {year.name}
// //                   {year.is_active ? " (Active)" : ""}
// //                 </option>
// //               ))}
// //             </select>
// //           </label>

// //           <label>
// //             Class
// //             <select
// //               value={classId}
// //               onChange={(e) => setClassId(e.target.value)}
// //               required
// //               disabled={!yearId || loading}
// //             >
// //               <option value="">Select Class</option>
// //               {classes.map((schoolClass) => (
// //                 <option
// //                   key={schoolClass.id}
// //                   value={String(schoolClass.id)}
// //                 >
// //                   {schoolClass.name ?? schoolClass.class_name}
// //                 </option>
// //               ))}
// //             </select>
// //           </label>

// //           <label>
// //             Section
// //             <select
// //               value={sectionId}
// //               onChange={(e) => setSectionId(e.target.value)}
// //               required
// //               disabled={!classId || sections.length === 0}
// //             >
// //               <option value="">Select Section</option>
// //               {sections.map((section) => (
// //                 <option key={section.id} value={String(section.id)}>
// //                   {section.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </label>

// //           <label>
// //             Subject
// //             <select
// //               value={subjectId}
// //               onChange={(e) => setSubjectId(e.target.value)}
// //               required
// //               disabled={!classId || subjects.length === 0}
// //             >
// //               <option value="">
// //                 {loading && classId
// //                   ? "Loading subjects..."
// //                   : subjects.length === 0
// //                     ? "No subjects available"
// //                     : "Select Subject"}
// //               </option>

// //               {subjects.map((subject) => (
// //                 <option key={subject.id} value={subject.id}>
// //                   {subject.name}
// //                 </option>
// //               ))}
// //             </select>

// //             <small className="field-hint">
// //               {subjects.length} subject(s) available
// //             </small>
// //           </label>

// //           <label>
// //             Teacher
// //             <select
// //               value={teacherId}
// //               onChange={(e) => setTeacherId(e.target.value)}
// //               required
// //             >
// //               <option value="">Select Teacher</option>
// //               {teachers.map((teacher) => (
// //                 <option key={teacher.id} value={String(teacher.id)}>
// //                   {teacher.name ||
// //                     teacher.full_name ||
// //                     teacher.username ||
// //                     teacher.email}
// //                   {teacher.employee_id
// //                     ? ` (${teacher.employee_id})`
// //                     : ""}
// //                 </option>
// //               ))}
// //             </select>
// //           </label>

// //           <button type="submit" disabled={saving}>
// //             {saving ? "Assigning..." : "Assign Teacher"}
// //           </button>
// //         </form>
// //       </section>

// //       <section className="assignment-card">
// //         <h2>Existing Assignments</h2>

// //         {allocations.length === 0 ? (
// //           <p className="empty-state">No teacher assignments found.</p>
// //         ) : (
// //           <div className="assignment-table-wrapper">
// //             <table className="assignment-table">
// //               <thead>
// //                 <tr>
// //                   <th>Teacher</th>
// //                   <th>Class</th>
// //                   <th>Section</th>
// //                   <th>Subject</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {allocations.map((item) => (
// //                   <tr key={item.id}>
// //                     <td>{item.teacher_name || item.teacher}</td>
// //                     <td>{item.class_name || item.school_class}</td>
// //                     <td>{item.section_name || item.section}</td>
// //                     <td>{item.subject_name || item.subject}</td>
// //                     <td>
// //                       <button
// //                         type="button"
// //                         className="delete-button"
// //                         onClick={() => handleDelete(item.id)}
// //                       >
// //                         Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </section>

// //       <style>{`
// //         .teacher-assignment-page {
// //           width: 100%;
// //           max-width: 1200px;
// //           margin: 0 auto;
// //           padding: 24px;
// //           box-sizing: border-box;
// //           color: #172033;
// //         }

// //         .page-header {
// //           margin-bottom: 24px;
// //         }

// //         .page-header h1 {
// //           margin: 0 0 8px;
// //           font-size: 28px;
// //         }

// //         .page-header p {
// //           margin: 0;
// //           color: #64748b;
// //           line-height: 1.6;
// //         }

// //         .assignment-card {
// //           margin-bottom: 24px;
// //           padding: 22px;
// //           background: #fff;
// //           border: 1px solid #e2e8f0;
// //           border-radius: 14px;
// //           box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
// //         }

// //         .assignment-card h2 {
// //           margin: 0 0 20px;
// //           font-size: 20px;
// //         }

// //         .assignment-form {
// //           display: grid;
// //           grid-template-columns: repeat(2, minmax(0, 1fr));
// //           gap: 18px;
// //         }

// //         .assignment-form label {
// //           display: flex;
// //           min-width: 0;
// //           flex-direction: column;
// //           gap: 8px;
// //           font-size: 14px;
// //           font-weight: 600;
// //         }

// //         .assignment-form select {
// //           width: 100%;
// //           min-height: 44px;
// //           padding: 10px 12px;
// //           box-sizing: border-box;
// //           border: 1px solid #cbd5e1;
// //           border-radius: 8px;
// //           background: #fff;
// //           color: #172033;
// //           font: inherit;
// //         }

// //         .assignment-form select:focus {
// //           outline: 2px solid #93c5fd;
// //           border-color: #2563eb;
// //         }

// //         .assignment-form select:disabled {
// //           background: #f1f5f9;
// //           color: #64748b;
// //           cursor: not-allowed;
// //         }

// //         .field-hint {
// //           color: #64748b;
// //           font-size: 12px;
// //           font-weight: 400;
// //         }

// //         .assignment-form button,
// //         .delete-button {
// //           min-height: 42px;
// //           padding: 11px 16px;
// //           border: 0;
// //           border-radius: 8px;
// //           font-weight: 600;
// //           cursor: pointer;
// //         }

// //         .assignment-form button {
// //           align-self: end;
// //           background: #2563eb;
// //           color: #fff;
// //         }

// //         .assignment-form button:disabled {
// //           opacity: 0.6;
// //           cursor: not-allowed;
// //         }

// //         .assignment-alert {
// //           margin-bottom: 16px;
// //           padding: 12px 16px;
// //           border-radius: 8px;
// //         }

// //         .assignment-alert.error {
// //           background: #fef2f2;
// //           color: #b91c1c;
// //         }

// //         .assignment-alert.success {
// //           background: #f0fdf4;
// //           color: #166534;
// //         }

// //         .assignment-table-wrapper {
// //           width: 100%;
// //           overflow-x: auto;
// //         }

// //         .assignment-table {
// //           width: 100%;
// //           min-width: 650px;
// //           border-collapse: collapse;
// //         }

// //         .assignment-table th,
// //         .assignment-table td {
// //           padding: 13px 12px;
// //           border-bottom: 1px solid #e2e8f0;
// //           text-align: left;
// //           white-space: nowrap;
// //         }

// //         .assignment-table th {
// //           background: #f8fafc;
// //           color: #475569;
// //           font-size: 13px;
// //         }

// //         .delete-button {
// //           background: #fee2e2;
// //           color: #b91c1c;
// //         }

// //         .empty-state {
// //           color: #64748b;
// //         }

// //         @media (max-width: 640px) {
// //           .teacher-assignment-page {
// //             padding: 14px;
// //           }

// //           .assignment-card {
// //             padding: 16px;
// //           }

// //           .assignment-form {
// //             grid-template-columns: minmax(0, 1fr);
// //           }

// //           .page-header h1 {
// //             font-size: 23px;
// //           }
// //         }
// //       `}</style>
// //     </main>
// //   );
// // }




// import { useCallback, useEffect, useState } from "react";
// import { academicAdminService } from "../../services/academicAdminService";
// import { teacherService } from "../../services/teacherService";
// import { apiRequest } from "../../utils/apiRequest";

// function getList(data) {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.results)) return data.results;
//   if (Array.isArray(data?.data)) return getList(data.data);
//   if (Array.isArray(data?.teachers)) return data.teachers;
//   return [];
// }

// function getErrorMessage(err) {
//   const data = err?.response?.data || err?.data || err?.message || err;

//   if (typeof data === "string") return data;

//   if (data && typeof data === "object") {
//     return Object.entries(data)
//       .map(([key, value]) => {
//         const message = Array.isArray(value)
//           ? value.join(", ")
//           : typeof value === "object"
//             ? JSON.stringify(value)
//             : String(value);

//         return `${key}: ${message}`;
//       })
//       .join(" | ");
//   }

//   return "Something went wrong. Please try again.";
// }

// export default function AdminTeacherAssin() {
//   const [years, setYears] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [allocations, setAllocations] = useState([]);

//   const [yearId, setYearId] = useState("");
//   const [classId, setClassId] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [teacherId, setTeacherId] = useState("");
//   const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

//   const [mode, setMode] = useState("single");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   // Load academic years
//   const loadYears = useCallback(async () => {
//     try {
//       const data = await academicAdminService.getAcademicYears();
//       const list = getList(data);

//       setYears(list);

//       const activeYear = list.find((year) => year.is_active);
//       const defaultYear = activeYear || list[0];

//       if (defaultYear) {
//         setYearId(String(defaultYear.id));
//       }
//     } catch (err) {
//       setError("Academic years load nahi ho paaye.");
//     }
//   }, []);

//   // Load teachers
//   const loadTeachers = useCallback(async () => {
//     try {
//       const data = await teacherService.getTeachers();
//       setTeachers(getList(data));
//     } catch (err) {
//       console.error("Teachers error:", err);
//       setError("Teachers load nahi ho paaye.");
//     }
//   }, []);

//   // GET: Load existing assignments
//   const loadAllocations = useCallback(async () => {
//     try {
//       const params = new URLSearchParams();

//       if (classId) params.set("school_class", classId);
//       if (sectionId) params.set("section", sectionId);

//       const query = params.toString();
//       const endpoint =
//         `/academics/admin/teacher-allocations/` +
//         (query ? `?${query}` : "");

//       const data = await apiRequest(endpoint, {
//         method: "GET",
//       });

//       setAllocations(getList(data));
//     } catch (err) {
//       console.error("Teacher allocations error:", err);
//       setError("Teacher assignments load nahi ho paaye.");
//     }
//   }, [classId, sectionId]);

//   useEffect(() => {
//     loadYears();
//     loadTeachers();
//   }, [loadYears, loadTeachers]);

//   // Load classes for selected academic year
//   useEffect(() => {
//     let cancelled = false;

//     async function loadClasses() {
//       setClasses([]);
//       setSections([]);
//       setSubjects([]);
//       setClassId("");
//       setSectionId("");
//       setSelectedSubjectIds([]);
//       setAllocations([]);

//       if (!yearId) return;

//       setLoading(true);

//       try {
//         const data = await academicAdminService.getClasses(yearId);

//         if (!cancelled) {
//           setClasses(getList(data));
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error("Classes error:", err);
//           setError("Classes load nahi ho paayi.");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadClasses();

//     return () => {
//       cancelled = true;
//     };
//   }, [yearId]);

//   // Load sections and subjects for selected class
//   useEffect(() => {
//     let cancelled = false;

//     async function loadClassData() {
//       setSections([]);
//       setSubjects([]);
//       setSectionId("");
//       setSelectedSubjectIds([]);

//       if (!classId) return;

//       setLoading(true);
//       setError("");

//       try {
//         const [sectionData, subjectData] = await Promise.all([
//           academicAdminService.getSections(classId),
//           academicAdminService.getClassSubjects(classId),
//         ]);

//         if (cancelled) return;

//         setSections(getList(sectionData));

//         const mappedSubjects = getList(subjectData)
//           .map((item) => {
//             const subject =
//               typeof item.subject === "object"
//                 ? item.subject
//                 : null;

//             return {
//               id: String(subject?.id ?? item.subject ?? ""),
//               name:
//                 item.subject_name ||
//                 subject?.name ||
//                 item.name ||
//                 "",
//               code: item.subject_code || subject?.code || "",
//             };
//           })
//           .filter((item) => item.id && item.name);

//         setSubjects(mappedSubjects);
//       } catch (err) {
//         if (!cancelled) {
//           console.error("Class data error:", err);
//           setError(getErrorMessage(err));
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadClassData();

//     return () => {
//       cancelled = true;
//     };
//   }, [classId]);

//   // Refresh assignment list when filters change
//   useEffect(() => {
//     loadAllocations();
//   }, [loadAllocations]);

//   // Switch between single and bulk modes
//   function handleModeChange(newMode) {
//     setMode(newMode);
//     setSelectedSubjectIds([]);
//     setError("");
//     setMessage("");
//   }

//   // Checkbox selection
//   function handleSubjectChange(subjectId, checked) {
//     setSelectedSubjectIds((previous) => {
//       if (!checked) {
//         return previous.filter((id) => id !== String(subjectId));
//       }

//       if (mode === "single") {
//         return [String(subjectId)];
//       }

//       if (previous.includes(String(subjectId))) {
//         return previous;
//       }

//       return [...previous, String(subjectId)];
//     });

//     setError("");
//     setMessage("");
//   }

//   // POST: Single or bulk assignment
//   async function handleAssign(event) {
//     event.preventDefault();

//     setError("");
//     setMessage("");

//     if (!teacherId || !classId || !sectionId) {
//       setError("Teacher, class aur section select karein.");
//       return;
//     }

//     if (selectedSubjectIds.length === 0) {
//       setError("Kam se kam ek subject checkbox select karein.");
//       return;
//     }

//     if (mode === "single" && selectedSubjectIds.length !== 1) {
//       setError("Single assignment mein sirf ek subject select karein.");
//       return;
//     }

//     const commonPayload = {
//       teacher: Number(teacherId),
//       school_class: Number(classId),
//       section: Number(sectionId),
//     };

//     setSaving(true);

//     try {
//       if (mode === "single") {
//         await academicAdminService.createTeacherSubjectAllocation({
//           ...commonPayload,
//           subject: Number(selectedSubjectIds[0]),
//         });

//         setMessage("Single subject successfully assign ho gaya.");
//       } else {
//         await academicAdminService.createBulkTeacherSubjectAllocation({
//           ...commonPayload,
//           subjects: selectedSubjectIds.map(Number),
//         });

//         setMessage(
//           `${selectedSubjectIds.length} subjects successfully assign ho gaye.`
//         );
//       }

//       setSelectedSubjectIds([]);

//       await loadAllocations();
//     } catch (err) {
//       console.error("Teacher assignment error:", err);
//       setError(getErrorMessage(err));
//     } finally {
//       setSaving(false);
//     }
//   }

//   // DELETE: Remove assignment
//   async function handleDelete(id) {
//     if (
//       !window.confirm(
//         "Kya aap is teacher assignment ko delete karna chahte hain?"
//       )
//     ) {
//       return;
//     }

//     setError("");
//     setMessage("");

//     try {
//       await apiRequest(
//         `/academics/admin/teacher-allocations/${id}/`,
//         { method: "DELETE" }
//       );

//       setMessage("Teacher assignment delete ho gaya.");
//       await loadAllocations();
//     } catch (err) {
//       console.error("Delete assignment error:", err);
//       setError(getErrorMessage(err));
//     }
//   }


// const groupedAllocations = Object.values(
//   allocations.reduce((groups, item) => {
//     const key = [
//       item.teacher,
//       item.school_class,
//       item.section,
//     ].join("-");

//     if (!groups[key]) {
//       groups[key] = {
//         key,
//         teacher_name: item.teacher_name,
//         class_name: item.class_name,
//         section_name: item.section_name,
//         subjects: [],
//         allocationIds: [],
//       };
//     }

//     const subjectName = item.subject_name || "Unnamed Subject";

//     if (!groups[key].subjects.includes(subjectName)) {
//       groups[key].subjects.push(subjectName);
//     }

//     groups[key].allocationIds.push(item.id);

//     return groups;
//   }, {})
// );


//   return (
//     <main className="teacher-assignment-page">
//       <style>{`
//         .teacher-assignment-page {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 24px;
//           color: #172033;
//         }
//         .teacher-assignment-page * {
//           box-sizing: border-box;
//         }
//         .assignment-card {
//           margin-bottom: 24px;
//           padding: 22px;
//           background: #fff;
//           border: 1px solid #e2e8f0;
//           border-radius: 14px;
//         }
//         .assignment-form {
//           display: grid;
//           grid-template-columns: repeat(2, minmax(0, 1fr));
//           gap: 18px;
//         }
//         .assignment-field {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           min-width: 0;
//         }
//         .assignment-field label,
//         .subject-heading {
//           font-size: 14px;
//           font-weight: 600;
//         }
//         .assignment-field select {
//           width: 100%;
//           min-height: 44px;
//           padding: 10px;
//           border: 1px solid #cbd5e1;
//           border-radius: 8px;
//           background: white;
//           color: #172033;
//         }
//         .assignment-mode {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           margin-bottom: 22px;
//         }
//         .assignment-mode button,
//         .assign-button,
//         .delete-button {
//           padding: 11px 16px;
//           border: 0;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//         }
//         .assignment-mode button {
//           background: #e2e8f0;
//           color: #334155;
//         }
//         .assignment-mode button.active,
//         .assign-button {
//           background: #2563eb;
//           color: white;
//         }
//         .assign-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }
//         .subject-list {
//           grid-column: 1 / -1;
//           display: grid;
//           grid-template-columns: repeat(3, minmax(0, 1fr));
//           gap: 10px;
//         }
//         .subject-option {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 12px;
//           border: 1px solid #e2e8f0;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 14px;
//         }
//         .subject-option input {
//           width: 17px;
//           height: 17px;
//           accent-color: #2563eb;
//         }
//         .assignment-alert {
//           margin-bottom: 16px;
//           padding: 12px 16px;
//           border-radius: 8px;
//           overflow-wrap: anywhere;
//         }
//         .assignment-alert.error {
//           background: #fef2f2;
//           color: #b91c1c;
//         }
//         .assignment-alert.success {
//           background: #f0fdf4;
//           color: #166534;
//         }
//         .assignment-table-wrapper {
//           width: 100%;
//           overflow-x: auto;
//         }
//         .assignment-table {
//           width: 100%;
//           min-width: 650px;
//           border-collapse: collapse;
//         }
//         .assignment-table th,
//         .assignment-table td {
//           padding: 13px 12px;
//           border-bottom: 1px solid #e2e8f0;
//           text-align: left;
//         }
//         .assignment-table th {
//           background: #f8fafc;
//         }
//         .delete-button {
//           background: #fee2e2;
//           color: #b91c1c;
//         }
//         @media (max-width: 700px) {
//           .teacher-assignment-page {
//             padding: 14px;
//           }
//           .assignment-card {
//             padding: 16px;
//           }
//           .assignment-form {
//             grid-template-columns: 1fr;
//           }
//           .subject-list {
//             grid-template-columns: repeat(2, minmax(0, 1fr));
//           }
//         }
//         @media (max-width: 420px) {
//           .subject-list {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>

//       <header style={{ marginBottom: 24 }}>
//         <h1>Teacher Subject Assignment</h1>
//         <p>Ek teacher ko single ya multiple subjects assign karein.</p>
//       </header>

//       {error && (
//         <div className="assignment-alert error" role="alert">
//           {error}
//         </div>
//       )}

//       {message && (
//         <div className="assignment-alert success" role="status">
//           {message}
//         </div>
//       )}

//       <section className="assignment-card">
//         <h2>Assign Subjects</h2>

//         <div className="assignment-mode">
//           <button
//             type="button"
//             className={mode === "single" ? "active" : ""}
//             onClick={() => handleModeChange("single")}
//           >
//             Single Subject Assign
//           </button>

//           <button
//             type="button"
//             className={mode === "bulk" ? "active" : ""}
//             onClick={() => handleModeChange("bulk")}
//           >
//             Bulk Subject Assign
//           </button>
//         </div>

//         <form className="assignment-form" onSubmit={handleAssign}>
//           <div className="assignment-field">
//             <label htmlFor="academic-year">Academic Year</label>
//             <select
//               id="academic-year"
//               value={yearId}
//               onChange={(e) => setYearId(e.target.value)}
//               required
//             >
//               <option value="">Select Academic Year</option>
//               {years.map((year) => (
//                 <option key={year.id} value={String(year.id)}>
//                   {year.name}{year.is_active ? " (Active)" : ""}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="assignment-field">
//             <label htmlFor="school-class">Class</label>
//             <select
//               id="school-class"
//               value={classId}
//               onChange={(e) => setClassId(e.target.value)}
//               disabled={!yearId || loading}
//               required
//             >
//               <option value="">Select Class</option>
//               {classes.map((item) => (
//                 <option key={item.id} value={String(item.id)}>
//                   {item.name || item.class_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="assignment-field">
//             <label htmlFor="section">Section</label>
//             <select
//               id="section"
//               value={sectionId}
//               onChange={(e) => setSectionId(e.target.value)}
//               disabled={!classId || sections.length === 0}
//               required
//             >
//               <option value="">Select Section</option>
//               {sections.map((item) => (
//                 <option key={item.id} value={String(item.id)}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="assignment-field">
//             <label htmlFor="teacher">Teacher</label>
//             <select
//               id="teacher"
//               value={teacherId}
//               onChange={(e) => setTeacherId(e.target.value)}
//               required
//             >
//               <option value="">Select Teacher</option>
//               {teachers.map((teacher) => (
//                 <option key={teacher.id} value={String(teacher.id)}>
//                   {teacher.name ||
//                     teacher.full_name ||
//                     teacher.username ||
//                     teacher.email ||
//                     teacher.employee_id ||
//                     `Teacher ${teacher.id}`}
//                   {teacher.employee_id ? ` (${teacher.employee_id})` : ""}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="subject-heading">
//             Select {mode === "single" ? "One Subject" : "Multiple Subjects"}
//           </div>

//           <div className="subject-list">
//             {subjects.map((subject) => (
//               <label className="subject-option" key={subject.id}>
//                 <input
//                   type="checkbox"
//                   checked={selectedSubjectIds.includes(subject.id)}
//                   onChange={(e) =>
//                     handleSubjectChange(subject.id, e.target.checked)
//                   }
//                   disabled={mode === "single" &&
//                     selectedSubjectIds.length === 1 &&
//                     !selectedSubjectIds.includes(subject.id)}
//                 />
//                 <span>
//                   {subject.name}
//                   {subject.code ? ` (${subject.code})` : ""}
//                 </span>
//               </label>
//             ))}

//             {classId && subjects.length === 0 && (
//               <p>
//                 {loading
//                   ? "Loading subjects..."
//                   : "Is class ke liye koi subject available nahi hai. Pehle Class Subjects setup karein."}
//               </p>
//             )}

//             {!classId && (
//               <p>Subjects dekhne ke liye pehle academic year aur class select karein.</p>
//             )}
//           </div>

//           <p style={{ gridColumn: "1 / -1", margin: 0, color: "#64748b" }}>
//             Selected subjects: {selectedSubjectIds.length}
//           </p>

//           <button
//             className="assign-button"
//             type="submit"
//             disabled={
//               saving ||
//               loading ||
//               !teacherId ||
//               !classId ||
//               !sectionId ||
//               selectedSubjectIds.length === 0
//             }
//           >
//             {saving
//               ? "Assigning..."
//               : mode === "single"
//                 ? "Assign Single Subject"
//                 : `Assign ${selectedSubjectIds.length || ""} Subjects`}
//           </button>
//         </form>
//       </section>

//       <section className="assignment-card">
//         <h2>Existing Assignments</h2>

//         {allocations.length === 0 ? (
//           <p>No teacher assignments found.</p>
//         ) : (
//           <div className="assignment-table-wrapper">
//             <table className="assignment-table">
//               <thead>
//                 <tr>
//                   <th>Teacher</th>
//                   <th>Class</th>
//                   <th>Section</th>
//                   <th>Subject</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {groupedAllocations.map((item) => (
//                   <tr key={item.key}>
//                     <td>{item.teacher_name}</td>
//                     <td>{item.class_name}</td>
//                     <td>{item.section_name}</td>

//                     <td>{item.subjects.join(", ")}</td>

//                     <td>
//                       {item.allocationIds.map((id) => (
//                         <button
//                           key={id}
//                           type="button"
//                           onClick={() => handleDelete(id)}
//                         >
//                           Delete
//                         </button>
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }





import { useCallback, useEffect, useState } from "react";
import { academicAdminService } from "../../services/academicAdminService";
import { teacherService } from "../../services/teacherService";
import { apiRequest } from "../../utils/apiRequest";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return getList(data.data);
  if (Array.isArray(data?.teachers)) return data.teachers;
  return [];
}

function getErrorMessage(err) {
  const data = err?.response?.data || err?.data || err?.message || err;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);

        return `${key}: ${message}`;
      })
      .join(" | ");
  }

  return "Something went wrong. Please try again.";
}

function getSubjectList(data) {
  return getList(data)
    .map((item) => {
      const subject =
        typeof item.subject === "object" ? item.subject : null;

      return {
        id: String(subject?.id ?? item.subject ?? item.id ?? ""),
        name:
          item.subject_name ||
          subject?.name ||
          item.name ||
          "",
        code: item.subject_code || subject?.code || item.code || "",
      };
    })
    .filter((subject) => subject.id && subject.name);
}

export default function AdminTeacherAssin() {
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [yearId, setYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [mode, setMode] = useState("single");

  const [editingGroup, setEditingGroup] = useState(null);
  const [editAvailableSubjects, setEditAvailableSubjects] = useState([]);
  const [editSubjectIds, setEditSubjectIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load academic years
  const loadYears = useCallback(async () => {
    try {
      const data = await academicAdminService.getAcademicYears();
      const list = getList(data);

      setYears(list);

      const activeYear = list.find((year) => year.is_active);
      const defaultYear = activeYear || list[0];

      if (defaultYear) {
        setYearId(String(defaultYear.id));
      }
    } catch (err) {
      console.error("Academic years error:", err);
      setError(getErrorMessage(err));
    }
  }, []);

  // Load teachers
  const loadTeachers = useCallback(async () => {
    try {
      const data = await teacherService.getTeachers();
      setTeachers(getList(data));
    } catch (err) {
      console.error("Teachers error:", err);
      setError(getErrorMessage(err));
    }
  }, []);

  // Load existing assignments
  const loadAllocations = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (classId) params.set("school_class", classId);
      if (sectionId) params.set("section", sectionId);

      const query = params.toString();
      const endpoint =
        "/academics/admin/teacher-allocations/" +
        (query ? `?${query}` : "");

      const data = await apiRequest(endpoint, { method: "GET" });

      setAllocations(getList(data));
    } catch (err) {
      console.error("Teacher allocations error:", err);
      setError(getErrorMessage(err));
    }
  }, [classId, sectionId]);

  useEffect(() => {
    loadYears();
    loadTeachers();
  }, [loadYears, loadTeachers]);

  // Load classes for selected academic year
  useEffect(() => {
    let cancelled = false;

    async function loadClasses() {
      setClasses([]);
      setSections([]);
      setSubjects([]);
      setClassId("");
      setSectionId("");
      setSelectedSubjectIds([]);
      setAllocations([]);
      setEditingGroup(null);

      if (!yearId) return;

      setLoading(true);
      setError("");

      try {
        const data = await academicAdminService.getClasses(yearId);

        if (!cancelled) {
          setClasses(getList(data));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Classes error:", err);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, [yearId]);

  // Load sections and subjects when class changes
  useEffect(() => {
    let cancelled = false;

    async function loadClassData() {
      setSections([]);
      setSubjects([]);
      setSectionId("");
      setSelectedSubjectIds([]);
      setEditingGroup(null);

      if (!classId) return;

      setLoading(true);
      setError("");

      try {
        const [sectionData, subjectData] = await Promise.all([
          academicAdminService.getSections(classId),
          academicAdminService.getClassSubjects(classId),
        ]);

        if (cancelled) return;

        setSections(getList(sectionData));
        setSubjects(getSubjectList(subjectData));
      } catch (err) {
        if (!cancelled) {
          console.error("Class data error:", err);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadClassData();

    return () => {
      cancelled = true;
    };
  }, [classId]);

  // Refresh assignments when filters change
  useEffect(() => {
    loadAllocations();
  }, [loadAllocations]);

  function handleModeChange(newMode) {
    setMode(newMode);
    setSelectedSubjectIds([]);
    setError("");
    setMessage("");
  }

  function handleSubjectChange(subjectId, checked) {
    setSelectedSubjectIds((previous) => {
      if (!checked) {
        return previous.filter((id) => id !== String(subjectId));
      }

      if (mode === "single") {
        return [String(subjectId)];
      }

      return previous.includes(String(subjectId))
        ? previous
        : [...previous, String(subjectId)];
    });

    setError("");
    setMessage("");
  }

  // Create a single or multiple new assignments
  async function handleAssign(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!teacherId || !classId || !sectionId) {
      setError("Teacher, class aur section select karein.");
      return;
    }

    if (selectedSubjectIds.length === 0) {
      setError("Kam se kam ek subject select karein.");
      return;
    }

    if (mode === "single" && selectedSubjectIds.length !== 1) {
      setError("Single assignment mein sirf ek subject select karein.");
      return;
    }

    const commonPayload = {
      teacher: Number(teacherId),
      school_class: Number(classId),
      section: Number(sectionId),
    };

    setSaving(true);

    try {
      if (mode === "single") {
        await academicAdminService.createTeacherSubjectAllocation({
          ...commonPayload,
          subject: Number(selectedSubjectIds[0]),
        });

        setMessage("Subject successfully assign ho gaya.");
      } else {
        // Bulk endpoint synchronizes the complete subject set
        const existing = allocations.filter((item) => {
          const itemTeacher = String(
            typeof item.teacher === "object"
              ? item.teacher?.id
              : item.teacher
          );

          const itemClass = String(
            typeof item.school_class === "object"
              ? item.school_class?.id
              : item.school_class
          );

          const itemSection = String(
            typeof item.section === "object"
              ? item.section?.id
              : item.section
          );

          return (
            itemTeacher === String(teacherId) &&
            itemClass === String(classId) &&
            itemSection === String(sectionId)
          );
        });

        if (
          existing.length > 0 &&
          !window.confirm(
            "Bulk save existing assignments ko selected subjects ke saath synchronize karega. Jo subjects select nahi hain, woh remove ho sakte hain. Continue?"
          )
        ) {
          setSaving(false);
          return;
        }

        await academicAdminService.createBulkTeacherSubjectAllocation({
          ...commonPayload,
          subjects: selectedSubjectIds.map(Number),
        });

        setMessage(
          `${selectedSubjectIds.length} subjects successfully assign/update ho gaye.`
        );
      }

      setSelectedSubjectIds([]);
      await loadAllocations();
    } catch (err) {
      console.error("Assign teacher error:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // Group assignments by teacher + class + section
  const groupedAllocations = Object.values(
    allocations.reduce((groups, item) => {
      const teacherKey = String(
        typeof item.teacher === "object"
          ? item.teacher?.id
          : item.teacher
      );

      const classKey = String(
        typeof item.school_class === "object"
          ? item.school_class?.id
          : item.school_class
      );

      const sectionKey = String(
        typeof item.section === "object"
          ? item.section?.id
          : item.section
      );

      const key = `${teacherKey}-${classKey}-${sectionKey}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          teacher_id: teacherKey,
          school_class_id: classKey,
          section_id: sectionKey,
          teacher_name:
            item.teacher_name ||
            item.teacher?.name ||
            `Teacher ${teacherKey}`,
          class_name:
            item.class_name ||
            item.school_class?.name ||
            `Class ${classKey}`,
          section_name:
            item.section_name ||
            item.section?.name ||
            `Section ${sectionKey}`,
          subjects: [],
          subjectIds: [],
          allocationIds: [],
        };
      }

      const subjectKey = String(
        typeof item.subject === "object"
          ? item.subject?.id
          : item.subject
      );

      const subjectName =
        item.subject_name ||
        item.subject?.name ||
        `Subject ${subjectKey}`;

      if (!groups[key].subjectIds.includes(subjectKey)) {
        groups[key].subjectIds.push(subjectKey);
        groups[key].subjects.push(subjectName);
      }

      groups[key].allocationIds.push(item.id);

      return groups;
    }, {})
  );

  // Open edit panel and preselect current subjects
  async function handleEditGroup(group) {
    setError("");
    setMessage("");
    setEditingGroup(null);
    setLoading(true);

    try {
      const data = await academicAdminService.getClassSubjects(
        group.school_class_id
      );

      const classSubjects = getSubjectList(data);

      setEditAvailableSubjects(classSubjects);
      setEditSubjectIds(
        group.subjectIds.filter((id) =>
          classSubjects.some((subject) => subject.id === id)
        )
      );

      setEditingGroup(group);
    } catch (err) {
      console.error("Edit subjects error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleEditSubjectChange(subjectId, checked) {
    setEditSubjectIds((previous) => {
      if (checked) {
        return previous.includes(subjectId)
          ? previous
          : [...previous, subjectId];
      }

      return previous.filter((id) => id !== subjectId);
    });
  }

  // Save edited subject set
  async function handleSaveEditedSubjects() {
    if (!editingGroup) return;

    if (
      editSubjectIds.length === 0 &&
      !window.confirm(
        "Koi subject selected nahi hai. Kya aap is teacher ke saare assignments remove karna chahte hain?"
      )
    ) {
      return;
    }

    setEditSaving(true);
    setError("");
    setMessage("");

    try {
      await academicAdminService.createBulkTeacherSubjectAllocation({
        teacher: Number(editingGroup.teacher_id),
        school_class: Number(editingGroup.school_class_id),
        section: Number(editingGroup.section_id),
        subjects: editSubjectIds.map(Number),
      });

      setMessage("Teacher ke subjects successfully update ho gaye.");
      setEditingGroup(null);
      setEditSubjectIds([]);
      setEditAvailableSubjects([]);

      await loadAllocations();
    } catch (err) {
      console.error("Update teacher subjects error:", err);
      setError(getErrorMessage(err));
    } finally {
      setEditSaving(false);
    }
  }

  function cancelEdit() {
    setEditingGroup(null);
    setEditSubjectIds([]);
    setEditAvailableSubjects([]);
  }

  // Delete one assignment
  async function handleDeleteAssignment(id) {
    if (!window.confirm("Kya aap ye subject assignment delete karna chahte hain?")) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      await apiRequest(`/academics/admin/teacher-allocations/${id}/`, {
        method: "DELETE",
      });

      setMessage("Subject assignment delete ho gaya.");
      await loadAllocations();
    } catch (err) {
      console.error("Delete assignment error:", err);
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  // Delete every assignment in a group
  async function handleDeleteGroup(group) {
    if (
      !window.confirm(
        `Kya aap ${group.teacher_name} ke ${group.class_name}, Section ${group.section_name} ke saare assignments delete karna chahte hain?`
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      for (const id of group.allocationIds) {
        await apiRequest(`/academics/admin/teacher-allocations/${id}/`, {
          method: "DELETE",
        });
      }

      setMessage("Group ke saare assignments delete ho gaye.");

      if (editingGroup?.key === group.key) {
        cancelEdit();
      }

      await loadAllocations();
    } catch (err) {
      console.error("Delete group error:", err);
      setError(getErrorMessage(err));
      await loadAllocations();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="teacher-assignment-page">
      <style>{`
        .teacher-assignment-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          color: #172033;
          box-sizing: border-box;
        }

        .teacher-assignment-page * {
          box-sizing: border-box;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .page-header p {
          color: #64748b;
          line-height: 1.6;
        }

        .assignment-card {
          margin-bottom: 24px;
          padding: 22px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
        }

        .assignment-card h2 {
          margin: 0 0 20px;
          font-size: 20px;
        }

        .assignment-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .assignment-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .assignment-field label,
        .subject-heading {
          font-size: 14px;
          font-weight: 600;
        }

        .assignment-field select {
          width: 100%;
          min-height: 44px;
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
          color: #172033;
          font: inherit;
        }

        .assignment-mode {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .assignment-mode button,
        .assign-button,
        .edit-button,
        .cancel-button,
        .delete-button {
          min-height: 40px;
          padding: 10px 14px;
          border: 0;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .assignment-mode button {
          background: #e2e8f0;
          color: #334155;
        }

        .assignment-mode button.active,
        .assign-button {
          background: #2563eb;
          color: #fff;
        }

        .assign-button:disabled,
        .edit-button:disabled,
        .cancel-button:disabled,
        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .subject-heading {
          grid-column: 1 / -1;
        }

        .subject-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .subject-option {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .subject-option input {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
          accent-color: #2563eb;
        }

        .subject-count {
          grid-column: 1 / -1;
          margin: 0;
          color: #64748b;
        }

        .assignment-alert {
          margin-bottom: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          overflow-wrap: anywhere;
        }

        .assignment-alert.error {
          background: #fef2f2;
          color: #b91c1c;
        }

        .assignment-alert.success {
          background: #f0fdf4;
          color: #166534;
        }

        .assignment-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .assignment-table {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
        }

        .assignment-table th,
        .assignment-table td {
          padding: 13px 12px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          vertical-align: top;
          overflow-wrap: anywhere;
        }

        .assignment-table th {
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
        }

        .assignment-table td:first-child {
          font-weight: 600;
        }

        .row-actions,
        .edit-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .edit-button {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .delete-button {
          background: #fee2e2;
          color: #b91c1c;
        }

        .cancel-button {
          background: #e2e8f0;
          color: #334155;
        }

        .edit-subject-panel {
          margin: 0 0 24px;
          padding: 18px;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          background: #f8fbff;
        }

        .edit-subject-panel h3 {
          margin-top: 0;
        }

        .edit-subject-panel .subject-list {
          margin: 18px 0;
        }

        .empty-state {
          color: #64748b;
        }

        @media (max-width: 700px) {
          .teacher-assignment-page {
            padding: 14px;
          }

          .assignment-card {
            padding: 16px;
          }

          .assignment-form {
            grid-template-columns: minmax(0, 1fr);
          }

          .subject-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .page-header h1 {
            font-size: 23px;
          }
        }

        @media (max-width: 420px) {
          .subject-list {
            grid-template-columns: minmax(0, 1fr);
          }

          .assignment-mode button {
            width: 100%;
          }
        }
      `}</style>

      <header className="page-header">
        <h1>Teacher Subject Assignment</h1>
        <p>
          Teachers ko class aur section ke according single ya multiple
          subjects assign aur edit karein.
        </p>
      </header>

      {error && (
        <div className="assignment-alert error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="assignment-alert success" role="status">
          {message}
        </div>
      )}

      <section className="assignment-card">
        <h2>Assign Subjects</h2>

        <div className="assignment-mode">
          <button
            type="button"
            className={mode === "single" ? "active" : ""}
            onClick={() => handleModeChange("single")}
          >
            Single Subject Assign
          </button>

          <button
            type="button"
            className={mode === "bulk" ? "active" : ""}
            onClick={() => handleModeChange("bulk")}
          >
            Bulk Subject Assign
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleAssign}>
          <div className="assignment-field">
            <label htmlFor="academic-year">Academic Year</label>
            <select
              id="academic-year"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              required
            >
              <option value="">Select Academic Year</option>
              {years.map((year) => (
                <option key={year.id} value={String(year.id)}>
                  {year.name}
                  {year.is_active ? " (Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="assignment-field">
            <label htmlFor="school-class">Class</label>
            <select
              id="school-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={!yearId || loading}
              required
            >
              <option value="">Select Class</option>
              {classes.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name || item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="assignment-field">
            <label htmlFor="section">Section</label>
            <select
              id="section"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={!classId || sections.length === 0 || loading}
              required
            >
              <option value="">Select Section</option>
              {sections.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="assignment-field">
            <label htmlFor="teacher">Teacher</label>
            <select
              id="teacher"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={String(teacher.id)}>
                  {teacher.name ||
                    teacher.full_name ||
                    teacher.username ||
                    teacher.email ||
                    `Teacher ${teacher.id}`}
                  {teacher.employee_id ? ` (${teacher.employee_id})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="subject-heading">
            Select {mode === "single" ? "One Subject" : "Multiple Subjects"}
          </div>

          <div className="subject-list">
            {subjects.map((subject) => (
              <label className="subject-option" key={subject.id}>
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(subject.id)}
                  onChange={(e) =>
                    handleSubjectChange(subject.id, e.target.checked)
                  }
                  disabled={
                    mode === "single" &&
                    selectedSubjectIds.length === 1 &&
                    !selectedSubjectIds.includes(subject.id)
                  }
                />

                <span>
                  {subject.name}
                  {subject.code ? ` (${subject.code})` : ""}
                </span>
              </label>
            ))}

            {classId && subjects.length === 0 && (
              <p>
                {loading
                  ? "Loading subjects..."
                  : "Is class ke liye subjects available nahi hain. Pehle Class Subjects setup karein."}
              </p>
            )}

            {!classId && (
              <p>
                Subjects dekhne ke liye pehle academic year aur class select karein.
              </p>
            )}
          </div>

          <p className="subject-count">
            Selected subjects: {selectedSubjectIds.length}
          </p>

          <button
            className="assign-button"
            type="submit"
            disabled={
              saving ||
              loading ||
              !teacherId ||
              !classId ||
              !sectionId ||
              selectedSubjectIds.length === 0
            }
          >
            {saving
              ? "Saving..."
              : mode === "single"
                ? "Assign Single Subject"
                : `Assign ${selectedSubjectIds.length} Subjects`}
          </button>
        </form>
      </section>

      <section className="assignment-card">
        <h2>Existing Assignments</h2>

        {editingGroup && (
          <div className="edit-subject-panel">
            <h3>Edit Teacher Subjects</h3>

            <p>
              <strong>Teacher:</strong> {editingGroup.teacher_name}
            </p>
            <p>
              <strong>Class:</strong> {editingGroup.class_name}
              {" · "}
              <strong>Section:</strong> {editingGroup.section_name}
            </p>

            <div className="subject-list">
              {editAvailableSubjects.map((subject) => (
                <label className="subject-option" key={subject.id}>
                  <input
                    type="checkbox"
                    checked={editSubjectIds.includes(subject.id)}
                    onChange={(e) =>
                      handleEditSubjectChange(subject.id, e.target.checked)
                    }
                  />

                  <span>
                    {subject.name}
                    {subject.code ? ` (${subject.code})` : ""}
                  </span>
                </label>
              ))}
            </div>

            {editAvailableSubjects.length === 0 && (
              <p>No subjects available for this class.</p>
            )}

            <p>Selected subjects: {editSubjectIds.length}</p>

            <div className="edit-actions">
              <button
                type="button"
                className="assign-button"
                onClick={handleSaveEditedSubjects}
                disabled={editSaving || loading}
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
                disabled={editSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {allocations.length === 0 ? (
          <p className="empty-state">No teacher assignments found.</p>
        ) : groupedAllocations.length === 0 ? (
          <p className="empty-state">No grouped assignments found.</p>
        ) : (
          <div className="assignment-table-wrapper">
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subjects</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {groupedAllocations.map((item) => (
                  <tr key={item.key}>
                    <td>{item.teacher_name}</td>
                    <td>{item.class_name}</td>
                    <td>{item.section_name}</td>
                    <td>{item.subjects.join(", ")}</td>

                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEditGroup(item)}
                          disabled={loading || editSaving || deleting}
                        >
                          Edit Subjects
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDeleteGroup(item)}
                          disabled={deleting || editSaving}
                        >
                          {deleting ? "Deleting..." : "Delete Group"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
