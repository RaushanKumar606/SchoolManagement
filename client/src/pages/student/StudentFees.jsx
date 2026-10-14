
// import { useState } from "react";
// import {
//   createFeeOnlineOrder,
//   verifyFeeOnlinePayment,
//   getMyFeeInvoice,
//   getMyFeePayments,
// } from "../../services/studentService";

//  import "./Student.css";

// function StudentFees() {
//   const [loading, setLoading] = useState(false);

//   const [invoice, setInvoice] = useState(null);
//   const [payments, setPayments] = useState([]);

//   // =========================
//   // GET INVOICE
//   // =========================

//   const handleInvoice = async () => {
//     try {
//       setLoading(true);

//       const res = await getMyFeeInvoice();

//       console.log("Invoice:", res);

//       setInvoice(res);
//     } catch (error) {
//       console.error("Invoice Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // PAYMENT HISTORY
//   // =========================

//   const handlePayments = async () => {
//     try {
//       setLoading(true);

//       const res = await getMyFeePayments();

//       console.log("Payments:", res);

//       setPayments(res?.results || res || []);
//     } catch (error) {
//       console.error("Payments Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // CREATE ONLINE ORDER
//   // =========================

//   const handlePayNow = async () => {
//     try {
//       setLoading(true);

//       const res = await createFeeOnlineOrder({
//         amount: 5000,
//       });

//       console.log("Online Order:", res);

//       // Razorpay integration yahan hogi

//     } catch (error) {
//       console.error("Payment Order Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="student-fees-page">

//       {/* ================= HEADER ================= */}

//       <div className="fees-page-header">

//         <div>
//           <h1>Fees & Payments</h1>

//           <p>
//             Manage your school fees, invoices and payments
//           </p>
//         </div>

//         <div className="academic-badge">
//           📅 Academic Year 2026-27
//         </div>

//       </div>


//       {/* ================= SUMMARY ================= */}

//       <div className="fees-summary-grid">

//         <div className="fee-summary-card total">

//           <div className="fee-icon">
//             ₹
//           </div>

//           <div>
//             <span>Total Fees</span>
//             <h2>₹45,000</h2>
//           </div>

//         </div>


//         <div className="fee-summary-card paid">

//           <div className="fee-icon">
//             ✓
//           </div>

//           <div>
//             <span>Paid Amount</span>
//             <h2>₹30,000</h2>
//           </div>

//         </div>


//         <div className="fee-summary-card pending">

//           <div className="fee-icon">
//             !
//           </div>

//           <div>
//             <span>Pending Amount</span>
//             <h2>₹15,000</h2>
//           </div>

//         </div>

//       </div>


//       {/* ================= ACTION CARDS ================= */}

//       <div className="fees-section">

//         <div className="section-title">
//           <h2>Fee Services</h2>

//           <p>
//             Select an option to manage your fees
//           </p>
//         </div>


//         <div className="fee-services-grid">


//           {/* INVOICE */}

//           <div className="fee-service-card">

//             <div className="service-icon invoice-icon">
//               📄
//             </div>

//             <div className="service-content">

//               <h3>Fee Invoice</h3>

//               <p>
//                 View your current fee invoice
//                 and payment details.
//               </p>

//               <button
//                 className="secondary-btn"
//                 onClick={handleInvoice}
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Loading..."
//                   : "View Invoice"}
//               </button>

//             </div>

//           </div>


//           {/* PAYMENT HISTORY */}

//           <div className="fee-service-card">

//             <div className="service-icon payment-icon">
//               💳
//             </div>

//             <div className="service-content">

//               <h3>Payment History</h3>

//               <p>
//                 Check your previous fee
//                 payments and transactions.
//               </p>

//               <button
//                 className="secondary-btn"
//                 onClick={handlePayments}
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Loading..."
//                   : "View Payments"}
//               </button>

//             </div>

//           </div>


//           {/* ONLINE PAYMENT */}

//           <div className="fee-service-card pay-card">

//             <div className="service-icon online-icon">
//               💰
//             </div>

//             <div className="service-content">

//               <h3>Pay Fees Online</h3>

//               <p>
//                 Pay your pending school fees
//                 securely online.
//               </p>

//               <button
//                 className="primary-btn"
//                 onClick={handlePayNow}
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Processing..."
//                   : "Pay Now →"}
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ================= INVOICE RESULT ================= */}

//       {invoice && (
//         <div className="fees-result-card">

//           <div className="result-header">

//             <h2>Fee Invoice</h2>

//             <button
//               onClick={() => setInvoice(null)}
//             >
//               ✕
//             </button>

//           </div>

//           <pre>
//             {JSON.stringify(invoice, null, 2)}
//           </pre>

//         </div>
//       )}


//       {/* ================= PAYMENTS RESULT ================= */}

//       {payments.length > 0 && (
//         <div className="fees-result-card">

//           <div className="result-header">

//             <h2>Payment History</h2>

//             <button
//               onClick={() => setPayments([])}
//             >
//               ✕
//             </button>

//           </div>

//           <div className="payment-list">

//             {payments.map((payment, index) => (

//               <div
//                 className="payment-row"
//                 key={payment.id || index}
//               >

//                 <div>
//                   <strong>
//                     Payment #{payment.id || index + 1}
//                   </strong>

//                   <span>
//                     {payment.payment_date ||
//                       payment.created_at ||
//                       "Payment"}
//                   </span>
//                 </div>

//                 <strong>
//                   ₹{payment.amount || 0}
//                 </strong>

//                 <span className="payment-success">
//                   ✓ Paid
//                 </span>

//               </div>

//             ))}

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default StudentFees;







import { useState } from "react";
import {
  getMyFeeInvoice,
  getMyFeePayments,
  createFeeOnlineOrder,
  verifyFeeOnlinePayment,
} from "../../services/studentService";

function StudentFees() {
  // ==============================
  // STATE
  // ==============================

  const [invoice, setInvoice] = useState([]);
  const [payments, setPayments] = useState([]);

  const [activeSection, setActiveSection] = useState(null);

  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [error, setError] = useState("");

  // ==============================
  // CALCULATE FEES
  // ==============================

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

  // ==============================
  // VIEW INVOICE
  // ==============================

  const handleInvoice = async () => {
    try {
      setInvoiceLoading(true);
      setError("");

      const res = await getMyFeeInvoice();

      console.log("My Invoice:", res);

      if (!res?.success) {
        throw new Error(
          res?.message || "Unable to load invoice"
        );
      }

      setInvoice(res.data || []);
      setActiveSection("invoice");
    } catch (error) {
      console.error("Invoice Error:", error);

      setError(
        error.message || "Failed to load invoice"
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  // ==============================
  // PAYMENT HISTORY
  // ==============================

  const handlePayments = async () => {
    try {
      setPaymentsLoading(true);
      setError("");

      const res = await getMyFeePayments();

      console.log("My Payments:", res);

      if (!res?.success) {
        throw new Error(
          res?.message || "Unable to load payments"
        );
      }

      setPayments(res.data || []);
      setActiveSection("payments");
    } catch (error) {
      console.error("Payments Error:", error);

      setError(
        error.message || "Failed to load payment history"
      );
    } finally {
      setPaymentsLoading(false);
    }
  };

  // ==============================
  // PAY ONLINE
  // ==============================

  const handlePayNow = async (selectedInvoice) => {
    try {
      if (!selectedInvoice?.id) {
        setError("Invoice information is missing.");
        return;
      }

      if (Number(selectedInvoice.due_amount || 0) <= 0) {
        setError("There is no pending amount for this invoice.");
        return;
      }

      setPaymentLoading(true);
      setError("");

      // --------------------------------
      // STEP 1: CREATE RAZORPAY ORDER
      // --------------------------------

      const res = await createFeeOnlineOrder(
        selectedInvoice.id
      );

      console.log("Razorpay Order Response:", res);

      if (!res?.success) {
        throw new Error(
          res?.message ||
            "Unable to create payment order"
        );
      }

      const order = res.data;

      console.log("Order ID:", order.order_id);
      console.log("Amount:", order.amount);
      console.log("Key ID:", order.key_id);

      // --------------------------------
      // CHECK RAZORPAY SCRIPT
      // --------------------------------

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded. Please add Razorpay script."
        );
      }

      // --------------------------------
      // RAZORPAY CHECKOUT OPTIONS
      // --------------------------------

      const options = {
        key: order.key_id,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Data Click Education",

        description: `Fee Payment - ${order.invoice?.invoice_number || ""}`,

        order_id: order.order_id,

        handler: async function (response) {
          await verifyPayment(response);
        },

        prefill: {
          name: order.student?.name || "",
        },

        notes: {
          invoice_id: String(
            order.invoice?.id || ""
          ),
          invoice_number:
            order.invoice?.invoice_number || "",
          student_id:
            order.student?.student_id || "",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      // --------------------------------
      // OPEN RAZORPAY
      // --------------------------------

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Create Payment Order Error:",
        error
      );

      setError(
        error.message ||
          "Unable to start online payment"
      );

      setPaymentLoading(false);
    }
  };

  // ==============================
  // VERIFY PAYMENT
  // ==============================

  const verifyPayment = async (response) => {
    try {
      setError("");

      console.log(
        "Razorpay Success Response:",
        response
      );

      const paymentResponse =
        await verifyFeeOnlinePayment({
          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,
        });

      console.log(
        "Payment Verification:",
        paymentResponse
      );

      if (!paymentResponse?.success) {
        throw new Error(
          paymentResponse?.message ||
            "Payment verification failed"
        );
      }

      // --------------------------------
      // PAYMENT SUCCESS
      // --------------------------------

      alert(
        "Payment successful! Your fee payment has been verified."
      );

      setPaymentLoading(false);

      // Refresh invoice data ONLY after
      // successful payment.
      const invoiceResponse =
        await getMyFeeInvoice();

      if (invoiceResponse?.success) {
        setInvoice(
          invoiceResponse.data || []
        );
      }

      // Refresh payment history ONLY after
      // successful payment.
      const paymentHistoryResponse =
        await getMyFeePayments();

      if (paymentHistoryResponse?.success) {
        setPayments(
          paymentHistoryResponse.data || []
        );
      }

      setActiveSection("payments");
    } catch (error) {
      console.error(
        "Payment Verification Error:",
        error
      );

      setError(
        error.message ||
          "Payment verification failed"
      );

      setPaymentLoading(false);
    }
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==============================
  // FORMAT MONEY
  // ==============================

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="student-fees-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="fees-header">
        <div>
          <h1>Fees & Payments</h1>

          <p>
            Manage your school fees,
            invoices and payments
          </p>
        </div>

        <div className="academic-year">
          Academic Year
        </div>
      </div>

      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div className="fees-error">
          {error}

          <button
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* =================================
          SUMMARY CARDS
      ================================= */}

      <div className="fee-summary-grid">

        {/* TOTAL */}

        <div className="fee-summary-card total">
          <div className="fee-card-icon">
            ₹
          </div>

          <div>
            <span>Total Fees</span>

            <h2>
              ₹{formatMoney(totalFees)}
            </h2>
          </div>
        </div>

        {/* PAID */}

        <div className="fee-summary-card paid">
          <div className="fee-card-icon">
            ✓
          </div>

          <div>
            <span>Paid Fees</span>

            <h2>
              ₹{formatMoney(paidFees)}
            </h2>
          </div>
        </div>

        {/* PENDING */}

        <div className="fee-summary-card pending">
          <div className="fee-card-icon">
            !
          </div>

          <div>
            <span>Pending Fees</span>

            <h2>
              ₹{formatMoney(pendingFees)}
            </h2>
          </div>
        </div>

      </div>

      {/* =================================
          ACTION CARDS
      ================================= */}

      <div className="fees-actions-grid">

        {/* VIEW INVOICE */}

        <div className="fee-action-card">

          <div className="action-icon invoice-icon">
            🧾
          </div>

          <div className="action-content">
            <h3>Fee Invoice</h3>

            <p>
              View your fee invoices
              and pending amounts.
            </p>

            <button
              className="primary-btn"
              onClick={handleInvoice}
              disabled={invoiceLoading}
            >
              {invoiceLoading
                ? "Loading..."
                : "View Invoice"}
            </button>
          </div>

        </div>

        {/* PAYMENT HISTORY */}

        <div className="fee-action-card">

          <div className="action-icon payment-icon">
            💳
          </div>

          <div className="action-content">
            <h3>Payment History</h3>

            <p>
              View all your previous
              fee payments.
            </p>

            <button
              className="secondary-btn"
              onClick={handlePayments}
              disabled={paymentsLoading}
            >
              {paymentsLoading
                ? "Loading..."
                : "Payment History"}
            </button>
          </div>

        </div>

        {/* PAY ONLINE */}

        <div className="fee-action-card">

          <div className="action-icon online-icon">
            ⚡
          </div>

          <div className="action-content">
            <h3>Pay Fees Online</h3>

            <p>
              Pay your pending fees
              securely online.
            </p>

            <button
              className="success-btn"
              onClick={handleInvoice}
              disabled={invoiceLoading}
            >
              {invoiceLoading
                ? "Loading..."
                : "View Pending Fees"}
            </button>
          </div>

        </div>

      </div>

      {/* =================================
          INVOICE SECTION
      ================================= */}

      {activeSection === "invoice" && (
        <div className="fees-section">

          <div className="section-header">
            <div>
              <h2>My Fee Invoices</h2>

              <p>
                Your complete fee details
              </p>
            </div>
          </div>

          {invoice.length === 0 ? (
            <div className="empty-state">
              <div>🧾</div>

              <h3>No Invoice Found</h3>

              <p>
                No fee invoice is available
                for your account.
              </p>
            </div>
          ) : (
            <div className="invoice-list">



              {invoice.map((item) => (
                <div
                  className="invoice-card"
                  key={item.id}
                >

                  <div className="invoice-top">

                    <div>
                      <span className="invoice-label">
                        Invoice Number
                      </span>

                      <h3>
                        {item.invoice_number ||
                          `INV-${item.id}`}
                      </h3>
                    </div>

                    <span
                      className={`status-badge ${
                        (
                          item.status ||
                          ""
                        ).toLowerCase()
                      }`}
                    >
                      {item.status || "PENDING"}
                    </span>

                  </div>

                  <div className="invoice-details">

                    <div>
                      <span>Student</span>
                      <strong>
                        {item.student_name ||
                          "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Class</span>
                      <strong>
                        {item.class_name ||
                          "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Section</span>
                      <strong>
                        {item.section_name ||
                          "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Due Date</span>
                      <strong>
                        {formatDate(
                          item.due_date
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="invoice-amounts">

                    <div>
                      <span>Total</span>

                      <strong>
                        ₹
                        {formatMoney(
                          item.amount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Paid</span>

                      <strong className="paid-text">
                        ₹
                        {formatMoney(
                          item.paid_amount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Pending</span>

                      <strong className="pending-text">
                        ₹
                        {formatMoney(
                          item.due_amount
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* PAY BUTTON */}

                  {Number(
                    item.due_amount || 0
                  ) > 0 && (
                    <div className="invoice-footer">

                      <button
                        className="pay-now-btn"
                        onClick={() =>
                          handlePayNow(item)
                        }
                        disabled={
                          paymentLoading
                        }
                      >
                        {paymentLoading
                          ? "Processing..."
                          : `Pay ₹${formatMoney(
                              item.due_amount
                            )}`}
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* =================================
          PAYMENT HISTORY SECTION
      ================================= */}

      {activeSection === "payments" && (
        <div className="fees-section">

          <div className="section-header">

            <div>
              <h2>Payment History</h2>

              <p>
                Your previous fee
                payment transactions
              </p>
            </div>

          </div>

          {payments.length === 0 ? (
            <div className="empty-state">

              <div>💳</div>

              <h3>
                No Payments Found
              </h3>

              <p>
                You have not made any
                fee payments yet.
              </p>

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
                        <strong>
                          {payment.receipt_number ||
                            "-"}
                        </strong>
                      </td>

                      <td>
                        {payment.invoice_number ||
                          "-"}
                      </td>

                      <td>
                        ₹
                        {formatMoney(
                          payment.amount
                        )}
                      </td>

                      <td>
                        <span className="method-badge">
                          {payment.payment_method ||
                            "-"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          payment.payment_date
                        )}
                      </td>

                      <td>

                        <span
                          className={`payment-status ${
                            (
                              payment.payment_status ||
                              ""
                            ).toLowerCase()
                          }`}
                        >
                          {payment.payment_status ||
                            "-"}
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

      {/* =================================
          PAYMENT LOADING OVERLAY
      ================================= */}

      {paymentLoading && (
        <div className="payment-processing">

          <div className="processing-box">

            <div className="processing-spinner"></div>

            <h3>
              Processing Payment
            </h3>

            <p>
              Please complete the payment
              in Razorpay.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default StudentFees;

