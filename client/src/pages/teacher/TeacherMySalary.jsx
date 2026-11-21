

import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService";
import "./TeacherMySalary.css";

function TeacherMySalary() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySalary();
  }, []);

  const fetchMySalary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await teacherService.getMySalary();


      if (response?.success) {
        const records = Array.isArray(response.data)
          ? response.data
          : [];

        setSalarySlips(records);
      } else {
        setSalarySlips([]);
        setError(response?.message || "Unable to load salary details.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load salary details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStructure = (slip) => {
    const structure =
      slip?.salary_structure_details ||
      slip?.salary_structure ||
      {};

    return typeof structure === "object" && structure !== null
      ? structure
      : {};
  };

  const getAmount = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const getMonthName = (slip) => {
    const month = slip?.month_name || slip?.month;

    if (!month) return "-";

    if (typeof month === "string" && isNaN(Number(month))) {
      return month;
    }

    const monthNumber = Number(month);

    if (monthNumber < 1 || monthNumber > 12) {
      return String(month);
    }

    return new Date(2000, monthNumber - 1).toLocaleString("en-IN", {
      month: "long",
    });
  };

  const getEmployeeName = (slip) =>
    slip?.employee_name ||
    slip?.employee?.name ||
    slip?.employee?.username ||
    "Employee";

  const getEmployeeId = (slip) =>
    slip?.employee_username ||
    slip?.employee?.employee_id ||
    slip?.employee?.username ||
    "-";

  const getGrossSalary = (slip) => {
    const structure = getStructure(slip);

    const explicitGross =
      slip?.gross_salary ??
      structure?.gross_salary;

    if (explicitGross !== undefined && explicitGross !== null) {
      return Number(explicitGross);
    }

    return (
      Number(slip?.basic_salary || structure?.basic_salary || 0) +
      Number(slip?.total_allowance ?? structure?.total_allowance ?? 0)
    );
  };

  const getAllowances = (slip) => {
    const structure = getStructure(slip);

    return [
      {
        label: "House Rent Allowance",
        amount: Number(
          structure?.house_rent_allowance ||
          structure?.hra ||
          0
        ),
      },
      {
        label: "Transport Allowance",
        amount: Number(
          structure?.transport_allowance ||
          structure?.conveyance_allowance ||
          0
        ),
      },
      {
        label: "Other Allowance",
        amount: Number(structure?.other_allowance || 0),
      },
    ].filter((item) => item.amount > 0);
  };

  const getDeductions = (slip) => {
    const structure = getStructure(slip);

    return [
      {
        label: "Other Deductions",
        amount: Number(
          slip?.total_deduction ??
          structure?.other_deduction ??
          0
        ),
      },
    ].filter((item) => item.amount > 0);
  };

  const getNetSalary = (slip) => {
    if (slip?.net_salary !== undefined && slip?.net_salary !== null) {
      return Number(slip.net_salary);
    }

    return (
      getGrossSalary(slip) -
      Number(slip?.total_deduction || 0)
    );
  };

  const numberToWords = (number) => {
    const units = [
      "", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen",
      "Fifteen", "Sixteen", "Seventeen", "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty",
      "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    const convert = (n) => {
      if (n < 20) return units[n];

      if (n < 100) {
        return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
      }

      if (n < 1000) {
        return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)
          }`.trim();
      }

      if (n < 100000) {
        return `${convert(Math.floor(n / 1000))} Thousand ${convert(n % 1000)
          }`.trim();
      }

      if (n < 10000000) {
        return `${convert(Math.floor(n / 100000))} Lakh ${convert(n % 100000)
          }`.trim();
      }

      return `${convert(Math.floor(n / 10000000))} Crore ${convert(n % 10000000)
        }`.trim();
    };

    const rupees = Math.floor(Number(number || 0));
    const paise = Math.round((Number(number || 0) - rupees) * 100);

    if (rupees === 0 && paise === 0) return "Zero Rupees Only";

    let result = rupees > 0 ? `${convert(rupees)} Rupees` : "";

    if (paise > 0) {
      result += ` ${convert(paise)} Paise`;
    }

    return `${result.trim()} Only`;
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "PAID") return "salary-status paid";
    if (value === "APPROVED") return "salary-status approved";
    if (value === "DRAFT") return "salary-status pending";

    return "salary-status other";
  };

  const escapeHtml = (value) =>
    String(value ?? "-").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);

  const getSlipHtml = (slip) => {
    const structure = getStructure(slip);
    const allowances = getAllowances(slip);
    const deductions = getDeductions(slip);

    const basicSalary = Number(
      slip?.basic_salary ?? structure?.basic_salary ?? 0
    );

    const gross = getGrossSalary(slip);
    const totalDeduction = Number(slip?.total_deduction || 0);
    const netSalary = getNetSalary(slip);

    const employee = escapeHtml(getEmployeeName(slip));
    const employeeId = escapeHtml(getEmployeeId(slip));
    const month = escapeHtml(getMonthName(slip));
    const year = escapeHtml(slip?.year);
    const status = escapeHtml(slip?.status);
    const employeeType = escapeHtml(
      slip?.employee_type || structure?.employee_type || "Teacher"
    );

    const bank = slip.bank_details || slip.employee.bank_details || {};


    const earningRows = [
      `<tr><td>Basic Salary</td><td>${getAmount(basicSalary)}</td></tr>`,
      ...allowances.map(
        (item) => `<tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${getAmount(item.amount)}</td>
        </tr>`
      ),
    ].join("");

    const deductionRows = deductions.length
      ? deductions.map(
        (item) => `<tr>
            <td>${escapeHtml(item.label)}</td>
            <td>${getAmount(item.amount)}</td>
          </tr>`
      ).join("")
      : `<tr><td>No deductions</td><td>${getAmount(0)}</td></tr>`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Salary Slip - ${employee}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            color: #111;
            padding: 20px;
            margin: 0;
          }
          .slip {
            max-width: 950px;
            margin: auto;
            border: 2px solid #222;
          }
          .school-name, .slip-title {
            text-align: center;
            font-size: 25px;
            font-weight: bold;
            border-bottom: 1px solid #222;
            padding: 7px;
          }
          .slip-title { font-size: 23px; }
          .employee-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 25px 12px;
            min-height: 170px;
            font-size: 18px;
            line-height: 2;
          }
          .salary-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .salary-column:first-child {
            border-right: 1px solid #222;
          }
          .column-title {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            padding: 9px;
            border-top: 2px solid #222;
            border-bottom: 1px solid #222;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 17px;
          }
          td {
            padding: 10px;
          }
          td:last-child {
            text-align: right;
            white-space: nowrap;
          }
          .total-row {
            font-weight: bold;
            border-top: 1px solid #222;
          }
          .net-pay {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 2px solid #222;
            border-bottom: 2px solid #222;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            padding: 12px;
          }
          .amount-words {
            text-align: center;
            padding: 15px;
            font-size: 16px;
          }
          @media print {
            body { padding: 0; }
            .slip { max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="slip">
          <div class="school-name"> <h2>Springfield School</h2>
              <span>Knowledge • Character • Excellence</span></div>
          <div class="slip-title">Salary Slip for ${month} ${year}</div>

          <div class="employee-details">
            <div>
              Name: ${employee}<br/>
              Emp. No: ${employeeId}<br/>
              Designation: ${employeeType}
            </div>
            <div>
              Department: ${escapeHtml(slip?.department || "Educations")}<br/>
              Bank Name: ${escapeHtml(bank?.bank_name
      || "-")}
      <br/>
              A/c No.: ${escapeHtml(bank.account_number || "-")}<br/>
              Status: ${status}
            </div>
          </div>

          <div class="salary-columns">
            <div class="salary-column">
              <div class="column-title">Earnings</div>
              <table>
                ${earningRows}
                <tr class="total-row">
                  <td>Gross Salary</td>
                  <td>${getAmount(gross)}</td>
                </tr>
              </table>
            </div>

            <div class="salary-column">
              <div class="column-title">Deductions</div>
              <table>
                ${deductionRows}
                <tr class="total-row">
                  <td>Total Deductions</td>
                  <td>${getAmount(totalDeduction)}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="net-pay">
            <span>Net Pay</span>
            <span>${getAmount(netSalary)}</span>
          </div>

          <div class="amount-words">
            Amount in Words: <strong>${escapeHtml(numberToWords(netSalary))}</strong>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;
  };

  const handlePrint = (slip) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print your salary slip.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(getSlipHtml(slip));
    printWindow.document.close();
  };

  const totalNetSalary = salarySlips.reduce(
    (total, slip) => total + getNetSalary(slip),
    0
  );

  const latestSalary = salarySlips[0] || null;

  if (loading) {
    return (
      <div className="teacher-salary-loading">
        Loading your salary details...
      </div>
    );
  }

  return (
    <div className="teacher-my-salary">
      <div className="salary-page-header">
        <div>
          <h1>My Salary</h1>
          <p>View your salary slips and payment history.</p>
        </div>

        <button
          className="salary-refresh-btn"
          onClick={fetchMySalary}
        >
          ↻ Refresh
        </button>
      </div>

      {error && <div className="salary-error">{error}</div>}

      <div className="salary-summary-grid">
        <div className="salary-summary-card">
          <span>Total Salary Slips</span>
          <h2>{salarySlips.length}</h2>
        </div>

        <div className="salary-summary-card">
          <span>Latest Net Salary</span>
          <h2>{getAmount(latestSalary ? getNetSalary(latestSalary) : 0)}</h2>
        </div>

        <div className="salary-summary-card">
          <span>Total Net Salary</span>
          <h2>{getAmount(totalNetSalary)}</h2>
        </div>
      </div>

      <div className="salary-history-card">
        <div className="salary-history-header">
          <h2>Salary History</h2>
          <span>{salarySlips.length} Records</span>
        </div>

        {salarySlips.length === 0 ? (
          <div className="salary-empty">
            <div className="salary-empty-icon">💰</div>
            <h3>No Salary Records Found</h3>
            <p>Your salary slips will appear here once generated.</p>
          </div>
        ) : (
          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Salary Period</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {salarySlips.map((slip) => (
                  <tr key={slip.id}>
                    <td>
                      <strong>
                        {getMonthName(slip)} {slip.year}
                      </strong>
                      <small>Slip #{slip.id}</small>
                    </td>

                    <td>{getAmount(getGrossSalary(slip))}</td>

                    <td>{getAmount(slip.total_deduction)}</td>

                    <td className="salary-net-amount">
                      {getAmount(getNetSalary(slip))}
                    </td>

                    <td>
                      <span className={getStatusClass(slip.status)}>
                        {slip.status || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <div className="salary-actions">
                        <button
                          className="salary-view-btn"
                          onClick={() => setSelectedSlip(slip)}
                        >
                          View
                        </button>

                        <button
                          className="salary-print-btn"
                          onClick={() => handlePrint(slip)}
                        >
                          Print / PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedSlip && (
        <div
          className="salary-modal-overlay"
          onClick={() => setSelectedSlip(null)}
        >
          <div
            className="salary-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="salary-modal-header">
              <h2>Salary Slip Preview</h2>
              <button onClick={() => setSelectedSlip(null)}>
                ✕
              </button>
            </div>

            <div className="salary-slip-preview">
              <div className="preview-school-name">
                <h2>Springfield School</h2>
                <span>Knowledge • Character • Excellence</span>
              </div>

              <div className="preview-slip-title">
                Salary Slip for {getMonthName(selectedSlip)} {selectedSlip.year}
              </div>

              <div className="preview-employee-details">
                <div>
                  <p><strong>Emp. Name:</strong> {getEmployeeName(selectedSlip)}</p>
                  <p><strong>Emp. No:</strong> {getEmployeeId(selectedSlip)}</p>
                  <p>
                    <strong>Designation:</strong>{" "}
                    {selectedSlip.employee_type || "Teacher"}
                  </p>
                </div>

                <div>
                  <p><strong>Department:</strong> {selectedSlip.department || "Educations"}</p>
                  <p>
                    <strong>Bank:-</strong>{" "}
                    {selectedSlip.bank_details.bank_name || "-"}
                  </p>
                  <p> <strong>AC.NO:-</strong>  {selectedSlip.bank_details.account_number}</p>
                  <p>
                    <strong>Payment Status:</strong> {selectedSlip.status || "-"}
                  </p>
                </div>
              </div>

              <div className="preview-salary-columns">
                <div>
                  <h3>Earnings</h3>

                  <div className="preview-salary-row">
                    <span>Basic Salary</span>
                    <strong>
                      {getAmount(
                        selectedSlip.basic_salary ??
                        getStructure(selectedSlip).basic_salary
                      )}
                    </strong>
                  </div>

                  {getAllowances(selectedSlip).map((item) => (
                    <div className="preview-salary-row" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{getAmount(item.amount)}</strong>
                    </div>
                  ))}

                  <div className="preview-salary-row preview-total">
                    <span>Gross Salary</span>
                    <strong>{getAmount(getGrossSalary(selectedSlip))}</strong>
                  </div>
                </div>

                <div>
                  <h3>Deductions</h3>

                  {getDeductions(selectedSlip).length ? (
                    getDeductions(selectedSlip).map((item) => (
                      <div className="preview-salary-row" key={item.label}>
                        <span>{item.label}</span>
                        <strong>{getAmount(item.amount)}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="preview-salary-row">
                      <span>No deductions</span>
                      <strong>{getAmount(0)}</strong>
                    </div>
                  )}

                  <div className="preview-salary-row preview-total">
                    <span>Total Deductions</span>
                    <strong>
                      {getAmount(selectedSlip.total_deduction)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="preview-net-pay">
                <strong>Net Pay</strong>
                <strong>{getAmount(getNetSalary(selectedSlip))}</strong>
              </div>

              <div className="preview-amount-words">
                Amount in Words:{" "}
                <strong>
                  {numberToWords(getNetSalary(selectedSlip))}
                </strong>
              </div>
            </div>

            <div className="salary-modal-footer">
              <button
                className="salary-close-btn"
                onClick={() => setSelectedSlip(null)}
              >
                Close
              </button>

              <button
                className="salary-print-btn"
                onClick={() => handlePrint(selectedSlip)}
              >
                Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherMySalary;
