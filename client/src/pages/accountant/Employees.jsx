import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
import "./Employees.css";

function Employees() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("TEACHER");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonType, setComingSoonType] = useState("");

  // =====================================================
  // LOAD EMPLOYEES
  // API CALL ONLY WHEN EMPLOYEES PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await accountantService.getPayrollEmployees();

      if (response?.success) {
        setEmployees(response.data || []);
      } else {
        setError(
          response?.message ||
            "Unable to load employees."
        );
      }
    } catch (err) {
      console.error(
        "Employees API Error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading employees."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER CHANGE
  // STAFF + HR = COMING SOON
  // =====================================================

  const handleFilterChange = (value) => {
    if (
      value === "STAFF" ||
      value === "HR"
    ) {
      setComingSoonType(value);
      setShowComingSoon(true);

      // Keep Teacher selected
      return;
    }

    setFilter(value);
  };

  // =====================================================
  // GET EMPLOYEE ROLE
  // =====================================================

  const getEmployeeRole = (employee) => {
    return String(
      employee.role ||
        employee.employee_role ||
        employee.user_role ||
        ""
    ).toUpperCase();
  };

  // =====================================================
  // GET EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = (employee) => {
    return (
      employee.name ||
      employee.full_name ||
      employee.employee_name ||
      employee.username ||
      "N/A"
    );
  };

  // =====================================================
  // GET USERNAME
  // =====================================================

  const getUsername = (employee) => {
    return (
      employee.username ||
      employee.employee_username ||
      ""
    );
  };

  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees = employees.filter(
    (employee) => {
      return (
        getEmployeeRole(employee) ===
        filter
      );
    }
  );

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchEmployees();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="employees-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="employees-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={handleBack}
            title="Back to Dashboard"
          >
            ←
          </button>

          <div>
            <h1>Employees</h1>

            <p>
              Manage Teacher employees
            </p>
          </div>

        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="employee-filter">

          <label>
            Employee Type
          </label>

          <select
            value={filter}
            onChange={(e) =>
              handleFilterChange(
                e.target.value
              )
            }
          >
            <option value="TEACHER">
              Teacher
            </option>

            <option value="STAFF">
              Staff
            </option>

            <option value="HR">
              HR
            </option>
          </select>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="employees-content">

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="employee-summary">

          <div className="summary-card">

            <span>
              Total Teachers
            </span>

            <strong>
              {loading
                ? "..."
                : filteredEmployees.length}
            </strong>

          </div>

          <div className="summary-card">

            <span>
              Active
            </span>

            <strong>
              {loading
                ? "..."
                : filteredEmployees.filter(
                    (employee) =>
                      employee.is_active !==
                      false
                  ).length}
            </strong>

          </div>

          <div className="summary-card">

            <span>
              Inactive
            </span>

            <strong>
              {loading
                ? "..."
                : filteredEmployees.filter(
                    (employee) =>
                      employee.is_active ===
                      false
                  ).length}
            </strong>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="employees-error">

            <div>
              <strong>
                Error
              </strong>

              <span>
                {error}
              </span>
            </div>

            <button
              onClick={handleRetry}
            >
              Retry
            </button>

          </div>

        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="employees-loading">

            <div className="loader-spinner"></div>

            <p>
              Loading employees...
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <section className="employees-table-card">

            <div className="table-header">

              <div>

                <h2>
                  Teacher Employees
                </h2>

                <p>
                  {filteredEmployees.length} teacher
                  {filteredEmployees.length !==
                  1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Employee
                    </th>

                    <th>
                      Username
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="empty-row"
                      >
                        No teacher employees found.
                      </td>

                    </tr>

                  ) : (

                    filteredEmployees.map(
                      (
                        employee,
                        index
                      ) => (

                        <tr
                          key={
                            employee.id ||
                            employee.user_id ||
                            index
                          }
                        >

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>

                          {/* EMPLOYEE */}

                          <td>

                            <div className="employee-cell">

                              <div className="employee-avatar">

                                {getEmployeeName(
                                  employee
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {getEmployeeName(
                                    employee
                                  )}
                                </strong>

                                <small>
                                  Employee ID:{" "}
                                  {employee.employee_id ||
                                    employee.id ||
                                    "N/A"}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* USERNAME */}

                          <td>
                            {getUsername(
                              employee
                            ) || "N/A"}
                          </td>

                          {/* EMAIL */}

                          <td>
                            {employee.email ||
                              employee.employee_email ||
                              "N/A"}
                          </td>

                          {/* PHONE */}

                          <td>
                            {employee.phone ||
                              employee.mobile ||
                              employee.phone_number ||
                              "N/A"}
                          </td>

                          {/* ROLE */}

                          <td>

                            <span className="role-badge">
                              Teacher
                            </span>

                          </td>

                          {/* STATUS */}

                          <td>

                            {employee.is_active ===
                            false ? (

                              <span className="status-badge status-inactive">
                                Inactive
                              </span>

                            ) : (

                              <span className="status-badge status-active">
                                Active
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

      {/* =================================================
          COMING SOON MODAL
      ================================================= */}

      {showComingSoon && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowComingSoon(false)
          }
        >

          <div
            className="coming-soon-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="coming-soon-icon">
              🚧
            </div>

            <h2>
              Coming Soon
            </h2>

            <p>

              {comingSoonType ===
              "STAFF"
                ? "Staff management is currently under development."
                : "HR management is currently under development."}

            </p>

            <button
              onClick={() =>
                setShowComingSoon(false)
              }
            >
              Okay
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Employees;