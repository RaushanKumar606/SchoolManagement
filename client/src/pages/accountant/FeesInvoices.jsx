import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
import "./FeesInvoice.css";

function FeesInvoice() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  // =====================================================
  // LOAD INVOICES
  // API CALL ONLY WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * Is function ko accountantService ke
       * Fees Invoice API se connect karenge.
       */

      const response =
        await accountantService.getFeesInvoices();

      if (response?.success) {
        setInvoices(response.data || []);
      } else {
        setError(
          response?.message ||
            "Unable to load fees invoices."
        );
      }
    } catch (err) {
      console.error(
        "Fees Invoice API Error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading fees invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredInvoices = invoices.filter(
    (invoice) => {
      const searchText =
        search.toLowerCase().trim();

      const studentName = String(
        invoice.student_name ||
          invoice.student?.name ||
          invoice.student?.username ||
          ""
      ).toLowerCase();

      const studentUsername = String(
        invoice.student_username ||
          invoice.student?.username ||
          ""
      ).toLowerCase();

      const invoiceNumber = String(
        invoice.invoice_number ||
          invoice.invoice_no ||
          invoice.id ||
          ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentUsername.includes(searchText) ||
        invoiceNumber.includes(searchText);

      const invoiceStatus =
        String(
          invoice.status || ""
        ).toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        invoiceStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // VIEW INVOICE
  // =====================================================

  const handleView = async (invoice) => {
    try {
      setError("");

      /*
       * Agar detail API available hai to use karo.
       * Filhaal selected invoice ka data show karenge.
       */

      if (invoice.id) {
        const response =
          await accountantService.getFeesInvoice(
            invoice.id
          );

        if (response?.success) {
          setSelectedInvoice(
            response.data
          );
          setShowDetails(true);
          return;
        }
      }

      setSelectedInvoice(invoice);
      setShowDetails(true);

    } catch (err) {
      console.error(
        "Invoice Detail Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load invoice details."
      );
    }
  };

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
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
    fetchInvoices();
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalInvoices =
    invoices.length;

  const paidInvoices =
    invoices.filter(
      (invoice) =>
        String(
          invoice.status || ""
        ).toUpperCase() === "PAID"
    ).length;

  const pendingInvoices =
    invoices.filter(
      (invoice) =>
        String(
          invoice.status || ""
        ).toUpperCase() === "PENDING"
    ).length;

  const totalAmount =
    invoices.reduce(
      (total, invoice) =>
        total +
        Number(
          invoice.total_amount ||
            invoice.amount ||
            invoice.total ||
            0
        ),
      0
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="fees-invoice-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="fees-invoice-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={handleBack}
            title="Back to Dashboard"
          >
            ←
          </button>

          <div>
            <h1>
              Fees Invoice
            </h1>

            <p>
              Manage student fees invoices
            </p>
          </div>

        </div>

        <button
          className="refresh-button"
          onClick={handleRetry}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Refresh"}
        </button>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="fees-invoice-content">

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="invoice-summary">

          <div className="invoice-summary-card">

            <span>
              Total Invoices
            </span>

            <strong>
              {loading
                ? "..."
                : totalInvoices}
            </strong>

          </div>

          <div className="invoice-summary-card">

            <span>
              Paid
            </span>

            <strong>
              {loading
                ? "..."
                : paidInvoices}
            </strong>

          </div>

          <div className="invoice-summary-card">

            <span>
              Pending
            </span>

            <strong>
              {loading
                ? "..."
                : pendingInvoices}
            </strong>

          </div>

          <div className="invoice-summary-card">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{" "}
              {loading
                ? "..."
                : formatMoney(
                    totalAmount
                  )}
            </strong>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="invoice-error">

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
            FILTERS
        ================================================= */}

        <section className="invoice-filter-card">

          <div className="search-box">

            <label>
              Search
            </label>

            <input
              type="text"
              placeholder="Search student or invoice number..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="status-filter">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="PARTIAL">
                Partial
              </option>

              <option value="OVERDUE">
                Overdue
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>

            </select>

          </div>

        </section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="invoice-loading">

            <div className="loader-spinner"></div>

            <p>
              Loading fees invoices...
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <section className="invoice-table-card">

            <div className="table-header">

              <div>

                <h2>
                  Student Fees Invoices
                </h2>

                <p>
                  {filteredInvoices.length} invoice
                  {filteredInvoices.length !==
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
                      Invoice
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Due Date
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredInvoices.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-row"
                      >
                        No fees invoices found.
                      </td>

                    </tr>

                  ) : (

                    filteredInvoices.map(
                      (
                        invoice,
                        index
                      ) => (

                        <tr
                          key={
                            invoice.id ||
                            index
                          }
                        >

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>

                          {/* INVOICE */}

                          <td>

                            <strong>
                              {invoice.invoice_number ||
                                invoice.invoice_no ||
                                `INV-${invoice.id}`}
                            </strong>

                          </td>

                          {/* STUDENT */}

                          <td>

                            <div className="student-cell">

                              <div className="student-avatar">

                                {String(
                                  invoice.student_name ||
                                    invoice.student?.name ||
                                    invoice.student?.username ||
                                    "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {invoice.student_name ||
                                    invoice.student?.name ||
                                    invoice.student?.username ||
                                    "N/A"}
                                </strong>

                                <small>
                                  {invoice.student_username ||
                                    invoice.student?.username ||
                                    ""}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* DATE */}

                          <td>
                            {invoice.invoice_date ||
                              invoice.date ||
                              "N/A"}
                          </td>

                          {/* DUE DATE */}

                          <td>
                            {invoice.due_date ||
                              "N/A"}
                          </td>

                          {/* AMOUNT */}

                          <td>

                            <strong>
                              ₹{" "}
                              {formatMoney(
                                invoice.total_amount ||
                                  invoice.amount ||
                                  invoice.total
                              )}
                            </strong>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`invoice-status ${getStatusClass(
                                invoice.status
                              )}`}
                            >
                              {invoice.status ||
                                "N/A"}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td>

                            <button
                              className="view-invoice-button"
                              onClick={() =>
                                handleView(
                                  invoice
                                )
                              }
                            >
                              View
                            </button>

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
          DETAILS MODAL
      ================================================= */}

      {showDetails &&
        selectedInvoice && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowDetails(false)
            }
          >

            <div
              className="invoice-details-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>

                  <h2>
                    Invoice Details
                  </h2>

                  <p>
                    {selectedInvoice.invoice_number ||
                      selectedInvoice.invoice_no ||
                      `INV-${selectedInvoice.id}`}
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

              <div className="invoice-details">

                <div className="detail-item">

                  <span>
                    Invoice Number
                  </span>

                  <strong>
                    {selectedInvoice.invoice_number ||
                      selectedInvoice.invoice_no ||
                      `INV-${selectedInvoice.id}`}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Student
                  </span>

                  <strong>
                    {selectedInvoice.student_name ||
                      selectedInvoice.student?.name ||
                      selectedInvoice.student?.username ||
                      "N/A"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Invoice Date
                  </span>

                  <strong>
                    {selectedInvoice.invoice_date ||
                      selectedInvoice.date ||
                      "N/A"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Due Date
                  </span>

                  <strong>
                    {selectedInvoice.due_date ||
                      "N/A"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Amount
                  </span>

                  <strong>
                    ₹{" "}
                    {formatMoney(
                      selectedInvoice.total_amount ||
                        selectedInvoice.amount ||
                        selectedInvoice.total
                    )}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong>
                    {selectedInvoice.status ||
                      "N/A"}
                  </strong>

                </div>

                {selectedInvoice.payment_method && (

                  <div className="detail-item">

                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {
                        selectedInvoice.payment_method
                      }
                    </strong>

                  </div>

                )}

                {selectedInvoice.payment_reference && (

                  <div className="detail-item">

                    <span>
                      Payment Reference
                    </span>

                    <strong>
                      {
                        selectedInvoice.payment_reference
                      }
                    </strong>

                  </div>

                )}

                {selectedInvoice.remarks && (

                  <div className="detail-item detail-full">

                    <span>
                      Remarks
                    </span>

                    <strong>
                      {selectedInvoice.remarks}
                    </strong>

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