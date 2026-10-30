
// import { useCallback, useEffect, useState } from "react";

// import { admitCardService } from "../../services/admitCardService";

// import {
//   getExams,
//   createExam,
//   publishExamResults,
//   publishExamTimetable,
//   getExamSchedules,
//   createExamSchedule,
//   getExamAvailableSubjects,
// } from "../../services/exams";

// import { academicAdminService } from "../../services/academicAdminService";



// const getList = (response, keys = []) => {
//   if (Array.isArray(response)) return response;

//   for (const key of keys) {
//     if (Array.isArray(response?.[key])) return response[key];
//   }

//   if (Array.isArray(response?.data)) return response.data;
//   if (Array.isArray(response?.results)) return response.results;

//   return [];
// };

// const getId = (item) => item?.id ?? item?.value ?? "";

// const getName = (item) =>
//   item?.name ??
//   item?.title ??
//   item?.display_name ??
//   item?.class_name ??
//   item?.subject_name ??
//   (item?.id ? `ID: ${item.id}` : "Unknown");

// const getErrorMessage = (error) =>
//   error?.message || "Something went wrong. Please try again.";

// const initialExamForm = {
//   name: "",
//   academic_year: "",
//   school_class: "",
//   section: "",
//   start_date: "",
//   end_date: "",
// };

// const initialScheduleForm = {
//   subject: "",
//   exam_date: "",
//   start_time: "",
//   end_time: "",
//   total_marks: "100",
//   passing_marks: "33",
// };

// export default function AdminExam() {
//   const [exams, setExams] = useState([]);
//   const [academicYears, setAcademicYears] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);

//   const [examForm, setExamForm] = useState(initialExamForm);
//   const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);

//   const [selectedExam, setSelectedExam] = useState(null);
//   const [availableSubjects, setAvailableSubjects] = useState([]);
//   const [schedules, setSchedules] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [loadingSections, setLoadingSections] = useState(false);
//   const [loadingSchedule, setLoadingSchedule] = useState(false);
//   const [savingExam, setSavingExam] = useState(false);
//   const [savingSchedule, setSavingSchedule] = useState(false);

//   const [publishingTimetableId, setPublishingTimetableId] = useState(null);
//   const [releasingAdmitCardId, setReleasingAdmitCardId] = useState(null);
//   const [publishingResultId, setPublishingResultId] = useState(null);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const loadExams = useCallback(async () => {
//     const response = await getExams();
//     setExams(getList(response, ["exams", "results", "data"]));
//   }, []);

//   const loadAcademicYears = useCallback(async () => {
//     const response = await academicAdminService.getAcademicYears();
//     setAcademicYears(getList(response, ["academic_years", "years", "results", "data"]));
//   }, []);

//   const loadInitialData = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       await Promise.all([loadExams(), loadAcademicYears()]);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [loadExams, loadAcademicYears]);

//   useEffect(() => {
//     loadInitialData();
//   }, [loadInitialData]);

//   const handleExamFormChange = (event) => {
//     const { name, value } = event.target;

//     setExamForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleYearChange = async (event) => {
//     const academicYearId = event.target.value;

//     setExamForm((previous) => ({
//       ...previous,
//       academic_year: academicYearId,
//       school_class: "",
//       section: "",
//     }));

//     setClasses([]);
//     setSections([]);
//     setError("");
//     setSuccess("");

//     if (!academicYearId) return;

//     setLoadingClasses(true);

//     try {
//       const response = await academicAdminService.getClasses(academicYearId);
//       setClasses(getList(response, ["classes", "results", "data"]));
//     } catch (err) {
//       setError(`Classes load nahi ho sake: ${getErrorMessage(err)}`);
//     } finally {
//       setLoadingClasses(false);
//     }
//   };

//   const handleClassChange = async (event) => {
//     const classId = event.target.value;

//     setExamForm((previous) => ({
//       ...previous,
//       school_class: classId,
//       section: "",
//     }));

//     setSections([]);
//     setError("");
//     setSuccess("");

//     if (!classId) return;

//     setLoadingSections(true);

//     try {
//       const response = await academicAdminService.getSections(classId);
//       setSections(getList(response, ["sections", "results", "data"]));
//     } catch (err) {
//       setError(`Sections load nahi ho sake: ${getErrorMessage(err)}`);
//     } finally {
//       setLoadingSections(false);
//     }
//   };

//   const handleCreateExam = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (
//       !examForm.name.trim() ||
//       !examForm.academic_year ||
//       !examForm.school_class ||
//       !examForm.section ||
//       !examForm.start_date ||
//       !examForm.end_date
//     ) {
//       setError("Please saari exam details fill karein.");
//       return;
//     }

//     if (examForm.end_date < examForm.start_date) {
//       setError("Exam end date, start date se pehle nahi ho sakti.");
//       return;
//     }

//     setSavingExam(true);

//     try {
//       await createExam({
//         name: examForm.name.trim(),
//         academic_year: Number(examForm.academic_year),
//         school_class: Number(examForm.school_class),
//         section: Number(examForm.section),
//         start_date: examForm.start_date,
//         end_date: examForm.end_date,
//       });

//       setSuccess("Exam successfully create ho gaya.");
//       setExamForm(initialExamForm);
//       setClasses([]);
//       setSections([]);
//       await loadExams();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setSavingExam(false);
//     }
//   };

//   const handleManageSchedule = async (exam) => {
//     setSelectedExam(exam);
//     setScheduleForm(initialScheduleForm);
//     setAvailableSubjects([]);
//     setSchedules([]);
//     setError("");
//     setSuccess("");
//     setLoadingSchedule(true);

//     try {
//       const [subjectsResponse, schedulesResponse] = await Promise.all([
//         getExamAvailableSubjects(exam.id),
//         getExamSchedules(exam.id),
//       ]);

//       setAvailableSubjects(
//         getList(subjectsResponse, ["subjects", "available_subjects", "results", "data"])
//       );

//       setSchedules(
//         getList(schedulesResponse, ["schedules", "exam_schedules", "results", "data"])
//       );
//     } catch (err) {
//       setError(`Schedule data load nahi hua: ${getErrorMessage(err)}`);
//     } finally {
//       setLoadingSchedule(false);
//     }
//   };

//   const handleScheduleFormChange = (event) => {
//     const { name, value } = event.target;

//     setScheduleForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleCreateSchedule = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!selectedExam) {
//       setError("Pehle ek exam select karein.");
//       return;
//     }

//     const totalMarks = Number(scheduleForm.total_marks);
//     const passingMarks = Number(scheduleForm.passing_marks);

//     if (
//       !scheduleForm.subject ||
//       !scheduleForm.exam_date ||
//       !scheduleForm.start_time ||
//       !scheduleForm.end_time
//     ) {
//       setError("Schedule ki saari required details fill karein.");
//       return;
//     }

//     if (scheduleForm.end_time <= scheduleForm.start_time) {
//       setError("End time, start time se baad ka hona chahiye.");
//       return;
//     }

//     if (
//       !Number.isFinite(totalMarks) ||
//       !Number.isFinite(passingMarks) ||
//       totalMarks <= 0 ||
//       passingMarks < 0 ||
//       passingMarks > totalMarks
//     ) {
//       setError("Marks valid hon: total marks positive aur passing marks total se zyada na hon.");
//       return;
//     }

//     setSavingSchedule(true);

//     try {
//       await createExamSchedule(selectedExam.id, {
//         subject: Number(scheduleForm.subject),
//         exam_date: scheduleForm.exam_date,
//         start_time: scheduleForm.start_time,
//         end_time: scheduleForm.end_time,
//         total_marks: totalMarks,
//         passing_marks: passingMarks,
//       });

//       setSuccess("Exam schedule successfully add ho gaya.");

//       const response = await getExamSchedules(selectedExam.id);
//       setSchedules(getList(response, ["schedules", "exam_schedules", "results", "data"]));

//       setScheduleForm(initialScheduleForm);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setSavingSchedule(false);
//     }
//   };

//   const handlePublishTimetable = async (exam) => {
//     if (!window.confirm(`"${exam.name}" ka timetable publish karna hai?`)) {
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setPublishingTimetableId(exam.id);

//     try {
//       await publishExamTimetable(exam.id);
//       setSuccess(`${exam.name}: timetable publish ho gaya.`);
//       await loadExams();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPublishingTimetableId(null);
//     }
//   };

//   const handleReleaseAdmitCard = async (exam) => {
//     if (!window.confirm(`"${exam.name}" ke admit cards release karne hain?`)) {
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setReleasingAdmitCardId(exam.id);

//     try {
//       await admitCardService.releaseAdmitCard(exam.id);
//       setSuccess(`${exam.name}: admit cards release ho gaye.`);
//       await loadExams();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setReleasingAdmitCardId(null);
//     }
//   };

//   const handlePublishResults = async (exam) => {
//     if (!window.confirm(`"${exam.name}" ke results publish karne hain?`)) {
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setPublishingResultId(exam.id);

//     try {
//       await publishExamResults(exam.id);
//       setSuccess(`${exam.name}: results publish ho gaye.`);
//       await loadExams();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPublishingResultId(null);
//     }
//   };

//   const closeSchedulePanel = () => {
//     setSelectedExam(null);
//     setAvailableSubjects([]);
//     setSchedules([]);
//     setError("");
//     setSuccess("");
//   };

//   return (
//     <div className="admin-exam-page">
//       <div className="exam-page-header">
//         <div>
//           <h1>Examination Management</h1>
//           <p>Create exams, manage schedules, publish timetables and results.</p>
//         </div>

//         <button
//           type="button"
//           className="exam-btn exam-btn-secondary"
//           onClick={loadInitialData}
//           disabled={loading}
//         >
//           {loading ? "Refreshing..." : "Refresh"}
//         </button>
//       </div>

//       {error && (
//         <div className="exam-alert exam-alert-error" role="alert">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="exam-alert exam-alert-success" role="status">
//           {success}
//         </div>
//       )}

//       <section className="exam-card">
//         <h2>Create New Exam</h2>

//         <form onSubmit={handleCreateExam} className="exam-form-grid">
//           <div className="exam-field">
//             <label htmlFor="exam-name">Exam Name *</label>
//             <input
//               id="exam-name"
//               name="name"
//               value={examForm.name}
//               onChange={handleExamFormChange}
//               placeholder="e.g. First Terminal Examination"
//               required
//             />
//           </div>

//           <div className="exam-field">
//             <label htmlFor="academic-year">Academic Year *</label>
//             <select
//               id="academic-year"
//               name="academic_year"
//               value={examForm.academic_year}
//               onChange={handleYearChange}
//               required
//             >
//               <option value="">Select academic year</option>
//               {academicYears.map((year) => (
//                 <option key={getId(year)} value={getId(year)}>
//                   {getName(year)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="exam-field">
//             <label htmlFor="school-class">Class *</label>
//             <select
//               id="school-class"
//               name="school_class"
//               value={examForm.school_class}
//               onChange={handleClassChange}
//               disabled={!examForm.academic_year || loadingClasses}
//               required
//             >
//               <option value="">
//                 {loadingClasses ? "Loading classes..." : "Select class"}
//               </option>
//               {classes.map((schoolClass) => (
//                 <option key={getId(schoolClass)} value={getId(schoolClass)}>
//                   {getName(schoolClass)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="exam-field">
//             <label htmlFor="exam-section">Section *</label>
//             <select
//               id="exam-section"
//               name="section"
//               value={examForm.section}
//               onChange={handleExamFormChange}
//               disabled={!examForm.school_class || loadingSections}
//               required
//             >
//               <option value="">
//                 {loadingSections ? "Loading sections..." : "Select section"}
//               </option>
//               {sections.map((section) => (
//                 <option key={getId(section)} value={getId(section)}>
//                   {getName(section)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="exam-field">
//             <label htmlFor="exam-start-date">Start Date *</label>
//             <input
//               id="exam-start-date"
//               type="date"
//               name="start_date"
//               value={examForm.start_date}
//               onChange={handleExamFormChange}
//               required
//             />
//           </div>

//           <div className="exam-field">
//             <label htmlFor="exam-end-date">End Date *</label>
//             <input
//               id="exam-end-date"
//               type="date"
//               name="end_date"
//               value={examForm.end_date}
//               min={examForm.start_date || undefined}
//               onChange={handleExamFormChange}
//               required
//             />
//           </div>

//           <div className="exam-form-actions">
//             <button
//               type="submit"
//               className="exam-btn exam-btn-primary"
//               disabled={savingExam}
//             >
//               {savingExam ? "Creating..." : "Create Exam"}
//             </button>
//           </div>
//         </form>
//       </section>

//       <section className="exam-card">
//         <div className="exam-section-heading">
//           <div>
//             <h2>Examination List</h2>
//             <p>{exams.length} exam(s) found</p>
//           </div>
//         </div>

//         {loading ? (
//           <p className="exam-empty-state">Loading exams...</p>
//         ) : exams.length === 0 ? (
//           <p className="exam-empty-state">
//             No exams found. Create your first exam above.
//           </p>
//         ) : (
//           <div className="exam-table-wrapper">
//             <table className="exam-table">
//               <thead>
//                 <tr>
//                   <th>Exam</th>
//                   <th>Academic Year</th>
//                   <th>Class</th>
//                   <th>Section</th>
//                   <th>Start Date</th>
//                   <th>End Date</th>
//                   <th>Timetable</th>
//                   <th>Admit Card</th>
//                   <th>Results</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {exams.map((exam) => (
//                   <tr key={exam.id}>
//                     <td>{exam.name || "—"}</td>
//                     <td>
//                       {exam.academic_year_name ||
//                         exam.academic_year?.name ||
//                         "Name unavailable"}
//                     </td>
//                     <td>
//                       {exam.class_name ||
//                         exam.school_class_name ||
//                         exam.school_class?.name ||
//                         "Name unavailable"}
//                     </td>
//                     <td>
//                       {exam.section_name ||
//                         exam.section?.name ||
//                         "Name unavailable"}
//                     </td>
//                     <td>{exam.start_date || "—"}</td>
//                     <td>{exam.end_date || "—"}</td>
//                     <td>
//                       <span
//                         className={`exam-status ${
//                           exam.is_timetable_published ? "is-published" : "is-pending"
//                         }`}
//                       >
//                         {exam.is_timetable_published ? "Published" : "Pending"}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`exam-status ${
//                           exam.is_admit_card_released ? "is-published" : "is-pending"
//                         }`}
//                       >
//                         {exam.is_admit_card_released ? "Released" : "Pending"}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`exam-status ${
//                           exam.is_result_published ? "is-published" : "is-pending"
//                         }`}
//                       >
//                         {exam.is_result_published ? "Published" : "Pending"}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="exam-actions">
//                         <button
//                           type="button"
//                           className="exam-btn exam-btn-secondary"
//                           onClick={() => handleManageSchedule(exam)}
//                         >
//                           Manage Schedule
//                         </button>

//                         <button
//                           type="button"
//                           className="exam-btn exam-btn-primary"
//                           onClick={() => handlePublishTimetable(exam)}
//                           disabled={
//                             !!exam.is_timetable_published ||
//                             publishingTimetableId === exam.id
//                           }
//                         >
//                           {publishingTimetableId === exam.id
//                             ? "Publishing..."
//                             : exam.is_timetable_published
//                               ? "Timetable Published"
//                               : "Publish Timetable"}
//                         </button>

//                         <button
//                           type="button"
//                           className="exam-btn exam-btn-secondary"
//                           onClick={() => handleReleaseAdmitCard(exam)}
//                           disabled={
//                             !!exam.is_admit_card_released ||
//                             releasingAdmitCardId === exam.id
//                           }
//                         >
//                           {releasingAdmitCardId === exam.id
//                             ? "Releasing..."
//                             : exam.is_admit_card_released
//                               ? "Admit Card Released"
//                               : "Release Admit Card"}
//                         </button>

//                         <button
//                           type="button"
//                           className="exam-btn exam-btn-success"
//                           onClick={() => handlePublishResults(exam)}
//                           disabled={
//                             !!exam.is_result_published ||
//                             publishingResultId === exam.id
//                           }
//                         >
//                           {publishingResultId === exam.id
//                             ? "Publishing..."
//                             : exam.is_result_published
//                               ? "Results Published"
//                               : "Publish Results"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {selectedExam && (
//         <section className="exam-card exam-schedule-panel">
//           <div className="exam-section-heading">
//             <div>
//               <h2>Manage Exam Schedule</h2>
//               <p>
//                 Exam: <strong>{selectedExam.name}</strong>
//               </p>
//             </div>

//             <button
//               type="button"
//               className="exam-btn exam-btn-secondary"
//               onClick={closeSchedulePanel}
//             >
//               Close
//             </button>
//           </div>

//           {loadingSchedule ? (
//             <p className="exam-empty-state">Loading subjects and schedules...</p>
//           ) : (
//             <>
//               <form onSubmit={handleCreateSchedule} className="exam-form-grid">
//                 <div className="exam-field">
//                   <label htmlFor="schedule-subject">Subject *</label>
//                   <select
//                     id="schedule-subject"
//                     name="subject"
//                     value={scheduleForm.subject}
//                     onChange={handleScheduleFormChange}
//                     required
//                   >
//                     <option value="">Select subject</option>
//                     {availableSubjects.map((subject) => (
//                       <option key={getId(subject)} value={getId(subject)}>
//                         {getName(subject)}
//                       </option>
//                     ))}
//                   </select>

//                   {availableSubjects.length === 0 && (
//                     <small>
//                       No available subjects returned by the API. Check class-subject
//                       assignments and the available-subjects endpoint.
//                     </small>
//                   )}
//                 </div>

//                 <div className="exam-field">
//                   <label htmlFor="schedule-date">Exam Date *</label>
//                   <input
//                     id="schedule-date"
//                     type="date"
//                     name="exam_date"
//                     value={scheduleForm.exam_date}
//                     min={selectedExam.start_date || undefined}
//                     max={selectedExam.end_date || undefined}
//                     onChange={handleScheduleFormChange}
//                     required
//                   />
//                 </div>

//                 <div className="exam-field">
//                   <label htmlFor="schedule-start-time">Start Time *</label>
//                   <input
//                     id="schedule-start-time"
//                     type="time"
//                     name="start_time"
//                     value={scheduleForm.start_time}
//                     onChange={handleScheduleFormChange}
//                     required
//                   />
//                 </div>

//                 <div className="exam-field">
//                   <label htmlFor="schedule-end-time">End Time *</label>
//                   <input
//                     id="schedule-end-time"
//                     type="time"
//                     name="end_time"
//                     value={scheduleForm.end_time}
//                     onChange={handleScheduleFormChange}
//                     required
//                   />
//                 </div>

//                 <div className="exam-field">
//                   <label htmlFor="schedule-total-marks">Total Marks *</label>
//                   <input
//                     id="schedule-total-marks"
//                     type="number"
//                     name="total_marks"
//                     min="1"
//                     value={scheduleForm.total_marks}
//                     onChange={handleScheduleFormChange}
//                     required
//                   />
//                 </div>

//                 <div className="exam-field">
//                   <label htmlFor="schedule-passing-marks">Passing Marks *</label>
//                   <input
//                     id="schedule-passing-marks"
//                     type="number"
//                     name="passing_marks"
//                     min="0"
//                     value={scheduleForm.passing_marks}
//                     onChange={handleScheduleFormChange}
//                     required
//                   />
//                 </div>

//                 <div className="exam-form-actions">
//                   <button
//                     type="submit"
//                     className="exam-btn exam-btn-primary"
//                     disabled={savingSchedule || availableSubjects.length === 0}
//                   >
//                     {savingSchedule ? "Saving..." : "Add Schedule"}
//                   </button>
//                 </div>
//               </form>

//               <h3 className="exam-subheading">Added Subjects / Schedules</h3>

//               {schedules.length === 0 ? (
//                 <p className="exam-empty-state">
//                   No schedules added yet. Add at least one subject schedule before
//                   publishing the timetable.
//                 </p>
//               ) : (
//                 <div className="exam-table-wrapper">
//                   <table className="exam-table">
//                     <thead>
//                       <tr>
//                         <th>Subject</th>
//                         <th>Date</th>
//                         <th>Start</th>
//                         <th>End</th>
//                         <th>Total Marks</th>
//                         <th>Passing Marks</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {schedules.map((schedule) => (
//                         <tr key={schedule.id}>
//                           <td>
//                             {schedule.subject_name ||
//                               schedule.subject?.name ||
//                               schedule.subject?.title ||
//                               (schedule.subject ? `Subject ID: ${schedule.subject}` : "—")}
//                           </td>
//                           <td>{schedule.exam_date || "—"}</td>
//                           <td>{schedule.start_time || "—"}</td>
//                           <td>{schedule.end_time || "—"}</td>
//                           <td>{schedule.total_marks ?? "—"}</td>
//                           <td>{schedule.passing_marks ?? "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }





import { useCallback, useEffect, useState } from "react";

import { admitCardService } from "../../services/admitCardService";

import {
  getExams,
  createExam,
  publishExamResults,
  publishExamTimetable,
  getExamSchedules,
  createExamSchedule,
  getExamAvailableSubjects,
} from "../../services/exams";

import { academicAdminService } from "../../services/academicAdminService";
import "./Exam.css";

const getList = (response, keys = []) => {
  if (Array.isArray(response)) return response;

  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }

  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;

  return [];
};

const getId = (item) => item?.id ?? item?.value ?? "";

const getName = (item) =>
  item?.name ??
  item?.title ??
  item?.display_name ??
  item?.class_name ??
  item?.subject_name ??
  (item?.id ? `ID: ${item.id}` : "Unknown");

const getErrorMessage = (error) =>
  error?.message || "Something went wrong. Please try again.";

const initialExamForm = {
  name: "",
  academic_year: "",
  school_class: "",
  section: "",
  start_date: "",
  end_date: "",
};

const initialScheduleForm = {
  subject: "",
  exam_date: "",
  start_time: "",
  end_time: "",
  total_marks: "100",
  passing_marks: "33",
};

export default function AdminExam() {
  const [exams, setExams] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [examForm, setExamForm] = useState(initialExamForm);
  const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);

  const [selectedExam, setSelectedExam] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [savingExam, setSavingExam] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [publishingTimetableId, setPublishingTimetableId] = useState(null);
  const [releasingAdmitCardId, setReleasingAdmitCardId] = useState(null);
  const [publishingResultId, setPublishingResultId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExams = useCallback(async () => {
    const response = await getExams();
    setExams(getList(response, ["exams", "results", "data"]));
  }, []);

  const loadAcademicYears = useCallback(async () => {
    const response = await academicAdminService.getAcademicYears();
    setAcademicYears(
      getList(response, ["academic_years", "years", "results", "data"])
    );
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([loadExams(), loadAcademicYears()]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loadExams, loadAcademicYears]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleExamFormChange = (event) => {
    const { name, value } = event.target;

    setExamForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleYearChange = async (event) => {
    const academicYearId = event.target.value;

    setExamForm((previous) => ({
      ...previous,
      academic_year: academicYearId,
      school_class: "",
      section: "",
    }));

    setClasses([]);
    setSections([]);
    setError("");
    setSuccess("");

    if (!academicYearId) return;

    setLoadingClasses(true);

    try {
      const response = await academicAdminService.getClasses(academicYearId);
      setClasses(getList(response, ["classes", "results", "data"]));
    } catch (err) {
      setError(`Classes load nahi ho sake: ${getErrorMessage(err)}`);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleClassChange = async (event) => {
    const classId = event.target.value;

    setExamForm((previous) => ({
      ...previous,
      school_class: classId,
      section: "",
    }));

    setSections([]);
    setError("");
    setSuccess("");

    if (!classId) return;

    setLoadingSections(true);

    try {
      const response = await academicAdminService.getSections(classId);
      setSections(getList(response, ["sections", "results", "data"]));
    } catch (err) {
      setError(`Sections load nahi ho sake: ${getErrorMessage(err)}`);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleCreateExam = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !examForm.name.trim() ||
      !examForm.academic_year ||
      !examForm.school_class ||
      !examForm.section ||
      !examForm.start_date ||
      !examForm.end_date
    ) {
      setError("Please saari exam details fill karein.");
      return;
    }

    if (examForm.end_date < examForm.start_date) {
      setError("Exam end date, start date se pehle nahi ho sakti.");
      return;
    }

    setSavingExam(true);

    try {
      await createExam({
        name: examForm.name.trim(),
        academic_year: Number(examForm.academic_year),
        school_class: Number(examForm.school_class),
        section: Number(examForm.section),
        start_date: examForm.start_date,
        end_date: examForm.end_date,
      });

      setSuccess("Exam successfully create ho gaya.");
      setExamForm(initialExamForm);
      setClasses([]);
      setSections([]);
      await loadExams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingExam(false);
    }
  };

  const handleManageSchedule = async (exam) => {
    setSelectedExam(exam);
    setScheduleForm(initialScheduleForm);
    setAvailableSubjects([]);
    setSchedules([]);
    setError("");
    setSuccess("");
    setLoadingSchedule(true);

    try {
      const [subjectsResponse, schedulesResponse] = await Promise.all([
        getExamAvailableSubjects(exam.id),
        getExamSchedules(exam.id),
      ]);

      setAvailableSubjects(
        getList(subjectsResponse, [
          "subjects",
          "available_subjects",
          "results",
          "data",
        ])
      );

      setSchedules(
        getList(schedulesResponse, [
          "schedules",
          "exam_schedules",
          "results",
          "data",
        ])
      );
    } catch (err) {
      setError(`Schedule data load nahi hua: ${getErrorMessage(err)}`);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleScheduleFormChange = (event) => {
    const { name, value } = event.target;

    setScheduleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateSchedule = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedExam) {
      setError("Pehle ek exam select karein.");
      return;
    }

    const totalMarks = Number(scheduleForm.total_marks);
    const passingMarks = Number(scheduleForm.passing_marks);

    if (
      !scheduleForm.subject ||
      !scheduleForm.exam_date ||
      !scheduleForm.start_time ||
      !scheduleForm.end_time
    ) {
      setError("Schedule ki saari required details fill karein.");
      return;
    }

    if (scheduleForm.end_time <= scheduleForm.start_time) {
      setError("End time, start time se baad ka hona chahiye.");
      return;
    }

    if (
      !Number.isFinite(totalMarks) ||
      !Number.isFinite(passingMarks) ||
      totalMarks <= 0 ||
      passingMarks < 0 ||
      passingMarks > totalMarks
    ) {
      setError(
        "Marks valid hon: total marks positive aur passing marks total se zyada na hon."
      );
      return;
    }

    if (
      selectedExam.start_date &&
      scheduleForm.exam_date < selectedExam.start_date
    ) {
      setError("Exam date, exam ki start date se pehle nahi ho sakti.");
      return;
    }

    if (
      selectedExam.end_date &&
      scheduleForm.exam_date > selectedExam.end_date
    ) {
      setError("Exam date, exam ki end date ke baad nahi ho sakti.");
      return;
    }

    setSavingSchedule(true);

    try {
      // IMPORTANT: Backend expects subject_id, not subject.
      const payload = {
        subject_id: Number(scheduleForm.subject),
        exam_date: scheduleForm.exam_date,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        total_marks: totalMarks,
        passing_marks: passingMarks,
      };

      await createExamSchedule(selectedExam.id, payload);

      setSuccess("Exam schedule successfully add ho gaya.");

      const response = await getExamSchedules(selectedExam.id);

      setSchedules(
        getList(response, [
          "schedules",
          "exam_schedules",
          "results",
          "data",
        ])
      );

      setScheduleForm(initialScheduleForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingSchedule(false);
    }
  };

  const handlePublishTimetable = async (exam) => {
    if (!window.confirm(`"${exam.name}" ka timetable publish karna hai?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setPublishingTimetableId(exam.id);

    try {
      await publishExamTimetable(exam.id);
      setSuccess(`${exam.name}: timetable publish ho gaya.`);
      await loadExams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPublishingTimetableId(null);
    }
  };

  const handleReleaseAdmitCard = async (exam) => {
    if (!window.confirm(`"${exam.name}" ke admit cards release karne hain?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setReleasingAdmitCardId(exam.id);

    try {
      await admitCardService.releaseAdmitCard(exam.id);
      setSuccess(`${exam.name}: admit cards release ho gaye.`);
      await loadExams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setReleasingAdmitCardId(null);
    }
  };

  const handlePublishResults = async (exam) => {
    if (!window.confirm(`"${exam.name}" ke results publish karne hain?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setPublishingResultId(exam.id);

    try {
      await publishExamResults(exam.id);
      setSuccess(`${exam.name}: results publish ho gaye.`);
      await loadExams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPublishingResultId(null);
    }
  };

  const closeSchedulePanel = () => {
    setSelectedExam(null);
    setAvailableSubjects([]);
    setSchedules([]);
    setError("");
    setSuccess("");
  };

  return (
    <div className="admin-exam-page">
      <div className="exam-page-header">
        <div>
          <h1>Examination Management</h1>
          <p>
            Create exams, manage schedules, publish timetables and results.
          </p>
        </div>

        <button
          type="button"
          className="exam-btn exam-btn-secondary"
          onClick={loadInitialData}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="exam-alert exam-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="exam-alert exam-alert-success" role="status">
          {success}
        </div>
      )}

      <section className="exam-card">
        <h2>Create New Exam</h2>

        <form onSubmit={handleCreateExam} className="exam-form-grid">
          <div className="exam-field">
            <label htmlFor="exam-name">Exam Name *</label>
            <input
              id="exam-name"
              name="name"
              value={examForm.name}
              onChange={handleExamFormChange}
              placeholder="e.g. First Terminal Examination"
              required
            />
          </div>

          <div className="exam-field">
            <label htmlFor="academic-year">Academic Year *</label>
            <select
              id="academic-year"
              name="academic_year"
              value={examForm.academic_year}
              onChange={handleYearChange}
              required
            >
              <option value="">Select academic year</option>
              {academicYears.map((year) => (
                <option key={getId(year)} value={getId(year)}>
                  {getName(year)}
                </option>
              ))}
            </select>
          </div>

          <div className="exam-field">
            <label htmlFor="school-class">Class *</label>
            <select
              id="school-class"
              name="school_class"
              value={examForm.school_class}
              onChange={handleClassChange}
              disabled={!examForm.academic_year || loadingClasses}
              required
            >
              <option value="">
                {loadingClasses ? "Loading classes..." : "Select class"}
              </option>
              {classes.map((schoolClass) => (
                <option key={getId(schoolClass)} value={getId(schoolClass)}>
                  {getName(schoolClass)}
                </option>
              ))}
            </select>
          </div>

          <div className="exam-field">
            <label htmlFor="exam-section">Section *</label>
            <select
              id="exam-section"
              name="section"
              value={examForm.section}
              onChange={handleExamFormChange}
              disabled={!examForm.school_class || loadingSections}
              required
            >
              <option value="">
                {loadingSections ? "Loading sections..." : "Select section"}
              </option>
              {sections.map((section) => (
                <option key={getId(section)} value={getId(section)}>
                  {getName(section)}
                </option>
              ))}
            </select>
          </div>

          <div className="exam-field">
            <label htmlFor="exam-start-date">Start Date *</label>
            <input
              id="exam-start-date"
              type="date"
              name="start_date"
              value={examForm.start_date}
              onChange={handleExamFormChange}
              required
            />
          </div>

          <div className="exam-field">
            <label htmlFor="exam-end-date">End Date *</label>
            <input
              id="exam-end-date"
              type="date"
              name="end_date"
              value={examForm.end_date}
              min={examForm.start_date || undefined}
              onChange={handleExamFormChange}
              required
            />
          </div>

          <div className="exam-form-actions">
            <button
              type="submit"
              className="exam-btn exam-btn-primary"
              disabled={savingExam}
            >
              {savingExam ? "Creating..." : "Create Exam"}
            </button>
          </div>
        </form>
      </section>

      <section className="exam-card">
        <div className="exam-section-heading">
          <div>
            <h2>Examination List</h2>
            <p>{exams.length} exam(s) found</p>
          </div>
        </div>

        {loading ? (
          <p className="exam-empty-state">Loading exams...</p>
        ) : exams.length === 0 ? (
          <p className="exam-empty-state">
            No exams found. Create your first exam above.
          </p>
        ) : (
          <div className="exam-table-wrapper">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Academic Year</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Timetable</th>
                  <th>Admit Card</th>
                  <th>Results</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.name || "—"}</td>
                    <td>
                      {exam.academic_year_name ||
                        exam.academic_year?.name ||
                        "Name unavailable"}
                    </td>
                    <td>
                      {exam.class_name ||
                        exam.school_class_name ||
                        exam.school_class?.name ||
                        "Name unavailable"}
                    </td>
                    <td>
                      {exam.section_name ||
                        exam.section?.name ||
                        "Name unavailable"}
                    </td>
                    <td>{exam.start_date || "—"}</td>
                    <td>{exam.end_date || "—"}</td>
                    <td>
                      <span
                        className={`exam-status ${
                          exam.is_timetable_published
                            ? "is-published"
                            : "is-pending"
                        }`}
                      >
                        {exam.is_timetable_published
                          ? "Published"
                          : "Pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`exam-status ${
                          exam.is_admit_card_released
                            ? "is-published"
                            : "is-pending"
                        }`}
                      >
                        {exam.is_admit_card_released
                          ? "Released"
                          : "Pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`exam-status ${
                          exam.is_result_published
                            ? "is-published"
                            : "is-pending"
                        }`}
                      >
                        {exam.is_result_published
                          ? "Published"
                          : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="exam-actions">
                        <button
                          type="button"
                          className="exam-btn exam-btn-secondary"
                          onClick={() => handleManageSchedule(exam)}
                        >
                          Manage Schedule
                        </button>

                        <button
                          type="button"
                          className="exam-btn exam-btn-primary"
                          onClick={() => handlePublishTimetable(exam)}
                          disabled={
                            !!exam.is_timetable_published ||
                            publishingTimetableId === exam.id
                          }
                        >
                          {publishingTimetableId === exam.id
                            ? "Publishing..."
                            : exam.is_timetable_published
                              ? "Timetable Published"
                              : "Publish Timetable"}
                        </button>

                        <button
                          type="button"
                          className="exam-btn exam-btn-secondary"
                          onClick={() => handleReleaseAdmitCard(exam)}
                          disabled={
                            !!exam.is_admit_card_released ||
                            releasingAdmitCardId === exam.id
                          }
                        >
                          {releasingAdmitCardId === exam.id
                            ? "Releasing..."
                            : exam.is_admit_card_released
                              ? "Admit Card Released"
                              : "Release Admit Card"}
                        </button>

                        <button
                          type="button"
                          className="exam-btn exam-btn-success"
                          onClick={() => handlePublishResults(exam)}
                          disabled={
                            !!exam.is_result_published ||
                            publishingResultId === exam.id
                          }
                        >
                          {publishingResultId === exam.id
                            ? "Publishing..."
                            : exam.is_result_published
                              ? "Results Published"
                              : "Publish Results"}
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

      {selectedExam && (
        <section className="exam-card exam-schedule-panel">
          <div className="exam-section-heading">
            <div>
              <h2>Manage Exam Schedule</h2>
              <p>
                Exam: <strong>{selectedExam.name}</strong>
              </p>
            </div>

            <button
              type="button"
              className="exam-btn exam-btn-secondary"
              onClick={closeSchedulePanel}
            >
              Close
            </button>
          </div>

          {loadingSchedule ? (
            <p className="exam-empty-state">
              Loading subjects and schedules...
            </p>
          ) : (
            <>
              <form
                onSubmit={handleCreateSchedule}
                className="exam-form-grid"
              >
                <div className="exam-field">
                  <label htmlFor="schedule-subject">Subject *</label>
                  <select
                    id="schedule-subject"
                    name="subject"
                    value={scheduleForm.subject}
                    onChange={handleScheduleFormChange}
                    required
                  >
                    <option value="">Select subject</option>
                    {availableSubjects.map((subject) => (
                      <option key={getId(subject)} value={getId(subject)}>
                        {getName(subject)}
                      </option>
                    ))}
                  </select>

                  {availableSubjects.length === 0 && (
                    <small>
                      No available subjects returned by the API. Check
                      class-subject assignments and the available-subjects
                      endpoint.
                    </small>
                  )}
                </div>

                <div className="exam-field">
                  <label htmlFor="schedule-date">Exam Date *</label>
                  <input
                    id="schedule-date"
                    type="date"
                    name="exam_date"
                    value={scheduleForm.exam_date}
                    min={selectedExam.start_date || undefined}
                    max={selectedExam.end_date || undefined}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </div>

                <div className="exam-field">
                  <label htmlFor="schedule-start-time">Start Time *</label>
                  <input
                    id="schedule-start-time"
                    type="time"
                    name="start_time"
                    value={scheduleForm.start_time}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </div>

                <div className="exam-field">
                  <label htmlFor="schedule-end-time">End Time *</label>
                  <input
                    id="schedule-end-time"
                    type="time"
                    name="end_time"
                    value={scheduleForm.end_time}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </div>

                <div className="exam-field">
                  <label htmlFor="schedule-total-marks">Total Marks *</label>
                  <input
                    id="schedule-total-marks"
                    type="number"
                    name="total_marks"
                    min="1"
                    value={scheduleForm.total_marks}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </div>

                <div className="exam-field">
                  <label htmlFor="schedule-passing-marks">
                    Passing Marks *
                  </label>
                  <input
                    id="schedule-passing-marks"
                    type="number"
                    name="passing_marks"
                    min="0"
                    value={scheduleForm.passing_marks}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </div>

                <div className="exam-form-actions">
                  <button
                    type="submit"
                    className="exam-btn exam-btn-primary"
                    disabled={
                      savingSchedule || availableSubjects.length === 0
                    }
                  >
                    {savingSchedule ? "Saving..." : "Add Schedule"}
                  </button>
                </div>
              </form>

              <h3 className="exam-subheading">
                Added Subjects / Schedules
              </h3>

              {schedules.length === 0 ? (
                <p className="exam-empty-state">
                  No schedules added yet. Add at least one subject schedule
                  before publishing the timetable.
                </p>
              ) : (
                <div className="exam-table-wrapper">
                  <table className="exam-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Total Marks</th>
                        <th>Passing Marks</th>
                      </tr>
                    </thead>

                    <tbody>
                      {schedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td>
                            {schedule.subject_name ||
                              schedule.subject?.name ||
                              schedule.subject?.title ||
                              (schedule.subject
                                ? `Subject ID: ${schedule.subject}`
                                : "—")}
                          </td>
                          <td>{schedule.exam_date || "—"}</td>
                          <td>{schedule.start_time || "—"}</td>
                          <td>{schedule.end_time || "—"}</td>
                          <td>{schedule.total_marks ?? "—"}</td>
                          <td>{schedule.passing_marks ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
