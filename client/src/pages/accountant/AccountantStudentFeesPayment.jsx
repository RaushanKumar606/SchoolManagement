
import { useEffect, useState } from "react";
import { getFeeInvoices } from "../../services/accountantService";
import "./Accountant.css";

function AccountantStudentFeePayment() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFeeInvoices();
      const records = Array.isArray(response)
        ? response
        : response?.data?.data ??
          response?.data ??
          response?.results ??
          [];

      setInvoices(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || "Unable to load fee records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = [
      invoice.student_name,
      invoice.student_id,
      invoice.invoice_number,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(searchText)
    );

    const invoiceStatus = String(
      invoice.status ?? invoice.invoice_status ?? ""
    ).toUpperCase();

    const matchesStatus =
      status === "ALL" || invoiceStatus === status;

    return matchesSearch && matchesStatus;
  });

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  return (
    <main className="collect-fee-page">
      <header className="collect-fee-header">
        <div>
          <h1>Payment Management Student Fees Dashboard</h1>
          <p>Search students and check their outstanding fees.</p>
        </div>

        <button
          className="collect-refresh-btn"
          onClick={loadInvoices}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="collect-fee-filters">
        <input
          type="search"
          placeholder="Search student name, Student ID or invoice..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All Invoices</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partially Paid</option>
          <option value="PAID">Paid</option>
        </select>
      </section>

      {error && (
        <div className="collect-fee-error">
          {error}
          <button onClick={loadInvoices}>Retry</button>
        </div>
      )}

      {loading ? (
        <p className="collect-fee-message">Loading fee records...</p>
      ) : (
        <section className="collect-fee-table-card">
          <div className="collect-fee-table-heading">
            <h2>Fee Records</h2>
            <span>{filteredInvoices.length} records</span>
          </div>

          <div className="collect-fee-table-scroll">
            <table className="collect-fee-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Total Fee</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => {
                  const invoiceStatus = String(
                    invoice.status ?? invoice.invoice_status ?? "PENDING"
                  ).toUpperCase();

                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.invoice_number || `#${invoice.id}`}</td>

                      <td>
                        <strong>{invoice.student_name || "Student"}</strong>
                        <small>{invoice.student_id || "—"}</small>
                      </td>

                      <td>
                        {invoice.class_name || "—"}
                        {invoice.section_name
                          ? ` / ${invoice.section_name}`
                          : ""}
                      </td>

                      <td>{money(invoice.amount)}</td>
                      <td>{money(invoice.paid_amount)}</td>
                      <td className="collect-fee-due">
                        {money(invoice.due_amount)}
                      </td>

                      <td>
                        <span
                          className={`collect-fee-status status-${invoiceStatus.toLowerCase()}`}
                        >
                          {invoiceStatus === "PARTIAL"
                            ? "Partially Paid"
                            : invoiceStatus}
                        </span>
                      </td>

                      <td>
                        {Number(invoice.due_amount) > 0 &&
                        !["CANCELLED", "PAID"].includes(invoiceStatus) ? (
                          <button
                            className="collect-pay-btn"
                            onClick={() =>
                              window.alert(
                                `Selected invoice: ${
                                  invoice.invoice_number || invoice.id
                                }. Payment form will be added in Step 3.`
                              )
                            }
                          >
                            Collect Fee
                          </button>
                        ) : (
                          <span className="collect-no-due">
                            {invoiceStatus === "PAID"
                              ? "Paid"
                              : "Unavailable"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="collect-fee-empty">
                      No matching fee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default AccountantStudentFeePayment;
