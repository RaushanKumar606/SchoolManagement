// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import accountantService from "../../services/accountantService";
// // import "./SalarySlip.css";

// // function SalarySlip() {
// //   const navigate = useNavigate();

// //   const [salarySlips, setSalarySlips] = useState([]);
// //   const [filter, setFilter] = useState("TEACHER");

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const [showComingSoon, setShowComingSoon] = useState(false);
// //   const [comingSoonType, setComingSoonType] = useState("");

// //   const [selectedSlip, setSelectedSlip] = useState(null);
// //   const [showDetails, setShowDetails] = useState(false);

// //   const [processingId, setProcessingId] = useState(null);

// //   // =====================================================
// //   // LOAD SALARY SLIPS ONLY WHEN PAGE OPENS
// //   // =====================================================

// //   useEffect(() => {
// //     fetchSalarySlips();
// //   }, []);

// //   const fetchSalarySlips = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const response = await accountantService.getSalarySlips();

// //       if (response?.success) {
// //         setSalarySlips(response.data || []);
// //       } else {
// //         setError(
// //           response?.message || "Unable to load salary slips."
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Salary Slip API Error:", err);

// //       setError(
// //         err?.message ||
// //           "Something went wrong while loading salary slips."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =====================================================
// //   // FILTER
// //   // =====================================================

// //   const handleFilterChange = (value) => {
// //     // STAFF + HR = COMING SOON
// //     if (value === "STAFF" || value === "HR") {
// //       setComingSoonType(value);
// //       setShowComingSoon(true);

// //       // Teacher filter ko selected hi rakho
// //       return;
// //     }

// //     // TEACHER
// //     setFilter(value);
// //   };

// //   // =====================================================
// //   // EMPLOYEE ROLE
// //   // =====================================================

// //   const getEmployeeRole = (slip) => {
// //     return String(
// //       slip.employee_role ||
// //         slip.role ||
// //         slip.employee?.role ||
// //         ""
// //     ).toUpperCase();
// //   };

// //   const filteredSlips = salarySlips.filter((slip) => {
// //     return getEmployeeRole(slip) === filter;
// //   });

// //   // =====================================================
// //   // EMPLOYEE NAME
// //   // =====================================================

// //   const getEmployeeName = (slip) => {
// //     return (
// //       slip.employee_name ||
// //       slip.employee_username ||
// //       slip.employee?.username ||
// //       "N/A"
// //     );
// //   };

// //   // =====================================================
// //   // STATUS CLASS
// //   // =====================================================

// //   const getStatusClass = (status) => {
// //     switch (String(status || "").toUpperCase()) {
// //       case "PAID":
// //         return "status-paid";

// //       case "APPROVED":
// //         return "status-approved";

// //       case "DRAFT":
// //         return "status-draft";

// //       default:
// //         return "status-default";
// //     }
// //   };

// //   // =====================================================
// //   // VIEW SALARY SLIP
// //   // =====================================================

// //   const handleView = async (id) => {
// //     try {
// //       setProcessingId(id);

// //       const response =
// //         await accountantService.getSalarySlip(id);

// //       if (response?.success) {
// //         setSelectedSlip(response.data);
// //         setShowDetails(true);
// //       } else {
// //         setError(
// //           response?.message ||
// //             "Unable to load salary slip."
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Salary Slip Detail Error:", err);

// //       setError(
// //         err?.message ||
// //           "Unable to load salary slip details."
// //       );
// //     } finally {
// //       setProcessingId(null);
// //     }
// //   };

// //   // =====================================================
// //   // APPROVE
// //   // =====================================================

// //   const handleApprove = async (id) => {
// //     const confirmed = window.confirm(
// //       "Are you sure you want to approve this salary slip?"
// //     );

// //     if (!confirmed) return;

// //     try {
// //       setProcessingId(id);
// //       setError("");

// //       const response =
// //         await accountantService.approveSalarySlip(id);

// //       if (response?.success) {
// //         await fetchSalarySlips();
// //       } else {
// //         setError(
// //           response?.message ||
// //             "Unable to approve salary slip."
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Approve Salary Error:", err);

// //       setError(
// //         err?.message ||
// //           "Unable to approve salary slip."
// //       );
// //     } finally {
// //       setProcessingId(null);
// //     }
// //   };

// //   // =====================================================
// //   // PAY SALARY
// //   // =====================================================

// //   const handlePaySalary = async (slip) => {
// //     if (slip.status !== "APPROVED") {
// //       setError(
// //         "Only approved salary slips can be paid."
// //       );
// //       return;
// //     }

// //     const confirmed = window.confirm(
// //       `Pay salary of ₹${slip.net_salary || 0} to ${getEmployeeName(
// //         slip
// //       )}?`
// //     );

// //     if (!confirmed) return;

// //     try {
// //       setProcessingId(slip.id);
// //       setError("");

// //       const response =
// //         await accountantService.paySalary(
// //           slip.id,
// //           {
// //             payment_method: "BANK",
// //             remarks: "Salary paid by Accountant",
// //           }
// //         );

// //       if (response?.success) {
// //         await fetchSalarySlips();
// //       } else {
// //         setError(
// //           response?.message ||
// //             "Unable to process salary payment."
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Pay Salary Error:", err);

// //       setError(
// //         err?.message ||
// //           "Unable to process salary payment."
// //       );
// //     } finally {
// //       setProcessingId(null);
// //     }
// //   };

// //   // =====================================================
// //   // MONTH
// //   // =====================================================

// //   const getMonthName = (month) => {
// //     const months = [
// //       "January",
// //       "February",
// //       "March",
// //       "April",
// //       "May",
// //       "June",
// //       "July",
// //       "August",
// //       "September",
// //       "October",
// //       "November",
// //       "December",
// //     ];

// //     const index = Number(month) - 1;

// //     return months[index] || month;
// //   };

// //   // =====================================================
// //   // BACK
// //   // =====================================================

// //   const handleBack = () => {
// //     navigate("/accountant/dashboard");
// //   };

// //   return (
// //     <div className="salary-slip-page">

// //       {/* =================================================
// //           HEADER
// //       ================================================= */}

// //       <header className="salary-slip-header">

// //         <div className="header-left">

// //           <button
// //             className="back-button"
// //             onClick={handleBack}
// //           >
// //             ←
// //           </button>

// //           <div>
// //             <h1>Salary Slips</h1>

// //             <p>
// //               Manage Teacher salary slips
// //             </p>
// //           </div>

// //         </div>

// //         {/* FILTER */}

// //         <div className="salary-filter">

// //           <label>Employee Type</label>

// //           <select
// //             value={filter}
// //             onChange={(e) =>
// //               handleFilterChange(e.target.value)
// //             }
// //           >
// //             <option value="TEACHER">
// //               Teacher
// //             </option>

// //             <option value="STAFF">
// //               Staff
// //             </option>

// //             <option value="HR">
// //               HR
// //             </option>
// //           </select>

// //         </div>

// //       </header>

// //       {/* =================================================
// //           CONTENT
// //       ================================================= */}

// //       <main className="salary-slip-content">

// //         {/* SUMMARY */}

// //         <div className="salary-summary">

// //           <div className="summary-card">

// //             <span>Teacher Slips</span>

// //             <strong>
// //               {loading
// //                 ? "..."
// //                 : filteredSlips.length}
// //             </strong>

// //           </div>

// //           <div className="summary-card">

// //             <span>Draft</span>

// //             <strong>
// //               {loading
// //                 ? "..."
// //                 : filteredSlips.filter(
// //                     (slip) =>
// //                       String(
// //                         slip.status
// //                       ).toUpperCase() === "DRAFT"
// //                   ).length}
// //             </strong>

// //           </div>

// //           <div className="summary-card">

// //             <span>Approved</span>

// //             <strong>
// //               {loading
// //                 ? "..."
// //                 : filteredSlips.filter(
// //                     (slip) =>
// //                       String(
// //                         slip.status
// //                       ).toUpperCase() ===
// //                       "APPROVED"
// //                   ).length}
// //             </strong>

// //           </div>

// //           <div className="summary-card">

// //             <span>Paid</span>

// //             <strong>
// //               {loading
// //                 ? "..."
// //                 : filteredSlips.filter(
// //                     (slip) =>
// //                       String(
// //                         slip.status
// //                       ).toUpperCase() === "PAID"
// //                   ).length}
// //             </strong>

// //           </div>

// //         </div>

// //         {/* ERROR */}

// //         {error && (
// //           <div className="salary-error">

// //             <span>{error}</span>

// //             <button
// //               onClick={() => setError("")}
// //             >
// //               ×
// //             </button>

// //           </div>
// //         )}

// //         {/* LOADING */}

// //         {loading ? (

// //           <div className="salary-loading">

// //             <div className="loader-spinner"></div>

// //             <p>
// //               Loading salary slips...
// //             </p>

// //           </div>

// //         ) : (

// //           <div className="salary-table-card">

// //             <div className="table-header">

// //               <div>

// //                 <h2>
// //                   Teacher Salary Slips
// //                 </h2>

// //                 <p>
// //                   {filteredSlips.length} salary slip
// //                   {filteredSlips.length !== 1
// //                     ? "s"
// //                     : ""}
// //                 </p>

// //               </div>

// //             </div>

// //             <div className="table-wrapper">

// //               <table>

// //                 <thead>

// //                   <tr>
// //                     <th>#</th>
// //                     <th>Employee</th>
// //                     <th>Period</th>
// //                     <th>Basic Salary</th>
// //                     <th>Allowance</th>
// //                     <th>Deduction</th>
// //                     <th>Net Salary</th>
// //                     <th>Status</th>
// //                     <th>Action</th>
// //                   </tr>

// //                 </thead>

// //                 <tbody>

// //                   {filteredSlips.length === 0 ? (

// //                     <tr>

// //                       <td
// //                         colSpan="9"
// //                         className="empty-row"
// //                       >
// //                         No salary slips found.
// //                       </td>

// //                     </tr>

// //                   ) : (

// //                     filteredSlips.map(
// //                       (slip, index) => (

// //                         <tr key={slip.id}>

// //                           <td>
// //                             {index + 1}
// //                           </td>

// //                           <td>

// //                             <div className="employee-cell">

// //                               <div className="employee-avatar">

// //                                 {getEmployeeName(
// //                                   slip
// //                                 )
// //                                   .charAt(0)
// //                                   .toUpperCase()}

// //                               </div>

// //                               <div>

// //                                 <strong>
// //                                   {getEmployeeName(
// //                                     slip
// //                                   )}
// //                                 </strong>

// //                                 <small>
// //                                   {slip.employee_username ||
// //                                     ""}
// //                                 </small>

// //                               </div>

// //                             </div>

// //                           </td>

// //                           <td>

// //                             <strong>
// //                               {getMonthName(
// //                                 slip.month
// //                               )}
// //                             </strong>

// //                             <small>
// //                               {slip.year}
// //                             </small>

// //                           </td>

// //                           <td>
// //                             ₹ {slip.basic_salary || 0}
// //                           </td>

// //                           <td>
// //                             ₹ {slip.total_allowance || 0}
// //                           </td>

// //                           <td>
// //                             ₹ {slip.total_deduction || 0}
// //                           </td>

// //                           <td>

// //                             <strong>
// //                               ₹ {slip.net_salary || 0}
// //                             </strong>

// //                           </td>

// //                           <td>

// //                             <span
// //                               className={`salary-status ${getStatusClass(
// //                                 slip.status
// //                               )}`}
// //                             >
// //                               {slip.status || "N/A"}
// //                             </span>

// //                           </td>

// //                           <td>

// //                             <div className="action-buttons">

// //                               <button
// //                                 className="view-btn"
// //                                 onClick={() =>
// //                                   handleView(
// //                                     slip.id
// //                                   )
// //                                 }
// //                                 disabled={
// //                                   processingId ===
// //                                   slip.id
// //                                 }
// //                               >
// //                                 View
// //                               </button>

// //                               {String(
// //                                 slip.status
// //                               ).toUpperCase() ===
// //                                 "DRAFT" && (

// //                                 <button
// //                                   className="approve-btn"
// //                                   onClick={() =>
// //                                     handleApprove(
// //                                       slip.id
// //                                     )
// //                                   }
// //                                   disabled={
// //                                     processingId ===
// //                                     slip.id
// //                                   }
// //                                 >
// //                                   {processingId ===
// //                                   slip.id
// //                                     ? "..."
// //                                     : "Approve"}
// //                                 </button>

// //                               )}

// //                               {String(
// //                                 slip.status
// //                               ).toUpperCase() ===
// //                                 "APPROVED" && (

// //                                 <button
// //                                   className="pay-btn"
// //                                   onClick={() =>
// //                                     handlePaySalary(
// //                                       slip
// //                                     )
// //                                   }
// //                                   disabled={
// //                                     processingId ===
// //                                     slip.id
// //                                   }
// //                                 >
// //                                   {processingId ===
// //                                   slip.id
// //                                     ? "..."
// //                                     : "Pay"}
// //                                 </button>

// //                               )}

// //                             </div>

// //                           </td>

// //                         </tr>

// //                       )
// //                     )

// //                   )}

// //                 </tbody>

// //               </table>

// //             </div>

// //           </div>

// //         )}

// //       </main>

// //       {/* =================================================
// //           SALARY DETAILS MODAL
// //       ================================================= */}

// //       {showDetails && selectedSlip && (

// //         <div
// //           className="modal-overlay"
// //           onClick={() =>
// //             setShowDetails(false)
// //           }
// //         >

// //           <div
// //             className="salary-details-modal"
// //             onClick={(e) =>
// //               e.stopPropagation()
// //             }
// //           >

// //             <div className="modal-header">

// //               <div>

// //                 <h2>
// //                   Salary Slip Details
// //                 </h2>

// //                 <p>
// //                   {getEmployeeName(
// //                     selectedSlip
// //                   )}
// //                 </p>

// //               </div>

// //               <button
// //                 onClick={() =>
// //                   setShowDetails(false)
// //                 }
// //               >
// //                 ×
// //               </button>

// //             </div>

// //             <div className="salary-details">

// //               <div className="detail-item">
// //                 <span>Employee</span>
// //                 <strong>
// //                   {getEmployeeName(
// //                     selectedSlip
// //                   )}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Month</span>
// //                 <strong>
// //                   {getMonthName(
// //                     selectedSlip.month
// //                   )}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Year</span>
// //                 <strong>
// //                   {selectedSlip.year}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Basic Salary</span>
// //                 <strong>
// //                   ₹ {selectedSlip.basic_salary || 0}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Total Allowance</span>
// //                 <strong>
// //                   ₹{" "}
// //                   {selectedSlip.total_allowance ||
// //                     0}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Total Deduction</span>
// //                 <strong>
// //                   ₹{" "}
// //                   {selectedSlip.total_deduction ||
// //                     0}
// //                 </strong>
// //               </div>

// //               <div className="detail-item net-salary">
// //                 <span>Net Salary</span>
// //                 <strong>
// //                   ₹ {selectedSlip.net_salary || 0}
// //                 </strong>
// //               </div>

// //               <div className="detail-item">
// //                 <span>Status</span>
// //                 <strong>
// //                   {selectedSlip.status || "N/A"}
// //                 </strong>
// //               </div>

// //               {selectedSlip.payment_method && (
// //                 <div className="detail-item">
// //                   <span>Payment Method</span>
// //                   <strong>
// //                     {selectedSlip.payment_method}
// //                   </strong>
// //                 </div>
// //               )}

// //               {selectedSlip.payment_reference && (
// //                 <div className="detail-item">
// //                   <span>Payment Reference</span>
// //                   <strong>
// //                     {selectedSlip.payment_reference}
// //                   </strong>
// //                 </div>
// //               )}

// //             </div>

// //           </div>

// //         </div>

// //       )}

// //       {/* =================================================
// //           COMING SOON MODAL
// //       ================================================= */}

// //       {showComingSoon && (

// //         <div
// //           className="modal-overlay"
// //           onClick={() =>
// //             setShowComingSoon(false)
// //           }
// //         >

// //           <div
// //             className="coming-soon-modal"
// //             onClick={(e) =>
// //               e.stopPropagation()
// //             }
// //           >

// //             <div className="coming-soon-icon">
// //               🚧
// //             </div>

// //             <h2>
// //               Coming Soon
// //             </h2>

// //             <p>
// //               {comingSoonType === "STAFF"
// //                 ? "Staff salary management is currently under development."
// //                 : "HR salary management is currently under development."}
// //             </p>

// //             <button
// //               onClick={() =>
// //                 setShowComingSoon(false)
// //               }
// //             >
// //               Okay
// //             </button>

// //           </div>

// //         </div>

// //       )}

// //     </div>
// //   );
// // }

// // export default SalarySlip;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import accountantService from "../../services/accountantService";
// import "./SalarySlip.css";

// function SalarySlip() {
//   const navigate = useNavigate();

//   const [salarySlips, setSalarySlips] = useState([]);
//   const [filter, setFilter] = useState("TEACHER");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [processingId, setProcessingId] = useState(null);

//   const [selectedSlip, setSelectedSlip] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   // Payment modal
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentSlip, setPaymentSlip] = useState(null);
//   const [bankDetails, setBankDetails] = useState(null);
//   const [bankLoading, setBankLoading] = useState(false);

//   const [paymentMethod, setPaymentMethod] = useState("BANK");
//   const [paymentReference, setPaymentReference] = useState("");
//   const [paymentRemarks, setPaymentRemarks] = useState("");
//   const [paymentError, setPaymentError] = useState("");

//   // =====================================================
//   // LOAD SALARY SLIPS
//   // =====================================================

//   useEffect(() => {
//     fetchSalarySlips();
//   }, []);

//   const fetchSalarySlips = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await accountantService.getSalarySlips();

//       if (response?.success) {
//         setSalarySlips(response.data || []);
//       } else {
//         setError(response?.message || "Unable to load salary slips.");
//       }
//     } catch (err) {
//       console.error("Salary Slip API Error:", err);
//       setError(err?.message || "Something went wrong while loading salary slips.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // EMPLOYEE ROLE
//   // =====================================================

//   const getEmployeeRole = (slip) => {
//     return String(
//       slip.employee_role ||
//       slip.employee_type ||
//       slip.role ||
//       slip.employee?.role ||
//       ""
//     ).toUpperCase();
//   };

//   const filteredSlips = salarySlips.filter(
//     (slip) => getEmployeeRole(slip) === filter
//   );

//   // =====================================================
//   // EMPLOYEE NAME
//   // =====================================================

//   const getEmployeeName = (slip) => {
//     return (
//       slip.employee_name ||
//       slip.employee_username ||
//       slip.employee?.username ||
//       "N/A"
//     );
//   };

//   // =====================================================
//   // MATCH EMPLOYEE BANK DETAILS
//   // =====================================================

//   const findEmployeeBankDetails = (records, slip) => {
//     const employeeId =
//       slip.employee_id ||
//       (typeof slip.employee === "number" ? slip.employee : null) ||
//       slip.employee?.id;

//     const username =
//       slip.employee_username ||
//       slip.employee?.username;

//     return records.find((record) => {
//       const recordEmployeeId =
//         record.employee_id ||
//         (typeof record.employee === "number" ? record.employee : null) ||
//         record.employee?.id ||
//         record.employee;

//       const recordUsername =
//         record.employee_username ||
//         record.employee?.username;

//       if (employeeId && recordEmployeeId) {
//         return String(employeeId) === String(recordEmployeeId);
//       }

//       if (username && recordUsername) {
//         return String(username).toLowerCase() ===
//           String(recordUsername).toLowerCase();
//       }

//       return false;
//     }) || null;
//   };

//   // =====================================================
//   // STATUS CLASS
//   // =====================================================

//   const getStatusClass = (status) => {
//     switch (String(status || "").toUpperCase()) {
//       case "PAID":
//         return "status-paid";
//       case "APPROVED":
//         return "status-approved";
//       case "DRAFT":
//         return "status-draft";
//       default:
//         return "status-default";
//     }
//   };

//   // =====================================================
//   // MONTH
//   // =====================================================

//   const getMonthName = (month) => {
//     const months = [
//       "January", "February", "March", "April",
//       "May", "June", "July", "August",
//       "September", "October", "November", "December",
//     ];

//     return months[Number(month) - 1] || month;
//   };

//   // =====================================================
//   // VIEW SALARY SLIP
//   // =====================================================

//   const handleView = async (id) => {
//     try {
//       setProcessingId(id);
//       setError("");

//       const response = await accountantService.getSalarySlip(id);

//       if (response?.success) {
//         setSelectedSlip(response.data);
//         setShowDetails(true);
//       } else {
//         setError(response?.message || "Unable to load salary slip.");
//       }
//     } catch (err) {
//       console.error("Salary Slip Detail Error:", err);
//       setError(err?.message || "Unable to load salary slip details.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // =====================================================
//   // APPROVE SALARY
//   // =====================================================

//   const handleApprove = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to approve this salary slip?"
//     );

//     if (!confirmed) return;

//     try {
//       setProcessingId(id);
//       setError("");

//       const response = await accountantService.approveSalarySlip(id);

//       if (response?.success) {
//         await fetchSalarySlips();
//       } else {
//         setError(response?.message || "Unable to approve salary slip.");
//       }
//     } catch (err) {
//       console.error("Approve Salary Error:", err);
//       setError(err?.message || "Unable to approve salary slip.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // =====================================================
//   // OPEN PAYMENT MODAL
//   // =====================================================

//   const handleOpenPayment = async (slip) => {
//     if (String(slip.status).toUpperCase() !== "APPROVED") {
//       setError("Only approved salary slips can be paid.");
//       return;
//     }

//     setPaymentSlip(slip);
//     setPaymentMethod("BANK");
//     setPaymentReference("");
//     setPaymentRemarks("");
//     setPaymentError("");
//     setBankDetails(null);
//     setShowPaymentModal(true);

//     try {
//       setBankLoading(true);

//       const response = await accountantService.getBankDetails();

//       if (!response?.success) {
//         throw new Error(
//           response?.message || "Unable to load employee bank details."
//         );
//       }

//       const records = Array.isArray(response.data) ? response.data : [];

//       const matchedRecord = findEmployeeBankDetails(records, slip);

//       setBankDetails(matchedRecord);
//     } catch (err) {
//       console.error("Employee Bank Details Error:", err);
//       setPaymentError(
//         err?.message || "Unable to load employee bank details."
//       );
//     } finally {
//       setBankLoading(false);
//     }
//   };

//   // =====================================================
//   // PAYMENT METHOD CHANGE
//   // =====================================================

//   const handlePaymentMethodChange = (value) => {
//     setPaymentMethod(value);
//     setPaymentReference("");
//     setPaymentError("");
//   };

//   // =====================================================
//   // SUBMIT SALARY PAYMENT
//   // =====================================================

//   // const handleSubmitPayment = async (e) => {
//   //   e.preventDefault();

//   //   if (!paymentSlip) return;

//   //   const method = paymentMethod.toUpperCase();
//   //   const reference = paymentReference.trim();

//   //   if (["BANK", "UPI"].includes(method)) {
//   //     if (!bankDetails) {
//   //       setPaymentError(
//   //         "Employee bank details are not available. Please add bank details first."
//   //       );
//   //       return;
//   //     }

//   //     if (!bankDetails.is_verified) {
//   //       setPaymentError(
//   //         "Employee bank details are not verified. School Admin must verify them before payment."
//   //       );
//   //       return;
//   //     }
//   //   }

//   //   if (method === "UPI" && !bankDetails?.upi_id) {
//   //     setPaymentError("Employee UPI ID is not available.");
//   //     return;
//   //   }

//   //   if (["BANK", "UPI", "CHEQUE"].includes(method) && !reference) {
//   //     setPaymentError(
//   //       method === "CHEQUE"
//   //         ? "Please enter the cheque number."
//   //         : "Please enter the transaction reference number."
//   //     );
//   //     return;
//   //   }

//   //   try {
//   //     setProcessingId(paymentSlip.id);
//   //     setPaymentError("");

//   //     const response = await accountantService.paySalary(
//   //       paymentSlip.id,
//   //       {
//   //         payment_method: method,
//   //         payment_reference: reference || null,
//   //         remarks: paymentRemarks.trim() || "Salary paid by Accountant",
//   //       }
//   //     );

//   //     if (response?.success) {
//   //       setShowPaymentModal(false);
//   //       setPaymentSlip(null);
//   //       setBankDetails(null);
//   //       await fetchSalarySlips();
//   //     } else {
//   //       setPaymentError(
//   //         response?.message || "Unable to process salary payment."
//   //       );
//   //     }
//   //   } catch (err) {
//   //     console.error("Pay Salary Error:", err);

//   //     setPaymentError(
//   //       err?.message || "Unable to process salary payment."
//   //     );
//   //   } finally {
//   //     setProcessingId(null);
//   //   }
//   // };

// const handleSubmitPayment = async (e) => {
//   e.preventDefault();

//   if (!paymentSlip) return;

//   const method = paymentMethod.toUpperCase();
//   const reference = paymentReference.trim();

//   setPaymentError("");

//   // BANK VALIDATION
//   if (method === "BANK") {
//     if (!bankDetails) {
//       setPaymentError("Employee bank details are not available.");
//       return;
//     }

//     if (!bankDetails.is_verified) {
//       setPaymentError("Employee bank details are not verified.");
//       return;
//     }

//     if (
//       !bankDetails.account_holder_name ||
//       !bankDetails.account_number ||
//       !bankDetails.ifsc_code ||
//       !bankDetails.bank_name
//     ) {
//       setPaymentError("Complete employee bank details are required.");
//       return;
//     }
//   }

//   // UPI VALIDATION
//   if (method === "UPI") {
//     if (!bankDetails) {
//       setPaymentError("Employee payment details are not available.");
//       return;
//     }

//     if (!bankDetails.is_verified) {
//       setPaymentError("Employee payment details are not verified.");
//       return;
//     }

//     if (!bankDetails.upi_id) {
//       setPaymentError("Employee UPI ID is not available.");
//       return;
//     }
//   }

//   // CHEQUE VALIDATION
//   if (method === "CHEQUE" && !reference) {
//     setPaymentError("Please enter the cheque number.");
//     return;
//   }

//   // TRANSACTION REFERENCE VALIDATION
//   if (["BANK", "UPI"].includes(method) && !reference) {
//     setPaymentError("Please enter the transaction reference number.");
//     return;
//   }

//   try {
//     setProcessingId(paymentSlip.id);

//     const response = await accountantService.paySalary(
//       paymentSlip.id,
//       {
//         payment_method: method,
//         payment_reference: reference || null,
//         remarks:
//           paymentRemarks.trim() || "Salary paid by Accountant",
//       }
//     );

//     if (response?.success) {
//       setShowPaymentModal(false);
//       setPaymentSlip(null);
//       setBankDetails(null);
//       setPaymentReference("");
//       setPaymentRemarks("");

//       await fetchSalarySlips();
//     } else {
//       setPaymentError(
//         response?.message || "Unable to process salary payment."
//       );
//     }
//   } catch (err) {
//     console.error("Pay Salary Error:", err);

//     setPaymentError(
//       err?.message || "Unable to process salary payment."
//     );
//   } finally {
//     setProcessingId(null);
//   }
// };


//   // =====================================================
//   // BACK
//   // =====================================================

//   const handleBack = () => {
//     navigate("/accountant/dashboard");
//   };

//   // =====================================================
//   // SUMMARY COUNTS
//   // =====================================================

//   const draftCount = filteredSlips.filter(
//     (slip) => String(slip.status).toUpperCase() === "DRAFT"
//   ).length;

//   const approvedCount = filteredSlips.filter(
//     (slip) => String(slip.status).toUpperCase() === "APPROVED"
//   ).length;

//   const paidCount = filteredSlips.filter(
//     (slip) => String(slip.status).toUpperCase() === "PAID"
//   ).length;

//   const employeeTypeLabel = {
//     TEACHER: "Teacher",
//     STAFF: "Staff",
//     HR: "HR",
//   };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="salary-slip-page">

//       <header className="salary-slip-header">
//         <div className="header-left">
//           <button className="back-button" onClick={handleBack}>
//             ←
//           </button>

//           <div>
//             <h1>Salary Slips</h1>
//             <p>Manage employee salary slips</p>
//           </div>
//         </div>

//         <div className="salary-filter">
//           <label>Employee Type</label>

//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="TEACHER">Teacher</option>
//             <option value="STAFF">Staff</option>
//             <option value="HR">HR</option>
//           </select>
//         </div>
//       </header>

//       <main className="salary-slip-content">

//         <div className="salary-summary">
//           <div className="summary-card">
//             <span>{employeeTypeLabel[filter]} Slips</span>
//             <strong>{loading ? "..." : filteredSlips.length}</strong>
//           </div>

//           <div className="summary-card">
//             <span>Draft</span>
//             <strong>{loading ? "..." : draftCount}</strong>
//           </div>

//           <div className="summary-card">
//             <span>Approved</span>
//             <strong>{loading ? "..." : approvedCount}</strong>
//           </div>

//           <div className="summary-card">
//             <span>Paid</span>
//             <strong>{loading ? "..." : paidCount}</strong>
//           </div>
//         </div>

//         {error && (
//           <div className="salary-error">
//             <span>{error}</span>
//             <button onClick={() => setError("")}>×</button>
//           </div>
//         )}

//         {loading ? (
//           <div className="salary-loading">
//             <div className="loader-spinner"></div>
//             <p>Loading salary slips...</p>
//           </div>
//         ) : (
//           <div className="salary-table-card">
//             <div className="table-header">
//               <div>
//                 <h2>{employeeTypeLabel[filter]} Salary Slips</h2>
//                 <p>
//                   {filteredSlips.length} salary slip
//                   {filteredSlips.length !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Employee</th>
//                     <th>Period</th>
//                     <th>Basic Salary</th>
//                     <th>Allowance</th>
//                     <th>Deduction</th>
//                     <th>Net Salary</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredSlips.length === 0 ? (
//                     <tr>
//                       <td colSpan="9" className="empty-row">
//                         No salary slips found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredSlips.map((slip, index) => (
//                       <tr key={slip.id}>
//                         <td>{index + 1}</td>

//                         <td>
//                           <div className="employee-cell">
//                             <div className="employee-avatar">
//                               {getEmployeeName(slip).charAt(0).toUpperCase()}
//                             </div>

//                             <div>
//                               <strong>{getEmployeeName(slip)}</strong>
//                               <small>{slip.employee_username || ""}</small>
//                             </div>
//                           </div>
//                         </td>

//                         <td>
//                           <strong>{getMonthName(slip.month)}</strong>
//                           <small>{slip.year}</small>
//                         </td>

//                         <td>₹ {slip.basic_salary || 0}</td>
//                         <td>₹ {slip.total_allowance || 0}</td>
//                         <td>₹ {slip.total_deduction || 0}</td>

//                         <td>
//                           <strong>₹ {slip.net_salary || 0}</strong>
//                         </td>

//                         <td>
//                           <span
//                             className={`salary-status ${getStatusClass(slip.status)}`}
//                           >
//                             {slip.status || "N/A"}
//                           </span>
//                         </td>

//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               className="view-btn"
//                               onClick={() => handleView(slip.id)}
//                               disabled={processingId === slip.id}
//                             >
//                               View
//                             </button>

//                             {String(slip.status).toUpperCase() === "DRAFT" && (
//                               <button
//                                 className="approve-btn"
//                                 onClick={() => handleApprove(slip.id)}
//                                 disabled={processingId === slip.id}
//                               >
//                                 {processingId === slip.id ? "..." : "Approve"}
//                               </button>
//                             )}

//                             {String(slip.status).toUpperCase() === "APPROVED" && (
//                               <button
//                                 className="pay-btn"
//                                 onClick={() => handleOpenPayment(slip)}
//                                 disabled={processingId === slip.id}
//                               >
//                                 Pay
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* =====================================================
//           PAYMENT MODAL
//       ===================================================== */}

//       {showPaymentModal && paymentSlip && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowPaymentModal(false)}
//         >
//           <div
//             className="salary-details-modal salary-payment-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header">
//               <div>
//                 <h2>Pay Employee Salary</h2>
//                 <p>{getEmployeeName(paymentSlip)}</p>
//               </div>

//               <button onClick={() => setShowPaymentModal(false)}>
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmitPayment}>
//               <div className="payment-amount-box">
//                 <span>Net Salary</span>
//                 <strong>₹ {paymentSlip.net_salary || 0}</strong>
//               </div>

//               <div className="payment-form-group">
//                 <label>Payment Method *</label>

//                 <select
//                   value={paymentMethod}
//                   onChange={(e) => handlePaymentMethodChange(e.target.value)}
//                   required
//                 >
//                   <option value="BANK">Bank Transfer</option>
//                   <option value="UPI">UPI</option>
//                   <option value="CASH">Cash</option>
//                   <option value="CHEQUE">Cheque</option>
//                 </select>
//               </div>

//               {bankLoading ? (
//                 <p>Loading employee bank details...</p>
//               ) : (
//                 <>
//                   {["BANK", "UPI"].includes(paymentMethod) && (
//                     <div className="employee-bank-info">
//                       <h3>Employee Bank Details</h3>

//                       {!bankDetails ? (
//                         <p className="bank-warning">
//                           Bank details not found for this employee.
//                         </p>
//                       ) : (
//                         <>
//                           <p>
//                             <strong>Account Holder:</strong>{" "}
//                             {bankDetails.account_holder_name || "N/A"}
//                           </p>

//                           <p>
//                             <strong>Bank:</strong>{" "}
//                             {bankDetails.bank_name || "N/A"}
//                           </p>

//                           <p>
//                             <strong>Account Number:</strong>{" "}
//                             {bankDetails.account_number || "N/A"}
//                           </p>

//                           <p>
//                             <strong>IFSC:</strong>{" "}
//                             {bankDetails.ifsc_code || "N/A"}
//                           </p>

//                           {bankDetails.upi_id && (
//                             <p>
//                               <strong>UPI ID:</strong> {bankDetails.upi_id}
//                             </p>
//                           )}

//                           <p>
//                             <strong>Verification:</strong>{" "}
//                             <span
//                               className={
//                                 bankDetails.is_verified
//                                   ? "bank-verified"
//                                   : "bank-unverified"
//                               }
//                             >
//                               {bankDetails.is_verified
//                                 ? "Verified"
//                                 : "Not Verified"}
//                             </span>
//                           </p>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}

// {paymentMethod === "BANK" && (
//   <div className="employee-bank-info">
//     <h3>Employee Bank Details</h3>

//     <div className="payment-form-group">
//       <label>Account Holder Name *</label>
//       <input
//         value={bankDetails?.account_holder_name || ""}
//         readOnly
//       />
//     </div>

//     <div className="payment-form-group">
//       <label>Bank Name *</label>
//       <input
//         value={bankDetails?.bank_name || ""}
//         readOnly
//       />
//     </div>

//     <div className="payment-form-group">
//       <label>Account Number *</label>
//       <input
//         value={bankDetails?.account_number || ""}
//         readOnly
//       />
//     </div>

//     <div className="payment-form-group">
//       <label>IFSC Code *</label>
//       <input
//         value={bankDetails?.ifsc_code || ""}
//         readOnly
//       />
//     </div>
//   </div>
// )}

// {paymentMethod === "UPI" && (
//   <div className="employee-bank-info">
//     <h3>Employee UPI Details</h3>

//     <div className="payment-form-group">
//       <label>Employee UPI ID *</label>
//       <input
//         value={bankDetails?.upi_id || ""}
//         readOnly
//         placeholder="UPI ID not available"
//       />
//     </div>

//     <p>
//       Example: employee@okaxis, employee@ybl,
//       employee@paytm
//     </p>
//   </div>
// )}

// {paymentMethod === "CASH" && (
//   <div className="employee-bank-info">
//     <h3>Cash Payment</h3>
//     <p>No bank or UPI details required.</p>
//   </div>
// )}

// {paymentMethod === "CHEQUE" && (
//   <div className="payment-form-group">
//     <label>Cheque Number *</label>
//     <input
//       value={paymentReference}
//       onChange={(e) => setPaymentReference(e.target.value)}
//       placeholder="Enter cheque number"
//       required
//     />
//   </div>
// )}

//               <div className="payment-form-group">
//                 <label>Remarks</label>

//                 <textarea
//                   value={paymentRemarks}
//                   onChange={(e) => setPaymentRemarks(e.target.value)}
//                   placeholder="Enter payment remarks (optional)"
//                   rows="3"
//                 />
//               </div>

//               {paymentError && (
//                 <div className="salary-error">
//                   {paymentError}
//                 </div>
//               )}

//               <div className="payment-modal-actions">
//                 <button
//                   type="button"
//                   className="view-btn"
//                   onClick={() => setShowPaymentModal(false)}
//                   disabled={processingId === paymentSlip.id}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="pay-btn"
//                   disabled={
//                     processingId === paymentSlip.id ||
//                     bankLoading
//                   }
//                 >
//                   {processingId === paymentSlip.id
//                     ? "Processing..."
//                     : "Confirm Payment"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           SALARY DETAILS MODAL
//       ===================================================== */}

//       {showDetails && selectedSlip && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowDetails(false)}
//         >
//           <div
//             className="salary-details-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header">
//               <div>
//                 <h2>Salary Slip Details</h2>
//                 <p>{getEmployeeName(selectedSlip)}</p>
//               </div>

//               <button onClick={() => setShowDetails(false)}>×</button>
//             </div>

//             <div className="salary-details">
//               <div className="detail-item">
//                 <span>Employee</span>
//                 <strong>{getEmployeeName(selectedSlip)}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Month</span>
//                 <strong>{getMonthName(selectedSlip.month)}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Year</span>
//                 <strong>{selectedSlip.year}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Basic Salary</span>
//                 <strong>₹ {selectedSlip.basic_salary || 0}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Total Allowance</span>
//                 <strong>₹ {selectedSlip.total_allowance || 0}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Total Deduction</span>
//                 <strong>₹ {selectedSlip.total_deduction || 0}</strong>
//               </div>

//               <div className="detail-item net-salary">
//                 <span>Net Salary</span>
//                 <strong>₹ {selectedSlip.net_salary || 0}</strong>
//               </div>

//               <div className="detail-item">
//                 <span>Status</span>
//                 <strong>{selectedSlip.status || "N/A"}</strong>
//               </div>

//               {selectedSlip.payment_method && (
//                 <div className="detail-item">
//                   <span>Payment Method</span>
//                   <strong>{selectedSlip.payment_method}</strong>
//                 </div>
//               )}

//               {selectedSlip.payment_reference && (
//                 <div className="detail-item">
//                   <span>Payment Reference</span>
//                   <strong>{selectedSlip.payment_reference}</strong>
//                 </div>
//               )}

//               {selectedSlip.paid_at && (
//                 <div className="detail-item">
//                   <span>Paid At</span>
//                   <strong>
//                     {new Date(selectedSlip.paid_at).toLocaleString()}
//                   </strong>
//                 </div>
//               )}

//               {selectedSlip.remarks && (
//                 <div className="detail-item">
//                   <span>Remarks</span>
//                   <strong>{selectedSlip.remarks}</strong>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SalarySlip;




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
import "./SalarySlip.css";

function SalarySlip() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [salarySlips, setSalarySlips] = useState([]);
  const [filter, setFilter] = useState("TEACHER");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);

  const [bankDetails, setBankDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // =====================================================
  // LOAD SALARY SLIPS
  // =====================================================

  useEffect(() => {
    fetchSalarySlips();
  }, []);

  const fetchSalarySlips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await accountantService.getSalarySlips();

      if (response?.success) {
        setSalarySlips(response.data || []);
      } else {
        setError(response?.message || "Unable to load salary slips.");
      }
    } catch (err) {
      console.error("Salary Slip API Error:", err);

      setError(
        err?.message || "Something went wrong while loading salary slips."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EMPLOYEE ROLE
  // =====================================================

  const getEmployeeRole = (slip) => {
    return String(
      slip.employee_role ||
      slip.employee_type ||
      slip.role ||
      slip.employee?.role ||
      ""
    ).toUpperCase();
  };

  const filteredSlips = salarySlips.filter(
    (slip) => getEmployeeRole(slip) === filter
  );

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = (slip) => {
    return (
      slip.employee_name ||
      slip.employee_username ||
      slip.employee?.username ||
      "N/A"
    );
  };

  // =====================================================
  // MATCH EMPLOYEE BANK DETAILS
  // =====================================================

  const findEmployeeBankDetails = (records, slip) => {
    const employeeId =
      slip.employee_id ||
      (typeof slip.employee === "number" ? slip.employee : null) ||
      slip.employee?.id;

    const username =
      slip.employee_username ||
      slip.employee?.username;

    return records.find((record) => {
      const recordEmployeeId =
        record.employee_id ||
        (typeof record.employee === "number" ? record.employee : null) ||
        record.employee?.id ||
        null;

      const recordUsername =
        record.employee_username ||
        record.employee?.username ||
        null;

      if (employeeId && recordEmployeeId) {
        return String(employeeId) === String(recordEmployeeId);
      }

      if (username && recordUsername) {
        return (
          String(username).toLowerCase() ===
          String(recordUsername).toLowerCase()
        );
      }

      return false;
    }) || null;
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "PAID":
        return "status-paid";

      case "APPROVED":
        return "status-approved";

      case "DRAFT":
        return "status-draft";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // MONTH
  // =====================================================

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[Number(month) - 1] || month;
  };

  // =====================================================
  // VIEW SALARY SLIP
  // =====================================================

  const handleView = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      const response = await accountantService.getSalarySlip(id);

      if (response?.success) {
        setSelectedSlip(response.data);
        setShowDetails(true);
      } else {
        setError(response?.message || "Unable to load salary slip.");
      }
    } catch (err) {
      console.error("Salary Slip Detail Error:", err);

      setError(err?.message || "Unable to load salary slip details.");
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE SALARY
  // =====================================================

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this salary slip?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      const response = await accountantService.approveSalarySlip(id);

      if (response?.success) {
        await fetchSalarySlips();
      } else {
        setError(response?.message || "Unable to approve salary slip.");
      }
    } catch (err) {
      console.error("Approve Salary Error:", err);

      setError(err?.message || "Unable to approve salary slip.");
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // OPEN PAYMENT MODAL
  // =====================================================

  const handleOpenPayment = async (slip) => {
    if (String(slip.status).toUpperCase() !== "APPROVED") {
      setError("Only approved salary slips can be paid.");
      return;
    }

    setPaymentSlip(slip);
    setPaymentMethod("BANK");
    setPaymentReference("");
    setPaymentRemarks("");
    setPaymentError("");
    setBankDetails(null);
    setShowPaymentModal(true);

    try {
      setBankLoading(true);

      const response = await accountantService.getBankDetails();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load employee bank details."
        );
      }

      const records = Array.isArray(response.data)
        ? response.data
        : [];

      const matchedRecord = findEmployeeBankDetails(records, slip);

      setBankDetails(matchedRecord);
    } catch (err) {
      console.error("Employee Bank Details Error:", err);

      setPaymentError(
        err?.message || "Unable to load employee bank details."
      );
    } finally {
      setBankLoading(false);
    }
  };

  // =====================================================
  // CLOSE PAYMENT MODAL
  // =====================================================

  const handleClosePayment = () => {
    if (processingId) return;

    setShowPaymentModal(false);
    setPaymentSlip(null);
    setBankDetails(null);
    setPaymentReference("");
    setPaymentRemarks("");
    setPaymentError("");
  };

  // =====================================================
  // PAYMENT METHOD CHANGE
  // =====================================================

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    setPaymentReference("");
    setPaymentError("");
  };

  // =====================================================
  // SUBMIT SALARY PAYMENT
  // =====================================================

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!paymentSlip) return;

    const method = paymentMethod.toUpperCase();
    const reference = paymentReference.trim();

    setPaymentError("");

    // BANK VALIDATION
    if (method === "BANK") {
      if (!bankDetails) {
        setPaymentError("Employee bank details are not available.");
        return;
      }

      if (!bankDetails.is_verified) {
        setPaymentError("Employee bank details are not verified.");
        return;
      }

      if (
        !bankDetails.account_holder_name ||
        !bankDetails.account_number ||
        !bankDetails.ifsc_code ||
        !bankDetails.bank_name
      ) {
        setPaymentError("Complete employee bank details are required.");
        return;
      }
    }

    // UPI VALIDATION
    if (method === "UPI") {
      if (!bankDetails) {
        setPaymentError("Employee payment details are not available.");
        return;
      }

      if (!bankDetails.is_verified) {
        setPaymentError("Employee payment details are not verified.");
        return;
      }

      if (!bankDetails.upi_id) {
        setPaymentError("Employee UPI ID is not available.");
        return;
      }
    }

    // CHEQUE VALIDATION
    if (method === "CHEQUE" && !reference) {
      setPaymentError("Please enter the cheque number.");
      return;
    }

    // BANK / UPI REFERENCE VALIDATION
    if (["BANK", "UPI"].includes(method) && !reference) {
      setPaymentError("Please enter the transaction reference number.");
      return;
    }

    try {
      setProcessingId(paymentSlip.id);

      const response = await accountantService.paySalary(
        paymentSlip.id,
        {
          payment_method: method,
          payment_reference: reference || null,
          remarks:
            paymentRemarks.trim() || "Salary paid by Accountant",
        }
      );

      if (response?.success) {
        setShowPaymentModal(false);
        setPaymentSlip(null);
        setBankDetails(null);
        setPaymentReference("");
        setPaymentRemarks("");
        setPaymentError("");

        await fetchSalarySlips();
      } else {
        setPaymentError(
          response?.message || "Unable to process salary payment."
        );
      }
    } catch (err) {
      console.error("Pay Salary Error:", err);

      setPaymentError(
        err?.message || "Unable to process salary payment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const draftCount = filteredSlips.filter(
    (slip) => String(slip.status).toUpperCase() === "DRAFT"
  ).length;

  const approvedCount = filteredSlips.filter(
    (slip) => String(slip.status).toUpperCase() === "APPROVED"
  ).length;

  const paidCount = filteredSlips.filter(
    (slip) => String(slip.status).toUpperCase() === "PAID"
  ).length;

  const employeeTypeLabel = {
    TEACHER: "Teacher",
    STAFF: "Staff",
    HR: "HR",
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="salary-slip-page">

      {/* HEADER */}

      <header className="salary-slip-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            ←
          </button>

          <div>
            <h1>Salary Slips</h1>
            <p>Manage employee salary slips</p>
          </div>
        </div>

        <div className="salary-filter">
          <label>Employee Type</label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="TEACHER">Teacher</option>
            <option value="STAFF">Staff</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </header>

      {/* CONTENT */}

      <main className="salary-slip-content">

        {/* SUMMARY */}

        <div className="salary-summary">
          <div className="summary-card">
            <span>{employeeTypeLabel[filter]} Slips</span>
            <strong>{loading ? "..." : filteredSlips.length}</strong>
          </div>

          <div className="summary-card">
            <span>Draft</span>
            <strong>{loading ? "..." : draftCount}</strong>
          </div>

          <div className="summary-card">
            <span>Approved</span>
            <strong>{loading ? "..." : approvedCount}</strong>
          </div>

          <div className="summary-card">
            <span>Paid</span>
            <strong>{loading ? "..." : paidCount}</strong>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="salary-error">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="salary-loading">
            <div className="loader-spinner"></div>
            <p>Loading salary slips...</p>
          </div>
        ) : (
          <div className="salary-table-card">

            <div className="table-header">
              <div>
                <h2>{employeeTypeLabel[filter]} Salary Slips</h2>

                <p>
                  {filteredSlips.length} salary slip
                  {filteredSlips.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Period</th>
                    <th>Basic Salary</th>
                    <th>Allowance</th>
                    <th>Deduction</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSlips.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-row">
                        No salary slips found.
                      </td>
                    </tr>
                  ) : (
                    filteredSlips.map((slip, index) => (
                      <tr key={slip.id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {getEmployeeName(slip).charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <strong>{getEmployeeName(slip)}</strong>
                              <small>{slip.employee_username || ""}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong>{getMonthName(slip.month)}</strong>
                          <small>{slip.year}</small>
                        </td>

                        <td>₹ {slip.basic_salary || 0}</td>
                        <td>₹ {slip.total_allowance || 0}</td>
                        <td>₹ {slip.total_deduction || 0}</td>

                        <td>
                          <strong>₹ {slip.net_salary || 0}</strong>
                        </td>

                        <td>
                          <span
                            className={`salary-status ${getStatusClass(slip.status)}`}
                          >
                            {slip.status || "N/A"}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => handleView(slip.id)}
                              disabled={processingId === slip.id}
                            >
                              View
                            </button>

                            {String(slip.status).toUpperCase() === "DRAFT" && (
                              <button
                                className="approve-btn"
                                onClick={() => handleApprove(slip.id)}
                                disabled={processingId === slip.id}
                              >
                                {processingId === slip.id ? "..." : "Approve"}
                              </button>
                            )}

                            {String(slip.status).toUpperCase() === "APPROVED" && (
                              <button
                                className="pay-btn"
                                onClick={() => handleOpenPayment(slip)}
                                disabled={processingId === slip.id}
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal && paymentSlip && (
        <div
          className="modal-overlay"
          onClick={handleClosePayment}
        >
          <div
            className="salary-details-modal salary-payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Pay Employee Salary</h2>
                <p>{getEmployeeName(paymentSlip)}</p>
              </div>

              <button
                type="button"
                onClick={handleClosePayment}
                disabled={processingId === paymentSlip.id}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitPayment}>

              {/* AMOUNT */}

              <div className="payment-amount-box">
                <span>Net Salary</span>
                <strong>₹ {paymentSlip.net_salary || 0}</strong>
              </div>

              {/* PAYMENT METHOD */}

              <div className="payment-form-group">
                <label>Payment Method *</label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    handlePaymentMethodChange(e.target.value)
                  }
                  required
                >
                  <option value="BANK">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>

              {/* BANK / UPI / CASH / CHEQUE DETAILS */}

              {bankLoading ? (
                <p>Loading employee payment details...</p>
              ) : (
                <>
                  {/* BANK DETAILS */}

                  {paymentMethod === "BANK" && (
                    <div className="employee-bank-info">
                      <h3>Employee Bank Details</h3>

                      {!bankDetails ? (
                        <p className="bank-warning">
                          Employee bank details not found.
                        </p>
                      ) : (
                        <>
                          <div className="payment-form-group">
                            <label>Account Holder Name</label>
                            <input
                              value={bankDetails.account_holder_name || ""}
                              readOnly
                            />
                          </div>

                          <div className="payment-form-group">
                            <label>Bank Name</label>
                            <input
                              value={bankDetails.bank_name || ""}
                              readOnly
                            />
                          </div>

                          <div className="payment-form-group">
                            <label>Account Number</label>
                            <input
                              value={bankDetails.account_number || ""}
                              readOnly
                            />
                          </div>

                          <div className="payment-form-group">
                            <label>IFSC Code</label>
                            <input
                              value={bankDetails.ifsc_code || ""}
                              readOnly
                            />
                          </div>

                          <p>
                            Verification:{" "}
                            <strong
                              className={
                                bankDetails.is_verified
                                  ? "bank-verified"
                                  : "bank-unverified"
                              }
                            >
                              {bankDetails.is_verified
                                ? "Verified"
                                : "Not Verified"}
                            </strong>
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* UPI DETAILS */}

                  {paymentMethod === "UPI" && (
                    <div className="employee-bank-info">
                      <h3>Employee UPI Details</h3>

                      {!bankDetails?.upi_id ? (
                        <p className="bank-warning">
                          Employee UPI ID not found.
                        </p>
                      ) : (
                        <div className="payment-form-group">
                          <label>Employee UPI ID</label>
                          <input
                            value={bankDetails.upi_id}
                            readOnly
                          />
                        </div>
                      )}

                      {bankDetails && (
                        <p>
                          Verification:{" "}
                          <strong
                            className={
                              bankDetails.is_verified
                                ? "bank-verified"
                                : "bank-unverified"
                            }
                          >
                            {bankDetails.is_verified
                              ? "Verified"
                              : "Not Verified"}
                          </strong>
                        </p>
                      )}
                    </div>
                  )}

                  {/* CASH DETAILS */}

                  {paymentMethod === "CASH" && (
                    <div className="employee-bank-info">
                      <h3>Cash Payment</h3>
                      <p>No bank or UPI details required.</p>
                    </div>
                  )}

                  {/* CHEQUE DETAILS */}

                  {paymentMethod === "CHEQUE" && (
                    <div className="payment-form-group">
                      <label>Cheque Number *</label>

                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) =>
                          setPaymentReference(e.target.value)
                        }
                        placeholder="Enter cheque number"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* BANK / UPI TRANSACTION REFERENCE */}

              {["BANK", "UPI"].includes(paymentMethod) && (
                <div className="payment-form-group">
                  <label>
                    {paymentMethod === "UPI"
                      ? "UPI Transaction ID / UTR Number *"
                      : "Bank Transaction UTR Number *"}
                  </label>

                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) =>
                      setPaymentReference(e.target.value)
                    }
                    placeholder="Enter transaction reference number"
                    required
                  />
                </div>
              )}

              {/* REMARKS */}

              <div className="payment-form-group">
                <label>Remarks</label>

                <textarea
                  value={paymentRemarks}
                  onChange={(e) =>
                    setPaymentRemarks(e.target.value)
                  }
                  placeholder="Enter payment remarks (optional)"
                  rows="3"
                />
              </div>

              {/* PAYMENT ERROR */}

              {paymentError && (
                <div className="salary-error">
                  {paymentError}
                </div>
              )}

              {/* BUTTONS */}

              <div className="payment-modal-actions">
                <button
                  type="button"
                  className="view-btn"
                  onClick={handleClosePayment}
                  disabled={processingId === paymentSlip.id}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="pay-btn"
                  disabled={
                    processingId === paymentSlip.id ||
                    bankLoading
                  }
                >
                  {processingId === paymentSlip.id
                    ? "Processing..."
                    : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          SALARY DETAILS MODAL
      ===================================================== */}

      {showDetails && selectedSlip && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="salary-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Salary Slip Details</h2>
                <p>{getEmployeeName(selectedSlip)}</p>
              </div>

              <button onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>

            <div className="salary-details">
              <div className="detail-item">
                <span>Employee</span>
                <strong>{getEmployeeName(selectedSlip)}</strong>
              </div>

              <div className="detail-item">
                <span>Month</span>
                <strong>{getMonthName(selectedSlip.month)}</strong>
              </div>

              <div className="detail-item">
                <span>Year</span>
                <strong>{selectedSlip.year}</strong>
              </div>

              <div className="detail-item">
                <span>Basic Salary</span>
                <strong>₹ {selectedSlip.basic_salary || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Total Allowance</span>
                <strong>₹ {selectedSlip.total_allowance || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Total Deduction</span>
                <strong>₹ {selectedSlip.total_deduction || 0}</strong>
              </div>

              <div className="detail-item net-salary">
                <span>Net Salary</span>
                <strong>₹ {selectedSlip.net_salary || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>{selectedSlip.status || "N/A"}</strong>
              </div>

              {selectedSlip.payment_method && (
                <div className="detail-item">
                  <span>Payment Method</span>
                  <strong>{selectedSlip.payment_method}</strong>
                </div>
              )}

              {selectedSlip.payment_reference && (
                <div className="detail-item">
                  <span>Payment Reference</span>
                  <strong>{selectedSlip.payment_reference}</strong>
                </div>
              )}

              {selectedSlip.paid_at && (
                <div className="detail-item">
                  <span>Paid At</span>
                  <strong>
                    {new Date(selectedSlip.paid_at).toLocaleString()}
                  </strong>
                </div>
              )}

              {selectedSlip.remarks && (
                <div className="detail-item">
                  <span>Remarks</span>
                  <strong>{selectedSlip.remarks}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalarySlip;
