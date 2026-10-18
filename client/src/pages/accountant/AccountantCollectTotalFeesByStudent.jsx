
import { useEffect, useState } from "react";
import { getFeeDashboard } from "../../services/accountantService";
import "./Accountant.css";

function AccountantCollectTotalFeesByStudent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getFeeDashboard();

        if (response?.success === false) {
          throw new Error(response.message || "Unable to load dashboard");
        }

        setData(response?.data ?? response);
      } catch (err) {
        setError(err.message || "Failed to load fee data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const records = data?.fee_records ?? [];
  const summary = data?.invoice_summary ?? {};
  const payments = data?.recent_payments ?? [];

  const filteredRecords = records.filter((item) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(item.student_name || "").toLowerCase().includes(query) ||
      String(item.student_id || "").toLowerCase().includes(query) ||
      String(item.class_name || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" ||
      String(item.status || "").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="accountant-loading">
        <div className="accountant-spinner" />
        <p>Loading Accountant Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="accountant-dashboard">
      <header className="accountant-header">
        <div>
          <h1>Collect Student Fees Management Dashboard</h1>
          <p>Manage fee collections, invoices and student dues.</p>
        </div>

        <button
          className="accountant-refresh"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh
        </button>
      </header>

      {error && (
        <div className="accountant-error" role="alert">
          {error}
        </div>
      )}

      <section className="accountant-summary-grid">
        <article className="accountant-stat-card stat-blue">
          <div className="stat-icon">₹</div>
          <div className="stat-label">Total Invoiced</div>
          <div className="stat-value">
            {money(data?.total_invoiced)}
          </div>
          <div className="stat-footnote">Total active invoice amount</div>
        </article>

        <article className="accountant-stat-card stat-green">
          <div className="stat-icon">↗</div>
          <div className="stat-label">Total Collected</div>
          <div className="stat-value">
            {money(data?.total_collected)}
          </div>
          <div className="stat-footnote">Successful payments</div>
        </article>

        <article className="accountant-stat-card stat-orange">
          <div className="stat-icon">◷</div>
          <div className="stat-label">Pending Amount</div>
          <div className="stat-value">
            {money(data?.total_due)}
          </div>
          <div className="stat-footnote">Outstanding fee balance</div>
        </article>

        <article className="accountant-stat-card stat-purple">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Paid Invoices</div>
          <div className="stat-value">{summary.paid ?? 0}</div>
          <div className="stat-footnote">Fully paid invoices</div>
        </article>
      </section>

      <section className="accountant-status-section">
        <div className="accountant-section-heading">
          <div>
            <h2>Fee Status Overview</h2>
            <p>Invoice status at a glance</p>
          </div>
        </div>

        <div className="accountant-status-grid">
          <button
            className={`accountant-status-card status-paid ${
              statusFilter === "PAID" ? "selected" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "PAID" ? "ALL" : "PAID")
            }
          >
            <span className="status-dot" />
            <span>Paid</span>
            <strong>{summary.paid ?? 0}</strong>
            <small>Invoices</small>
          </button>

          <button
            className={`accountant-status-card status-pending ${
              statusFilter === "PENDING" ? "selected" : ""
            }`}
            onClick={() =>
              setStatusFilter(
                statusFilter === "PENDING" ? "ALL" : "PENDING"
              )
            }
          >
            <span className="status-dot" />
            <span>Pending</span>
            <strong>{summary.pending ?? 0}</strong>
            <small>Invoices</small>
          </button>

          <button
            className={`accountant-status-card status-partial ${
              statusFilter === "PARTIAL" ? "selected" : ""
            }`}
            onClick={() =>
              setStatusFilter(
                statusFilter === "PARTIAL" ? "ALL" : "PARTIAL"
              )
            }
          >
            <span className="status-dot" />
            <span>Partially Paid</span>
            <strong>{summary.partial ?? 0}</strong>
            <small>Invoices</small>
          </button>
        </div>
      </section>

      <section className="accountant-panel">
        <div className="accountant-section-heading">
          <div>
            <h2>Student Fee Records</h2>
            <p>Check which students have paid and who has outstanding fees.</p>
          </div>
          <span className="accountant-record-count">
            {filteredRecords.length} records
          </span>
        </div>

        <div className="accountant-table-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student name, ID or class..."
            aria-label="Search fee records"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter invoices by status"
          >
            <option value="ALL">All statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partially paid</option>
          </select>
        </div>

        <div className="accountant-table-wrap">
          <table className="accountant-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class / Section</th>
                <th>Invoice</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Due Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">
                        {String(item.student_name || "S")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <strong>{item.student_name || "Unknown student"}</strong>
                        <small>{item.student_id || "—"}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.class_name || "—"}
                    <small className="table-subtext">
                      Section {item.section_name || "—"}
                    </small>
                  </td>
                  <td>{item.invoice_number || "—"}</td>
                  <td>{money(item.amount)}</td>
                  <td className="amount-paid">{money(item.paid_amount)}</td>
                  <td className="amount-due">{money(item.due_amount)}</td>
                  <td>
                    <span
                      className={`fee-status-badge ${String(
                        item.status || "PENDING"
                      ).toLowerCase()}`}
                    >
                      {item.status === "PARTIAL"
                        ? "Partially Paid"
                        : item.status === "PAID"
                          ? "Paid"
                          : item.status === "CANCELLED"
                            ? "Cancelled"
                            : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="7" className="accountant-empty">
                    No matching fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="accountant-panel">
        <div className="accountant-section-heading">
          <div>
            <h2>Recent Successful Payments</h2>
            <p>Latest recorded fee transactions</p>
          </div>
        </div>

        <div className="accountant-table-wrap">
          <table className="accountant-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Student</th>
                <th>Payment Method</th>
                <th>Payment Date</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td><strong>{payment.receipt_number || "—"}</strong></td>
                  <td>
                    {payment.student_name || "—"}
                    <small className="table-subtext">
                      {payment.student_id || ""}
                    </small>
                  </td>
                  <td>{payment.payment_method || "—"}</td>
                  <td>{payment.payment_date || "—"}</td>
                  <td className="amount-paid">{money(payment.amount)}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="accountant-empty">
                    No successful payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AccountantCollectTotalFeesByStudent;
