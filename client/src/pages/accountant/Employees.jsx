// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import accountantService from "../../services/accountantService";
// import "./Employees.css";

// function Employees() {
//   const navigate = useNavigate();

//   // =====================================================
//   // STATE
//   // =====================================================

//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState("TEACHER");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showComingSoon, setShowComingSoon] = useState(false);
//   const [comingSoonType, setComingSoonType] = useState("");

//   // =====================================================
//   // LOAD EMPLOYEES
//   // API CALL ONLY WHEN EMPLOYEES PAGE OPENS
//   // =====================================================

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response =
//         await accountantService.getPayrollEmployees();

//       if (response?.success) {
//         setEmployees(response.data || []);
//       } else {
//         setError(
//           response?.message ||
//             "Unable to load employees."
//         );
//       }
//     } catch (err) {
//       console.error(
//         "Employees API Error:",
//         err
//       );

//       setError(
//         err?.message ||
//           "Something went wrong while loading employees."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // FILTER CHANGE
//   // STAFF + HR = COMING SOON
//   // =====================================================

//   const handleFilterChange = (value) => {
//     if (
//       value === "STAFF" ||
//       value === "HR"
//     ) {
//       setComingSoonType(value);
//       setShowComingSoon(true);

//       // Keep Teacher selected
//       return;
//     }

//     setFilter(value);
//   };

//   // =====================================================
//   // GET EMPLOYEE ROLE
//   // =====================================================

//   const getEmployeeRole = (employee) => {
//     return String(
//       employee.role ||
//         employee.employee_role ||
//         employee.user_role ||
//         ""
//     ).toUpperCase();
//   };

//   // =====================================================
//   // GET EMPLOYEE NAME
//   // =====================================================

//   const getEmployeeName = (employee) => {
//     return (
//       employee.name ||
//       employee.full_name ||
//       employee.employee_name ||
//       employee.username ||
//       "N/A"
//     );
//   };

//   // =====================================================
//   // GET USERNAME
//   // =====================================================

//   const getUsername = (employee) => {
//     return (
//       employee.username ||
//       employee.employee_username ||
//       ""
//     );
//   };

//   // =====================================================
//   // FILTER EMPLOYEES
//   // =====================================================

//   const filteredEmployees = employees.filter(
//     (employee) => {
//       return (
//         getEmployeeRole(employee) ===
//         filter
//       );
//     }
//   );

//   // =====================================================
//   // BACK
//   // =====================================================

//   const handleBack = () => {
//     navigate("/accountant/dashboard");
//   };

//   // =====================================================
//   // RETRY
//   // =====================================================

//   const handleRetry = () => {
//     fetchEmployees();
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="employees-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <header className="employees-header">

//         <div className="header-left">

//           <button
//             className="back-button"
//             onClick={handleBack}
//             title="Back to Dashboard"
//           >
//             ←
//           </button>

//           <div>
//             <h1>Employees</h1>

//             <p>
//               Manage Teacher employees
//             </p>
//           </div>

//         </div>

//         {/* =================================================
//             FILTER
//         ================================================= */}

//         <div className="employee-filter">

//           <label>
//             Employee Type
//           </label>

//           <select
//             value={filter}
//             onChange={(e) =>
//               handleFilterChange(
//                 e.target.value
//               )
//             }
//           >
//             <option value="TEACHER">
//               Teacher
//             </option>

//             <option value="STAFF">
//               Staff
//             </option>

//             <option value="HR">
//               HR
//             </option>
//           </select>

//         </div>

//       </header>

//       {/* =================================================
//           MAIN CONTENT
//       ================================================= */}

//       <main className="employees-content">

//         {/* =================================================
//             SUMMARY
//         ================================================= */}

//         <section className="employee-summary">

//           <div className="summary-card">

//             <span>
//               Total Teachers
//             </span>

//             <strong>
//               {loading
//                 ? "..."
//                 : filteredEmployees.length}
//             </strong>

//           </div>

//           <div className="summary-card">

//             <span>
//               Active
//             </span>

//             <strong>
//               {loading
//                 ? "..."
//                 : filteredEmployees.filter(
//                     (employee) =>
//                       employee.is_active !==
//                       false
//                   ).length}
//             </strong>

//           </div>

//           <div className="summary-card">

//             <span>
//               Inactive
//             </span>

//             <strong>
//               {loading
//                 ? "..."
//                 : filteredEmployees.filter(
//                     (employee) =>
//                       employee.is_active ===
//                       false
//                   ).length}
//             </strong>

//           </div>

//         </section>

//         {/* =================================================
//             ERROR
//         ================================================= */}

//         {error && (

//           <div className="employees-error">

//             <div>
//               <strong>
//                 Error
//               </strong>

//               <span>
//                 {error}
//               </span>
//             </div>

//             <button
//               onClick={handleRetry}
//             >
//               Retry
//             </button>

//           </div>

//         )}

//         {/* =================================================
//             LOADING
//         ================================================= */}

//         {loading ? (

//           <div className="employees-loading">

//             <div className="loader-spinner"></div>

//             <p>
//               Loading employees...
//             </p>

//           </div>

//         ) : (

//           /* =================================================
//              TABLE
//           ================================================= */

//           <section className="employees-table-card">

//             <div className="table-header">

//               <div>

//                 <h2>
//                   Teacher Employees
//                 </h2>

//                 <p>
//                   {filteredEmployees.length} teacher
//                   {filteredEmployees.length !==
//                   1
//                     ? "s"
//                     : ""}
//                 </p>

//               </div>

//             </div>

//             <div className="table-wrapper">

//               <table>

//                 <thead>

//                   <tr>

//                     <th>
//                       #
//                     </th>

//                     <th>
//                       Employee
//                     </th>

//                     <th>
//                       Username
//                     </th>

//                     <th>
//                       Email
//                     </th>

//                     <th>
//                       Phone
//                     </th>

//                     <th>
//                       Role
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredEmployees.length ===
//                   0 ? (

//                     <tr>

//                       <td
//                         colSpan="7"
//                         className="empty-row"
//                       >
//                         No teacher employees found.
//                       </td>

//                     </tr>

//                   ) : (

//                     filteredEmployees.map(
//                       (
//                         employee,
//                         index
//                       ) => (

//                         <tr
//                           key={
//                             employee.id ||
//                             employee.user_id ||
//                             index
//                           }
//                         >

//                           {/* NUMBER */}

//                           <td>
//                             {index + 1}
//                           </td>

//                           {/* EMPLOYEE */}

//                           <td>

//                             <div className="employee-cell">

//                               <div className="employee-avatar">

//                                 {getEmployeeName(
//                                   employee
//                                 )
//                                   .charAt(0)
//                                   .toUpperCase()}

//                               </div>

//                               <div>

//                                 <strong>
//                                   {getEmployeeName(
//                                     employee
//                                   )}
//                                 </strong>

//                                 <small>
//                                   Employee ID:{" "}
//                                   {employee.employee_id ||
//                                     employee.id ||
//                                     "N/A"}
//                                 </small>

//                               </div>

//                             </div>

//                           </td>

//                           {/* USERNAME */}

//                           <td>
//                             {getUsername(
//                               employee
//                             ) || "N/A"}
//                           </td>

//                           {/* EMAIL */}

//                           <td>
//                             {employee.email ||
//                               employee.employee_email ||
//                               "N/A"}
//                           </td>

//                           {/* PHONE */}

//                           <td>
//                             {employee.phone ||
//                               employee.mobile ||
//                               employee.phone_number ||
//                               "N/A"}
//                           </td>

//                           {/* ROLE */}

//                           <td>

//                             <span className="role-badge">
//                               Teacher
//                             </span>

//                           </td>

//                           {/* STATUS */}

//                           <td>

//                             {employee.is_active ===
//                             false ? (

//                               <span className="status-badge status-inactive">
//                                 Inactive
//                               </span>

//                             ) : (

//                               <span className="status-badge status-active">
//                                 Active
//                               </span>

//                             )}

//                           </td>

//                         </tr>

//                       )
//                     )

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </section>

//         )}

//       </main>

//       {/* =================================================
//           COMING SOON MODAL
//       ================================================= */}

//       {showComingSoon && (

//         <div
//           className="modal-overlay"
//           onClick={() =>
//             setShowComingSoon(false)
//           }
//         >

//           <div
//             className="coming-soon-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             <div className="coming-soon-icon">
//               🚧
//             </div>

//             <h2>
//               Coming Soon
//             </h2>

//             <p>

//               {comingSoonType ===
//               "STAFF"
//                 ? "Staff management is currently under development."
//                 : "HR management is currently under development."}

//             </p>

//             <button
//               onClick={() =>
//                 setShowComingSoon(false)
//               }
//             >
//               Okay
//             </button>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }

// export default Employees;



import { useEffect, useMemo, useState } from "react";
import accountantService from "../../services/accountantService";
import "./Employees.css";

function Employees() {
  // =====================================================
  // STATES
  // =====================================================

  const [employees, setEmployees] = useState([]);
  const [bankDetailsList, setBankDetailsList] = useState([]);

  const [filter, setFilter] = useState("TEACHER");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingBankDetails, setEditingBankDetails] = useState(null);

  const initialForm = {
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    branch_name: "",
    upi_id: "",
  };

  const [form, setForm] = useState(initialForm);

  // =====================================================
  // RESPONSE HELPERS
  // =====================================================

  const extractList = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    if (Array.isArray(response?.data?.results)) {
      return response.data.results;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    return [];
  };

  // =====================================================
  // EMPLOYEE HELPERS
  // =====================================================

  const getEmployeeId = (employee) => {
    return (
      employee?.id ??
      employee?.user_id ??
      employee?.pk ??
      null
    );
  };

  const getEmployeeName = (employee) => {
    return (
      employee?.employee_name ||
      employee?.full_name ||
      employee?.name ||
      employee?.username ||
      employee?.first_name ||
      "N/A"
    );
  };

  const getEmployeeUsername = (employee) => {
    return (
      employee?.employee_username ||
      employee?.username ||
      employee?.email ||
      ""
    );
  };

  const getEmployeeRole = (employee) => {
    return String(
      employee?.employee_role ||
      employee?.employee_type ||
      employee?.role ||
      ""
    ).toUpperCase();
  };

  const getEmployeeCode = (employee) => {
    return (
      employee?.employee_id ||
      employee?.employee_code ||
      employee?.teacher_id ||
      employee?.staff_id ||
      "N/A"
    );
  };

  // =====================================================
  // BANK DETAILS MATCHING
  // =====================================================

  const findBankDetails = (employee, records = bankDetailsList) => {
    if (!employee || !Array.isArray(records)) {
      return null;
    }

    const employeeId = getEmployeeId(employee);

    const username = getEmployeeUsername(employee)
      .trim()
      .toLowerCase();

    return (
      records.find((record) => {
        // Employee FK from EmployeeBankDetailsSerializer
        const recordEmployeeId =
          typeof record?.employee === "number" ||
          typeof record?.employee === "string"
            ? record.employee
            : record?.employee?.id ??
              record?.employee_pk ??
              record?.user_id ??
              null;

        // First try primary key matching
        if (
          employeeId !== null &&
          recordEmployeeId !== null &&
          recordEmployeeId !== undefined &&
          String(employeeId) === String(recordEmployeeId)
        ) {
          return true;
        }

        // If IDs don't match, try username matching
        const recordUsername = String(
          record?.employee_username ||
          record?.employee?.username ||
          record?.employee?.email ||
          ""
        )
          .trim()
          .toLowerCase();

        if (
          username &&
          recordUsername &&
          username === recordUsername
        ) {
          return true;
        }

        return false;
      }) || null
    );
  };

  // =====================================================
  // LOAD PAGE DATA
  // =====================================================

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeeResponse, bankResponse] = await Promise.all([
        accountantService.getPayrollEmployees(),
        accountantService.getBankDetails(),
      ]);

      if (employeeResponse?.success === false) {
        throw new Error(
          employeeResponse.message || "Unable to load employees."
        );
      }

      if (bankResponse?.success === false) {
        throw new Error(
          bankResponse.message || "Unable to load bank details."
        );
      }

      setEmployees(extractList(employeeResponse));
      setBankDetailsList(extractList(bankResponse));
    } catch (err) {
      console.error("Employee Page Error:", err);

      setError(
        err?.message || "Unable to load employee information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const role = getEmployeeRole(employee);

      const roleMatches =
        role === filter ||
        (filter === "STAFF" && role === "HR");

      const searchText = search.trim().toLowerCase();

      const searchMatches =
        !searchText ||
        getEmployeeName(employee).toLowerCase().includes(searchText) ||
        getEmployeeUsername(employee).toLowerCase().includes(searchText) ||
        String(getEmployeeCode(employee))
          .toLowerCase()
          .includes(searchText);

      return roleMatches && searchMatches;
    });
  }, [employees, filter, search]);

  // =====================================================
  // REFRESH BANK DETAILS
  // =====================================================

  const refreshBankDetails = async (
    savedRecord = null,
    employee = null
  ) => {
    const response = await accountantService.getBankDetails();

    if (response?.success === false) {
      throw new Error(
        response.message || "Unable to refresh bank details."
      );
    }

    let records = extractList(response);

    // Add saved record as fallback if GET does not return it
    if (savedRecord && employee) {
      const alreadyExists = findBankDetails(employee, records);

      if (!alreadyExists) {
        const employeeId = getEmployeeId(employee);

        const normalizedRecord = {
          ...savedRecord,
          employee:
            savedRecord.employee ??
            employeeId,
          employee_username:
            savedRecord.employee_username ||
            getEmployeeUsername(employee),
          employee_name:
            savedRecord.employee_name ||
            getEmployeeName(employee),
        };

        records = [...records, normalizedRecord];
      }
    }

    setBankDetailsList(records);

    return records;
  };

  // =====================================================
  // OPEN BANK DETAILS MODAL
  // =====================================================

  const handleOpenBankDetails = (employee) => {
    setSelectedEmployee(employee);

    const existingDetails = findBankDetails(employee);

    setEditingBankDetails(existingDetails);

    if (existingDetails) {
      setForm({
        account_holder_name:
          existingDetails.account_holder_name || "",

        bank_name:
          existingDetails.bank_name || "",

        account_number:
          existingDetails.account_number || "",

        confirm_account_number:
          existingDetails.account_number || "",

        ifsc_code:
          existingDetails.ifsc_code || "",

        branch_name:
          existingDetails.branch_name || "",

        upi_id:
          existingDetails.upi_id || "",
      });
    } else {
      setForm({
        ...initialForm,
        account_holder_name: getEmployeeName(employee),
      });
    }

    setError("");
    setSuccess("");
    setShowBankModal(true);
  };


  // Verify Bank Details

  const handleVerifyBankDetails = async (details) => {
  if (!details?.id) {
    setError("Bank details ID not found.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to verify these bank details?"
  );

  if (!confirmed) return;

  try {
    setError("");
    setSuccess("");

    await accountantService.verifyBankDetails(details.id);

    setSuccess("Bank details verified successfully.");

    await refreshBankDetails();
  } catch (error) {
    setError(
      error?.message || "Unable to verify bank details."
    );
  }
};

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseBankModal = () => {
    if (saving) return;

    setShowBankModal(false);
    setSelectedEmployee(null);
    setEditingBankDetails(null);
    setForm(initialForm);
    setError("");
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "ifsc_code"
          ? value.toUpperCase().trim()
          : value,
    }));
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!form.account_holder_name.trim()) {
      return "Please enter account holder name.";
    }

    if (!form.bank_name.trim()) {
      return "Please enter bank name.";
    }

    if (!form.account_number.trim()) {
      return "Please enter account number.";
    }

    if (!/^\d{8,20}$/.test(form.account_number.trim())) {
      return "Account number must contain 8 to 20 digits.";
    }

    if (
      form.account_number.trim() !==
      form.confirm_account_number.trim()
    ) {
      return "Account numbers do not match.";
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc_code.trim())) {
      return "Please enter a valid IFSC code.";
    }

    if (
      form.upi_id.trim() &&
      !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(
        form.upi_id.trim()
      )
    ) {
      return "Please enter a valid UPI ID.";
    }

    return "";
  };

  // =====================================================
  // SAVE BANK DETAILS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      setError("Please select an employee.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const employeeId = getEmployeeId(selectedEmployee);

    if (employeeId === null || employeeId === undefined) {
      setError("Employee database ID is missing.");
      return;
    }

    const payload = {
      employee: employeeId,
      account_holder_name: form.account_holder_name.trim(),
      bank_name: form.bank_name.trim(),
      account_number: form.account_number.trim(),
      ifsc_code: form.ifsc_code.trim().toUpperCase(),
      branch_name: form.branch_name.trim(),
      upi_id: form.upi_id.trim(),
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      if (editingBankDetails?.id) {
        const {
          employee,
          ...updatePayload
        } = payload;

        response = await accountantService.updateBankDetails(
          editingBankDetails.id,
          updatePayload
        );
      } else {
        response = await accountantService.createBankDetails(payload);
      }

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to save bank details."
        );
      }

      // Use the returned serializer data if available
      const returnedRecord =
        response?.data &&
        !Array.isArray(response.data) &&
        typeof response.data === "object"
          ? response.data
          : {};

      const savedRecord = {
        ...payload,
        ...returnedRecord,
        employee:
          returnedRecord.employee ??
          employeeId,
        employee_username:
          returnedRecord.employee_username ||
          getEmployeeUsername(selectedEmployee),
        employee_name:
          returnedRecord.employee_name ||
          getEmployeeName(selectedEmployee),
      };

      // Refresh list and keep saved record as fallback
      await refreshBankDetails(
        savedRecord,
        selectedEmployee
      );

      setSuccess(
        editingBankDetails
          ? "Bank details updated successfully."
          : "Bank details saved successfully."
      );

      setShowBankModal(false);
      setSelectedEmployee(null);
      setEditingBankDetails(null);
      setForm(initialForm);
    } catch (err) {
      console.error("Save Bank Details Error:", err);

      const backendErrors =
        err?.data || err?.response?.data;

      if (
        backendErrors &&
        typeof backendErrors === "object"
      ) {
        const messages = Object.entries(backendErrors)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "string"
                ? value
                : JSON.stringify(value);

            return `${field}: ${message}`;
          })
          .join(" | ");

        setError(
          messages ||
          err?.message ||
          "Unable to save bank details."
        );
      } else {
        setError(
          err?.message || "Unable to save bank details."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

 
return (
  <div className="employees-page">

    {/* HEADER */}
    <div className="employees-header">
      <div>
        <h1>Employees</h1>
        <p>Manage teachers, staff and employee bank details.</p>
      </div>

      <button
        type="button"
        className="employee-refresh-btn"
        onClick={fetchPageData}
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh"}
      </button>
    </div>

    {/* SUCCESS */}
    {success && (
      <div className="employee-success-message">
        {success}
        <button type="button" onClick={() => setSuccess("")}>
          ×
        </button>
      </div>
    )}

    {/* ERROR */}
    {error && (
      <div className="employee-error-message">
        {error}
        <button type="button" onClick={() => setError("")}>
          ×
        </button>
      </div>
    )}

    {/* FILTERS */}
    <div className="employees-toolbar">
      <div className="employee-tabs">
        <button
          type="button"
          className={filter === "TEACHER" ? "active" : ""}
          onClick={() => setFilter("TEACHER")}
        >
          Teachers
        </button>

        <button
          type="button"
          className={filter === "STAFF" ? "active" : ""}
          onClick={() => setFilter("STAFF")}
        >
          Staff / HR
        </button>
      </div>

      <input
        type="search"
        className="employee-search"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* EMPLOYEE TABLE */}
    <div className="employees-table-card">
      <div className="employees-table-heading">
        <div>
          <h2>
            {filter === "TEACHER"
              ? "Teacher List"
              : "Staff & HR List"}
          </h2>
          <p>{filteredEmployees.length} employee(s)</p>
        </div>
      </div>

      {loading ? (
        <div className="employee-loading">
          Loading employees...
        </div>
      ) : (
        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Role</th>
                <th>Bank Details</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="employee-empty">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee, index) => {
                  const details = findBankDetails(employee);

                  return (
                    <tr key={getEmployeeId(employee) || index}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="employee-name-cell">
                          <div className="employee-avatar">
                            {getEmployeeName(employee)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {getEmployeeName(employee)}
                            </strong>
                            <small>
                              {getEmployeeUsername(employee) || "N/A"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{getEmployeeCode(employee)}</td>

                      <td>
                        <span className="employee-role-badge">
                          {getEmployeeRole(employee) || "N/A"}
                        </span>
                      </td>

                      {/* BANK STATUS */}
                      <td>
                        {details ? (
                          <span
                            className={
                              details.is_verified
                                ? "bank-status verified"
                                : "bank-status pending"
                            }
                          >
                            {details.is_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        ) : (
                          <span className="bank-status missing">
                            Not Added
                          </span>
                        )}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td>
                        <div className="employee-action-buttons">

                          <button
                            type="button"
                            className="bank-details-btn"
                            onClick={() =>
                              handleOpenBankDetails(employee)
                            }
                          >
                            {details
                              ? "Edit Bank Details"
                              : "Add Bank Details"}
                          </button>

                          {details && !details.is_verified && (
                            <button
                              type="button"
                              className="bank-verify-btn"
                              onClick={() =>
                                handleVerifyBankDetails(details)
                              }
                            >
                              Verify
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* BANK DETAILS MODAL */}
    {showBankModal && selectedEmployee && (
      <div
        className="employee-modal-overlay"
        onClick={handleCloseBankModal}
      >
        <div
          className="employee-bank-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="employee-modal-header">
            <div>
              <h2>
                {editingBankDetails
                  ? "Update Bank Details"
                  : "Add Bank Details"}
              </h2>

              <p>{getEmployeeName(selectedEmployee)}</p>
            </div>

            <button
              type="button"
              onClick={handleCloseBankModal}
              disabled={saving}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="employee-form-grid">

              <div className="employee-form-group full-width">
                <label>Employee</label>
                <input
                  value={`${getEmployeeName(selectedEmployee)} (${getEmployeeCode(selectedEmployee)})`}
                  readOnly
                />
              </div>

              <div className="employee-form-group">
                <label>Account Holder Name *</label>
                <input
                  name="account_holder_name"
                  value={form.account_holder_name}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div className="employee-form-group">
                <label>Bank Name *</label>
                <input
                  name="bank_name"
                  value={form.bank_name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div className="employee-form-group">
                <label>Account Number *</label>
                <input
                  name="account_number"
                  type="password"
                  inputMode="numeric"
                  value={form.account_number}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div className="employee-form-group">
                <label>Confirm Account Number *</label>
                <input
                  name="confirm_account_number"
                  type="password"
                  inputMode="numeric"
                  value={form.confirm_account_number}
                  onChange={handleChange}
                  placeholder="Confirm account number"
                  required
                />
              </div>

              <div className="employee-form-group">
                <label>IFSC Code *</label>
                <input
                  name="ifsc_code"
                  value={form.ifsc_code}
                  onChange={handleChange}
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  required
                />
              </div>

              <div className="employee-form-group">
                <label>Branch Name</label>
                <input
                  name="branch_name"
                  value={form.branch_name}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                />
              </div>

              <div className="employee-form-group full-width">
                <label>UPI ID (Optional)</label>
                <input
                  name="upi_id"
                  value={form.upi_id}
                  onChange={handleChange}
                  placeholder="e.g. teacher@okaxis"
                />
                <small>
                  Employee ka PhonePe, Google Pay ya Paytm UPI ID.
                </small>
              </div>
            </div>

            {editingBankDetails && (
              <div className="employee-verification-note">
                Current status:{" "}
                <strong>
                  {editingBankDetails.is_verified
                    ? "Verified"
                    : "Not Verified"}
                </strong>

                <p>
                  Bank details update hone par verification
                  dobara required ho sakti hai.
                </p>
              </div>
            )}

            <div className="employee-modal-actions">
              <button
                type="button"
                className="employee-cancel-btn"
                onClick={handleCloseBankModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="employee-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingBankDetails
                    ? "Update Details"
                    : "Save Bank Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}

export default Employees;

