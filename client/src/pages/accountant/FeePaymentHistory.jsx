
import { useEffect, useState } from "react";
import { getFeePayments } from "../../services/accountantService";
import "./Accountant.css";

function FeePaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFeePayments();
  console.log(response);
      const records = Array.isArray(response)
        ? response
        : response?.data?.data ??
          response?.data?.results ??
          response?.data ??
          response?.results ??
          [];

      setPayments(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || "Unable to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const escapeHtml = (value) =>
    String(value ?? "—").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });

  const openReceipt = (payment, download = false) => {
    const popup = window.open("", "_blank", "width=900,height=750");

    if (!popup) {
      alert("Please allow pop-ups to print or download the receipt.");
      return;
    }

    const receiptNumber = escapeHtml(payment.receipt_number);
    const studentName = escapeHtml(payment.student_name);
    const studentId = escapeHtml(payment.student_id);
    const rollNumber = escapeHtml(payment.roll_number);
    const className = escapeHtml(payment.class_name);
    const sectionName = escapeHtml(payment.section_name);
    const invoiceNumber = escapeHtml(payment.invoice_number);
    const amount = money(payment.amount);
    const paymentMethod = escapeHtml(payment.payment_method);
    const transactionReference = escapeHtml(
      payment.transaction_reference || "Not applicable"
    );
    const paymentDate = formatDate(payment.payment_date);
    const collectedBy = escapeHtml(payment.collected_by_name);
    const remarks = escapeHtml(payment.remarks || "—");

    popup.document.open();
    popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Receipt-${receiptNumber}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 35px;
            font-family: Arial, sans-serif;
            color: #172b4d;
            background: #fff;
          }
          .receipt {
            max-width: 750px;
            margin: auto;
            padding: 35px;
            border: 1px solid #dbe2ea;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0 0 8px;
            font-size: 25px;
            color: #1e3a8a;
          }
          .header p { margin: 0; color: #64748b; }
          .receipt-title {
            text-align: center;
            margin: 25px 0;
            font-size: 21px;
            letter-spacing: 2px;
          }
          .receipt-meta {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 25px;
          }
          .details {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .details td {
            padding: 12px;
            border: 1px solid #dbe2ea;
            font-size: 14px;
          }
          .details td:first-child {
            width: 38%;
            font-weight: bold;
            background: #f8fafc;
          }
          .amount {
            padding: 18px;
            margin: 20px 0;
            text-align: center;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
          }
          .amount span {
            display: block;
            margin-bottom: 7px;
            color: #475569;
          }
          .amount strong {
            font-size: 27px;
            color: #1e40af;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 55px;
          }
          .signature {
            width: 45%;
            padding-top: 10px;
            border-top: 1px solid #64748b;
            text-align: center;
            font-size: 13px;
          }
          .thank-you {
            margin-top: 35px;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 11px 25px;
            border: 0;
            border-radius: 6px;
            color: white;
            background: #1e40af;
            cursor: pointer;
          }
          @media print {
            body { padding: 0; }
            .receipt {
              max-width: none;
              border: none;
              padding: 15px;
            }
            .print-button { display: none; }
            @page { size: A4; margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">
          ${download ? "Save as PDF" : "Print Receipt"}
        </button>

        <main class="receipt">
          <header class="header">
            <h1>School Management System</h1>
            <p>Official Student Fee Payment Receipt</p>
          </header>

          <h2 class="receipt-title">PAYMENT RECEIPT</h2>

          <div class="receipt-meta">
            <strong>Receipt No: ${receiptNumber}</strong>
            <strong>Date: ${escapeHtml(paymentDate)}</strong>
          </div>

          <table class="details">
            <tr><td>Student Name</td><td>${studentName}</td></tr>
            <tr><td>Student ID</td><td>${studentId}</td></tr>
           <tr><td>Roll Number</td><td>${rollNumber}</td></tr>
            <tr><td>Class / Section</td><td>${className} / ${sectionName}</td></tr>
            <tr><td>Invoice Number</td><td>${invoiceNumber}</td></tr>
            <tr><td>Payment Method</td><td>${paymentMethod}</td></tr>
            <tr><td>Transaction Reference</td><td>${transactionReference}</td></tr>
            <tr><td>Collected By</td><td>${collectedBy}</td></tr>
            <tr><td>Remarks</td><td>${remarks}</td></tr>
          </table>

          <div class="amount">
            <span>Amount Received</span>
            <strong>${escapeHtml(amount)}</strong>
          </div>

          <div class="footer">
            <div class="signature">Accountant Signature</div>
            <div class="signature">Authorized Signature</div>
          </div>

          <p class="thank-you">
            Thank you. This is a computer-generated payment receipt.
          </p>
        </main>
      </body>
      </html>
    `);
    popup.document.close();

    popup.focus();

    if (!download) {
      popup.print();
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const text = search.trim().toLowerCase();

    return [
      payment.receipt_number,
      payment.student_name,
      payment.student_id,
      payment.roll_number,
      payment.invoice_number,
      payment.transaction_reference,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(text)
    );
  });

  const totalCollected = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  return (
    <main className="fee-history-page">
      <header className="fee-history-header">
        <div>
          <h1>Fee Payment History</h1>
          <p>View payments and print or download student receipts.</p>
        </div>

        <button
          className="fee-history-refresh"
          onClick={loadPayments}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="fee-history-stats">
        <div>
          <span>Total Payments</span>
          <strong>{payments.length}</strong>
        </div>

        <div>
          <span>Total Collected</span>
          <strong>{money(totalCollected)}</strong>
        </div>
      </section>

      {error && <div className="collect-fee-error">{error}</div>}

      <section className="fee-history-card">
        <div className="fee-history-toolbar">
          <h2>Payment Records</h2>

          <input
            type="search"
            placeholder="Search receipt, student or invoice..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="collect-fee-message">Loading payments...</p>
        ) : (
          <div className="fee-history-table-scroll">
            <table className="fee-history-table">
              <thead>
                <tr>
                  <th>Receipt No.</th>
                  <th>Student</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Collected By</th>
                  <th>Receipt</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.receipt_number || `#${payment.id}`}</td>
                    <td>
                      <strong>{payment.student_name || "—"}</strong>
                      <small>{payment.student_id || "—"}</small>
                    </td>
                    <td>{payment.invoice_number || "—"}</td>
                    <td>{money(payment.amount)}</td>
                    <td>{payment.payment_method || "—"}</td>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>{payment.collected_by_name || "—"}</td>
                    <td>
                      <button
                        className="fee-receipt-view-btn"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="fee-history-empty">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedPayment && (
        <div
          className="fee-receipt-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPayment(null);
            }
          }}
        >
          <section className="fee-receipt-modal">
            <div className="fee-receipt-modal-header">
              <div>
                <h2>Payment Receipt</h2>
                <p>{selectedPayment.receipt_number || "Receipt"}</p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="fee-receipt-close"
              >
                ×
              </button>
            </div>

            <div className="fee-receipt-preview">
              <h3>School Management System</h3>
              <p>Official Student Fee Payment Receipt</p>
              <hr />

              <strong>
                Receipt No: {selectedPayment.receipt_number || "—"}
              </strong>

              <p>Student: {selectedPayment.student_name || "—"}</p>
              <p>Student ID: {selectedPayment.student_id || "—"}</p>
              <p>Roll Number: {selectedPayment.roll_number || "—"}</p>
              <p>Class: {selectedPayment.class_name || "—"}</p>
              <p>Section: {selectedPayment.section_name || "—"}</p>
              <p>Invoice: {selectedPayment.invoice_number || "—"}</p>
              <p>Payment Method: {selectedPayment.payment_method || "—"}</p>
              <p>
                Transaction Reference:{" "}
                {selectedPayment.transaction_reference || "—"}
              </p>
              <p>Date: {formatDate(selectedPayment.payment_date)}</p>
              <p>Collected By: {selectedPayment.collected_by_name || "—"}</p>

              <div className="fee-receipt-preview-amount">
                Amount Received: {money(selectedPayment.amount)}
              </div>
            </div>

            <div className="fee-receipt-actions">
              <button
                onClick={() => openReceipt(selectedPayment, false)}
              >
                Print Receipt
              </button>

              <button
                onClick={() => openReceipt(selectedPayment, true)}
              >
                Download PDF
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default FeePaymentHistory;
