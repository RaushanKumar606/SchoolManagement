import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
// import "./SalarySlip.css";

function SalarySlip() {
  const navigate = useNavigate();

  const [salarySlips, setSalarySlips] = useState([]);
  const [filter, setFilter] = useState("TEACHER");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonType, setComingSoonType] = useState("");

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [processingId, setProcessingId] = useState(null);

  // =====================================================
  // LOAD SALARY SLIPS ONLY WHEN PAGE OPENS
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
        setError(
          response?.message || "Unable to load salary slips."
        );
      }
    } catch (err) {
      console.error("Salary Slip API Error:", err);

      setError(
        err?.message ||
          "Something went wrong while loading salary slips."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const handleFilterChange = (value) => {
    // STAFF + HR = COMING SOON
    if (value === "STAFF" || value === "HR") {
      setComingSoonType(value);
      setShowComingSoon(true);

      // Teacher filter ko selected hi rakho
      return;
    }

    // TEACHER
    setFilter(value);
  };

  // =====================================================
  // EMPLOYEE ROLE
  // =====================================================

  const getEmployeeRole = (slip) => {
    return String(
      slip.employee_role ||
        slip.role ||
        slip.employee?.role ||
        ""
    ).toUpperCase();
  };

  const filteredSlips = salarySlips.filter((slip) => {
    return getEmployeeRole(slip) === filter;
  });

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
  // VIEW SALARY SLIP
  // =====================================================

  const handleView = async (id) => {
    try {
      setProcessingId(id);

      const response =
        await accountantService.getSalarySlip(id);

      if (response?.success) {
        setSelectedSlip(response.data);
        setShowDetails(true);
      } else {
        setError(
          response?.message ||
            "Unable to load salary slip."
        );
      }
    } catch (err) {
      console.error("Salary Slip Detail Error:", err);

      setError(
        err?.message ||
          "Unable to load salary slip details."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this salary slip?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      const response =
        await accountantService.approveSalarySlip(id);

      if (response?.success) {
        await fetchSalarySlips();
      } else {
        setError(
          response?.message ||
            "Unable to approve salary slip."
        );
      }
    } catch (err) {
      console.error("Approve Salary Error:", err);

      setError(
        err?.message ||
          "Unable to approve salary slip."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // PAY SALARY
  // =====================================================

  const handlePaySalary = async (slip) => {
    if (slip.status !== "APPROVED") {
      setError(
        "Only approved salary slips can be paid."
      );
      return;
    }

    const confirmed = window.confirm(
      `Pay salary of ₹${slip.net_salary || 0} to ${getEmployeeName(
        slip
      )}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(slip.id);
      setError("");

      const response =
        await accountantService.paySalary(
          slip.id,
          {
            payment_method: "BANK",
            remarks: "Salary paid by Accountant",
          }
        );

      if (response?.success) {
        await fetchSalarySlips();
      } else {
        setError(
          response?.message ||
            "Unable to process salary payment."
        );
      }
    } catch (err) {
      console.error("Pay Salary Error:", err);

      setError(
        err?.message ||
          "Unable to process salary payment."
      );
    } finally {
      setProcessingId(null);
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

    const index = Number(month) - 1;

    return months[index] || month;
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  return (
    <div className="salary-slip-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="salary-slip-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={handleBack}
          >
            ←
          </button>

          <div>
            <h1>Salary Slips</h1>

            <p>
              Manage Teacher salary slips
            </p>
          </div>

        </div>

        {/* FILTER */}

        <div className="salary-filter">

          <label>Employee Type</label>

          <select
            value={filter}
            onChange={(e) =>
              handleFilterChange(e.target.value)
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
          CONTENT
      ================================================= */}

      <main className="salary-slip-content">

        {/* SUMMARY */}

        <div className="salary-summary">

          <div className="summary-card">

            <span>Teacher Slips</span>

            <strong>
              {loading
                ? "..."
                : filteredSlips.length}
            </strong>

          </div>

          <div className="summary-card">

            <span>Draft</span>

            <strong>
              {loading
                ? "..."
                : filteredSlips.filter(
                    (slip) =>
                      String(
                        slip.status
                      ).toUpperCase() === "DRAFT"
                  ).length}
            </strong>

          </div>

          <div className="summary-card">

            <span>Approved</span>

            <strong>
              {loading
                ? "..."
                : filteredSlips.filter(
                    (slip) =>
                      String(
                        slip.status
                      ).toUpperCase() ===
                      "APPROVED"
                  ).length}
            </strong>

          </div>

          <div className="summary-card">

            <span>Paid</span>

            <strong>
              {loading
                ? "..."
                : filteredSlips.filter(
                    (slip) =>
                      String(
                        slip.status
                      ).toUpperCase() === "PAID"
                  ).length}
            </strong>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="salary-error">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading ? (

          <div className="salary-loading">

            <div className="loader-spinner"></div>

            <p>
              Loading salary slips...
            </p>

          </div>

        ) : (

          <div className="salary-table-card">

            <div className="table-header">

              <div>

                <h2>
                  Teacher Salary Slips
                </h2>

                <p>
                  {filteredSlips.length} salary slip
                  {filteredSlips.length !== 1
                    ? "s"
                    : ""}
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

                      <td
                        colSpan="9"
                        className="empty-row"
                      >
                        No salary slips found.
                      </td>

                    </tr>

                  ) : (

                    filteredSlips.map(
                      (slip, index) => (

                        <tr key={slip.id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>

                            <div className="employee-cell">

                              <div className="employee-avatar">

                                {getEmployeeName(
                                  slip
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {getEmployeeName(
                                    slip
                                  )}
                                </strong>

                                <small>
                                  {slip.employee_username ||
                                    ""}
                                </small>

                              </div>

                            </div>

                          </td>

                          <td>

                            <strong>
                              {getMonthName(
                                slip.month
                              )}
                            </strong>

                            <small>
                              {slip.year}
                            </small>

                          </td>

                          <td>
                            ₹ {slip.basic_salary || 0}
                          </td>

                          <td>
                            ₹ {slip.total_allowance || 0}
                          </td>

                          <td>
                            ₹ {slip.total_deduction || 0}
                          </td>

                          <td>

                            <strong>
                              ₹ {slip.net_salary || 0}
                            </strong>

                          </td>

                          <td>

                            <span
                              className={`salary-status ${getStatusClass(
                                slip.status
                              )}`}
                            >
                              {slip.status || "N/A"}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="view-btn"
                                onClick={() =>
                                  handleView(
                                    slip.id
                                  )
                                }
                                disabled={
                                  processingId ===
                                  slip.id
                                }
                              >
                                View
                              </button>

                              {String(
                                slip.status
                              ).toUpperCase() ===
                                "DRAFT" && (

                                <button
                                  className="approve-btn"
                                  onClick={() =>
                                    handleApprove(
                                      slip.id
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    slip.id
                                  }
                                >
                                  {processingId ===
                                  slip.id
                                    ? "..."
                                    : "Approve"}
                                </button>

                              )}

                              {String(
                                slip.status
                              ).toUpperCase() ===
                                "APPROVED" && (

                                <button
                                  className="pay-btn"
                                  onClick={() =>
                                    handlePaySalary(
                                      slip
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    slip.id
                                  }
                                >
                                  {processingId ===
                                  slip.id
                                    ? "..."
                                    : "Pay"}
                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

      {/* =================================================
          SALARY DETAILS MODAL
      ================================================= */}

      {showDetails && selectedSlip && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowDetails(false)
          }
        >

          <div
            className="salary-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Salary Slip Details
                </h2>

                <p>
                  {getEmployeeName(
                    selectedSlip
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowDetails(false)
                }
              >
                ×
              </button>

            </div>

            <div className="salary-details">

              <div className="detail-item">
                <span>Employee</span>
                <strong>
                  {getEmployeeName(
                    selectedSlip
                  )}
                </strong>
              </div>

              <div className="detail-item">
                <span>Month</span>
                <strong>
                  {getMonthName(
                    selectedSlip.month
                  )}
                </strong>
              </div>

              <div className="detail-item">
                <span>Year</span>
                <strong>
                  {selectedSlip.year}
                </strong>
              </div>

              <div className="detail-item">
                <span>Basic Salary</span>
                <strong>
                  ₹ {selectedSlip.basic_salary || 0}
                </strong>
              </div>

              <div className="detail-item">
                <span>Total Allowance</span>
                <strong>
                  ₹{" "}
                  {selectedSlip.total_allowance ||
                    0}
                </strong>
              </div>

              <div className="detail-item">
                <span>Total Deduction</span>
                <strong>
                  ₹{" "}
                  {selectedSlip.total_deduction ||
                    0}
                </strong>
              </div>

              <div className="detail-item net-salary">
                <span>Net Salary</span>
                <strong>
                  ₹ {selectedSlip.net_salary || 0}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>
                  {selectedSlip.status || "N/A"}
                </strong>
              </div>

              {selectedSlip.payment_method && (
                <div className="detail-item">
                  <span>Payment Method</span>
                  <strong>
                    {selectedSlip.payment_method}
                  </strong>
                </div>
              )}

              {selectedSlip.payment_reference && (
                <div className="detail-item">
                  <span>Payment Reference</span>
                  <strong>
                    {selectedSlip.payment_reference}
                  </strong>
                </div>
              )}

            </div>

          </div>

        </div>

      )}

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
              {comingSoonType === "STAFF"
                ? "Staff salary management is currently under development."
                : "HR salary management is currently under development."}
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

export default SalarySlip;