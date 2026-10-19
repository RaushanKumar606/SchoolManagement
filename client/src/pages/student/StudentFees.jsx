
import { useEffect, useState } from "react";
import {
  getMyFeeStructure,
  getMyFeeInvoice,
  getMyFeePayments,
  createFeeOnlineOrder,
  verifyFeeOnlinePayment,
} from "../../services/studentService";

function StudentFees() {
  const [feeStructure, setFeeStructure] = useState(null);
  const [structureLoading, setStructureLoading] = useState(true);
  const [structureError, setStructureError] = useState("");

  const [invoice, setInvoice] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [feeView, setFeeView] = useState("all");
  const [invoiceMode, setInvoiceMode] = useState("all");

  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [error, setError] = useState("");

  // Custom payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Normalize API response
  const getArrayData = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    if (Array.isArray(res?.results)) return res.results;
    return [];
  };

  // Load fee structure
  useEffect(() => {
    let cancelled = false;

    const loadFeeStructure = async () => {
      try {
        setStructureLoading(true);
        setStructureError("");

        const res = await getMyFeeStructure();

        if (!res?.success) {
          throw new Error(
            res?.message || "Unable to load fee structure."
          );
        }

        if (!cancelled) {
          setFeeStructure(res.data || null);
        }
      } catch (err) {
        console.error("Fee Structure Error:", err);

        if (!cancelled) {
          setStructureError(
            err.message || "Failed to load fee structure."
          );
        }
      } finally {
        if (!cancelled) setStructureLoading(false);
      }
    };

    loadFeeStructure();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load invoices
  useEffect(() => {
    let cancelled = false;

    const loadInvoiceSummary = async () => {
      try {
        setSummaryLoading(true);

        const res = await getMyFeeInvoice();

        if (!res?.success) {
          throw new Error(
            res?.message || "Unable to load invoice summary."
          );
        }

        if (!cancelled) {
          setInvoice(getArrayData(res));
        }
      } catch (err) {
        console.error("Invoice Summary Error:", err);

        if (!cancelled) {
          setError(
            err.message || "Failed to load invoice summary."
          );
        }
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    };

    loadInvoiceSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  // Invoice calculations
  const totalFees = invoice.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const paidFees = invoice.reduce(
    (total, item) => total + Number(item.paid_amount || 0),
    0
  );

  const pendingFees = invoice.reduce(
    (total, item) => total + Number(item.due_amount || 0),
    0
  );

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format money
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Fee structure total
  const structureTotal =
    feeStructure?.total_annual_fee ??
    (
      Number(feeStructure?.yearly_fee || 0) +
      Number(feeStructure?.admission_fee || 0) +
      Number(feeStructure?.exam_fee || 0) +
      Number(feeStructure?.transport_fee || 0) +
      Number(feeStructure?.other_fee || 0)
    );

  // Refresh invoices
  const refreshInvoices = async () => {
    const res = await getMyFeeInvoice();

    if (!res?.success) {
      throw new Error(
        res?.message || "Unable to refresh invoices."
      );
    }

    const rows = getArrayData(res);
    setInvoice(rows);

    return rows;
  };


  // View all invoices or only pending invoices


  const handleInvoice = async () => {
    try {
      setInvoiceLoading(true);
      setError("");

      await refreshInvoices();

      setInvoiceMode("all");
      setFeeView("all");
      setActiveSection("invoice");
    } catch (err) {
      console.error("Invoice Error:", err);
      setError(err.message || "Failed to load invoices.");
    } finally {
      setInvoiceLoading(false);
    }
  };
  // Pay Fees Online: show pending invoices only
  const handlePayFeesOnline = async () => {
    try {
      setInvoiceLoading(true);
      setError("");

      await refreshInvoices();

      setInvoiceMode("pending");
      setFeeView("pending");
      setActiveSection("invoice");
    } catch (err) {
      console.error("Pending Fees Error:", err);
      setError(err.message || "Failed to load pending fees.");
    } finally {
      setInvoiceLoading(false);
    }
  };


  // Payment history
  const handlePayments = async () => {
    try {
      setPaymentsLoading(true);
      setError("");

      const res = await getMyFeePayments();

      if (!res?.success) {
        throw new Error(
          res?.message || "Unable to load payment history."
        );
      }

      setPayments(getArrayData(res));
      setActiveSection("payments");
    } catch (err) {
      console.error("Payments Error:", err);
      setError(err.message || "Failed to load payment history.");
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Open custom payment modal
  const openPaymentModal = (item) => {
    const due = Number(item?.due_amount || 0);

    if (!item?.id) {
      setError("Invoice information is missing.");
      return;
    }

    if (!Number.isFinite(due) || due <= 0) {
      setError("There is no pending amount for this invoice.");
      return;
    }

    setError("");
    setSelectedInvoice(item);
    setPaymentAmount(String(due));
    setShowPaymentModal(true);
  };

  // Close custom payment modal
  const closePaymentModal = () => {
    if (paymentLoading) return;

    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setPaymentAmount("");
  };

  // Start Razorpay payment with the entered amount
  const handlePayNow = async () => {
    try {
      if (!selectedInvoice?.id) {
        throw new Error("Please select a valid invoice.");
      }

      const due = Number(selectedInvoice.due_amount);
      const enteredAmount = paymentAmount.trim();

      // Reject blank or invalid amounts, including more than 2 decimals
      if (!/^\d+(\.\d{1,2})?$/.test(enteredAmount)) {
        throw new Error(
          "Enter a valid amount with up to two decimal places."
        );
      }

      const amount = Number(enteredAmount);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      if (amount > due) {
        throw new Error(
          `Payment cannot exceed the pending amount of ₹${formatMoney(due)}.`
        );
      }

      setPaymentLoading(true);
      setError("");

      // Send invoice ID AND custom amount to the backend
      const res = await createFeeOnlineOrder(
        selectedInvoice.id,
        amount
      );

      console.log("Razorpay Order Response:", res);

      if (!res?.success) {
        throw new Error(
          res?.message || "Unable to create payment order."
        );
      }

      const order = res.data;

      if (!order?.order_id || !order?.key_id || !order?.amount) {
        throw new Error("Invalid Razorpay order details received.");
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded. Please add the Razorpay checkout script."
        );
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Data Click Education",
        description: `Fee Payment - ${order.invoice?.invoice_number || ""
          }`,
        order_id: order.order_id,

        handler: async (response) => {
          await verifyPayment(response);
        },

        prefill: {
          name: order.student?.name || "",
        },

        notes: {
          invoice_id: String(order.invoice?.id || ""),
          invoice_number: order.invoice?.invoice_number || "",
          student_id: order.student?.student_id || "",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      // Close custom amount modal before opening Razorpay
      setShowPaymentModal(false);

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay Payment Failed:", response);

        setError(
          response?.error?.description ||
          "Payment failed. Please try again."
        );

        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Create Payment Order Error:", err);

      setError(
        err.message || "Unable to start online payment."
      );

      setPaymentLoading(false);
    }
  };

  // Verify payment and refresh data
  const verifyPayment = async (response) => {
    try {
      setError("");

      const paymentResponse = await verifyFeeOnlinePayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      console.log("Payment Verification:", paymentResponse);

      if (!paymentResponse?.success) {
        throw new Error(
          paymentResponse?.message ||
          "Payment verification failed."
        );
      }

      window.alert(
        "Payment successful! Your fee payment has been verified."
      );

      // Refresh invoice totals and outstanding balances
      await refreshInvoices();

      // Refresh payment history
      const historyResponse = await getMyFeePayments();

      if (historyResponse?.success) {
        setPayments(getArrayData(historyResponse));
      }

      setActiveSection("payments");
      setSelectedInvoice(null);
      setPaymentAmount("");
    } catch (err) {
      console.error("Payment Verification Error:", err);

      setError(
        err.message || "Payment verification failed."
      );
    } finally {
      setPaymentLoading(false);
    }
  };



  const handlePrintInvoice = (item) => {
    if (!item) {
      setError("Invoice information is missing.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=750"
    );

    if (!printWindow) {
      setError("Please allow pop-ups to print the invoice.");
      return;
    }

    const safe = (value) =>
      String(value ?? "-").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    const total = Number(item.amount || 0);
    const paid = Number(item.paid_amount || 0);
    const due = Number(item.due_amount || 0);

    const status =
      due <= 0
        ? "PAID"
        : paid > 0
          ? "PARTIALLY PAID"
          : "PENDING";

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Fee Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 30px;
            color: #1e293b;
          }
          .invoice {
            max-width: 750px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 28px;
            border-radius: 10px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
          }
          h1 { margin-top: 0; }
          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin: 25px 0;
          }
          .field span {
            display: block;
            color: #64748b;
            font-size: 13px;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th { background: #f1f5f9; }
          .amount { text-align: right; }
          .print-btn {
            margin-bottom: 20px;
            padding: 10px 18px;
            border: 0;
            background: #2563eb;
            color: white;
            cursor: pointer;
          }
          @media print {
            .print-btn { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">
          Print / Save as PDF
        </button>

        <main class="invoice">
          <div class="header">
            <div>
              <h1>School Fee Invoice</h1>
              <p>Student Fee Receipt</p>
            </div>
            <div>
              <p><strong>Invoice:</strong>
                ${safe(item.fee_particulars?.toLowerCase().includes("monthly fee")
      ? "Tuition Fees"
      : item.fee_particulars || "School Fees")}
              </p>
              <p><strong>Due Date:</strong>
                ${safe(formatDate(item.due_date))}
              </p>
              <p><strong>Status:</strong> ${safe(status)}</p>
            </div>
          </div>

          <h3>Student Details</h3>

          <div class="details">
            <div class="field">
              <span>Student Name</span>
              <strong>${safe(item.student_name)}</strong>
            </div>
            <div class="field">
              <span>Class</span>
              <strong>${safe(item.class_name)}</strong>
            </div>
            <div class="field">
              <span>Section</span>
              <strong>${safe(item.section_name)}</strong>
            </div>
            <div class="field">
              <span>Invoice ID</span>
              <strong>${safe(item.id)}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="amount">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Fee</td>
                <td class="amount">${formatMoney(total)}</td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td class="amount">${formatMoney(paid)}</td>
              </tr>
              <tr>
                <td>Pending Balance</td>
                <td class="amount">${formatMoney(due)}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 35px;">
            Authorized Signature: ____________________
          </p>
        </main>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  return (
    <div className="student-fees-page">
      {/* PAGE HEADER */}
      <div className="fees-header">
        <div>
          <h1>Fees &amp; Payments</h1>
          <p>Manage your school fees, invoices and payments</p>
        </div>

        <div className="academic-year">
          {feeStructure?.academic_year_name ||
            feeStructure?.academic_year?.name ||
            "Academic Year"}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="fees-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            aria-label="Close error"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="fee-summary-grid">
        <div className="fee-summary-card total">
          <div className="fee-card-icon">₹</div>
          <div>
            <span>Total Invoiced Fees</span>
            <h2>
              {summaryLoading
                ? "Loading..."
                : `₹${formatMoney(totalFees)}`}
            </h2>
          </div>
        </div>

        <div className="fee-summary-card paid">
          <div className="fee-card-icon">✓</div>
          <div>
            <span>Paid Fees</span>
            <h2>
              {summaryLoading
                ? "Loading..."
                : `₹${formatMoney(paidFees)}`}
            </h2>
          </div>
        </div>

        <div className="fee-summary-card pending">
          <div className="fee-card-icon">!</div>
          <div>
            <span>Pending Fees</span>
            <h2>
              {summaryLoading
                ? "Loading..."
                : `₹${formatMoney(pendingFees)}`}
            </h2>
          </div>
        </div>
      </div>

      {/* FEE STRUCTURE */}
      <div className="fees-section fee-structure-section">
        <div className="section-header">
          <div>
            <h2>My Class Fee Structure</h2>
            <p>Fees configured by your school administrator</p>
          </div>

          {feeStructure?.is_active && (
            <span className="status-badge paid">Active</span>
          )}
        </div>

        {structureLoading ? (
          <div className="empty-state">
            Loading your class fee structure...
          </div>
        ) : structureError ? (
          <div className="fees-error" role="alert">
            <span>{structureError}</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  setStructureLoading(true);
                  setStructureError("");

                  const res = await getMyFeeStructure();

                  if (!res?.success) {
                    throw new Error(
                      res?.message || "Unable to load fee structure."
                    );
                  }

                  setFeeStructure(res.data || null);
                } catch (err) {
                  setStructureError(
                    err.message || "Failed to load fee structure."
                  );
                } finally {
                  setStructureLoading(false);
                }
              }}
            >
              Retry
            </button>
          </div>
        ) : !feeStructure ? (
          <div className="empty-state">
            <div>🧾</div>
            <h3>No Fee Structure Found</h3>
            <p>
              Please contact your school administrator to configure
              fees for your class and academic year.
            </p>
          </div>
        ) : (
          <>
            <div className="invoice-details">
              <div>
                <span>Academic Year</span>
                <strong>
                  {feeStructure.academic_year_name ||
                    feeStructure.academic_year?.name ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>Class</span>
                <strong>
                  {feeStructure.class_name ||
                    feeStructure.school_class?.name ||
                    "-"}
                </strong>
              </div>
            </div>

            <div className="invoice-amounts fee-structure-amounts">
              <div>
                <span>Monthly Fee</span>
                <strong>₹{formatMoney(feeStructure.monthly_fee)}</strong>
              </div>
              <div>
                <span>Yearly Tuition</span>
                <strong>₹{formatMoney(feeStructure.yearly_fee)}</strong>
              </div>
              <div>
                <span>Admission Fee</span>
                <strong>₹{formatMoney(feeStructure.admission_fee)}</strong>
              </div>
              <div>
                <span>Exam Fee</span>
                <strong>₹{formatMoney(feeStructure.exam_fee)}</strong>
              </div>
              <div>
                <span>Transport Fee</span>
                <strong>₹{formatMoney(feeStructure.transport_fee)}</strong>
              </div>
              <div>
                <span>Other Charges</span>
                <strong>₹{formatMoney(feeStructure.other_fee)}</strong>
              </div>
            </div>

            <div className="fee-structure-total">
              <span>Total Annual Fee</span>
              <h2>₹{formatMoney(structureTotal)}</h2>
            </div>
          </>
        )}
      </div>

      {/* ACTION CARDS */}
      <div className="fees-actions-grid">
        <div className="fee-action-card">
          <div className="action-icon invoice-icon">🧾</div>
          <div className="action-content">
            <h3>Fee Invoice</h3>
            <p>View your fee invoices and pending amounts.</p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => handleInvoice("all")}
              disabled={invoiceLoading}
            >
              {invoiceLoading ? "Loading..." : "View Invoice"}
            </button>
          </div>
        </div>

        <div className="fee-action-card">
          <div className="action-icon payment-icon">💳</div>
          <div className="action-content">
            <h3>Payment History</h3>
            <p>View your previous fee payments.</p>
            <button
              type="button"
              className="secondary-btn"
              onClick={handlePayments}
              disabled={paymentsLoading}
            >
              {paymentsLoading ? "Loading..." : "Payment History"}
            </button>
          </div>
        </div>

        <div className="fee-action-card">
          <div className="action-icon online-icon">⚡</div>
          <div className="action-content">
            <h3>Pay Fees Online</h3>
            <p>Pay your pending fees securely online.</p>
            <button
              type="button"
              className="success-btn"
              onClick={handlePayFeesOnline}
              disabled={invoiceLoading}
            >
              {invoiceLoading ? "Loading..." : "View Pending Fees"}
            </button>
          </div>
        </div>
      </div>


      {/* INVOICE LIST */}
      {activeSection === "invoice" && (
        <div className="fees-section">
          <div className="section-header">
            <div>
              <h2>
                {feeView === "pending"
                  ? "Pending Fee Invoices"
                  : "My Fee Invoices"}
              </h2>
              <p>
                {feeView === "pending"
                  ? "Invoices with outstanding fees"
                  : "Your complete fee details"}
              </p>
            </div>
          </div>

          {invoice.filter((item) =>
            feeView === "pending"
              ? Number(item.due_amount || 0) > 0
              : true
          ).length === 0 ? (
            <div className="empty-state">
              <div>🧾</div>
              <h3>
                {feeView === "pending"
                  ? "No Pending Fees"
                  : "No Invoice Found"}
              </h3>
              <p>
                {feeView === "pending"
                  ? "You have no outstanding fee payments."
                  : "No fee invoice is available for your account."}
              </p>
            </div>
          ) : (
            <div className="invoice-list">
              {invoice
                .filter((item) =>
                  feeView === "pending"
                    ? Number(item.due_amount || 0) > 0
                    : true
                )
                .map((item) => (
                  <div className="invoice-card" key={item.id}>
                    <div className="invoice-top">
                      <div>
                        <span className="invoice-label">
                          Invoice Number
                        </span>
                        <h3>
                          {item.fee_particulars?.toLowerCase().includes("monthly fee")
                            ? "Tuition Fees"
                            : item.fee_particulars || "School Fees"}
                        </h3>
                      </div>

                      <span
                        className={`status-badge ${(
                          Number(item.due_amount || 0) <= 0
                            ? "paid"
                            : Number(item.paid_amount || 0) > 0
                              ? "partial"
                              : "pending"
                        )}`}
                      >
                        {Number(item.due_amount || 0) <= 0
                          ? "PAID"
                          : Number(item.paid_amount || 0) > 0
                            ? "PARTIALLY PAID"
                            : "PENDING"}
                      </span>
                    </div>

                    <div className="invoice-details">
                      <div>
                        <span>Student</span>
                        <strong>{item.student_name || "-"}</strong>
                      </div>
                      <div>
                        <span>Class</span>
                        <strong>{item.class_name || "-"}</strong>
                      </div>
                      <div>
                        <span>Section</span>
                        <strong>{item.section_name || "-"}</strong>
                      </div>
                      <div>
                        <span>Due Date</span>
                        <strong>{formatDate(item.due_date)}</strong>
                      </div>
                    </div>

                    <div className="invoice-amounts">
                      <div>
                        <span>Total</span>
                        <strong>₹{formatMoney(item.amount)}</strong>
                      </div>
                      <div>
                        <span>Paid</span>
                        <strong className="paid-text">
                          ₹{formatMoney(item.paid_amount)}
                        </strong>
                      </div>
                      <div>
                        <span>Pending</span>
                        <strong className="pending-text">
                          ₹{formatMoney(item.due_amount)}
                        </strong>
                      </div>
                    </div>

                    <div className="invoice-footer">
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => handlePrintInvoice(item)}
                      >
                        Print Invoice
                      </button>

                      {Number(item.due_amount || 0) > 0 && (
                        <button
                          type="button"
                          className="pay-now-btn"
                          onClick={() => openPaymentModal(item)}
                          disabled={paymentLoading}
                        >
                          Pay Now · ₹{formatMoney(item.due_amount)}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}


      {/* PAYMENT HISTORY */}
      {activeSection === "payments" && (
        <div className="fees-section">
          <div className="section-header">
            <div>
              <h2>Payment History</h2>
              <p>Your previous fee payment transactions</p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="empty-state">
              <div>💳</div>
              <h3>No Payments Found</h3>
              <p>You have not made any fee payments yet.</p>
            </div>
          ) : (
            <div className="payment-table-wrapper">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Receipt</th>
                    <th>Invoice</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.receipt_number || "-"}</strong>
                      </td>
                      {/* <td>{payment.invoice_number || "-"}</td> */}

                      <td>
                        <div>
                          {payment.fee_particulars?.toLowerCase().includes("monthly fee")
                            ? "Tuition Fees"
                            : payment.fee_particulars || "Tuition Fees"}
                        </div>
                        <small>{payment.invoice_number || "-"}</small>
                      </td>


                      <td>₹{formatMoney(payment.amount)}</td>
                      <td>
                        <span className="method-badge">
                          {payment.payment_method || "-"}
                        </span>
                      </td>
                      <td>{formatDate(payment.payment_date)}</td>
                      <td>
                        <span
                          className={`payment-status ${(
                            payment.payment_status || ""
                          ).toLowerCase()}`}
                        >
                          {payment.payment_status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM PAYMENT AMOUNT MODAL */}
      {showPaymentModal && selectedInvoice && (
        <div
          className="custom-payment-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closePaymentModal();
            }
          }}
        >
          <div
            className="custom-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-payment-title"
          >
            <button
              type="button"
              className="custom-payment-close"
              aria-label="Close payment dialog"
              onClick={closePaymentModal}
              disabled={paymentLoading}
            >
              ×
            </button>

            <div className="custom-payment-icon">₹</div>

            <h2 id="custom-payment-title">Customize Your Payment</h2>
            <p className="custom-payment-subtitle">
              Enter the amount you want to pay now.
            </p>

            <div className="custom-payment-invoice">
              <span>Invoice</span>
              <strong>
                {selectedInvoice.invoice_number ||
                  `INV-${selectedInvoice.id}`}
              </strong>
            </div>

            <div className="custom-payment-balance">
              <span>Pending Balance</span>
              <strong>
                ₹{formatMoney(selectedInvoice.due_amount)}
              </strong>
            </div>

            <label htmlFor="custom-payment-amount">
              Payment Amount (₹)
            </label>

            <input
              id="custom-payment-amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              max={Number(selectedInvoice.due_amount)}
              step="0.01"
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(event.target.value)}
              placeholder="Enter amount"
              autoFocus
              disabled={paymentLoading}
            />

            <div className="custom-payment-remaining">
              <span>Estimated balance after payment</span>
              <strong>
                ₹
                {formatMoney(
                  Math.max(
                    0,
                    Number(selectedInvoice.due_amount || 0) -
                    (Number(paymentAmount) || 0)
                  )
                )}
              </strong>
            </div>

            <div className="custom-payment-quick">
              <button
                type="button"
                onClick={() =>
                  setPaymentAmount(
                    String(
                      Math.min(
                        1000,
                        Number(selectedInvoice.due_amount)
                      )
                    )
                  )
                }
                disabled={
                  paymentLoading ||
                  Number(selectedInvoice.due_amount) < 1
                }
              >
                ₹1,000
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaymentAmount(
                    String(
                      Math.min(
                        2000,
                        Number(selectedInvoice.due_amount)
                      )
                    )
                  )
                }
                disabled={
                  paymentLoading ||
                  Number(selectedInvoice.due_amount) < 1
                }
              >
                ₹2,000
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaymentAmount(
                    String(selectedInvoice.due_amount)
                  )
                }
                disabled={paymentLoading}
              >
                Full Amount
              </button>
            </div>

            <div className="custom-payment-actions">
              <button
                type="button"
                className="custom-payment-cancel"
                onClick={closePaymentModal}
                disabled={paymentLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="custom-payment-submit"
                onClick={handlePayNow}
                disabled={
                  paymentLoading ||
                  !/^\d+(\.\d{1,2})?$/.test(paymentAmount.trim()) ||
                  !Number.isFinite(Number(paymentAmount)) ||
                  Number(paymentAmount) <= 0 ||
                  Number(paymentAmount) >
                  Number(selectedInvoice.due_amount)
                }
              >
                {paymentLoading
                  ? "Processing..."
                  : `Continue · ₹${formatMoney(paymentAmount)}`}
              </button>
            </div>

            <p className="custom-payment-secure">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}

      {/* PAYMENT PROCESSING OVERLAY */}
      {paymentLoading && (
        <div className="payment-processing">
          <div className="processing-box">
            <div className="processing-spinner"></div>
            <h3>Processing Payment</h3>
            <p>Please complete the payment in Razorpay.</p>
          </div>
        </div>
      )}

      {/* Modal styles */}
      <style>{`
        .custom-payment-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
        }

        .custom-payment-modal {
          position: relative;
          width: 100%;
          max-width: 440px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          box-sizing: border-box;
          padding: 28px;
          border-radius: 20px;
          background: #fff;
          color: #172033;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
        }

        .custom-payment-close {
          position: absolute;
          top: 12px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #334155;
          font-size: 26px;
          cursor: pointer;
        }

        .custom-payment-icon {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          margin-bottom: 16px;
          border-radius: 16px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 28px;
          font-weight: 800;
        }

        .custom-payment-modal h2 {
          margin: 0 36px 8px 0;
          font-size: 23px;
        }

        .custom-payment-subtitle {
          margin: 0 0 22px;
          color: #64748b;
          font-size: 14px;
        }

        .custom-payment-invoice,
        .custom-payment-balance,
        .custom-payment-remaining {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: #f8fafc;
          margin-bottom: 12px;
        }

        .custom-payment-invoice span,
        .custom-payment-balance span,
        .custom-payment-remaining span {
          color: #64748b;
          font-size: 13px;
        }

        .custom-payment-balance strong {
          color: #b45309;
          font-size: 18px;
        }

        .custom-payment-modal label {
          display: block;
          margin: 20px 0 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .custom-payment-modal input {
          display: block;
          width: 100%;
          min-height: 52px;
          box-sizing: border-box;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          outline: none;
          background: #fff;
          color: #0f172a;
          font-size: 20px;
          font-weight: 700;
        }

        .custom-payment-modal input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .custom-payment-remaining {
          margin-top: 12px;
          background: #eff6ff;
        }

        .custom-payment-remaining strong {
          color: #1d4ed8;
          white-space: nowrap;
        }

        .custom-payment-quick {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0 22px;
        }

        .custom-payment-quick button {
          flex: 1;
          min-width: 90px;
          padding: 9px 10px;
          border: 1px solid #bfdbfe;
          border-radius: 9px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .custom-payment-actions {
          display: flex;
          gap: 10px;
        }

        .custom-payment-actions button {
          flex: 1;
          min-height: 46px;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .custom-payment-cancel {
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #334155;
        }

        .custom-payment-submit {
          border: 0;
          background: #2563eb;
          color: #fff;
        }

        .custom-payment-submit:disabled,
        .custom-payment-cancel:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .custom-payment-secure {
          margin: 16px 0 0;
          color: #64748b;
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .custom-payment-overlay {
            padding: 12px;
          }

          .custom-payment-modal {
            max-height: calc(100vh - 24px);
            padding: 22px 18px;
            border-radius: 16px;
          }

          .custom-payment-modal h2 {
            font-size: 20px;
          }

          .custom-payment-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentFees;
