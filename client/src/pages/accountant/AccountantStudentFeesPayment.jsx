
// import { useEffect, useState } from "react";
// import { getFeeInvoices } from "../../services/accountantService";
// import "./Accountant.css";

// function AccountantStudentFeePayment() {
//   const [invoices, setInvoices] = useState([]);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadInvoices = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getFeeInvoices();
//       const records = Array.isArray(response)
//         ? response
//         : response?.data?.data ??
//           response?.data ??
//           response?.results ??
//           [];

//       setInvoices(Array.isArray(records) ? records : []);
//     } catch (err) {
//       setError(err?.message || "Unable to load fee records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   const filteredInvoices = invoices.filter((invoice) => {
//     const searchText = search.trim().toLowerCase();

//     const matchesSearch = [
//       invoice.student_name,
//       invoice.student_id,
//       invoice.invoice_number,
//     ].some((value) =>
//       String(value ?? "").toLowerCase().includes(searchText)
//     );

//     const invoiceStatus = String(
//       invoice.status ?? invoice.invoice_status ?? ""
//     ).toUpperCase();

//     const matchesStatus =
//       status === "ALL" || invoiceStatus === status;

//     return matchesSearch && matchesStatus;
//   });

//   const money = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 2,
//     }).format(Number(value) || 0);

//   return (
//     <main className="collect-fee-page">
//       <header className="collect-fee-header">
//         <div>
//           <h1>Payment Management Student Fees Dashboard</h1>
//           <p>Search students and check their outstanding fees.</p>
//         </div>

//         <button
//           className="collect-refresh-btn"
//           onClick={loadInvoices}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </header>

//       <section className="collect-fee-filters">
//         <input
//           type="search"
//           placeholder="Search student name, Student ID or invoice..."
//           value={search}
//           onChange={(event) => setSearch(event.target.value)}
//         />

//         <select
//           value={status}
//           onChange={(event) => setStatus(event.target.value)}
//         >
//           <option value="ALL">All Invoices</option>
//           <option value="PENDING">Pending</option>
//           <option value="PARTIAL">Partially Paid</option>
//           <option value="PAID">Paid</option>
//         </select>
//       </section>

//       {error && (
//         <div className="collect-fee-error">
//           {error}
//           <button onClick={loadInvoices}>Retry</button>
//         </div>
//       )}

//       {loading ? (
//         <p className="collect-fee-message">Loading fee records...</p>
//       ) : (
//         <section className="collect-fee-table-card">
//           <div className="collect-fee-table-heading">
//             <h2>Fee Records</h2>
//             <span>{filteredInvoices.length} records</span>
//           </div>

//           <div className="collect-fee-table-scroll">
//             <table className="collect-fee-table">
//               <thead>
//                 <tr>
//                   <th>Invoice</th>
//                   <th>Student</th>
//                   <th>Class</th>
//                   <th>Total Fee</th>
//                   <th>Paid</th>
//                   <th>Due</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredInvoices.map((invoice) => {
//                   const invoiceStatus = String(
//                     invoice.status ?? invoice.invoice_status ?? "PENDING"
//                   ).toUpperCase();

//                   return (
//                     <tr key={invoice.id}>
//                       <td>{invoice.invoice_number || `#${invoice.id}`}</td>

//                       <td>
//                         <strong>{invoice.student_name || "Student"}</strong>
//                         <small>{invoice.student_id || "—"}</small>
//                       </td>

//                       <td>
//                         {invoice.class_name || "—"}
//                         {invoice.section_name
//                           ? ` / ${invoice.section_name}`
//                           : ""}
//                       </td>

//                       <td>{money(invoice.amount)}</td>
//                       <td>{money(invoice.paid_amount)}</td>
//                       <td className="collect-fee-due">
//                         {money(invoice.due_amount)}
//                       </td>

//                       <td>
//                         <span
//                           className={`collect-fee-status status-${invoiceStatus.toLowerCase()}`}
//                         >
//                           {invoiceStatus === "PARTIAL"
//                             ? "Partially Paid"
//                             : invoiceStatus}
//                         </span>
//                       </td>

//                       <td>
//                         {Number(invoice.due_amount) > 0 &&
//                         !["CANCELLED", "PAID"].includes(invoiceStatus) ? (
//                           <button
//                             className="collect-pay-btn"
//                             onClick={() =>
//                               window.alert(
//                                 `Selected invoice: ${
//                                   invoice.invoice_number || invoice.id
//                                 }. Payment form will be added in Step 3.`
//                               )
//                             }
//                           >
//                             Collect Fee
//                           </button>
//                         ) : (
//                           <span className="collect-no-due">
//                             {invoiceStatus === "PAID"
//                               ? "Paid"
//                               : "Unavailable"}
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {filteredInvoices.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="collect-fee-empty">
//                       No matching fee records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }

// export default AccountantStudentFeePayment;



import { useEffect, useState } from "react";
import {
  getFeeInvoices,
  collectStudentFee,
} from "../../services/accountantService";
import "./Accountant.css";

function AccountantStudentFeePayment() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [saving, setSaving] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_method: "CASH",
    transaction_reference: "",
    payment_date: new Date().toISOString().slice(0, 10),
    remarks: "",
  });

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

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: Number(invoice.due_amount || 0).toString(),
      payment_method: "CASH",
      transaction_reference: "",
      payment_date: new Date().toISOString().slice(0, 10),
      remarks: "",
    });
    setError("");
    setSuccess("");
  };

  const closePaymentModal = () => {
    if (saving) return;
    setSelectedInvoice(null);
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPaymentForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCollectPayment = async (event) => {
    event.preventDefault();

    if (!selectedInvoice) return;

    const amount = Number(paymentForm.amount);
    const dueAmount = Number(selectedInvoice.due_amount || 0);

    if (!amount || amount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (amount > dueAmount) {
      setError(`Payment cannot exceed remaining due of ${money(dueAmount)}.`);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        invoice: selectedInvoice.id,
        amount,
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
        transaction_reference:
          paymentForm.transaction_reference.trim(),
        remarks: paymentForm.remarks.trim(),
      };

      await collectStudentFee(payload);

      setSuccess(
        `Payment of ${money(amount)} collected successfully.`
      );

      setSelectedInvoice(null);
      await loadInvoices();
    } catch (err) {
      setError(
        err?.message || "Payment could not be collected. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <main className="collect-fee-page">
      <header className="collect-fee-header">
        <div>
          <h1>Student Fee Collection</h1>
          <p>Search students and collect their outstanding fees.</p>
        </div>

        <button
          className="collect-refresh-btn"
          onClick={loadInvoices}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {success && (
        <div className="collect-fee-success">
          {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {error && !selectedInvoice && (
        <div className="collect-fee-error">
          {error}
          <button onClick={loadInvoices}>Retry</button>
        </div>
      )}

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

                  const dueAmount = Number(invoice.due_amount || 0);

                  return (
                    <tr key={invoice.id}>
                      <td>
                        {invoice.invoice_number || `#${invoice.id}`}
                      </td>

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
                        {money(dueAmount)}
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
                        {dueAmount > 0 &&
                        !["CANCELLED", "PAID"].includes(invoiceStatus) ? (
                          <button
                            className="collect-pay-btn"
                            onClick={() => openPaymentModal(invoice)}
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

      {selectedInvoice && (
        <div
          className="fee-payment-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePaymentModal();
            }
          }}
        >
          <section
            className="fee-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fee-payment-title"
          >
            <div className="fee-payment-modal-header">
              <div>
                <h2 id="fee-payment-title">Collect Student Fee</h2>
                <p>
                  Invoice:{" "}
                  {selectedInvoice.invoice_number ||
                    `#${selectedInvoice.id}`}
                </p>
              </div>

              <button
                type="button"
                className="fee-modal-close"
                onClick={closePaymentModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <div className="fee-payment-student">
              <strong>
                {selectedInvoice.student_name || "Student"}
              </strong>
              <span>
                Student ID: {selectedInvoice.student_id || "—"}
              </span>
              <span>
                Class: {selectedInvoice.class_name || "—"}
                {selectedInvoice.section_name
                  ? ` / ${selectedInvoice.section_name}`
                  : ""}
              </span>
            </div>

            <div className="fee-payment-summary">
              <div>
                <span>Total Fee</span>
                <strong>{money(selectedInvoice.amount)}</strong>
              </div>

              <div>
                <span>Already Paid</span>
                <strong>{money(selectedInvoice.paid_amount)}</strong>
              </div>

              <div>
                <span>Remaining Due</span>
                <strong className="fee-summary-due">
                  {money(selectedInvoice.due_amount)}
                </strong>
              </div>
            </div>

            <form
              className="fee-payment-form"
              onSubmit={handleCollectPayment}
            >
              {error && (
                <div className="collect-fee-error">{error}</div>
              )}

              <label>
                Payment Amount (₹)
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  max={Number(selectedInvoice.due_amount || 0)}
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  required
                />
              </label>

              <label>
                Payment Method
                <select
                  name="payment_method"
                  value={paymentForm.payment_method}
                  onChange={handlePaymentChange}
                  required
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CARD">Card</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </label>

              <label>
                Transaction Reference
                <input
                  type="text"
                  name="transaction_reference"
                  placeholder="UPI ID / Bank reference / Cheque number"
                  value={paymentForm.transaction_reference}
                  onChange={handlePaymentChange}
                />
              </label>

              <label>
                Payment Date
                <input
                  type="date"
                  name="payment_date"
                  value={paymentForm.payment_date}
                  onChange={handlePaymentChange}
                  required
                />
              </label>

              <label>
                Remarks
                <textarea
                  name="remarks"
                  rows="3"
                  placeholder="Optional remarks..."
                  value={paymentForm.remarks}
                  onChange={handlePaymentChange}
                />
              </label>

              <div className="fee-payment-form-actions">
                <button
                  type="button"
                  className="fee-cancel-btn"
                  onClick={closePaymentModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fee-submit-btn"
                  disabled={saving}
                >
                  {saving ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default AccountantStudentFeePayment;
