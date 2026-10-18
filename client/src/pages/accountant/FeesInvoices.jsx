
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
// import "./FeesInvoice.css";

function FeesInvoice() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  // --------------------------------------------------
  // LOAD INVOICES
  // --------------------------------------------------
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await accountantService.getFeeInvoices();

      console.log("FEES INVOICE API RESPONSE:", response);

      // Supports common Django REST Framework response formats.
      const invoiceList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
            ? response.results
            : Array.isArray(response?.data?.results)
              ? response.data.results
              : Array.isArray(response?.data?.data)
                ? response.data.data
                : null;

      if (invoiceList === null) {
        throw new Error(
          response?.message ||
          "Invoice response format is incorrect. Check the console."
        );
      }

      setInvoices(invoiceList);
    } catch (err) {
      console.error("Fees Invoice API Error:", err);
      setInvoices([]);
      setError(err?.message || "Unable to load fee invoices.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  const formatDate = (dateValue) => {
    if (!dateValue || dateValue === "N/A") return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  const formatMoney = (value) => {
    const amount = Number(value ?? 0);

    return (Number.isFinite(amount) ? amount : 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const getInvoiceAmount = (invoice) =>
    Number(
      invoice?.amount ??
      invoice?.total_amount ??
      invoice?.total ??
      0
    );

  const getPaidAmount = (invoice) =>
    Number(invoice?.paid_amount ?? 0);

  const getDueAmount = (invoice) =>
    Number(
      invoice?.due_amount ??
      Math.max(getInvoiceAmount(invoice) - getPaidAmount(invoice), 0)
    );

  const getStudentName = (invoice) =>
    invoice?.student_name ||
    invoice?.student?.name ||
    invoice?.student?.full_name ||
    invoice?.student?.username ||
    "N/A";

  const getStudentUsername = (invoice) =>
    invoice?.student_username ||
    invoice?.student?.username ||
    invoice?.student_id ||
    "";

  const getInvoiceNumber = (invoice) =>
    invoice?.invoice_number ||
    invoice?.invoice_no ||
    `INV-${invoice?.id ?? "N/A"}`;

  const getInvoiceDate = (invoice) =>
    invoice?.invoice_date ||
    invoice?.date ||
    invoice?.created_at ||
    "N/A";

  const getStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "PAID":
        return "invoice-status-paid";
      case "PENDING":
        return "invoice-status-pending";
      case "PARTIAL":
        return "invoice-status-partial";
      case "OVERDUE":
        return "invoice-status-overdue";
      case "CANCELLED":
        return "invoice-status-cancelled";
      default:
        return "invoice-status-default";
    }
  };

  // --------------------------------------------------
  // SEARCH + STATUS FILTER
  // --------------------------------------------------
  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      String(getStudentName(invoice)).toLowerCase().includes(searchText) ||
      String(getStudentUsername(invoice)).toLowerCase().includes(searchText) ||
      String(getInvoiceNumber(invoice)).toLowerCase().includes(searchText);

    const status = String(invoice?.status || "").toUpperCase();

    const matchesStatus =
      statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --------------------------------------------------
  // VIEW INVOICE DETAILS
  // --------------------------------------------------
  const handleView = async (invoice) => {
    setError("");

    // Show the available invoice data immediately.
    setSelectedInvoice(invoice);
    setShowDetails(true);

    // Fetch detail only if the service method exists.
    if (!invoice?.id || typeof accountantService.getFeesInvoice !== "function") {
      return;
    }

    try {
      const response = await accountantService.getFeeInvoices(invoice.id);

      console.log("INVOICE DETAIL RESPONSE:", response);

      const detail =
        response?.data?.data ??
        response?.data ??
        response?.invoice ??
        response;

      if (detail && typeof detail === "object" && !Array.isArray(detail)) {
        setSelectedInvoice((previous) => ({
          ...previous,
          ...detail,
        }));
      }
    } catch (err) {
      console.error("Invoice Detail Error:", err);
      // Keep the invoice list data visible if detail API fails.
    }
  };

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------
  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) =>
      String(invoice?.status || "").toUpperCase() === "PAID"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) =>
      String(invoice?.status || "").toUpperCase() === "PENDING"
  ).length;

  const totalAmount = invoices.reduce(
    (total, invoice) => total + getInvoiceAmount(invoice),
    0
  );

  const totalPaid = invoices.reduce(
    (total, invoice) => total + getPaidAmount(invoice),
    0
  );

  const totalDue = invoices.reduce(
    (total, invoice) => total + getDueAmount(invoice),
    0
  );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="fees-invoice-page">
      <header className="fees-invoice-header">
        <div className="header-left">
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
            title="Back to Dashboard"
          >
            ←
          </button>

          <div>
            <h1>Fees Invoice</h1>
            <p>Manage student fee invoices and payments</p>
          </div>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchInvoices}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <main className="fees-invoice-content">
        {/* SUMMARY CARDS */}
        <section className="invoice-summary">
          <div className="invoice-summary-card">
            <span>Total Invoices</span>
            <strong>{loading ? "..." : totalInvoices}</strong>
          </div>

          <div className="invoice-summary-card">
            <span>Paid Invoices</span>
            <strong>{loading ? "..." : paidInvoices}</strong>
          </div>

          <div className="invoice-summary-card">
            <span>Pending Invoices</span>
            <strong>{loading ? "..." : pendingInvoices}</strong>
          </div>

          <div className="invoice-summary-card">
            <span>Total Amount</span>
            <strong>
              {loading ? "..." : `₹ ${formatMoney(totalAmount)}`}
            </strong>
            <small className="invoice-payment-breakdown">
              Paid: ₹ {formatMoney(totalPaid)}
              {" | "}
              Due: ₹ {formatMoney(totalDue)}
            </small>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="invoice-error" role="alert">
            <div>
              <strong>Error</strong>
              <span>{error}</span>
            </div>

            <button type="button" onClick={fetchInvoices}>
              Retry
            </button>
          </div>
        )}

        {/* FILTERS */}
        <section className="invoice-filter-card">
          <div className="search-box">
            <label htmlFor="invoice-search">Search</label>
            <input
              id="invoice-search"
              type="text"
              placeholder="Search student or invoice number..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="status-filter">
            <label htmlFor="invoice-status">Status</label>
            <select
              id="invoice-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </section>

        {/* INVOICE TABLE */}
        {loading ? (
          <div className="invoice-loading">
            <div className="loader-spinner" />
            <p>Loading fee invoices...</p>
          </div>
        ) : (
          <section className="invoice-table-card">
            <div className="table-header">
              <div>
                <h2>Student Fees Invoices</h2>
                <p>
                  {filteredInvoices.length} invoice
                  {filteredInvoices.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice</th>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-row">
                        No fee invoices found.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice, index) => (
                      <tr key={invoice.id ?? index}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{getInvoiceNumber(invoice)}</strong>
                        </td>

                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {String(getStudentName(invoice))
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{getStudentName(invoice)}</strong>
                              <small>{getStudentUsername(invoice)}</small>
                            </div>
                          </div>
                        </td>

                        <td>{formatDate(getInvoiceDate(invoice))}</td>

                        <td>{formatDate(invoice.due_date)}</td>

                        <td>
                          <strong>
                            ₹ {formatMoney(getInvoiceAmount(invoice))}
                          </strong>
                          <small className="invoice-payment-breakdown">
                            Paid: ₹ {formatMoney(getPaidAmount(invoice))}
                            {" | "}
                            Due: ₹ {formatMoney(getDueAmount(invoice))}
                          </small>
                        </td>

                        <td>
                          <span
                            className={`invoice-status ${getStatusClass(
                              invoice.status
                            )}`}
                          >
                            {invoice.status || "N/A"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="view-invoice-button"
                            onClick={() => handleView(invoice)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* INVOICE DETAILS MODAL */}
      {showDetails && selectedInvoice && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="invoice-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Invoice Details</h2>
                <p>{getInvoiceNumber(selectedInvoice)}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                aria-label="Close invoice details"
              >
                ×
              </button>
            </div>

            <div className="invoice-details">
              <div className="detail-item">
                <span>Invoice Number</span>
                <strong>{getInvoiceNumber(selectedInvoice)}</strong>
              </div>

              <div className="detail-item">
                <span>Student</span>
                <strong>{getStudentName(selectedInvoice)}</strong>
              </div>

              <div className="detail-item">
                <span>Invoice Date</span>
                <strong>{getInvoiceDate(selectedInvoice)}</strong>
              </div>

              <div className="detail-item">
                <span>Due Date</span>
                <strong>{selectedInvoice.due_date || "N/A"}</strong>
              </div>

              <div className="detail-item">
                <span>Total Amount</span>
                <strong>₹ {formatMoney(getInvoiceAmount(selectedInvoice))}</strong>
              </div>

              <div className="detail-item">
                <span>Paid Amount</span>
                <strong>₹ {formatMoney(getPaidAmount(selectedInvoice))}</strong>
              </div>

              <div className="detail-item">
                <span>Due Amount</span>
                <strong>₹ {formatMoney(getDueAmount(selectedInvoice))}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>{selectedInvoice.status || "N/A"}</strong>
              </div>

              {selectedInvoice.payment_method && (
                <div className="detail-item">
                  <span>Payment Method</span>
                  <strong>{selectedInvoice.payment_method}</strong>
                </div>
              )}

              {selectedInvoice.payment_reference && (
                <div className="detail-item">
                  <span>Payment Reference</span>
                  <strong>{selectedInvoice.payment_reference}</strong>
                </div>
              )}

              {selectedInvoice.remarks && (
                <div className="detail-item detail-full">
                  <span>Remarks</span>
                  <strong>{selectedInvoice.remarks}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeesInvoice;
