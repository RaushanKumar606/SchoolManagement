
import { useEffect, useMemo, useState } from "react";
import accountantService from "../../services/accountantService";
import "./Accountant.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

function getRows(response) {
  return response?.data ?? response?.results ?? response ?? [];
}

export default function TeacherSalaryManagement() {
  const now = new Date();

  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [slips, setSlips] = useState([]);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [paymentReference, setPaymentReference] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [employeeResponse, structureResponse, slipResponse] =
        await Promise.all([
          accountantService.getPayrollEmployees(),
          accountantService.getSalaryStructures(),
          accountantService.getSalarySlips(),
        ]);

      setEmployees(getRows(employeeResponse));
      setStructures(getRows(structureResponse));
      setSlips(getRows(slipResponse));
    } catch (err) {
      console.error("Salary management loading error:", err);
      setError(err.message || "Unable to load salary data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentSlips = useMemo(
    () =>
      slips.filter(
        (slip) =>
          Number(slip.month) === Number(month) &&
          Number(slip.year) === Number(year)
      ),
    [slips, month, year]
  );

  const filteredSlips = useMemo(() => {
    return currentSlips.filter((slip) => {
      const name = (
        slip.employee_name ||
        slip.employee_username ||
        ""
      ).toLowerCase();

      const matchesSearch = name.includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || slip.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [currentSlips, search, status]);

  const totalSalary = currentSlips.reduce(
    (sum, slip) => sum + Number(slip.net_salary || 0),
    0
  );

  const paidSalary = currentSlips
    .filter((slip) => slip.status === "PAID")
    .reduce((sum, slip) => sum + Number(slip.net_salary || 0), 0);

  const pendingSalary = currentSlips
    .filter((slip) => slip.status !== "PAID")
    .reduce((sum, slip) => sum + Number(slip.net_salary || 0), 0);

  const generateSlip = async (employee, structure) => {
    return accountantService.createSalarySlip({
      employee: employee.id,
      salary_structure: structure.id,
      month: Number(month),
      year: Number(year),
    });
  };

  const handleGenerateAll = async () => {
    if (!window.confirm(`Generate salary slips for all eligible employees for ${MONTHS[month - 1]} ${year}?`)) {
      return;
    }

    setProcessing(true);
    setMessage("");
    setError("");

    let created = 0;
    let skipped = 0;

    try {
      const eligibleEmployees = employees.filter((employee) =>
        ["TEACHER", "STAFF", "HR"].includes(
          String(employee.role || "").toUpperCase()
        )
      );

      for (const employee of eligibleEmployees) {
        const structure = structures.find(
          (item) =>
            Number(item.employee) === Number(employee.id) &&
            item.is_active
        );

        if (!structure) {
          skipped++;
          continue;
        }

        try {
          await generateSlip(employee, structure);
          created++;
        } catch (err) {
          console.warn(`Could not generate slip for ${employee.name}:`, err);
          skipped++;
        }
      }

      setMessage(`${created} salary slips generated. ${skipped} skipped (missing structure or already generated).`);
      await loadData();
    } catch (err) {
      setError(err.message || "Salary generation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async (slip) => {
    if (!window.confirm(`Approve salary for ${slip.employee_name}?`)) return;

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      await accountantService.approveSalarySlip(slip.id);
      setMessage("Salary approved successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Could not approve salary.");
    } finally {
      setProcessing(false);
    }
  };

  const openPayment = (slip) => {
    setPaymentSlip(slip);
    setPaymentMethod("BANK");
    setPaymentReference("");
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!paymentSlip) return;

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      await accountantService.paySalary(paymentSlip.id, {
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        remarks: `${MONTHS[month - 1]} ${year} salary payment`,
      });

      setPaymentSlip(null);
      setMessage("Salary payment completed successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Salary payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkPayment = async () => {
    const payable = currentSlips.filter(
      (slip) => selected.includes(slip.id) && slip.status === "APPROVED"
    );

    if (!payable.length) {
      setError("Select at least one approved salary slip.");
      return;
    }

    if (!window.confirm(`Pay ${payable.length} selected salaries?`)) return;

    setProcessing(true);
    setError("");
    setMessage("");

    let paid = 0;
    let failed = 0;

    for (const slip of payable) {
      try {
        await accountantService.paySalary(slip.id, {
          payment_method: "BANK",
          payment_reference: "",
          remarks: `Bulk salary payment - ${MONTHS[month - 1]} ${year}`,
        });
        paid++;
      } catch (err) {
        console.error(`Payment failed for slip ${slip.id}:`, err);
        failed++;
      }
    }

    setSelected([]);
    setMessage(`${paid} salaries paid successfully. ${failed} failed.`);
    await loadData();
    setProcessing(false);
  };

  const toggleSelected = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleAll = () => {
    const payableIds = filteredSlips
      .filter((slip) => slip.status === "APPROVED")
      .map((slip) => slip.id);

    const allSelected = payableIds.every((id) => selected.includes(id));

    setSelected((previous) =>
      allSelected
        ? previous.filter((id) => !payableIds.includes(id))
        : [...new Set([...previous, ...payableIds])]
    );
  };

  const printSlip = (slip) => {
    const content = `
      <html>
      <head>
        <title>Salary Slip</title>
        <style>
          body { font-family: Arial; padding: 35px; color: #172033; }
          h1 { text-align: center; }
          .line { border-bottom: 1px solid #ddd; padding: 12px 0; display:flex; justify-content:space-between; }
          .total { font-size: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Salary Slip</h1>
        <p>Employee: ${slip.employee_name || slip.employee_username || ""}</p>
        <p>Salary Period: ${MONTHS[Number(slip.month) - 1]} ${slip.year}</p>
        <div class="line"><span>Basic Salary</span><b>${money(slip.basic_salary)}</b></div>
        <div class="line"><span>Total Allowance</span><b>${money(slip.total_allowance)}</b></div>
        <div class="line"><span>Total Deduction</span><b>${money(slip.total_deduction)}</b></div>
        <div class="line total"><span>Net Salary</span><b>${money(slip.net_salary)}</b></div>
        <p>Status: ${slip.status}</p>
        <p>Payment Method: ${slip.payment_method || "Not paid"}</p>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=700");
    if (!printWindow) {
      setError("Please allow pop-ups to print the salary slip.");
      return;
    }

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <main className="salary-page">
      <header className="salary-header">
        <div>
          <span className="salary-eyebrow">ACCOUNTANT / PAYROLL</span>
          <h1>Teacher Salary Management</h1>
          <p>Generate, approve and manage employee salary payments.</p>
        </div>

        <button
          className="salary-primary-btn"
          onClick={handleGenerateAll}
          disabled={processing || loading}
        >
          + Generate All Salaries
        </button>
      </header>

      {error && <div className="salary-alert error">{error}</div>}
      {message && <div className="salary-alert success">{message}</div>}

      <section className="salary-stats">
        <article>
          <span>Total Salary</span>
          <strong>{money(totalSalary)}</strong>
          <small>{currentSlips.length} salary slips</small>
        </article>
        <article>
          <span>Paid Salary</span>
          <strong>{money(paidSalary)}</strong>
          <small>Successfully paid</small>
        </article>
        <article>
          <span>Pending Salary</span>
          <strong>{money(pendingSalary)}</strong>
          <small>Awaiting payment</small>
        </article>
        <article>
          <span>Employees</span>
          <strong>{employees.length}</strong>
          <small>Available employees</small>
        </article>
      </section>

      <section className="salary-panel">
        <div className="salary-panel-heading">
          <div>
            <h2>Salary Records</h2>
            <p>Review employee salary slips and payment status.</p>
          </div>
          <button
            className="salary-outline-btn"
            onClick={loadData}
            disabled={loading || processing}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="salary-filters">
          <input
            placeholder="Search employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
            {MONTHS.map((name, index) => (
              <option value={index + 1} key={name}>{name}</option>
            ))}
          </select>

          <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {[year - 1, year, year + 1].sort().map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <div className="salary-bulk-toolbar">
          <label>
            <input
              type="checkbox"
              checked={
                filteredSlips.filter((slip) => slip.status === "APPROVED").length > 0 &&
                filteredSlips
                  .filter((slip) => slip.status === "APPROVED")
                  .every((slip) => selected.includes(slip.id))
              }
              onChange={toggleAll}
            />
            Select approved salaries
          </label>

          <button
            className="salary-primary-btn"
            onClick={handleBulkPayment}
            disabled={processing || selected.length === 0}
          >
            Pay Selected ({selected.length})
          </button>
        </div>

        {loading ? (
          <div className="salary-empty">Loading salary records...</div>
        ) : filteredSlips.length === 0 ? (
          <div className="salary-empty">
            No salary records found for {MONTHS[month - 1]} {year}.
            <br />
            Generate salary slips after creating employee salary structures.
          </div>
        ) : (
          <div className="salary-table-wrap">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Employee</th>
                  <th>Basic Salary</th>
                  <th>Allowance</th>
                  <th>Deduction</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlips.map((slip) => (
                  <tr key={slip.id}>
                    <td>
                      {slip.status === "APPROVED" ? (
                        <input
                          type="checkbox"
                          checked={selected.includes(slip.id)}
                          onChange={() => toggleSelected(slip.id)}
                        />
                      ) : "—"}
                    </td>
                    <td>
                      <strong>{slip.employee_name || slip.employee_username}</strong>
                      <small>Employee #{slip.employee}</small>
                    </td>
                    <td>{money(slip.basic_salary)}</td>
                    <td>{money(slip.total_allowance)}</td>
                    <td>{money(slip.total_deduction)}</td>
                    <td><strong>{money(slip.net_salary)}</strong></td>
                    <td>
                      <span className={`salary-status ${String(slip.status).toLowerCase()}`}>
                        {slip.status}
                      </span>
                    </td>
                    <td>
                      <div className="salary-actions">
                        {slip.status === "DRAFT" && (
                          <button onClick={() => handleApprove(slip)} disabled={processing}>
                            Approve
                          </button>
                        )}
                        {slip.status === "APPROVED" && (
                          <button onClick={() => openPayment(slip)} disabled={processing}>
                            Pay
                          </button>
                        )}
                        <button onClick={() => printSlip(slip)}>Print</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {paymentSlip && (
        <div className="salary-modal-backdrop">
          <form className="salary-payment-modal" onSubmit={handlePayment}>
            <button
              type="button"
              className="salary-modal-close"
              onClick={() => setPaymentSlip(null)}
            >
              ×
            </button>

            <h2>Pay Employee Salary</h2>
            <p>{paymentSlip.employee_name} — {money(paymentSlip.net_salary)}</p>

            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="BANK">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
            </select>

            <label>Transaction Reference (optional)</label>
            <input
              value={paymentReference}
              onChange={(event) => setPaymentReference(event.target.value)}
              placeholder="Enter transaction / UTR number"
            />

            <button className="salary-primary-btn" disabled={processing}>
              {processing ? "Processing..." : "Confirm Payment"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
