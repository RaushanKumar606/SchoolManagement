

// import { useEffect, useState } from "react";
// import { teacherService } from "../../services/teacherService";
// // import adminService from "../../services/adminService";
// const API_URL = "http://127.0.0.1:8000/api";

// function AdminDashboard() {
//   // =========================================================
//   // STUDENT STATES
//   // =========================================================
//  const [studentCredentials, setStudentCredentials] = useState(null);
//   const [showStudentCredentials, setShowStudentCredentials] = useState(false);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [selectedApp, setSelectedApp] = useState(null);

//   const [academicYearId, setAcademicYearId] = useState("1");
// const [academicYears, setAcademicYears] = useState([]);
// const [classId, setClassId] = useState("1");
// const [sectionId, setSectionId] = useState("1");


//   // const [academicYearId, setAcademicYearId] = useState("4");
//   // const [academicYears, setAcademicYears] = useState([]);

//   // const [classId, setClassId] = useState("1");
//   // const [classes, setClasses] = useState([]);

//   // const [sectionId, setSectionId] = useState("");
//   // const [sections, setSections] = useState([]);


//   const [approving, setApproving] = useState(false);
//   const [credentials, setCredentials] = useState(null);

//   // =========================================================
//   // TEACHER STATES
//   // =========================================================

//   const [teacherApplications, setTeacherApplications] = useState([]);
//   const [teachers, setTeachers] = useState([]);

//   const [teacherLoading, setTeacherLoading] = useState(true);
//   const [teacherError, setTeacherError] = useState("");

//   const [teacherApproving, setTeacherApproving] = useState(false);
//   const [teacherCredentials, setTeacherCredentials] = useState(null);

//   // =========================================================
//   // TEACHER VIEW / EDIT STATES
//   // =========================================================

//   const [selectedTeacher, setSelectedTeacher] = useState(null);

//   const [teacherDetailsLoading, setTeacherDetailsLoading] =
//     useState(false);

//   const [teacherUpdating, setTeacherUpdating] =
//     useState(false);

//   const [teacherEditMode, setTeacherEditMode] =
//     useState(false);

//   const [teacherEditForm, setTeacherEditForm] =
//     useState({
//       name: "",
//       email: "",
//       phone: "",
//       department: "",
//       primary_subject: "",
//       qualification: "",
//     });

//   // =========================================================
//   // INITIAL LOAD
//   // =========================================================

//   useEffect(() => {
//     fetchApplications();
//     fetchTeacherData();
//     fetchAcademicYears();
//   }, []);


// //  =========================================================
// //   GET ACADEMIC YEARS
// //   Called only once on initial dashboard load
// //   =========================================================
   
//   const fetchAcademicYears = async () => {
//     try {
//       const data = await adminService.getAcademicYears();

//       const years = Array.isArray(data)
//         ? data
//         : Array.isArray(data.results)
//         ? data.results
//         : [];

//       setAcademicYears(years);

//       // Automatically select active academic year
//       const activeYear = years.find(
//         (year) => year.is_active === true
//       );

//       if (activeYear) {
//         setAcademicYearId(String(activeYear.id));
//       }
//     } catch (err) {
//       console.error("Academic Year Error:", err);
//     }
//   }; 


//   // =========================================================
//   // GET CLASSES WHEN ACADEMIC YEAR CHANGES
//   // =========================================================

//   useEffect(() => {
//     if (!academicYearId) {
//       setClasses([]);
//       setClassId("");

//       setSections([]);
//       setSectionId("");

//       return;
//     }

//     const fetchClasses = async () => {
//       try {
//         const data = await adminService.getClasses(
//           academicYearId
//         );

//         const classList = Array.isArray(data)
//           ? data
//           : Array.isArray(data.results)
//           ? data.results
//           : [];

//         setClasses(classList);

//         // Reset dependent fields
//         setClassId("");
//         setSections([]);
//         setSectionId("");
//       } catch (err) {
//         console.error("Class Error:", err);

//         setClasses([]);
//         setClassId("");

//         setSections([]);
//         setSectionId("");
//       }
//     };

//     fetchClasses();
//   }, [academicYearId]);

//   //   =========================================================
//   // GET SECTIONS WHEN CLASS CHANGES
//   // =========================================================

//  useEffect(() => {
//     if (!classId) {
//       setSections([]);
//       setSectionId("");

//       return;
//     }

//     const fetchSections = async () => {
//       try {
//         const data = await adminService.getSections(
//           classId
//         );

//         const sectionList = Array.isArray(data)
//           ? data
//           : Array.isArray(data.results)
//           ? data.results
//           : [];

//         setSections(sectionList);

//         setSectionId("");
//       } catch (err) {
//         console.error("Section Error:", err);

//         setSections([]);
//         setSectionId("");
//       }
//     };

//     fetchSections();
//   }, [classId]);



 
//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token =
//         localStorage.getItem("access_token");

//       if (!token) {
//         throw new Error(
//           "You are not logged in. Access token not found."
//         );
//       }

//       const response = await fetch(
//         `${API_URL}/admissions/list/`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       //  const data = await adminService.getAdmissionsList()

//       const data = await response.json();

//       if (!data.ok) {
//         throw new Error(
//           data.detail ||
//             data.message ||
//             "Failed to load applications"
//         );
//       }

//       if (Array.isArray(data)) {
//         setApplications(data);
//       } else if (Array.isArray(data.results)) {
//         setApplications(data.results);
//       } else {
//         setApplications([]);
//         setError(
//           "Unexpected data format received from server."
//         );
//       }
//     } catch (err) {
//       console.error("Admission Error:", err);
//       setError(err.message);
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//  const handleApproveSubmit = async (e) => {
//   e.preventDefault();

//   if (!selectedApp) return;

//   const confirmApprove = window.confirm(
//     `Are you sure you want to approve this student?\n\nStudent: ${getStudentName(
//       selectedApp
//     )}`
//   );

//   if (!confirmApprove) {
//     return;
//   }

//   try {
//     setApproving(true);

//     const token =
//       localStorage.getItem("access_token");

//     if (!token) {
//       throw new Error(
//         "Access token not found. Please login again."
//       );
//     }

//     // const response = await fetch(
//     //   `${API_URL}/admissions/${selectedApp.id}/create-student/`,
//     //   {
//     //     method: "POST",

//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },

//     //     body: JSON.stringify({
//     //       academic_year_id:
//     //         parseInt(academicYearId),

//     //       class_id:
//     //         parseInt(classId),

//     //       section_id:
//     //         parseInt(sectionId),
//     //     }),
//     //   }
//     // );

//   //   const data = await adminService.createStudentFromAdmission(
//   //   selectedApp.id,
//   //   academicYearId,
//   //   classId,
//   //   sectionId
//   // );

//     const data = await response.json();

//     console.log(
//       "CREATE STUDENT RESPONSE:",
//       data
//     );

//     if (!response.ok) {
//       throw new Error(
//         data.detail ||
//           data.message ||
//           data.error ||
//           "Failed to create student."
//       );
//     }

//     // ==========================================
//     // STUDENT CREDENTIALS
//     // ==========================================

//     setStudentCredentials({
//       studentName:
//         data.student_name ||
//         getStudentName(selectedApp),

//       studentId:
//         data.student_id || "",

//       userId:
//         data.user_id ||
//         data.user?.id ||
//         "",

//       username:
//         data.username ||
//         data.user?.username ||
//         "",

//       password:
//         data.temporary_password ||
//         data.password ||
//         "",
//     });

//     // Close approval form
//     setSelectedApp(null);

//     // Reset fields
//     setAcademicYearId("");
//     setClassId("");
//     setSectionId("");

//     // Refresh admissions
//     await fetchApplications();

//     // ==========================================
//     // OPEN STUDENT SUCCESS POPUP
//     // ==========================================

//     setShowStudentCredentials(true);

//   } catch (err) {

//     console.error(
//       "Create Student Error:",
//       err
//     );

//     window.alert(
//       `Error: ${err.message}`
//     );

//   } finally {

//     setApproving(false);
//   }
// };




//   // =========================================================
//   // TEACHER DATA
//   // ADMIN API
//   // =========================================================

//   const fetchTeacherData = async () => {
//     try {
//       setTeacherLoading(true);
//       setTeacherError("");

//       const [
//         pendingData,
//         approvedData,
//       ] = await Promise.all([
//         teacherService.getPendingTeachers(),
//         teacherService.getTeachers(),
//       ]);

//       console.log(
//         "Pending Teachers:",
//         pendingData
//       );

//       console.log(
//         "Approved Teachers:",
//         approvedData
//       );

//       // -----------------------------------------------------
//       // PENDING TEACHERS
//       // -----------------------------------------------------

//       let pendingList = [];

//       if (Array.isArray(pendingData)) {
//         pendingList = pendingData;
//       } else if (
//         Array.isArray(pendingData.results)
//       ) {
//         pendingList =
//           pendingData.results;
//       } else if (
//         Array.isArray(pendingData.teachers)
//       ) {
//         pendingList =
//           pendingData.teachers;
//       } else if (
//         Array.isArray(
//           pendingData.applications
//         )
//       ) {
//         pendingList =
//           pendingData.applications;
//       }

//       // -----------------------------------------------------
//       // APPROVED TEACHERS
//       // -----------------------------------------------------

//       let approvedList = [];

//       if (Array.isArray(approvedData)) {
//         approvedList =
//           approvedData;
//       } else if (
//         Array.isArray(approvedData.results)
//       ) {
//         approvedList =
//           approvedData.results;
//       } else if (
//         Array.isArray(approvedData.teachers)
//       ) {
//         approvedList =
//           approvedData.teachers;
//       }

//       setTeacherApplications(
//         pendingList
//       );

//       setTeachers(
//         approvedList
//       );
//     } catch (err) {
//       console.error(
//         "Teacher Error:",
//         err
//       );

//       setTeacherError(
//         err.message ||
//           "Failed to load teacher applications."
//       );

//       setTeacherApplications([]);
//       setTeachers([]);
//     } finally {
//       setTeacherLoading(false);
//     }
//   };

//   // =========================================================
//   // APPROVE TEACHER
//   // =========================================================

//   const handleApproveTeacher = async (
//     teacher
//   ) => {
//     const confirmApprove =
//       window.confirm(
//         `Are you sure you want to approve ${getTeacherName(
//           teacher
//         )}?`
//       );

//     if (!confirmApprove) return;

//     try {
//       setTeacherApproving(true);
//       setTeacherError("");

//       const data =
//         await teacherService.approveTeacher(
//           teacher.id
//         );

//       console.log(
//         "Teacher Approve Response:",
//         data
//       );

//       if (
//         data.success === false ||
//         data.error ||
//         data.detail
//       ) {
//         throw new Error(
//           data.error ||
//             data.detail ||
//             "Failed to approve teacher."
//         );
//       }

//       setTeacherCredentials({
//         teacherName:
//           getTeacherName(teacher),

//         employeeId:
//           data.employee_id ||
//           data.employeeId ||
//           data.teacher_employee_id ||
//           "",

//         username:
//           data.username ||
//           data.user?.username ||
//           "",

//         password:
//           data.temporary_password ||
//           data.password ||
//           data.temp_password ||
//           "",
//       });

//       await fetchTeacherData();
//     } catch (err) {
//       console.error(
//         "Approve Teacher Error:",
//         err
//       );

//       setTeacherError(
//         err.message
//       );

//       alert(
//         `Error: ${err.message}`
//       );
//     } finally {
//       setTeacherApproving(false);
//     }
//   };

//   // =========================================================
//   // VIEW TEACHER
//   // USING EMPLOYEE ID
//   // =========================================================

//   const handleViewTeacher = async (
//     teacher
//   ) => {
//     const employeeId =
//       teacher.employee_id ||
//       teacher.employeeId;

//     if (!employeeId) {
//       alert(
//         "Employee ID not found."
//       );
//       return;
//     }

//     try {
//       setTeacherDetailsLoading(
//         true
//       );

//       setTeacherEditMode(false);

//       const data =
//         await teacherService.getTeacherDetails(
//           employeeId
//         );

//       console.log(
//         "Teacher Details:",
//         data
//       );

//       if (!data.success) {
//         throw new Error(
//           data.error ||
//             "Failed to load teacher details."
//         );
//       }

//       setSelectedTeacher(
//         data.teacher
//       );
//     } catch (err) {
//       console.error(
//         "Teacher Details Error:",
//         err
//       );

//       alert(
//         `Error: ${err.message}`
//       );
//     } finally {
//       setTeacherDetailsLoading(
//         false
//       );
//     }
//   };

//   // =========================================================
//   // EDIT TEACHER
//   // =========================================================

//   const handleEditTeacher = (
//     teacher
//   ) => {
//     setTeacherEditForm({
//       name:
//         teacher.name || "",

//       email:
//         teacher.email ||
//         teacher.user?.email ||
//         "",

//       phone:
//         teacher.phone || "",

//       department:
//         teacher.department || "",

//       primary_subject:
//         teacher.primary_subject ||
//         teacher.subject ||
//         "",

//       qualification:
//         teacher.qualification || "",
//     });

//     setTeacherEditMode(true);
//   };

//   // =========================================================
//   // TEACHER FORM CHANGE
//   // =========================================================

//   const handleTeacherEditChange = (
//     e
//   ) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     setTeacherEditForm(
//       (prev) => ({
//         ...prev,
//         [name]: value,
//       })
//     );
//   };

//   // =========================================================
//   // UPDATE TEACHER
//   // USING EMPLOYEE ID
//   // =========================================================

//   const handleUpdateTeacher =
//     async (e) => {
//       e.preventDefault();

//       if (
//         !selectedTeacher?.employee_id
//       ) {
//         alert(
//           "Employee ID not found."
//         );
//         return;
//       }

//       try {
//         setTeacherUpdating(
//           true
//         );

//         const data =
//           await teacherService.updateTeacher(
//             selectedTeacher.employee_id,
//             teacherEditForm
//           );

//         console.log(
//           "Teacher Update:",
//           data
//         );

//         if (!data.success) {
//           throw new Error(
//             data.error ||
//               "Failed to update teacher."
//           );
//         }

//         alert(
//           "Teacher updated successfully."
//         );

//         setSelectedTeacher(
//           data.teacher
//         );

//         setTeacherEditMode(
//           false
//         );

//         await fetchTeacherData();
//       } catch (err) {
//         console.error(
//           "Update Teacher Error:",
//           err
//         );

//         alert(
//           `Error: ${err.message}`
//         );
//       } finally {
//         setTeacherUpdating(
//           false
//         );
//       }
//     };

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   const getStudentName = (
//     application
//   ) => {
//     return [
//       application.student_first_name,
//       application.student_middle_name,
//       application.student_last_name,
//     ]
//       .filter(Boolean)
//       .join(" ");
//   };

//   const getTeacherName = (
//     teacher
//   ) => {
//     return (
//       teacher.name ||
//       teacher.full_name ||
//       teacher.user?.first_name ||
//       "Teacher"
//     );
//   };

//   const getTeacherEmail = (
//     teacher
//   ) => {
//     return (
//       teacher.email ||
//       teacher.user?.email ||
//       "-"
//     );
//   };

//   // =========================================================
//   // COUNTS
//   // =========================================================

//   const totalStudentApplications =
//     applications.length;

//   const pendingStudents =
//     applications.filter(
//       (item) =>
//         item.status === "PENDING"
//     ).length;

//   const reviewingStudents =
//     applications.filter(
//       (item) =>
//         item.status === "REVIEWING"
//     ).length;

//   const approvedStudents =
//     applications.filter(
//       (item) =>
//         item.status === "APPROVED"
//     ).length;

//   const totalTeacherApplications =
//     teacherApplications.length +
//     teachers.length;

//   const pendingTeachers =
//     teacherApplications.length;

//   const approvedTeachers =
//     teachers.length;

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="admin-page">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div className="admin-page-header">

//         <div>

//           <p className="page-label">
//             SCHOOL ADMINISTRATION
//           </p>

//           <h1>
//             Admission & Teacher Management
//           </h1>

//           <p>
//             Review and manage student
//             admissions and teacher
//             applications.
//           </p>

//         </div>

//         <button
//           className="refresh-button"
//           onClick={() => {
//             fetchApplications();
//             fetchTeacherData();
//           }}
//         >
//           ↻ Refresh
//         </button>

//       </div>

//       {/* =====================================================
//           ERRORS
//       ===================================================== */}

//       {error && (
//         <div className="admin-error">
//           Student: {error}
//         </div>
//       )}

//       {teacherError && (
//         <div className="admin-error">
//           Teacher: {teacherError}
//         </div>
//       )}

//       {/* =====================================================
//           STUDENT SUMMARY
//       ===================================================== */}

//       <h2 className="section-title">
//         Student Admissions
//       </h2>

//       <div className="admission-summary">

//         <div className="summary-card">
//           <span>
//             Total Applications Student
//           </span>

//           <strong>
//             {totalStudentApplications}
//           </strong>
//         </div>

//         <div className="summary-card">
//           <span>
//             Pending Student
//           </span>

//           <strong>
//             {pendingStudents}
//           </strong>
//         </div>

//         <div className="summary-card">
//           <span>
//             Reviewing
//           </span>

//           <strong>
//             {reviewingStudents}
//           </strong>
//         </div>

//         <div className="summary-card">
//           <span>
//             Approved Student
//           </span>

//           <strong>
//             {approvedStudents}
//           </strong>
//         </div>

//       </div>

//       {/* =====================================================
//           TEACHER SUMMARY
//       ===================================================== */}

//       <h2 className="section-title">
//         Teacher Applications
//       </h2>

//       <div className="admission-summary">

//         <div className="summary-card">
//           <span>
//             Total Applications Teacher
//           </span>

//           <strong>
//             {totalTeacherApplications}
//           </strong>
//         </div>

//         <div className="summary-card">
//           <span>
//             Pending Teacher
//           </span>

//           <strong>
//             {pendingTeachers}
//           </strong>
//         </div>

//         <div className="summary-card">
//           <span>
//             Approved Teacher
//           </span>

//           <strong>
//             {approvedTeachers}
//           </strong>
//         </div>

//       </div>

//       {/* =====================================================
//           STUDENT TABLE
//       ===================================================== */}

//       <div className="admission-table-card">

//         <div className="table-section-header">

//           <div>

//             <h2>
//               Student Admission Applications
//             </h2>

//             <p>
//               Manage student admission requests.
//             </p>

//           </div>

//           <button
//             className="refresh-button"
//             onClick={
//               fetchApplications
//             }
//           >
//             ↻ Refresh
//           </button>

//         </div>

//         {loading ? (

//           <div className="table-loading">
//             Loading applications...
//           </div>

//         ) : applications.length === 0 ? (

//           <div className="empty-state">

//             <div>🎓</div>

//             <h3>
//               No applications found
//             </h3>

//             <p>
//               New admission applications
//               will appear here.
//             </p>

//           </div>

//         ) : (

//           <div className="table-wrapper">

//             <table className="admission-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Application No.
//                   </th>

//                   <th>
//                     Student
//                   </th>

//                   <th>
//                     Class
//                   </th>

//                   <th>
//                     Parent
//                   </th>

//                   <th>
//                     Phone
//                   </th>

//                   <th>
//                     Status
//                   </th>

//                   <th>
//                     Applied On
//                   </th>

//                   <th>
//                     Action
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {applications.map(
//                   (application) => (

//                     <tr
//                       key={
//                         application.id
//                       }
//                     >

//                       <td>
//                         <strong>
//                           {application.application_number ||
//                             "-"}
//                         </strong>
//                       </td>

//                       <td>
//                         <div className="student-name">
//                           {getStudentName(
//                             application
//                           ) || "-"}
//                         </div>
//                       </td>

//                       <td>
//                         {application.applying_for_class ||
//                           "-"}
//                       </td>

//                       <td>
//                         {application.father_name ||
//                           "-"}
//                       </td>

//                       <td>
//                         {application.parent_phone ||
//                           "-"}
//                       </td>

//                       <td>

//                         <span
//                           className={`status-badge ${
//                             application.status
//                               ? application.status.toLowerCase()
//                               : ""
//                           }`}
//                         >
//                           {application.status ||
//                             "-"}
//                         </span>

//                       </td>

//                       <td>
//                         {application.created_at
//                           ? new Date(
//                               application.created_at
//                             ).toLocaleDateString(
//                               "en-IN"
//                             )
//                           : "-"}
//                       </td>

//                       <td
//                         style={{
//                           display: "flex",
//                           gap: "6px",
//                         }}
//                       >

//                         <button
//                           className="view-button"
//                           onClick={() =>
//                             alert(
//                               `Application: ${application.application_number}`
//                             )
//                           }
//                         >
//                           View
//                         </button>

//                         {application.status ===
//                           "PENDING" && (

//                           <button
//                             className="approve-action-button"
//                             onClick={() =>
//                               setSelectedApp(
//                                 application
//                               )
//                             }
//                           >
//                             Approve
//                           </button>

//                         )}

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//       {/* =====================================================
//           PENDING TEACHERS
//       ===================================================== */}

//       <div className="admission-table-card">

//         <div className="table-section-header">

//           <div>

//             <h2>
//               Pending Teacher Applications
//             </h2>

//             <p>
//               Review and approve teacher
//               registration requests.
//             </p>

//           </div>

//           <button
//             className="refresh-button"
//             onClick={
//               fetchTeacherData
//             }
//           >
//             ↻ Refresh
//           </button>

//         </div>

//         {teacherLoading ? (

//           <div className="table-loading">
//             Loading teacher applications...
//           </div>

//         ) : teacherApplications.length === 0 ? (

//           <div className="empty-state">

//             <div>👨‍🏫</div>

//             <h3>
//               No pending teacher applications
//             </h3>

//             <p>
//               New teacher registrations
//               will appear here.
//             </p>

//           </div>

//         ) : (

//           <div className="table-wrapper">

//             <table className="admission-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Name
//                   </th>

//                   <th>
//                     Email
//                   </th>

//                   <th>
//                     Phone
//                   </th>

//                   <th>
//                     Department
//                   </th>

//                   <th>
//                     Subject
//                   </th>

//                   <th>
//                     Qualification
//                   </th>

//                   <th>
//                     Action
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {teacherApplications.map(
//                   (teacher) => (

//                     <tr
//                       key={teacher.id}
//                     >

//                       <td>
//                         <strong>
//                           {getTeacherName(
//                             teacher
//                           )}
//                         </strong>
//                       </td>

//                       <td>
//                         {getTeacherEmail(
//                           teacher
//                         )}
//                       </td>

//                       <td>
//                         {teacher.phone ||
//                           "-"}
//                       </td>

//                       <td>
//                         {teacher.department ||
//                           "-"}
//                       </td>

//                       <td>
//                         {teacher.primary_subject ||
//                           teacher.subject ||
//                           "-"}
//                       </td>

//                       <td>
//                         {teacher.qualification ||
//                           "-"}
//                       </td>

//                       <td>

//                         <button
//                           className="approve-action-button"
//                           disabled={
//                             teacherApproving
//                           }
//                           onClick={() =>
//                             handleApproveTeacher(
//                               teacher
//                             )
//                           }
//                         >
//                           {teacherApproving
//                             ? "Approving..."
//                             : "Approve"}
//                         </button>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//       {/* =====================================================
//           APPROVED TEACHERS
//       ===================================================== */}

//       <div className="admission-table-card">

//         <div className="table-section-header">

//           <div>

//             <h2>
//               Approved Teachers
//             </h2>

//             <p>
//               View and edit approved teachers
//               using Employee ID.
//             </p>

//           </div>

//           <button
//             className="refresh-button"
//             onClick={
//               fetchTeacherData
//             }
//           >
//             ↻ Refresh
//           </button>

//         </div>

//         {teacherLoading ? (

//           <div className="table-loading">
//             Loading teachers...
//           </div>

//         ) : teachers.length === 0 ? (

//           <div className="empty-state">

//             <div>👩‍🏫</div>

//             <h3>
//               No approved teachers
//             </h3>

//             <p>
//               Approved teachers will
//               appear here.
//             </p>

//           </div>

//         ) : (

//           <div className="table-wrapper">

//             <table className="admission-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Employee ID
//                   </th>

//                   <th>
//                     Name
//                   </th>

//                   <th>
//                     Email
//                   </th>

//                   <th>
//                     Phone
//                   </th>

//                   <th>
//                     Department
//                   </th>

//                   <th>
//                     Subject
//                   </th>

//                   <th>
//                     Status
//                   </th>

//                   <th>
//                     Action
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {teachers.map(
//                   (teacher) => (

//                     <tr
//                       key={teacher.id}
//                     >

//                       <td>
//                         <strong>
//                           {teacher.employee_id ||
//                             teacher.employeeId ||
//                             "-"}
//                         </strong>
//                       </td>

//                       <td>
//                         {getTeacherName(
//                           teacher
//                         )}
//                       </td>

//                       <td>
//                         {getTeacherEmail(
//                           teacher
//                         )}
//                       </td>

//                       <td>
//                         {teacher.phone ||
//                           "-"}
//                       </td>

//                       <td>
//                         {teacher.department ||
//                           "-"}
//                       </td>

//                       <td>
//                         {teacher.primary_subject ||
//                           teacher.subject ||
//                           "-"}
//                       </td>

//                       <td>

//                         <span className="status-badge approved">
//                           APPROVED
//                         </span>

//                       </td>

//                       {/* VIEW / EDIT */}

//                       <td>

//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "6px",
//                             flexWrap: "wrap",
//                           }}
//                         >

//                           <button
//                             className="view-button"
//                             onClick={() =>
//                               handleViewTeacher(
//                                 teacher
//                               )
//                             }
//                           >
//                             View
//                           </button>

//                           <button
//                             className="edit-button"
//                             onClick={() => {

//                               const teacherData =
//                                 {
//                                   ...teacher,

//                                   employee_id:
//                                     teacher.employee_id ||
//                                     teacher.employeeId,

//                                   email:
//                                     teacher.email ||
//                                     teacher.user?.email ||
//                                     "",

//                                   phone:
//                                     teacher.phone ||
//                                     "",

//                                   qualification:
//                                     teacher.qualification ||
//                                     "",

//                                   primary_subject:
//                                     teacher.primary_subject ||
//                                     teacher.subject ||
//                                     "",
//                                 };

//                               setSelectedTeacher(
//                                 teacherData
//                               );

//                               handleEditTeacher(
//                                 teacherData
//                               );
//                             }}
//                           >
//                             Edit
//                           </button>

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//       {/* =====================================================
//           STUDENT APPROVAL MODAL
//       ===================================================== */}

//       {selectedApp && (

//         <div className="modal-overlay">

//           <div className="modal-content">

//             <h2>
//               Approve Admission
//             </h2>

//             <p>
//               Student:{" "}
//               <strong>
//                 {getStudentName(
//                   selectedApp
//                 )}
//               </strong>
//             </p>

//             <form
//               onSubmit={
//                 handleApproveSubmit
//               }
//             >

//               <div className="form-group">

//                 <label>
//                   Academic Year ID:
//                 </label>

//                 <input
//                   type="number"
//                   value={
//                     academicYearId
//                   }
//                   onChange={(e) =>
//                     setAcademicYearId(
//                       e.target.value
//                     )
//                   }
//                   required
//                 />

//               </div>

//               <div className="form-group">

//                 <label>
//                   Class ID:
//                 </label>

//                 <input
//                   type="number"
//                   value={
//                     classId
//                   }
//                   onChange={(e) =>
//                     setClassId(
//                       e.target.value
//                     )
//                   }
//                   required
//                 />

//               </div>

//               <div className="form-group">

//                 <label>
//                   Section ID:
//                 </label>

//                 <input
//                   type="number"
//                   value={
//                     sectionId
//                   }
//                   onChange={(e) =>
//                     setSectionId(
//                       e.target.value
//                     )
//                   }
//                   required
//                 />

//               </div>

//               <div className="modal-actions">

//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={() =>
//                     setSelectedApp(
//                       null
//                     )
//                   }
//                   disabled={approving}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="submit-btn"
//                   disabled={approving}
//                 >
//                   {approving
//                     ? "Creating..."
//                     : "Confirm & Generate Credentials"}
//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       )}

//       {/* =====================================================
//           STUDENT CREDENTIALS MODAL
//       ===================================================== */}

//       {showStudentCredentials &&
//   studentCredentials && (
//     <div className="modal-overlay">

//       <div className="student-success-modal">

//         {/* HEADER */}

//         <div className="student-success-header">

//           <h2>
//             🎉 Student Approved!
//           </h2>

//           <p>
//             Student account has been
//             created successfully.
//           </p>

//         </div>


//         {/* CREDENTIAL BOX */}

//         <div className="student-credentials-box">

//           {/* Student Name */}

//           <div className="credential-line">

//             <strong className="label-dark">
//               Student Name:
//             </strong>

//             <span>
//               {studentCredentials.studentName ||
//                 "-"}
//             </span>

//           </div>


//           {/* Student ID */}

//           <div className="credential-line">

//             <strong className="label-purple">
//               Student ID:
//             </strong>

//             <span>
//               {studentCredentials.studentId ||
//                 "-"}
//             </span>

//           </div>


//           {/* User ID */}

//           <div className="credential-line">

//             <strong className="label-blue">
//               User ID:
//             </strong>

//             <span>
//               {studentCredentials.userId ||
//                 "-"}
//             </span>

//           </div>


//           {/* Username */}

//           <div className="credential-line">

//             <strong className="label-blue">
//               Username:
//             </strong>

//             <span>
//               {studentCredentials.username ||
//                 "-"}
//             </span>

//           </div>


//           {/* Password */}

//           <div className="credential-line">

//             <strong className="label-red">
//               Temporary Password:
//             </strong>

//             <span>
//               {studentCredentials.password ||
//                 "-"}
//             </span>

//           </div>

//         </div>


//         {/* CLOSE BUTTON */}

//         <button
//           className="student-success-close"
//           onClick={() => {
//             setShowStudentCredentials(false);
//             setStudentCredentials(null);
//           }}
//         >
//           Close
//         </button>

//       </div>

//     </div>
//   )}
//       {/* =====================================================
//           TEACHER VIEW / EDIT POPUP
//       ===================================================== */}

//       {selectedTeacher && (

//         <div className="modal-overlay">

//           <div
//             className="modal-content teacher-modal"
//           >

//             {/* HEADER */}

//             <div className="teacher-modal-header">

//               <div>

//                 <h2>
//                   {teacherEditMode
//                     ? "Edit Teacher"
//                     : "Teacher Details"}
//                 </h2>

//                 <p>
//                   Employee ID:{" "}
//                   <strong>
//                     {selectedTeacher.employee_id}
//                   </strong>
//                 </p>

//               </div>

//               <button
//                 className="close-modal-button"
//                 onClick={() => {
//                   setSelectedTeacher(
//                     null
//                   );
//                   setTeacherEditMode(
//                     false
//                   );
//                 }}
//               >
//                 ×
//               </button>

//             </div>

//             {/* LOADING */}

//             {teacherDetailsLoading ? (

//               <div className="table-loading">
//                 Loading teacher details...
//               </div>

//             ) : teacherEditMode ? (

//               /* =================================================
//                  EDIT MODE
//               ================================================= */

//               <form
//                 onSubmit={
//                   handleUpdateTeacher
//                 }
//               >

//                 <div className="form-group">

//                   <label>
//                     Employee ID
//                   </label>

//                   <input
//                     type="text"
//                     value={
//                       selectedTeacher.employee_id
//                     }
//                     disabled
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={
//                       teacherEditForm.name
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                     required
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Email
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     value={
//                       teacherEditForm.email
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Phone
//                   </label>

//                   <input
//                     type="text"
//                     name="phone"
//                     value={
//                       teacherEditForm.phone
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Department
//                   </label>

//                   <input
//                     type="text"
//                     name="department"
//                     value={
//                       teacherEditForm.department
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Primary Subject
//                   </label>

//                   <input
//                     type="text"
//                     name="primary_subject"
//                     value={
//                       teacherEditForm.primary_subject
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Qualification
//                   </label>

//                   <input
//                     type="text"
//                     name="qualification"
//                     value={
//                       teacherEditForm.qualification
//                     }
//                     onChange={
//                       handleTeacherEditChange
//                     }
//                   />

//                 </div>

//                 <div className="modal-actions">

//                   <button
//                     type="button"
//                     className="cancel-btn"
//                     onClick={() =>
//                       setTeacherEditMode(
//                         false
//                       )
//                     }
//                     disabled={
//                       teacherUpdating
//                     }
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     className="submit-btn"
//                     disabled={
//                       teacherUpdating
//                     }
//                   >
//                     {teacherUpdating
//                       ? "Updating..."
//                       : "Update Teacher"}
//                   </button>

//                 </div>

//               </form>

//             ) : (

//               /* =================================================
//                  VIEW MODE
//               ================================================= */

//               <div>

//                 <div className="teacher-detail-grid">

//                   <div className="teacher-detail-item">

//                     <span>
//                       Name
//                     </span>

//                     <strong>
//                       {selectedTeacher.name ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Employee ID
//                     </span>

//                     <strong>
//                       {selectedTeacher.employee_id ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Email
//                     </span>

//                     <strong>
//                       {selectedTeacher.email ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Phone
//                     </span>

//                     <strong>
//                       {selectedTeacher.phone ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Department
//                     </span>

//                     <strong>
//                       {selectedTeacher.department ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Primary Subject
//                     </span>

//                     <strong>
//                       {selectedTeacher.primary_subject ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Qualification
//                     </span>

//                     <strong>
//                       {selectedTeacher.qualification ||
//                         "-"}
//                     </strong>

//                   </div>

//                   <div className="teacher-detail-item">

//                     <span>
//                       Status
//                     </span>

//                     <strong
//                       style={{
//                         color:
//                           selectedTeacher.is_active
//                             ? "#16a34a"
//                             : "#dc2626",
//                       }}
//                     >
//                       {selectedTeacher.is_active
//                         ? "Active"
//                         : "Inactive"}
//                     </strong>

//                   </div>

//                 </div>

//                 <div
//                   className="modal-actions"
//                   style={{
//                     marginTop: "20px",
//                   }}
//                 >

//                   <button
//                     className="cancel-btn"
//                     onClick={() =>
//                       setSelectedTeacher(
//                         null
//                       )
//                     }
//                   >
//                     Close
//                   </button>

//                   <button
//                     className="submit-btn"
//                     onClick={() =>
//                       handleEditTeacher(
//                         selectedTeacher
//                       )
//                     }
//                   >
//                     Edit Teacher
//                   </button>

//                 </div>

//               </div>

//             )}

//           </div>

//         </div>

//       )}

//       {/* =====================================================
//           TEACHER CREDENTIALS MODAL
//       ===================================================== */}

//       {teacherCredentials && (

//         <div className="modal-overlay">

//           <div className="modal-content success-modal">

//             <h2
//               style={{
//                 color: "#16a34a",
//               }}
//             >
//               🎉 Teacher Approved!
//             </h2>

//             <p>
//               Teacher account has been
//               created successfully.
//             </p>

//             <div className="credentials-box">

//               <p>
//                 <strong>
//                   Teacher Name:
//                 </strong>{" "}
//                 {
//                   teacherCredentials.teacherName
//                 }
//               </p>

//               <hr />

//               <p
//                 style={{
//                   color: "#7c3aed",
//                 }}
//               >
//                 <strong>
//                   Employee ID:
//                 </strong>{" "}
//                 {
//                   teacherCredentials.employeeId ||
//                   "-"
//                 }
//               </p>

//               <p
//                 style={{
//                   color: "#2563eb",
//                 }}
//               >
//                 <strong>
//                   Username:
//                 </strong>{" "}
//                 {
//                   teacherCredentials.username ||
//                   "-"
//                 }
//               </p>

//               <p
//                 style={{
//                   color: "#dc2626",
//                 }}
//               >
//                 <strong>
//                   Temporary Password:
//                 </strong>{" "}
//                 {
//                   teacherCredentials.password ||
//                   "-"
//                 }
//               </p>

//             </div>

//             <button
//               className="submit-btn"
//               onClick={() =>
//                 setTeacherCredentials(
//                   null
//                 )
//               }
//             >
//               Close
//             </button>

//           </div>

//         </div>

//       )}

//       {/* =====================================================
//           STYLES
//       ===================================================== */}

//       <style>{`

//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//           padding: 20px;
//         }

//         .modal-content {
//           background: #fff;
//           padding: 24px;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 420px;
//           box-shadow:
//             0 4px 12px rgba(0,0,0,0.15);
//         }

//         .teacher-modal {
//           max-width: 620px;
//           max-height: 90vh;
//           overflow-y: auto;
//         }

//         .teacher-modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 20px;
//         }

//         .teacher-modal-header h2 {
//           margin: 0;
//         }

//         .teacher-modal-header p {
//           margin: 5px 0 0;
//           color: #6b7280;
//         }

//         .close-modal-button {
//           border: none;
//           background: transparent;
//           font-size: 28px;
//           cursor: pointer;
//           color: #6b7280;
//           line-height: 1;
//         }

//         .close-modal-button:hover {
//           color: #111827;
//         }

//         .form-group {
//           margin-bottom: 14px;
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .form-group label {
//           font-weight: 500;
//           color: #374151;
//         }

//         .form-group input {
//           padding: 9px 10px;
//           border: 1px solid #d1d5db;
//           border-radius: 5px;
//           font-size: 14px;
//           outline: none;
//         }

//         .form-group input:focus {
//           border-color: #2563eb;
//         }

//         .form-group input:disabled {
//           background: #f3f4f6;
//           cursor: not-allowed;
//         }

//         .modal-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//           margin-top: 18px;
//         }

//         .cancel-btn {
//           padding: 9px 16px;
//           border: 1px solid #d1d5db;
//           background: #fff;
//           border-radius: 5px;
//           cursor: pointer;
//         }

//         .cancel-btn:hover {
//           background: #f9fafb;
//         }

//         .submit-btn {
//           padding: 9px 16px;
//           border: none;
//           background: #2563eb;
//           color: #fff;
//           border-radius: 5px;
//           cursor: pointer;
//           font-weight: 600;
//           width: 100%;
//         }

//         .submit-btn:hover {
//           background: #1d4ed8;
//         }

//         .submit-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .credentials-box {
//           background: #f3f4f6;
//           padding: 14px;
//           border-radius: 6px;
//           margin: 16px 0;
//         }

//         .credentials-box p {
//           margin: 8px 0;
//         }

//         .section-title {
//           margin: 25px 0 12px;
//         }

//         .table-section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 18px;
//         }

//         .table-section-header h2 {
//           margin: 0;
//         }

//         .table-section-header p {
//           margin: 5px 0 0;
//           color: #6b7280;
//         }

//         .approve-action-button {
//           background: #16a34a;
//           color: #fff;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-weight: 500;
//         }

//         .approve-action-button:hover {
//           background: #15803d;
//         }

//         .approve-action-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .status-badge.approved {
//           background: #dcfce7;
//           color: #166534;
//         }

//         /* =====================================================
//            TEACHER VIEW BUTTON
//         ===================================================== */

//         .view-button {
//           background: #2563eb;
//           color: #fff;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-weight: 500;
//         }

//         .view-button:hover {
//           background: #1d4ed8;
//         }

//         /* =====================================================
//            TEACHER EDIT BUTTON
//         ===================================================== */

//         .edit-button {
//           background: #f59e0b;
//           color: #fff;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-weight: 500;
//         }

//         .edit-button:hover {
//           background: #d97706;
//         }

//         /* =====================================================
//            TEACHER DETAILS GRID
//         ===================================================== */

//         .teacher-detail-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .teacher-detail-item {
//           background: #f8fafc;
//           border: 1px solid #e5e7eb;
//           border-radius: 6px;
//           padding: 13px;
//         }

//         .teacher-detail-item span {
//           display: block;
//           font-size: 12px;
//           color: #6b7280;
//           margin-bottom: 5px;
//         }

//         .teacher-detail-item strong {
//           font-size: 14px;
//           color: #111827;
//           word-break: break-word;
//         }

//         @media (max-width: 600px) {

//           .teacher-detail-grid {
//             grid-template-columns: 1fr;
//           }

//           .teacher-modal {
//             max-width: 100%;
//           }

//           .table-section-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 12px;
//           }

//         }

//          /* =====================================================
//          STUDENT APPROVED SUCCESS POPUP
//           ===================================================== */

// .student-success-modal {
//   width: 465px;
//   max-width: 90%;
//   background: #ffffff;
//   border-radius: 8px;
//   padding: 28px;
//   box-sizing: border-box;
//   box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
// }


// /* HEADER */

// .student-success-header h2 {
//   margin: 0;
//   font-size: 28px;
//   font-weight: 700;
//   color: #4ca05a;
// }

// .student-success-header p {
//   margin: 5px 0 20px;
//   font-size: 19px;
//   color: #222;
// }


// /* CREDENTIAL BOX */

// .student-credentials-box {
//   background: #f1f2f4;
//   border-radius: 7px;
//   padding: 25px 18px;
//   margin-bottom: 20px;
// }


// /* EACH LINE */

// .credential-line {
//   display: flex;
//   align-items: baseline;
//   gap: 5px;
//   padding: 9px 0;
//   font-size: 18px;
//   border-bottom: 1px solid #9ca3af;
// }

// .credential-line:last-child {
//   border-bottom: none;
// }


// /* LABELS */

// .label-dark {
//   color: #1f2937;
// }

// .label-purple {
//   color: #7c3aed;
// }

// .label-blue {
//   color: #2563eb;
// }

// .label-red {
//   color: #b83b3b;
// }


// /* VALUES */

// .credential-line span {
//   color: #374151;
// }


// /* CLOSE BUTTON */

// .student-success-close {
//   width: 100%;
//   border: none;
//   background: #3864df;
//   color: white;
//   padding: 12px;
//   border-radius: 5px;
//   font-size: 17px;
//   font-weight: 600;
//   cursor: pointer;
// }

// .student-success-close:hover {
//   background: #2f56c5;
// }


// /* MOBILE */

// @media (max-width: 600px) {

//   .student-success-modal {
//     width: 95%;
//     padding: 20px;
//   }

//   .student-success-header h2 {
//     font-size: 23px;
//   }

//   .student-success-header p {
//     font-size: 16px;
//   }

//   .credential-line {
//     font-size: 15px;
//   }
// }


          

//       `}</style>

//     </div>
//   );
// }

// export default AdminDashboard;
















// // import { useEffect, useState } from "react";
// // import { teacherService } from "../../services/teacherService";
// // import adminService from "../../services/adminService";

// // function AdminDashboard() {
// //   // =========================================================
// //   // STUDENT STATES
// //   // =========================================================

// //   const [studentCredentials, setStudentCredentials] = useState(null);
// //   const [showStudentCredentials, setShowStudentCredentials] =
// //     useState(false);

// //   const [applications, setApplications] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const [selectedApp, setSelectedApp] = useState(null);

// //   // Academic Year / Class / Section
// //   const [academicYearId, setAcademicYearId] = useState("");
// //   const [academicYears, setAcademicYears] = useState([]);

// //   const [classId, setClassId] = useState("");
// //   const [classes, setClasses] = useState([]);

// //   const [sectionId, setSectionId] = useState("");
// //   const [sections, setSections] = useState([]);

// //   const [approving, setApproving] = useState(false);

// //   // =========================================================
// //   // TEACHER STATES
// //   // =========================================================

// //   const [teacherApplications, setTeacherApplications] = useState([]);
// //   const [teachers, setTeachers] = useState([]);

// //   const [teacherLoading, setTeacherLoading] = useState(true);
// //   const [teacherError, setTeacherError] = useState("");

// //   const [teacherApproving, setTeacherApproving] = useState(false);
// //   const [teacherCredentials, setTeacherCredentials] = useState(null);

// //   // =========================================================
// //   // TEACHER VIEW / EDIT STATES
// //   // =========================================================

// //   const [selectedTeacher, setSelectedTeacher] = useState(null);

// //   const [teacherDetailsLoading, setTeacherDetailsLoading] =
// //     useState(false);

// //   const [teacherUpdating, setTeacherUpdating] =
// //     useState(false);

// //   const [teacherEditMode, setTeacherEditMode] =
// //     useState(false);

// //   const [teacherEditForm, setTeacherEditForm] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     department: "",
// //     primary_subject: "",
// //     qualification: "",
// //   });

// //   // =========================================================
// //   // INITIAL LOAD
// //   // =========================================================

// //   useEffect(() => {
// //     fetchApplications();
// //     fetchTeacherData();
// //     fetchAcademicYears();
// //   }, []);

// //   // =========================================================
// //   // GET ACADEMIC YEARS
// //   // Called only once on initial dashboard load
// //   // =========================================================

// //   const fetchAcademicYears = async () => {
// //     try {
// //       const data = await adminService.getAcademicYears();

// //       const years = Array.isArray(data)
// //         ? data
// //         : Array.isArray(data.results)
// //         ? data.results
// //         : [];

// //       setAcademicYears(years);

// //       // Automatically select active academic year
// //       const activeYear = years.find(
// //         (year) => year.is_active === true
// //       );

// //       if (activeYear) {
// //         setAcademicYearId(String(activeYear.id));
// //       }
// //     } catch (err) {
// //       console.error("Academic Year Error:", err);
// //     }
// //   };

// //   // =========================================================
// //   // GET CLASSES WHEN ACADEMIC YEAR CHANGES
// //   // =========================================================

// //   useEffect(() => {
// //     if (!academicYearId) {
// //       setClasses([]);
// //       setClassId("");

// //       setSections([]);
// //       setSectionId("");

// //       return;
// //     }

// //     const fetchClasses = async () => {
// //       try {
// //         const data = await adminService.getClasses(
// //           academicYearId
// //         );

// //         const classList = Array.isArray(data)
// //           ? data
// //           : Array.isArray(data.results)
// //           ? data.results
// //           : [];

// //         setClasses(classList);

// //         // Reset dependent fields
// //         setClassId("");
// //         setSections([]);
// //         setSectionId("");
// //       } catch (err) {
// //         console.error("Class Error:", err);

// //         setClasses([]);
// //         setClassId("");

// //         setSections([]);
// //         setSectionId("");
// //       }
// //     };

// //     fetchClasses();
// //   }, [academicYearId]);

// //   // =========================================================
// //   // GET SECTIONS WHEN CLASS CHANGES
// //   // =========================================================

// //   useEffect(() => {
// //     if (!classId) {
// //       setSections([]);
// //       setSectionId("");

// //       return;
// //     }

// //     const fetchSections = async () => {
// //       try {
// //         const data = await adminService.getSections(
// //           classId
// //         );

// //         const sectionList = Array.isArray(data)
// //           ? data
// //           : Array.isArray(data.results)
// //           ? data.results
// //           : [];

// //         setSections(sectionList);

// //         setSectionId("");
// //       } catch (err) {
// //         console.error("Section Error:", err);

// //         setSections([]);
// //         setSectionId("");
// //       }
// //     };

// //     fetchSections();
// //   }, [classId]);

// //   // =========================================================
// //   // FETCH STUDENT APPLICATIONS
// //   // =========================================================

// //   const fetchApplications = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const data =
// //         await adminService.getAdmissionsList();

// //       if (Array.isArray(data)) {
// //         setApplications(data);
// //       } else if (Array.isArray(data.results)) {
// //         setApplications(data.results);
// //       } else {
// //         setApplications([]);

// //         setError(
// //           "Unexpected data format received from server."
// //         );
// //       }
// //     } catch (err) {
// //       console.error(
// //         "Admission Error:",
// //         err
// //       );

// //       setError(err.message);

// //       setApplications([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =========================================================
// //   // CREATE STUDENT
// //   // =========================================================

// //   const handleApproveSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!selectedApp) return;

// //     if (
// //       !academicYearId ||
// //       !classId ||
// //       !sectionId
// //     ) {
// //       window.alert(
// //         "Please select Academic Year, Class and Section."
// //       );

// //       return;
// //     }

// //     const confirmApprove = window.confirm(
// //       `Are you sure you want to approve this student?\n\nStudent: ${getStudentName(
// //         selectedApp
// //       )}`
// //     );

// //     if (!confirmApprove) {
// //       return;
// //     }

// //     try {
// //       setApproving(true);

// //       // =====================================================
// //       // CREATE STUDENT API
// //       // =====================================================

// //       const data =
// //         await adminService.createStudentFromAdmission(
// //           selectedApp.id,
// //           academicYearId,
// //           classId,
// //           sectionId
// //         );

// //       console.log(
// //         "CREATE STUDENT RESPONSE:",
// //         data
// //       );

// //       // =====================================================
// //       // STUDENT CREDENTIALS
// //       // =====================================================

// //       setStudentCredentials({
// //         studentName:
// //           data.student_name ||
// //           getStudentName(selectedApp),

// //         studentId:
// //           data.student_id || "",

// //         userId:
// //           data.user_id ||
// //           data.user?.id ||
// //           "",

// //         username:
// //           data.username ||
// //           data.user?.username ||
// //           "",

// //         password:
// //           data.temporary_password ||
// //           data.password ||
// //           "",
// //       });

// //       // Close approval modal
// //       setSelectedApp(null);

// //       // Reset selection
// //       setAcademicYearId("");
// //       setClassId("");
// //       setSectionId("");

// //       setClasses([]);
// //       setSections([]);

// //       // Refresh applications
// //       await fetchApplications();

// //       // Open credentials popup
// //       setShowStudentCredentials(true);
// //     } catch (err) {
// //       console.error(
// //         "Create Student Error:",
// //         err
// //       );

// //       window.alert(
// //         `Error: ${err.message}`
// //       );
// //     } finally {
// //       setApproving(false);
// //     }
// //   };

// //   // =========================================================
// //   // TEACHER DATA
// //   // =========================================================

// //   const fetchTeacherData = async () => {
// //     try {
// //       setTeacherLoading(true);
// //       setTeacherError("");

// //       const [
// //         pendingData,
// //         approvedData,
// //       ] = await Promise.all([
// //         teacherService.getPendingTeachers(),
// //         teacherService.getTeachers(),
// //       ]);

// //       console.log(
// //         "Pending Teachers:",
// //         pendingData
// //       );

// //       console.log(
// //         "Approved Teachers:",
// //         approvedData
// //       );

// //       // -----------------------------------------------------
// //       // PENDING TEACHERS
// //       // -----------------------------------------------------

// //       let pendingList = [];

// //       if (Array.isArray(pendingData)) {
// //         pendingList = pendingData;
// //       } else if (
// //         Array.isArray(pendingData.results)
// //       ) {
// //         pendingList = pendingData.results;
// //       } else if (
// //         Array.isArray(pendingData.teachers)
// //       ) {
// //         pendingList = pendingData.teachers;
// //       } else if (
// //         Array.isArray(pendingData.applications)
// //       ) {
// //         pendingList =
// //           pendingData.applications;
// //       }

// //       // -----------------------------------------------------
// //       // APPROVED TEACHERS
// //       // -----------------------------------------------------

// //       let approvedList = [];

// //       if (Array.isArray(approvedData)) {
// //         approvedList = approvedData;
// //       } else if (
// //         Array.isArray(approvedData.results)
// //       ) {
// //         approvedList = approvedData.results;
// //       } else if (
// //         Array.isArray(approvedData.teachers)
// //       ) {
// //         approvedList = approvedData.teachers;
// //       }

// //       setTeacherApplications(
// //         pendingList
// //       );

// //       setTeachers(
// //         approvedList
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Teacher Error:",
// //         err
// //       );

// //       setTeacherError(
// //         err.message ||
// //           "Failed to load teacher applications."
// //       );

// //       setTeacherApplications([]);
// //       setTeachers([]);
// //     } finally {
// //       setTeacherLoading(false);
// //     }
// //   };

// //   // =========================================================
// //   // APPROVE TEACHER
// //   // =========================================================

// //   const handleApproveTeacher = async (
// //     teacher
// //   ) => {
// //     const confirmApprove =
// //       window.confirm(
// //         `Are you sure you want to approve ${getTeacherName(
// //           teacher
// //         )}?`
// //       );

// //     if (!confirmApprove) return;

// //     try {
// //       setTeacherApproving(true);
// //       setTeacherError("");

// //       const data =
// //         await teacherService.approveTeacher(
// //           teacher.id
// //         );

// //       console.log(
// //         "Teacher Approve Response:",
// //         data
// //       );

// //       if (
// //         data.success === false ||
// //         data.error ||
// //         data.detail
// //       ) {
// //         throw new Error(
// //           data.error ||
// //             data.detail ||
// //             "Failed to approve teacher."
// //         );
// //       }

// //       setTeacherCredentials({
// //         teacherName:
// //           getTeacherName(teacher),

// //         employeeId:
// //           data.employee_id ||
// //           data.employeeId ||
// //           data.teacher_employee_id ||
// //           "",

// //         username:
// //           data.username ||
// //           data.user?.username ||
// //           "",

// //         password:
// //           data.temporary_password ||
// //           data.password ||
// //           data.temp_password ||
// //           "",
// //       });

// //       await fetchTeacherData();
// //     } catch (err) {
// //       console.error(
// //         "Approve Teacher Error:",
// //         err
// //       );

// //       setTeacherError(
// //         err.message
// //       );

// //       alert(
// //         `Error: ${err.message}`
// //       );
// //     } finally {
// //       setTeacherApproving(false);
// //     }
// //   };

// //   // =========================================================
// //   // VIEW TEACHER
// //   // =========================================================

// //   const handleViewTeacher = async (
// //     teacher
// //   ) => {
// //     const employeeId =
// //       teacher.employee_id ||
// //       teacher.employeeId;

// //     if (!employeeId) {
// //       alert(
// //         "Employee ID not found."
// //       );

// //       return;
// //     }

// //     try {
// //       setTeacherDetailsLoading(
// //         true
// //       );

// //       setTeacherEditMode(false);

// //       const data =
// //         await teacherService.getTeacherDetails(
// //           employeeId
// //         );

// //       console.log(
// //         "Teacher Details:",
// //         data
// //       );

// //       if (!data.success) {
// //         throw new Error(
// //           data.error ||
// //             "Failed to load teacher details."
// //         );
// //       }

// //       setSelectedTeacher(
// //         data.teacher
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Teacher Details Error:",
// //         err
// //       );

// //       alert(
// //         `Error: ${err.message}`
// //       );
// //     } finally {
// //       setTeacherDetailsLoading(
// //         false
// //       );
// //     }
// //   };

// //   // =========================================================
// //   // EDIT TEACHER
// //   // =========================================================

// //   const handleEditTeacher = (
// //     teacher
// //   ) => {
// //     setTeacherEditForm({
// //       name:
// //         teacher.name || "",

// //       email:
// //         teacher.email ||
// //         teacher.user?.email ||
// //         "",

// //       phone:
// //         teacher.phone || "",

// //       department:
// //         teacher.department || "",

// //       primary_subject:
// //         teacher.primary_subject ||
// //         teacher.subject ||
// //         "",

// //       qualification:
// //         teacher.qualification || "",
// //     });

// //     setTeacherEditMode(true);
// //   };

// //   // =========================================================
// //   // TEACHER FORM CHANGE
// //   // =========================================================

// //   const handleTeacherEditChange = (
// //     e
// //   ) => {
// //     const {
// //       name,
// //       value,
// //     } = e.target;

// //     setTeacherEditForm(
// //       (prev) => ({
// //         ...prev,
// //         [name]: value,
// //       })
// //     );
// //   };

// //   // =========================================================
// //   // UPDATE TEACHER
// //   // =========================================================

// //   const handleUpdateTeacher =
// //     async (e) => {
// //       e.preventDefault();

// //       if (
// //         !selectedTeacher?.employee_id
// //       ) {
// //         alert(
// //           "Employee ID not found."
// //         );

// //         return;
// //       }

// //       try {
// //         setTeacherUpdating(
// //           true
// //         );

// //         const data =
// //           await teacherService.updateTeacher(
// //             selectedTeacher.employee_id,
// //             teacherEditForm
// //           );

// //         console.log(
// //           "Teacher Update:",
// //           data
// //         );

// //         if (!data.success) {
// //           throw new Error(
// //             data.error ||
// //               "Failed to update teacher."
// //           );
// //         }

// //         alert(
// //           "Teacher updated successfully."
// //         );

// //         setSelectedTeacher(
// //           data.teacher
// //         );

// //         setTeacherEditMode(
// //           false
// //         );

// //         await fetchTeacherData();
// //       } catch (err) {
// //         console.error(
// //           "Update Teacher Error:",
// //           err
// //         );

// //         alert(
// //           `Error: ${err.message}`
// //         );
// //       } finally {
// //         setTeacherUpdating(
// //           false
// //         );
// //       }
// //     };

// //   // =========================================================
// //   // HELPERS
// //   // =========================================================

// //   const getStudentName = (
// //     application
// //   ) => {
// //     return [
// //       application.student_first_name,
// //       application.student_middle_name,
// //       application.student_last_name,
// //     ]
// //       .filter(Boolean)
// //       .join(" ");
// //   };

// //   const getTeacherName = (
// //     teacher
// //   ) => {
// //     return (
// //       teacher.name ||
// //       teacher.full_name ||
// //       teacher.user?.first_name ||
// //       "Teacher"
// //     );
// //   };

// //   const getTeacherEmail = (
// //     teacher
// //   ) => {
// //     return (
// //       teacher.email ||
// //       teacher.user?.email ||
// //       "-"
// //     );
// //   };

// //   // =========================================================
// //   // COUNTS
// //   // =========================================================

// //   const totalStudentApplications =
// //     applications.length;

// //   const pendingStudents =
// //     applications.filter(
// //       (item) =>
// //         item.status === "PENDING"
// //     ).length;

// //   const reviewingStudents =
// //     applications.filter(
// //       (item) =>
// //         item.status === "REVIEWING"
// //     ).length;

// //   const approvedStudents =
// //     applications.filter(
// //       (item) =>
// //         item.status === "APPROVED"
// //     ).length;

// //   const totalTeacherApplications =
// //     teacherApplications.length +
// //     teachers.length;

// //   const pendingTeachers =
// //     teacherApplications.length;

// //   const approvedTeachers =
// //     teachers.length;

// //   // =========================================================
// //   // UI
// //   // =========================================================

// //   return (
// //     <div className="admin-page">

// //       {/* HEADER */}
// //       <div className="admin-page-header">
// //         <div>
// //           <p className="page-label">
// //             SCHOOL ADMINISTRATION
// //           </p>

// //           <h1>
// //             Admission & Teacher Management
// //           </h1>

// //           <p>
// //             Review and manage student
// //             admissions and teacher
// //             applications.
// //           </p>
// //         </div>

// //         <button
// //           className="refresh-button"
// //           onClick={() => {
// //             fetchApplications();
// //             fetchTeacherData();
// //           }}
// //         >
// //           ↻ Refresh
// //         </button>
// //       </div>

// //       {/* ERRORS */}
// //       {error && (
// //         <div className="admin-error">
// //           Student: {error}
// //         </div>
// //       )}

// //       {teacherError && (
// //         <div className="admin-error">
// //           Teacher: {teacherError}
// //         </div>
// //       )}

// //       {/* =====================================================
// //           STUDENT SUMMARY
// //       ===================================================== */}

// //       <h2 className="section-title">
// //         Student Admissions
// //       </h2>

// //       <div className="admission-summary">

// //         <div className="summary-card">
// //           <span>
// //             Total Applications Student
// //           </span>

// //           <strong>
// //             {totalStudentApplications}
// //           </strong>
// //         </div>

// //         <div className="summary-card">
// //           <span>
// //             Pending Student
// //           </span>

// //           <strong>
// //             {pendingStudents}
// //           </strong>
// //         </div>

// //         <div className="summary-card">
// //           <span>
// //             Reviewing
// //           </span>

// //           <strong>
// //             {reviewingStudents}
// //           </strong>
// //         </div>

// //         <div className="summary-card">
// //           <span>
// //             Approved Student
// //           </span>

// //           <strong>
// //             {approvedStudents}
// //           </strong>
// //         </div>

// //       </div>

// //       {/* =====================================================
// //           TEACHER SUMMARY
// //       ===================================================== */}

// //       <h2 className="section-title">
// //         Teacher Applications
// //       </h2>

// //       <div className="admission-summary">

// //         <div className="summary-card">
// //           <span>
// //             Total Applications Teacher
// //           </span>

// //           <strong>
// //             {totalTeacherApplications}
// //           </strong>
// //         </div>

// //         <div className="summary-card">
// //           <span>
// //             Pending Teacher
// //           </span>

// //           <strong>
// //             {pendingTeachers}
// //           </strong>
// //         </div>

// //         <div className="summary-card">
// //           <span>
// //             Approved Teacher
// //           </span>

// //           <strong>
// //             {approvedTeachers}
// //           </strong>
// //         </div>

// //       </div>

// //       {/* =====================================================
// //           STUDENT TABLE
// //       ===================================================== */}

// //       <div className="admission-table-card">

// //         <div className="table-section-header">

// //           <div>
// //             <h2>
// //               Student Admission Applications
// //             </h2>

// //             <p>
// //               Manage student admission requests.
// //             </p>
// //           </div>

// //           <button
// //             className="refresh-button"
// //             onClick={fetchApplications}
// //           >
// //             ↻ Refresh
// //           </button>

// //         </div>

// //         {loading ? (

// //           <div className="table-loading">
// //             Loading applications...
// //           </div>

// //         ) : applications.length === 0 ? (

// //           <div className="empty-state">
// //             <div>🎓</div>

// //             <h3>
// //               No applications found
// //             </h3>

// //             <p>
// //               New admission applications
// //               will appear here.
// //             </p>
// //           </div>

// //         ) : (

// //           <div className="table-wrapper">

// //             <table className="admission-table">

// //               <thead>
// //                 <tr>
// //                   <th>Application No.</th>
// //                   <th>Student</th>
// //                   <th>Class</th>
// //                   <th>Parent</th>
// //                   <th>Phone</th>
// //                   <th>Status</th>
// //                   <th>Applied On</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>

// //               <tbody>

// //                 {applications.map(
// //                   (application) => (

// //                     <tr
// //                       key={application.id}
// //                     >

// //                       <td>
// //                         <strong>
// //                           {application.application_number ||
// //                             "-"}
// //                         </strong>
// //                       </td>

// //                       <td>
// //                         <div className="student-name">
// //                           {getStudentName(
// //                             application
// //                           ) || "-"}
// //                         </div>
// //                       </td>

// //                       <td>
// //                         {application.applying_for_class ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {application.father_name ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {application.parent_phone ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         <span
// //                           className={`status-badge ${
// //                             application.status
// //                               ? application.status.toLowerCase()
// //                               : ""
// //                           }`}
// //                         >
// //                           {application.status ||
// //                             "-"}
// //                         </span>
// //                       </td>

// //                       <td>
// //                         {application.created_at
// //                           ? new Date(
// //                               application.created_at
// //                             ).toLocaleDateString(
// //                               "en-IN"
// //                             )
// //                           : "-"}
// //                       </td>

// //                       <td
// //                         style={{
// //                           display: "flex",
// //                           gap: "6px",
// //                         }}
// //                       >

// //                         <button
// //                           className="view-button"
// //                           onClick={() =>
// //                             alert(
// //                               `Application: ${application.application_number}`
// //                             )
// //                           }
// //                         >
// //                           View
// //                         </button>

// //                         {application.status ===
// //                           "PENDING" && (

// //                           <button
// //                             className="approve-action-button"
// //                             onClick={() =>
// //                               setSelectedApp(
// //                                 application
// //                               )
// //                             }
// //                           >
// //                             Approve
// //                           </button>

// //                         )}

// //                       </td>

// //                     </tr>

// //                   )
// //                 )}

// //               </tbody>

// //             </table>

// //           </div>
// //         )}

// //       </div>

// //       {/* =====================================================
// //           PENDING TEACHERS
// //       ===================================================== */}

// //       <div className="admission-table-card">

// //         <div className="table-section-header">

// //           <div>
// //             <h2>
// //               Pending Teacher Applications
// //             </h2>

// //             <p>
// //               Review and approve teacher
// //               registration requests.
// //             </p>
// //           </div>

// //           <button
// //             className="refresh-button"
// //             onClick={fetchTeacherData}
// //           >
// //             ↻ Refresh
// //           </button>

// //         </div>

// //         {teacherLoading ? (

// //           <div className="table-loading">
// //             Loading teacher applications...
// //           </div>

// //         ) : teacherApplications.length === 0 ? (

// //           <div className="empty-state">

// //             <div>👨‍🏫</div>

// //             <h3>
// //               No pending teacher applications
// //             </h3>

// //             <p>
// //               New teacher registrations
// //               will appear here.
// //             </p>

// //           </div>

// //         ) : (

// //           <div className="table-wrapper">

// //             <table className="admission-table">

// //               <thead>

// //                 <tr>
// //                   <th>Name</th>
// //                   <th>Email</th>
// //                   <th>Phone</th>
// //                   <th>Department</th>
// //                   <th>Subject</th>
// //                   <th>Qualification</th>
// //                   <th>Action</th>
// //                 </tr>

// //               </thead>

// //               <tbody>

// //                 {teacherApplications.map(
// //                   (teacher) => (

// //                     <tr
// //                       key={teacher.id}
// //                     >

// //                       <td>
// //                         <strong>
// //                           {getTeacherName(
// //                             teacher
// //                           )}
// //                         </strong>
// //                       </td>

// //                       <td>
// //                         {getTeacherEmail(
// //                           teacher
// //                         )}
// //                       </td>

// //                       <td>
// //                         {teacher.phone ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {teacher.department ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {teacher.primary_subject ||
// //                           teacher.subject ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {teacher.qualification ||
// //                           "-"}
// //                       </td>

// //                       <td>

// //                         <button
// //                           className="approve-action-button"
// //                           disabled={
// //                             teacherApproving
// //                           }
// //                           onClick={() =>
// //                             handleApproveTeacher(
// //                               teacher
// //                             )
// //                           }
// //                         >
// //                           {teacherApproving
// //                             ? "Approving..."
// //                             : "Approve"}
// //                         </button>

// //                       </td>

// //                     </tr>

// //                   )
// //                 )}

// //               </tbody>

// //             </table>

// //           </div>

// //         )}

// //       </div>

// //       {/* =====================================================
// //           APPROVED TEACHERS
// //       ===================================================== */}

// //       <div className="admission-table-card">

// //         <div className="table-section-header">

// //           <div>

// //             <h2>
// //               Approved Teachers
// //             </h2>

// //             <p>
// //               View and edit approved teachers
// //               using Employee ID.
// //             </p>

// //           </div>

// //           <button
// //             className="refresh-button"
// //             onClick={fetchTeacherData}
// //           >
// //             ↻ Refresh
// //           </button>

// //         </div>

// //         {teacherLoading ? (

// //           <div className="table-loading">
// //             Loading teachers...
// //           </div>

// //         ) : teachers.length === 0 ? (

// //           <div className="empty-state">

// //             <div>👩‍🏫</div>

// //             <h3>
// //               No approved teachers
// //             </h3>

// //             <p>
// //               Approved teachers will
// //               appear here.
// //             </p>

// //           </div>

// //         ) : (

// //           <div className="table-wrapper">

// //             <table className="admission-table">

// //               <thead>

// //                 <tr>
// //                   <th>Employee ID</th>
// //                   <th>Name</th>
// //                   <th>Email</th>
// //                   <th>Phone</th>
// //                   <th>Department</th>
// //                   <th>Subject</th>
// //                   <th>Status</th>
// //                   <th>Action</th>
// //                 </tr>

// //               </thead>

// //               <tbody>

// //                 {teachers.map(
// //                   (teacher) => (

// //                     <tr
// //                       key={teacher.id}
// //                     >

// //                       <td>
// //                         <strong>
// //                           {teacher.employee_id ||
// //                             teacher.employeeId ||
// //                             "-"}
// //                         </strong>
// //                       </td>

// //                       <td>
// //                         {getTeacherName(
// //                           teacher
// //                         )}
// //                       </td>

// //                       <td>
// //                         {getTeacherEmail(
// //                           teacher
// //                         )}
// //                       </td>

// //                       <td>
// //                         {teacher.phone ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {teacher.department ||
// //                           "-"}
// //                       </td>

// //                       <td>
// //                         {teacher.primary_subject ||
// //                           teacher.subject ||
// //                           "-"}
// //                       </td>

// //                       <td>

// //                         <span className="status-badge approved">
// //                           APPROVED
// //                         </span>

// //                       </td>

// //                       <td>

// //                         <div
// //                           style={{
// //                             display: "flex",
// //                             gap: "6px",
// //                             flexWrap: "wrap",
// //                           }}
// //                         >

// //                           <button
// //                             className="view-button"
// //                             onClick={() =>
// //                               handleViewTeacher(
// //                                 teacher
// //                               )
// //                             }
// //                           >
// //                             View
// //                           </button>

// //                           <button
// //                             className="edit-button"
// //                             onClick={() => {

// //                               const teacherData =
// //                                 {
// //                                   ...teacher,

// //                                   employee_id:
// //                                     teacher.employee_id ||
// //                                     teacher.employeeId,

// //                                   email:
// //                                     teacher.email ||
// //                                     teacher.user?.email ||
// //                                     "",

// //                                   phone:
// //                                     teacher.phone ||
// //                                     "",

// //                                   qualification:
// //                                     teacher.qualification ||
// //                                     "",

// //                                   primary_subject:
// //                                     teacher.primary_subject ||
// //                                     teacher.subject ||
// //                                     "",
// //                                 };

// //                               setSelectedTeacher(
// //                                 teacherData
// //                               );

// //                               handleEditTeacher(
// //                                 teacherData
// //                               );
// //                             }}
// //                           >
// //                             Edit
// //                           </button>

// //                         </div>

// //                       </td>

// //                     </tr>

// //                   )
// //                 )}

// //               </tbody>

// //             </table>

// //           </div>

// //         )}

// //       </div>

// //       {/* =====================================================
// //           STUDENT APPROVAL MODAL
// //       ===================================================== */}

// //       {selectedApp && (

// //         <div className="modal-overlay">

// //           <div className="modal-content">

// //             <h2>
// //               Approve Admission
// //             </h2>

// //             <p>
// //               Student:{" "}
// //               <strong>
// //                 {getStudentName(
// //                   selectedApp
// //                 )}
// //               </strong>
// //             </p>

// //             <form
// //               onSubmit={
// //                 handleApproveSubmit
// //               }
// //             >

// //               {/* ACADEMIC YEAR */}

// //               <div className="form-group">

// //                 <label>
// //                   Academic Year:
// //                 </label>

// //                 <select
// //                   value={academicYearId}
// //                   onChange={(e) =>
// //                     setAcademicYearId(
// //                       e.target.value
// //                     )
// //                   }
// //                   required
// //                 >

// //                   <option value="">
// //                     Select Academic Year
// //                   </option>

// //                   {academicYears.map(
// //                     (year) => (

// //                       <option
// //                         key={year.id}
// //                         value={year.id}
// //                       >
// //                         {year.name}
// //                       </option>

// //                     )
// //                   )}

// //                 </select>

// //               </div>

// //               {/* CLASS */}

// //               <div className="form-group">

// //                 <label>
// //                   Class:
// //                 </label>

// //                 <select
// //                   value={classId}
// //                   onChange={(e) =>
// //                     setClassId(
// //                       e.target.value
// //                     )
// //                   }
// //                   disabled={!academicYearId}
// //                   required
// //                 >

// //                   <option value="">
// //                     Select Class
// //                   </option>

// //                   {classes.map(
// //                     (item) => (

// //                       <option
// //                         key={item.id}
// //                         value={item.id}
// //                       >
// //                         {item.name}
// //                       </option>

// //                     )
// //                   )}

// //                 </select>

// //               </div>

// //               {/* SECTION */}

// //               <div className="form-group">

// //                 <label>
// //                   Section:
// //                 </label>

// //                 <select
// //                   value={sectionId}
// //                   onChange={(e) =>
// //                     setSectionId(
// //                       e.target.value
// //                     )
// //                   }
// //                   disabled={!classId}
// //                   required
// //                 >

// //                   <option value="">
// //                     Select Section
// //                   </option>

// //                   {sections.map(
// //                     (section) => (

// //                       <option
// //                         key={section.id}
// //                         value={section.id}
// //                       >
// //                         {section.name}
// //                       </option>

// //                     )
// //                   )}

// //                 </select>

// //               </div>

// //               {/* ACTIONS */}

// //               <div className="modal-actions">

// //                 <button
// //                   type="button"
// //                   className="cancel-btn"
// //                   onClick={() =>
// //                     setSelectedApp(
// //                       null
// //                     )
// //                   }
// //                   disabled={approving}
// //                 >
// //                   Cancel
// //                 </button>

// //                 <button
// //                   type="submit"
// //                   className="submit-btn"
// //                   disabled={
// //                     approving ||
// //                     !academicYearId ||
// //                     !classId ||
// //                     !sectionId
// //                   }
// //                 >
// //                   {approving
// //                     ? "Creating..."
// //                     : "Confirm & Generate Credentials"}
// //                 </button>

// //               </div>

// //             </form>

// //           </div>

// //         </div>

// //       )}

// //       {/* =====================================================
// //           STUDENT CREDENTIALS MODAL
// //       ===================================================== */}

// //       {showStudentCredentials &&
// //         studentCredentials && (

// //           <div className="modal-overlay">

// //             <div className="student-success-modal">

// //               <div className="student-success-header">

// //                 <h2>
// //                   🎉 Student Approved!
// //                 </h2>

// //                 <p>
// //                   Student account has been
// //                   created successfully.
// //                 </p>

// //               </div>

// //               <div className="student-credentials-box">

// //                 <div className="credential-line">

// //                   <strong className="label-dark">
// //                     Student Name:
// //                   </strong>

// //                   <span>
// //                     {studentCredentials.studentName ||
// //                       "-"}
// //                   </span>

// //                 </div>

// //                 <div className="credential-line">

// //                   <strong className="label-purple">
// //                     Student ID:
// //                   </strong>

// //                   <span>
// //                     {studentCredentials.studentId ||
// //                       "-"}
// //                   </span>

// //                 </div>

// //                 <div className="credential-line">

// //                   <strong className="label-blue">
// //                     User ID:
// //                   </strong>

// //                   <span>
// //                     {studentCredentials.userId ||
// //                       "-"}
// //                   </span>

// //                 </div>

// //                 <div className="credential-line">

// //                   <strong className="label-blue">
// //                     Username:
// //                   </strong>

// //                   <span>
// //                     {studentCredentials.username ||
// //                       "-"}
// //                   </span>

// //                 </div>

// //                 <div className="credential-line">

// //                   <strong className="label-red">
// //                     Temporary Password:
// //                   </strong>

// //                   <span>
// //                     {studentCredentials.password ||
// //                       "-"}
// //                   </span>

// //                 </div>

// //               </div>

// //               <button
// //                 className="student-success-close"
// //                 onClick={() => {
// //                   setShowStudentCredentials(
// //                     false
// //                   );

// //                   setStudentCredentials(
// //                     null
// //                   );
// //                 }}
// //               >
// //                 Close
// //               </button>

// //             </div>

// //           </div>

// //         )}

// //       {/* =====================================================
// //           TEACHER VIEW / EDIT POPUP
// //       ===================================================== */}

// //       {selectedTeacher && (

// //         <div className="modal-overlay">

// //           <div className="modal-content teacher-modal">

// //             <div className="teacher-modal-header">

// //               <div>

// //                 <h2>
// //                   {teacherEditMode
// //                     ? "Edit Teacher"
// //                     : "Teacher Details"}
// //                 </h2>

// //                 <p>
// //                   Employee ID:{" "}
// //                   <strong>
// //                     {selectedTeacher.employee_id}
// //                   </strong>
// //                 </p>

// //               </div>

// //               <button
// //                 className="close-modal-button"
// //                 onClick={() => {
// //                   setSelectedTeacher(
// //                     null
// //                   );

// //                   setTeacherEditMode(
// //                     false
// //                   );
// //                 }}
// //               >
// //                 ×
// //               </button>

// //             </div>

// //             {teacherDetailsLoading ? (

// //               <div className="table-loading">
// //                 Loading teacher details...
// //               </div>

// //             ) : teacherEditMode ? (

// //               <form
// //                 onSubmit={
// //                   handleUpdateTeacher
// //                 }
// //               >

// //                 <div className="form-group">

// //                   <label>
// //                     Employee ID
// //                   </label>

// //                   <input
// //                     type="text"
// //                     value={
// //                       selectedTeacher.employee_id
// //                     }
// //                     disabled
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Name
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={
// //                       teacherEditForm.name
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                     required
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Email
// //                   </label>

// //                   <input
// //                     type="email"
// //                     name="email"
// //                     value={
// //                       teacherEditForm.email
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Phone
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="phone"
// //                     value={
// //                       teacherEditForm.phone
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Department
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="department"
// //                     value={
// //                       teacherEditForm.department
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Primary Subject
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="primary_subject"
// //                     value={
// //                       teacherEditForm.primary_subject
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                   />

// //                 </div>

// //                 <div className="form-group">

// //                   <label>
// //                     Qualification
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="qualification"
// //                     value={
// //                       teacherEditForm.qualification
// //                     }
// //                     onChange={
// //                       handleTeacherEditChange
// //                     }
// //                   />

// //                 </div>

// //                 <div className="modal-actions">

// //                   <button
// //                     type="button"
// //                     className="cancel-btn"
// //                     onClick={() =>
// //                       setTeacherEditMode(
// //                         false
// //                       )
// //                     }
// //                     disabled={
// //                       teacherUpdating
// //                     }
// //                   >
// //                     Cancel
// //                   </button>

// //                   <button
// //                     type="submit"
// //                     className="submit-btn"
// //                     disabled={
// //                       teacherUpdating
// //                     }
// //                   >
// //                     {teacherUpdating
// //                       ? "Updating..."
// //                       : "Update Teacher"}
// //                   </button>

// //                 </div>

// //               </form>

// //             ) : (

// //               <div>

// //                 <div className="teacher-detail-grid">

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Name
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.name ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Employee ID
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.employee_id ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Email
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.email ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Phone
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.phone ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Department
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.department ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Primary Subject
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.primary_subject ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Qualification
// //                     </span>

// //                     <strong>
// //                       {selectedTeacher.qualification ||
// //                         "-"}
// //                     </strong>

// //                   </div>

// //                   <div className="teacher-detail-item">

// //                     <span>
// //                       Status
// //                     </span>

// //                     <strong
// //                       style={{
// //                         color:
// //                           selectedTeacher.is_active
// //                             ? "#16a34a"
// //                             : "#dc2626",
// //                       }}
// //                     >
// //                       {selectedTeacher.is_active
// //                         ? "Active"
// //                         : "Inactive"}
// //                     </strong>

// //                   </div>

// //                 </div>

// //                 <div
// //                   className="modal-actions"
// //                   style={{
// //                     marginTop: "20px",
// //                   }}
// //                 >

// //                   <button
// //                     className="cancel-btn"
// //                     onClick={() =>
// //                       setSelectedTeacher(
// //                         null
// //                       )
// //                     }
// //                   >
// //                     Close
// //                   </button>

// //                   <button
// //                     className="submit-btn"
// //                     onClick={() =>
// //                       handleEditTeacher(
// //                         selectedTeacher
// //                       )
// //                     }
// //                   >
// //                     Edit Teacher
// //                   </button>

// //                 </div>

// //               </div>

// //             )}

// //           </div>

// //         </div>

// //       )}

// //       {/* =====================================================
// //           TEACHER CREDENTIALS MODAL
// //       ===================================================== */}

// //       {teacherCredentials && (

// //         <div className="modal-overlay">

// //           <div className="modal-content success-modal">

// //             <h2
// //               style={{
// //                 color: "#16a34a",
// //               }}
// //             >
// //               🎉 Teacher Approved!
// //             </h2>

// //             <p>
// //               Teacher account has been
// //               created successfully.
// //             </p>

// //             <div className="credentials-box">

// //               <p>
// //                 <strong>
// //                   Teacher Name:
// //                 </strong>{" "}
// //                 {
// //                   teacherCredentials.teacherName
// //                 }
// //               </p>

// //               <hr />

// //               <p
// //                 style={{
// //                   color: "#7c3aed",
// //                 }}
// //               >
// //                 <strong>
// //                   Employee ID:
// //                 </strong>{" "}
// //                 {
// //                   teacherCredentials.employeeId ||
// //                   "-"
// //                 }
// //               </p>

// //               <p
// //                 style={{
// //                   color: "#2563eb",
// //                 }}
// //               >
// //                 <strong>
// //                   Username:
// //                 </strong>{" "}
// //                 {
// //                   teacherCredentials.username ||
// //                   "-"
// //                 }
// //               </p>

// //               <p
// //                 style={{
// //                   color: "#dc2626",
// //                 }}
// //               >
// //                 <strong>
// //                   Temporary Password:
// //                 </strong>{" "}
// //                 {
// //                   teacherCredentials.password ||
// //                   "-"
// //                 }
// //               </p>

// //             </div>

// //             <button
// //               className="submit-btn"
// //               onClick={() =>
// //                 setTeacherCredentials(
// //                   null
// //                 )
// //               }
// //             >
// //               Close
// //             </button>

// //           </div>

// //         </div>

// //       )}

// //       {/* =====================================================
// //           STYLES
// //       ===================================================== */}

// //       <style>{`

// //         .modal-overlay {
// //           position: fixed;
// //           inset: 0;
// //           background: rgba(0, 0, 0, 0.5);
// //           display: flex;
// //           justify-content: center;
// //           align-items: center;
// //           z-index: 1000;
// //           padding: 20px;
// //         }

// //         .modal-content {
// //           background: #fff;
// //           padding: 24px;
// //           border-radius: 8px;
// //           width: 100%;
// //           max-width: 420px;
// //           box-shadow:
// //             0 4px 12px rgba(0,0,0,0.15);
// //         }

// //         .teacher-modal {
// //           max-width: 620px;
// //           max-height: 90vh;
// //           overflow-y: auto;
// //         }

// //         .teacher-modal-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: flex-start;
// //           margin-bottom: 20px;
// //         }

// //         .teacher-modal-header h2 {
// //           margin: 0;
// //         }

// //         .teacher-modal-header p {
// //           margin: 5px 0 0;
// //           color: #6b7280;
// //         }

// //         .close-modal-button {
// //           border: none;
// //           background: transparent;
// //           font-size: 28px;
// //           cursor: pointer;
// //           color: #6b7280;
// //           line-height: 1;
// //         }

// //         .close-modal-button:hover {
// //           color: #111827;
// //         }

// //         .form-group {
// //           margin-bottom: 14px;
// //           display: flex;
// //           flex-direction: column;
// //           gap: 4px;
// //         }

// //         .form-group label {
// //           font-weight: 500;
// //           color: #374151;
// //         }

// //         .form-group input,
// //         .form-group select {
// //           padding: 9px 10px;
// //           border: 1px solid #d1d5db;
// //           border-radius: 5px;
// //           font-size: 14px;
// //           outline: none;
// //           background: #fff;
// //         }

// //         .form-group input:focus,
// //         .form-group select:focus {
// //           border-color: #2563eb;
// //         }

// //         .form-group input:disabled,
// //         .form-group select:disabled {
// //           background: #f3f4f6;
// //           cursor: not-allowed;
// //         }

// //         .modal-actions {
// //           display: flex;
// //           justify-content: flex-end;
// //           gap: 10px;
// //           margin-top: 18px;
// //         }

// //         .cancel-btn {
// //           padding: 9px 16px;
// //           border: 1px solid #d1d5db;
// //           background: #fff;
// //           border-radius: 5px;
// //           cursor: pointer;
// //         }

// //         .cancel-btn:hover {
// //           background: #f9fafb;
// //         }

// //         .submit-btn {
// //           padding: 9px 16px;
// //           border: none;
// //           background: #2563eb;
// //           color: #fff;
// //           border-radius: 5px;
// //           cursor: pointer;
// //           font-weight: 600;
// //           width: 100%;
// //         }

// //         .submit-btn:hover {
// //           background: #1d4ed8;
// //         }

// //         .submit-btn:disabled {
// //           opacity: 0.6;
// //           cursor: not-allowed;
// //         }

// //         .credentials-box {
// //           background: #f3f4f6;
// //           padding: 14px;
// //           border-radius: 6px;
// //           margin: 16px 0;
// //         }

// //         .credentials-box p {
// //           margin: 8px 0;
// //         }

// //         .section-title {
// //           margin: 25px 0 12px;
// //         }

// //         .table-section-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           padding: 18px;
// //         }

// //         .table-section-header h2 {
// //           margin: 0;
// //         }

// //         .table-section-header p {
// //           margin: 5px 0 0;
// //           color: #6b7280;
// //         }

// //         .approve-action-button {
// //           background: #16a34a;
// //           color: #fff;
// //           border: none;
// //           padding: 6px 12px;
// //           border-radius: 4px;
// //           cursor: pointer;
// //           font-weight: 500;
// //         }

// //         .approve-action-button:hover {
// //           background: #15803d;
// //         }

// //         .approve-action-button:disabled {
// //           opacity: 0.6;
// //           cursor: not-allowed;
// //         }

// //         .status-badge.approved {
// //           background: #dcfce7;
// //           color: #166534;
// //         }

// //         .view-button {
// //           background: #2563eb;
// //           color: #fff;
// //           border: none;
// //           padding: 6px 12px;
// //           border-radius: 4px;
// //           cursor: pointer;
// //           font-weight: 500;
// //         }

// //         .view-button:hover {
// //           background: #1d4ed8;
// //         }

// //         .edit-button {
// //           background: #f59e0b;
// //           color: #fff;
// //           border: none;
// //           padding: 6px 12px;
// //           border-radius: 4px;
// //           cursor: pointer;
// //           font-weight: 500;
// //         }

// //         .edit-button:hover {
// //           background: #d97706;
// //         }

// //         .teacher-detail-grid {
// //           display: grid;
// //           grid-template-columns: 1fr 1fr;
// //           gap: 12px;
// //         }

// //         .teacher-detail-item {
// //           background: #f8fafc;
// //           border: 1px solid #e5e7eb;
// //           border-radius: 6px;
// //           padding: 13px;
// //         }

// //         .teacher-detail-item span {
// //           display: block;
// //           font-size: 12px;
// //           color: #6b7280;
// //           margin-bottom: 5px;
// //         }

// //         .teacher-detail-item strong {
// //           font-size: 14px;
// //           color: #111827;
// //           word-break: break-word;
// //         }

// //         .student-success-modal {
// //           width: 465px;
// //           max-width: 90%;
// //           background: #ffffff;
// //           border-radius: 8px;
// //           padding: 28px;
// //           box-sizing: border-box;
// //           box-shadow:
// //             0 20px 50px rgba(0, 0, 0, 0.25);
// //         }

// //         .student-success-header h2 {
// //           margin: 0;
// //           font-size: 28px;
// //           font-weight: 700;
// //           color: #4ca05a;
// //         }

// //         .student-success-header p {
// //           margin: 5px 0 20px;
// //           font-size: 19px;
// //           color: #222;
// //         }

// //         .student-credentials-box {
// //           background: #f1f2f4;
// //           border-radius: 7px;
// //           padding: 25px 18px;
// //           margin-bottom: 20px;
// //         }

// //         .credential-line {
// //           display: flex;
// //           align-items: baseline;
// //           gap: 5px;
// //           padding: 9px 0;
// //           font-size: 18px;
// //           border-bottom: 1px solid #9ca3af;
// //         }

// //         .credential-line:last-child {
// //           border-bottom: none;
// //         }

// //         .label-dark {
// //           color: #1f2937;
// //         }

// //         .label-purple {
// //           color: #7c3aed;
// //         }

// //         .label-blue {
// //           color: #2563eb;
// //         }

// //         .label-red {
// //           color: #b83b3b;
// //         }

// //         .credential-line span {
// //           color: #374151;
// //         }

// //         .student-success-close {
// //           width: 100%;
// //           border: none;
// //           background: #3864df;
// //           color: white;
// //           padding: 12px;
// //           border-radius: 5px;
// //           font-size: 17px;
// //           font-weight: 600;
// //           cursor: pointer;
// //         }

// //         .student-success-close:hover {
// //           background: #2f56c5;
// //         }

// //         @media (max-width: 600px) {

// //           .teacher-detail-grid {
// //             grid-template-columns: 1fr;
// //           }

// //           .teacher-modal {
// //             max-width: 100%;
// //           }

// //           .table-section-header {
// //             flex-direction: column;
// //             align-items: flex-start;
// //             gap: 12px;
// //           }

// //           .student-success-modal {
// //             width: 95%;
// //             padding: 20px;
// //           }

// //           .student-success-header h2 {
// //             font-size: 23px;
// //           }

// //           .student-success-header p {
// //             font-size: 16px;
// //           }

// //           .credential-line {
// //             font-size: 15px;
// //           }
// //         }

// //       `}</style>

// //     </div>
// //   );
// // }

// // export default AdminDashboard;







import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService";

const API_URL = "http://127.0.0.1:8000/api";

function AdminDashboard() {
  // =========================================================
  // STUDENT STATES
  // =========================================================
 const [studentCredentials, setStudentCredentials] = useState(null);
  const [showStudentCredentials, setShowStudentCredentials] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedApp, setSelectedApp] = useState(null);
  const [academicYearId, setAcademicYearId] = useState("1");
  const [classId, setClassId] = useState("1");
  const [sectionId, setSectionId] = useState("1");

  const [approving, setApproving] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // =========================================================
  // TEACHER STATES
  // =========================================================

  const [teacherApplications, setTeacherApplications] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [teacherLoading, setTeacherLoading] = useState(true);
  const [teacherError, setTeacherError] = useState("");

  const [teacherApproving, setTeacherApproving] = useState(false);
  const [teacherCredentials, setTeacherCredentials] = useState(null);

  // =========================================================
  // TEACHER VIEW / EDIT STATES
  // =========================================================

  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [teacherDetailsLoading, setTeacherDetailsLoading] =
    useState(false);

  const [teacherUpdating, setTeacherUpdating] =
    useState(false);

  const [teacherEditMode, setTeacherEditMode] =
    useState(false);

  const [teacherEditForm, setTeacherEditForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      department: "",
      primary_subject: "",
      qualification: "",
    });

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchApplications();
    fetchTeacherData();
  }, []);

 
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "You are not logged in. Access token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/admissions/list/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to load applications"
        );
      }

      if (Array.isArray(data)) {
        setApplications(data);
      } else if (Array.isArray(data.results)) {
        setApplications(data.results);
      } else {
        setApplications([]);
        setError(
          "Unexpected data format received from server."
        );
      }
    } catch (err) {
      console.error("Admission Error:", err);
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };


 const handleApproveSubmit = async (e) => {
  e.preventDefault();

  if (!selectedApp) return;

  const confirmApprove = window.confirm(
    `Are you sure you want to approve this student?\n\nStudent: ${getStudentName(
      selectedApp
    )}`
  );

  if (!confirmApprove) {
    return;
  }

  try {
    setApproving(true);

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      throw new Error(
        "Access token not found. Please login again."
      );
    }

    const response = await fetch(
      `${API_URL}/admissions/${selectedApp.id}/create-student/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          academic_year_id:
            parseInt(academicYearId),

          class_id:
            parseInt(classId),

          section_id:
            parseInt(sectionId),
        }),
      }
    );

    const data = await response.json();

    console.log(
      "CREATE STUDENT RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          data.error ||
          "Failed to create student."
      );
    }

    // ==========================================
    // STUDENT CREDENTIALS
    // ==========================================

    setStudentCredentials({
      studentName:
        data.student_name ||
        getStudentName(selectedApp),

      studentId:
        data.student_id || "",

      userId:
        data.user_id ||
        data.user?.id ||
        "",

      username:
        data.username ||
        data.user?.username ||
        "",

      password:
        data.temporary_password ||
        data.password ||
        "",
    });

    // Close approval form
    setSelectedApp(null);

    // Reset fields
    setAcademicYearId("");
    setClassId("");
    setSectionId("");

    // Refresh admissions
    await fetchApplications();

    // ==========================================
    // OPEN STUDENT SUCCESS POPUP
    // ==========================================

    setShowStudentCredentials(true);

  } catch (err) {

    console.error(
      "Create Student Error:",
      err
    );

    window.alert(
      `Error: ${err.message}`
    );

  } finally {

    setApproving(false);
  }
};




  // =========================================================
  // TEACHER DATA
  // ADMIN API
  // =========================================================

  const fetchTeacherData = async () => {
    try {
      setTeacherLoading(true);
      setTeacherError("");

      const [
        pendingData,
        approvedData,
      ] = await Promise.all([
        teacherService.getPendingTeachers(),
        teacherService.getTeachers(),
      ]);

      console.log(
        "Pending Teachers:",
        pendingData
      );

      console.log(
        "Approved Teachers:",
        approvedData
      );

      // -----------------------------------------------------
      // PENDING TEACHERS
      // -----------------------------------------------------

      let pendingList = [];

      if (Array.isArray(pendingData)) {
        pendingList = pendingData;
      } else if (
        Array.isArray(pendingData.results)
      ) {
        pendingList =
          pendingData.results;
      } else if (
        Array.isArray(pendingData.teachers)
      ) {
        pendingList =
          pendingData.teachers;
      } else if (
        Array.isArray(
          pendingData.applications
        )
      ) {
        pendingList =
          pendingData.applications;
      }

      // -----------------------------------------------------
      // APPROVED TEACHERS
      // -----------------------------------------------------

      let approvedList = [];

      if (Array.isArray(approvedData)) {
        approvedList =
          approvedData;
      } else if (
        Array.isArray(approvedData.results)
      ) {
        approvedList =
          approvedData.results;
      } else if (
        Array.isArray(approvedData.teachers)
      ) {
        approvedList =
          approvedData.teachers;
      }

      setTeacherApplications(
        pendingList
      );

      setTeachers(
        approvedList
      );
    } catch (err) {
      console.error(
        "Teacher Error:",
        err
      );

      setTeacherError(
        err.message ||
          "Failed to load teacher applications."
      );

      setTeacherApplications([]);
      setTeachers([]);
    } finally {
      setTeacherLoading(false);
    }
  };

  // =========================================================
  // APPROVE TEACHER
  // =========================================================

  const handleApproveTeacher = async (
    teacher
  ) => {
    const confirmApprove =
      window.confirm(
        `Are you sure you want to approve ${getTeacherName(
          teacher
        )}?`
      );

    if (!confirmApprove) return;

    try {
      setTeacherApproving(true);
      setTeacherError("");

      const data =
        await teacherService.approveTeacher(
          teacher.id
        );

      console.log(
        "Teacher Approve Response:",
        data
      );

      if (
        data.success === false ||
        data.error ||
        data.detail
      ) {
        throw new Error(
          data.error ||
            data.detail ||
            "Failed to approve teacher."
        );
      }

      setTeacherCredentials({
        teacherName:
          getTeacherName(teacher),

        employeeId:
          data.employee_id ||
          data.employeeId ||
          data.teacher_employee_id ||
          "",

        username:
          data.username ||
          data.user?.username ||
          "",

        password:
          data.temporary_password ||
          data.password ||
          data.temp_password ||
          "",
      });

      await fetchTeacherData();
    } catch (err) {
      console.error(
        "Approve Teacher Error:",
        err
      );

      setTeacherError(
        err.message
      );

      alert(
        `Error: ${err.message}`
      );
    } finally {
      setTeacherApproving(false);
    }
  };

  // =========================================================
  // VIEW TEACHER
  // USING EMPLOYEE ID
  // =========================================================

  const handleViewTeacher = async (
    teacher
  ) => {
    const employeeId =
      teacher.employee_id ||
      teacher.employeeId;

    if (!employeeId) {
      alert(
        "Employee ID not found."
      );
      return;
    }

    try {
      setTeacherDetailsLoading(
        true
      );

      setTeacherEditMode(false);

      const data =
        await teacherService.getTeacherDetails(
          employeeId
        );

      console.log(
        "Teacher Details:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.error ||
            "Failed to load teacher details."
        );
      }

      setSelectedTeacher(
        data.teacher
      );
    } catch (err) {
      console.error(
        "Teacher Details Error:",
        err
      );

      alert(
        `Error: ${err.message}`
      );
    } finally {
      setTeacherDetailsLoading(
        false
      );
    }
  };

  // =========================================================
  // EDIT TEACHER
  // =========================================================

  const handleEditTeacher = (
    teacher
  ) => {
    setTeacherEditForm({
      name:
        teacher.name || "",

      email:
        teacher.email ||
        teacher.user?.email ||
        "",

      phone:
        teacher.phone || "",

      department:
        teacher.department || "",

      primary_subject:
        teacher.primary_subject ||
        teacher.subject ||
        "",

      qualification:
        teacher.qualification || "",
    });

    setTeacherEditMode(true);
  };

  // =========================================================
  // TEACHER FORM CHANGE
  // =========================================================

  const handleTeacherEditChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setTeacherEditForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =========================================================
  // UPDATE TEACHER
  // USING EMPLOYEE ID
  // =========================================================

  const handleUpdateTeacher =
    async (e) => {
      e.preventDefault();

      if (
        !selectedTeacher?.employee_id
      ) {
        alert(
          "Employee ID not found."
        );
        return;
      }

      try {
        setTeacherUpdating(
          true
        );

        const data =
          await teacherService.updateTeacher(
            selectedTeacher.employee_id,
            teacherEditForm
          );

        console.log(
          "Teacher Update:",
          data
        );

        if (!data.success) {
          throw new Error(
            data.error ||
              "Failed to update teacher."
          );
        }

        alert(
          "Teacher updated successfully."
        );

        setSelectedTeacher(
          data.teacher
        );

        setTeacherEditMode(
          false
        );

        await fetchTeacherData();
      } catch (err) {
        console.error(
          "Update Teacher Error:",
          err
        );

        alert(
          `Error: ${err.message}`
        );
      } finally {
        setTeacherUpdating(
          false
        );
      }
    };

  // =========================================================
  // HELPERS
  // =========================================================

  const getStudentName = (
    application
  ) => {
    return [
      application.student_first_name,
      application.student_middle_name,
      application.student_last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getTeacherName = (
    teacher
  ) => {
    return (
      teacher.name ||
      teacher.full_name ||
      teacher.user?.first_name ||
      "Teacher"
    );
  };

  const getTeacherEmail = (
    teacher
  ) => {
    return (
      teacher.email ||
      teacher.user?.email ||
      "-"
    );
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const totalStudentApplications =
    applications.length;

  const pendingStudents =
    applications.filter(
      (item) =>
        item.status === "PENDING"
    ).length;

  const reviewingStudents =
    applications.filter(
      (item) =>
        item.status === "REVIEWING"
    ).length;

  const approvedStudents =
    applications.filter(
      (item) =>
        item.status === "APPROVED"
    ).length;

  const totalTeacherApplications =
    teacherApplications.length +
    teachers.length;

  const pendingTeachers =
    teacherApplications.length;

  const approvedTeachers =
    teachers.length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="admin-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>

          <p className="page-label">
            SCHOOL ADMINISTRATION
          </p>

          <h1>
            Admission & Teacher Management
          </h1>

          <p>
            Review and manage student
            admissions and teacher
            applications.
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={() => {
            fetchApplications();
            fetchTeacherData();
          }}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =====================================================
          ERRORS
      ===================================================== */}

      {error && (
        <div className="admin-error">
          Student: {error}
        </div>
      )}

      {teacherError && (
        <div className="admin-error">
          Teacher: {teacherError}
        </div>
      )}

      {/* =====================================================
          STUDENT SUMMARY
      ===================================================== */}

      <h2 className="section-title">
        Student Admissions
      </h2>

      <div className="admission-summary">

        <div className="summary-card">
          <span>
            Total Applications Student
          </span>

          <strong>
            {totalStudentApplications}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Pending Student
          </span>

          <strong>
            {pendingStudents}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Reviewing
          </span>

          <strong>
            {reviewingStudents}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Approved Student
          </span>

          <strong>
            {approvedStudents}
          </strong>
        </div>

      </div>

      {/* =====================================================
          TEACHER SUMMARY
      ===================================================== */}

      <h2 className="section-title">
        Teacher Applications
      </h2>

      <div className="admission-summary">

        <div className="summary-card">
          <span>
            Total Applications Teacher
          </span>

          <strong>
            {totalTeacherApplications}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Pending Teacher
          </span>

          <strong>
            {pendingTeachers}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Approved Teacher
          </span>

          <strong>
            {approvedTeachers}
          </strong>
        </div>

      </div>

      {/* =====================================================
          STUDENT TABLE
      ===================================================== */}

      <div className="admission-table-card">

        <div className="table-section-header">

          <div>

            <h2>
              Student Admission Applications
            </h2>

            <p>
              Manage student admission requests.
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={
              fetchApplications
            }
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="table-loading">
            Loading applications...
          </div>

        ) : applications.length === 0 ? (

          <div className="empty-state">

            <div>🎓</div>

            <h3>
              No applications found
            </h3>

            <p>
              New admission applications
              will appear here.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="admission-table">

              <thead>

                <tr>

                  <th>
                    Application No.
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Class
                  </th>

                  <th>
                    Parent
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Applied On
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {applications.map(
                  (application) => (

                    <tr
                      key={
                        application.id
                      }
                    >

                      <td>
                        <strong>
                          {application.application_number ||
                            "-"}
                        </strong>
                      </td>

                      <td>
                        <div className="student-name">
                          {getStudentName(
                            application
                          ) || "-"}
                        </div>
                      </td>

                      <td>
                        {application.applying_for_class ||
                          "-"}
                      </td>

                      <td>
                        {application.father_name ||
                          "-"}
                      </td>

                      <td>
                        {application.parent_phone ||
                          "-"}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            application.status
                              ? application.status.toLowerCase()
                              : ""
                          }`}
                        >
                          {application.status ||
                            "-"}
                        </span>

                      </td>

                      <td>
                        {application.created_at
                          ? new Date(
                              application.created_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td
                        style={{
                          display: "flex",
                          gap: "6px",
                        }}
                      >

                        <button
                          className="view-button"
                          onClick={() =>
                            alert(
                              `Application: ${application.application_number}`
                            )
                          }
                        >
                          View
                        </button>

                        {application.status ===
                          "PENDING" && (

                          <button
                            className="approve-action-button"
                            onClick={() =>
                              setSelectedApp(
                                application
                              )
                            }
                          >
                            Approve
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          PENDING TEACHERS
      ===================================================== */}

      <div className="admission-table-card">

        <div className="table-section-header">

          <div>

            <h2>
              Pending Teacher Applications
            </h2>

            <p>
              Review and approve teacher
              registration requests.
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={
              fetchTeacherData
            }
          >
            ↻ Refresh
          </button>

        </div>

        {teacherLoading ? (

          <div className="table-loading">
            Loading teacher applications...
          </div>

        ) : teacherApplications.length === 0 ? (

          <div className="empty-state">

            <div>👨‍🏫</div>

            <h3>
              No pending teacher applications
            </h3>

            <p>
              New teacher registrations
              will appear here.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="admission-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Qualification
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {teacherApplications.map(
                  (teacher) => (

                    <tr
                      key={teacher.id}
                    >

                      <td>
                        <strong>
                          {getTeacherName(
                            teacher
                          )}
                        </strong>
                      </td>

                      <td>
                        {getTeacherEmail(
                          teacher
                        )}
                      </td>

                      <td>
                        {teacher.phone ||
                          "-"}
                      </td>

                      <td>
                        {teacher.department ||
                          "-"}
                      </td>

                      <td>
                        {teacher.primary_subject ||
                          teacher.subject ||
                          "-"}
                      </td>

                      <td>
                        {teacher.qualification ||
                          "-"}
                      </td>

                      <td>

                        <button
                          className="approve-action-button"
                          disabled={
                            teacherApproving
                          }
                          onClick={() =>
                            handleApproveTeacher(
                              teacher
                            )
                          }
                        >
                          {teacherApproving
                            ? "Approving..."
                            : "Approve"}
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          APPROVED TEACHERS
      ===================================================== */}

      <div className="admission-table-card">

        <div className="table-section-header">

          <div>

            <h2>
              Approved Teachers
            </h2>

            <p>
              View and edit approved teachers
              using Employee ID.
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={
              fetchTeacherData
            }
          >
            ↻ Refresh
          </button>

        </div>

        {teacherLoading ? (

          <div className="table-loading">
            Loading teachers...
          </div>

        ) : teachers.length === 0 ? (

          <div className="empty-state">

            <div>👩‍🏫</div>

            <h3>
              No approved teachers
            </h3>

            <p>
              Approved teachers will
              appear here.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="admission-table">

              <thead>

                <tr>

                  <th>
                    Employee ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {teachers.map(
                  (teacher) => (

                    <tr
                      key={teacher.id}
                    >

                      <td>
                        <strong>
                          {teacher.employee_id ||
                            teacher.employeeId ||
                            "-"}
                        </strong>
                      </td>

                      <td>
                        {getTeacherName(
                          teacher
                        )}
                      </td>

                      <td>
                        {getTeacherEmail(
                          teacher
                        )}
                      </td>

                      <td>
                        {teacher.phone ||
                          "-"}
                      </td>

                      <td>
                        {teacher.department ||
                          "-"}
                      </td>

                      <td>
                        {teacher.primary_subject ||
                          teacher.subject ||
                          "-"}
                      </td>

                      <td>

                        <span className="status-badge approved">
                          APPROVED
                        </span>

                      </td>

                      {/* VIEW / EDIT */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >

                          <button
                            className="view-button"
                            onClick={() =>
                              handleViewTeacher(
                                teacher
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="edit-button"
                            onClick={() => {

                              const teacherData =
                                {
                                  ...teacher,

                                  employee_id:
                                    teacher.employee_id ||
                                    teacher.employeeId,

                                  email:
                                    teacher.email ||
                                    teacher.user?.email ||
                                    "",

                                  phone:
                                    teacher.phone ||
                                    "",

                                  qualification:
                                    teacher.qualification ||
                                    "",

                                  primary_subject:
                                    teacher.primary_subject ||
                                    teacher.subject ||
                                    "",
                                };

                              setSelectedTeacher(
                                teacherData
                              );

                              handleEditTeacher(
                                teacherData
                              );
                            }}
                          >
                            Edit
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          STUDENT APPROVAL MODAL
      ===================================================== */}

      {selectedApp && (

        <div className="modal-overlay">

          <div className="modal-content">

            <h2>
              Approve Admission
            </h2>

            <p>
              Student:{" "}
              <strong>
                {getStudentName(
                  selectedApp
                )}
              </strong>
            </p>

            <form
              onSubmit={
                handleApproveSubmit
              }
            >

              <div className="form-group">

                <label>
                  Academic Year ID:
                </label>

                <input
                  type="number"
                  value={
                    academicYearId
                  }
                  onChange={(e) =>
                    setAcademicYearId(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Class ID:
                </label>

                <input
                  type="number"
                  value={
                    classId
                  }
                  onChange={(e) =>
                    setClassId(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Section ID:
                </label>

                <input
                  type="number"
                  value={
                    sectionId
                  }
                  onChange={(e) =>
                    setSectionId(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setSelectedApp(
                      null
                    )
                  }
                  disabled={approving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={approving}
                >
                  {approving
                    ? "Creating..."
                    : "Confirm & Generate Credentials"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          STUDENT CREDENTIALS MODAL
      ===================================================== */}

      {showStudentCredentials &&
  studentCredentials && (
    <div className="modal-overlay">

      <div className="student-success-modal">

        {/* HEADER */}

        <div className="student-success-header">

          <h2>
            🎉 Student Approved!
          </h2>

          <p>
            Student account has been
            created successfully.
          </p>

        </div>


        {/* CREDENTIAL BOX */}

        <div className="student-credentials-box">

          {/* Student Name */}

          <div className="credential-line">

            <strong className="label-dark">
              Student Name:
            </strong>

            <span>
              {studentCredentials.studentName ||
                "-"}
            </span>

          </div>


          {/* Student ID */}

          <div className="credential-line">

            <strong className="label-purple">
              Student ID:
            </strong>

            <span>
              {studentCredentials.studentId ||
                "-"}
            </span>

          </div>


          {/* User ID */}

          <div className="credential-line">

            <strong className="label-blue">
              User ID:
            </strong>

            <span>
              {studentCredentials.userId ||
                "-"}
            </span>

          </div>


          {/* Username */}

          <div className="credential-line">

            <strong className="label-blue">
              Username:
            </strong>

            <span>
              {studentCredentials.username ||
                "-"}
            </span>

          </div>


          {/* Password */}

          <div className="credential-line">

            <strong className="label-red">
              Temporary Password:
            </strong>

            <span>
              {studentCredentials.password ||
                "-"}
            </span>

          </div>

        </div>


        {/* CLOSE BUTTON */}

        <button
          className="student-success-close"
          onClick={() => {
            setShowStudentCredentials(false);
            setStudentCredentials(null);
          }}
        >
          Close
        </button>

      </div>

    </div>
  )}
      {/* =====================================================
          TEACHER VIEW / EDIT POPUP
      ===================================================== */}

      {selectedTeacher && (

        <div className="modal-overlay">

          <div
            className="modal-content teacher-modal"
          >

            {/* HEADER */}

            <div className="teacher-modal-header">

              <div>

                <h2>
                  {teacherEditMode
                    ? "Edit Teacher"
                    : "Teacher Details"}
                </h2>

                <p>
                  Employee ID:{" "}
                  <strong>
                    {selectedTeacher.employee_id}
                  </strong>
                </p>

              </div>

              <button
                className="close-modal-button"
                onClick={() => {
                  setSelectedTeacher(
                    null
                  );
                  setTeacherEditMode(
                    false
                  );
                }}
              >
                ×
              </button>

            </div>

            {/* LOADING */}

            {teacherDetailsLoading ? (

              <div className="table-loading">
                Loading teacher details...
              </div>

            ) : teacherEditMode ? (

              /* =================================================
                 EDIT MODE
              ================================================= */

              <form
                onSubmit={
                  handleUpdateTeacher
                }
              >

                <div className="form-group">

                  <label>
                    Employee ID
                  </label>

                  <input
                    type="text"
                    value={
                      selectedTeacher.employee_id
                    }
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      teacherEditForm.name
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      teacherEditForm.email
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      teacherEditForm.phone
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={
                      teacherEditForm.department
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Primary Subject
                  </label>

                  <input
                    type="text"
                    name="primary_subject"
                    value={
                      teacherEditForm.primary_subject
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={
                      teacherEditForm.qualification
                    }
                    onChange={
                      handleTeacherEditChange
                    }
                  />

                </div>

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setTeacherEditMode(
                        false
                      )
                    }
                    disabled={
                      teacherUpdating
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                      teacherUpdating
                    }
                  >
                    {teacherUpdating
                      ? "Updating..."
                      : "Update Teacher"}
                  </button>

                </div>

              </form>

            ) : (

              /* =================================================
                 VIEW MODE
              ================================================= */

              <div>

                <div className="teacher-detail-grid">

                  <div className="teacher-detail-item">

                    <span>
                      Name
                    </span>

                    <strong>
                      {selectedTeacher.name ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Employee ID
                    </span>

                    <strong>
                      {selectedTeacher.employee_id ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedTeacher.email ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedTeacher.phone ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Department
                    </span>

                    <strong>
                      {selectedTeacher.department ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Primary Subject
                    </span>

                    <strong>
                      {selectedTeacher.primary_subject ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Qualification
                    </span>

                    <strong>
                      {selectedTeacher.qualification ||
                        "-"}
                    </strong>

                  </div>

                  <div className="teacher-detail-item">

                    <span>
                      Status
                    </span>

                    <strong
                      style={{
                        color:
                          selectedTeacher.is_active
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    >
                      {selectedTeacher.is_active
                        ? "Active"
                        : "Inactive"}
                    </strong>

                  </div>

                </div>

                <div
                  className="modal-actions"
                  style={{
                    marginTop: "20px",
                  }}
                >

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      setSelectedTeacher(
                        null
                      )
                    }
                  >
                    Close
                  </button>

                  <button
                    className="submit-btn"
                    onClick={() =>
                      handleEditTeacher(
                        selectedTeacher
                      )
                    }
                  >
                    Edit Teacher
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          TEACHER CREDENTIALS MODAL
      ===================================================== */}

      {teacherCredentials && (

        <div className="modal-overlay">

          <div className="modal-content success-modal">

            <h2
              style={{
                color: "#16a34a",
              }}
            >
              🎉 Teacher Approved!
            </h2>

            <p>
              Teacher account has been
              created successfully.
            </p>

            <div className="credentials-box">

              <p>
                <strong>
                  Teacher Name:
                </strong>{" "}
                {
                  teacherCredentials.teacherName
                }
              </p>

              <hr />

              <p
                style={{
                  color: "#7c3aed",
                }}
              >
                <strong>
                  Employee ID:
                </strong>{" "}
                {
                  teacherCredentials.employeeId ||
                  "-"
                }
              </p>

              <p
                style={{
                  color: "#2563eb",
                }}
              >
                <strong>
                  Username:
                </strong>{" "}
                {
                  teacherCredentials.username ||
                  "-"
                }
              </p>

              <p
                style={{
                  color: "#dc2626",
                }}
              >
                <strong>
                  Temporary Password:
                </strong>{" "}
                {
                  teacherCredentials.password ||
                  "-"
                }
              </p>

            </div>

            <button
              className="submit-btn"
              onClick={() =>
                setTeacherCredentials(
                  null
                )
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #fff;
          padding: 24px;
          border-radius: 8px;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 4px 12px rgba(0,0,0,0.15);
        }

        .teacher-modal {
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .teacher-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .teacher-modal-header h2 {
          margin: 0;
        }

        .teacher-modal-header p {
          margin: 5px 0 0;
          color: #6b7280;
        }

        .close-modal-button {
          border: none;
          background: transparent;
          font-size: 28px;
          cursor: pointer;
          color: #6b7280;
          line-height: 1;
        }

        .close-modal-button:hover {
          color: #111827;
        }

        .form-group {
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          padding: 9px 10px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
          outline: none;
        }

        .form-group input:focus {
          border-color: #2563eb;
        }

        .form-group input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        .cancel-btn {
          padding: 9px 16px;
          border: 1px solid #d1d5db;
          background: #fff;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #f9fafb;
        }

        .submit-btn {
          padding: 9px 16px;
          border: none;
          background: #2563eb;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
        }

        .submit-btn:hover {
          background: #1d4ed8;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .credentials-box {
          background: #f3f4f6;
          padding: 14px;
          border-radius: 6px;
          margin: 16px 0;
        }

        .credentials-box p {
          margin: 8px 0;
        }

        .section-title {
          margin: 25px 0 12px;
        }

        .table-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px;
        }

        .table-section-header h2 {
          margin: 0;
        }

        .table-section-header p {
          margin: 5px 0 0;
          color: #6b7280;
        }

        .approve-action-button {
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .approve-action-button:hover {
          background: #15803d;
        }

        .approve-action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-badge.approved {
          background: #dcfce7;
          color: #166534;
        }

        /* =====================================================
           TEACHER VIEW BUTTON
        ===================================================== */

        .view-button {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .view-button:hover {
          background: #1d4ed8;
        }

        /* =====================================================
           TEACHER EDIT BUTTON
        ===================================================== */

        .edit-button {
          background: #f59e0b;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .edit-button:hover {
          background: #d97706;
        }

        /* =====================================================
           TEACHER DETAILS GRID
        ===================================================== */

        .teacher-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .teacher-detail-item {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 13px;
        }

        .teacher-detail-item span {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .teacher-detail-item strong {
          font-size: 14px;
          color: #111827;
          word-break: break-word;
        }

        @media (max-width: 600px) {

          .teacher-detail-grid {
            grid-template-columns: 1fr;
          }

          .teacher-modal {
            max-width: 100%;
          }

          .table-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

        }

         /* =====================================================
         STUDENT APPROVED SUCCESS POPUP
          ===================================================== */

.student-success-modal {
  width: 465px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 8px;
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}


/* HEADER */

.student-success-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #4ca05a;
}

.student-success-header p {
  margin: 5px 0 20px;
  font-size: 19px;
  color: #222;
}


/* CREDENTIAL BOX */

.student-credentials-box {
  background: #f1f2f4;
  border-radius: 7px;
  padding: 25px 18px;
  margin-bottom: 20px;
}


/* EACH LINE */

.credential-line {
  display: flex;
  align-items: baseline;
  gap: 5px;
  padding: 9px 0;
  font-size: 18px;
  border-bottom: 1px solid #9ca3af;
}

.credential-line:last-child {
  border-bottom: none;
}


/* LABELS */

.label-dark {
  color: #1f2937;
}

.label-purple {
  color: #7c3aed;
}

.label-blue {
  color: #2563eb;
}

.label-red {
  color: #b83b3b;
}


/* VALUES */

.credential-line span {
  color: #374151;
}


/* CLOSE BUTTON */

.student-success-close {
  width: 100%;
  border: none;
  background: #3864df;
  color: white;
  padding: 12px;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
}

.student-success-close:hover {
  background: #2f56c5;
}


/* MOBILE */

@media (max-width: 600px) {

  .student-success-modal {
    width: 95%;
    padding: 20px;
  }

  .student-success-header h2 {
    font-size: 23px;
  }

  .student-success-header p {
    font-size: 16px;
  }

  .credential-line {
    font-size: 15px;
  }
}


          

      `}</style>

    </div>
  );
}

export default AdminDashboard;
