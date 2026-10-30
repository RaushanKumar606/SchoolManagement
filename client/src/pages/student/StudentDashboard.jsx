
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStudentProfile, getMyFeeInvoice, } from "../../services/studentService";
import "./Student.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const initialLoadStarted = useRef(false);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [feeInvoices, setFeeInvoices] = useState([]);
  const [feeLoading, setFeeLoading] = useState(true);
  const [feeError, setFeeError] = useState("");
 useEffect(() => {
  if (initialLoadStarted.current) return;

  initialLoadStarted.current = true;

  loadStudentProfile();
  loadPendingFees();
}, []);
  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyStudentProfile();
      setStudent(data);
    } catch (err) {
      console.error("Student profile error:", err);
      setError(err.message || "Unable to load student information.");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingFees = async () => {
    try {
      setFeeLoading(true);

      const response = await getMyFeeInvoice();

      const invoices = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.results)
          ? response.data.results
          : Array.isArray(response)
            ? response
            : [];

      setFeeInvoices(invoices);
    } catch (error) {
      console.error("Pending fees error:", error);
      setFeeInvoices([]);
    } finally {
      setFeeLoading(false);
    }
  };

  const openFeaturePopup = (feature) => {
    setSelectedFeature(feature);
  };

  const closeFeaturePopup = () => {
    setSelectedFeature(null);
  };

  const handleOpenFeature = () => {
    if (!selectedFeature?.path) return;
    const path = selectedFeature.path;
    setSelectedFeature(null);
    navigate(path);
  };

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Dashboard</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={loadStudentProfile}>
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard-error">
        <div className="error-icon">👤</div>
        <h2>Student Information Not Found</h2>
        <p>We could not find your student profile.</p>
        <button className="retry-btn" onClick={loadStudentProfile}>
          Try Again
        </button>
      </div>
    );
  }

  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    student.username ||
    "Student";

  const firstLetter =
    student.first_name?.charAt(0)?.toUpperCase() ||
    student.username?.charAt(0)?.toUpperCase() ||
    "S";



  const pendingInvoices = feeInvoices.filter(
    (invoice) => Number(invoice.due_amount || 0) > 0
  );

  const totalPendingFees = pendingInvoices.reduce(
    (total, invoice) => total + Number(invoice.due_amount || 0),
    0
  );

  const nextDueDate = pendingInvoices
    .filter((invoice) => invoice.due_date)
    .sort(
      (a, b) => new Date(a.due_date) - new Date(b.due_date)
    )[0]?.due_date;

  const formattedDueDate = nextDueDate
    ? new Date(nextDueDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "No pending due date";

  return (
    <>
      <div className="student-dashboard">

        {/* =====================================
            TOP BAR / BANNER HEADER
        ====================================== */}
        <section className="dashboard-header">
          <div className="dashboard-header-content">
            <h1>
              Hello, {student.first_name || fullName}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Welcome back to your student dashboard
            </p>
          </div>

          <div className="dashboard-date-badge">
            <span className="badge-icon">📅</span>
            <div>
              <strong>Thu, 9 Oct 2025</strong>
              <small>Academic Year : 2025 - 2026</small>
            </div>
          </div>
        </section>

        {/* =====================================
            TOP METRICS CARDS GRID (4 CARDS)
        ====================================== */}
        <section className="metrics-grid">

          {/* Student Profile Box */}
          <div className="dashboard-panel student-profile-panel">
            <div className="student-card-banner">
              <div className="student-avatar-lg">{firstLetter}</div>
              <div className="student-banner-info">
                <h2>{fullName}</h2>
                <span className="student-id-tag">{student.student_id || "STU-00006"}</span>
                <span className="status-pill active-pill">● Active</span>
              </div>
            </div>

            <div className="student-details-grid">
              <div><span>Class</span><strong>{student.school_class || "Class 10"} | Section {student.section || "A"}</strong></div>
              <div><span>Academic Year</span><strong>{student.academic_year || "2026-2027"} </strong></div>
              <div><span>Parent</span><strong>{student.father_name || "N/A"}</strong></div>
              <div><span>Phone</span><strong>{student.parent_phone || "N/A"}</strong></div>
            </div>

            <button
              className="view-full-profile-btn"
              onClick={() => openFeaturePopup({ title: "My Profile", description: "View your personal and academic information.", icon: "👤", path: "/student/profile" })}
            >
              View Full Profile →
            </button>
          </div>

          {/* Attendance Metric Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Attendance", description: "View your complete attendance record, present days and absent days.", icon: "📅", path: "/student/attendance" })}>
            <div className="metric-card-top">
              <div className="metric-icon attendance-bg">📅</div>
              <span className="metric-trend success">↑ 2% vs. last month</span>
            </div>
            <h3>Attendance</h3>
            <div className="metric-value">92%</div>
            <p className="metric-subtext">Present Days: 46 / 50</p>
          </div>

          {/* Pending Fees Metric Card */}
          {/* <div className="metric-card" onClick={() => openFeaturePopup({ title: "Fees", description: "View your fee details, payments and payment history.", icon: "💳", path: "/student/fees" })}>
            <div className="metric-card-top">
              <div className="metric-icon fees-bg">₹</div>
              <button className="pay-now-badge-btn">Pay Now →</button>
            </div>
            <h3>Pending Fees</h3>
            <div className="metric-value">₹ 5,000</div>
            <p className="metric-subtext">Next Due: 15 Oct 2025</p>
          </div> */}


          {/* Pending Fees Metric Card */}
          <div
            className="metric-card"
            onClick={() =>
              openFeaturePopup({
                title: "Fees",
                description:
                  "View your fee details, payments and payment history.",
                icon: "💳",
                path: "/student/fees",
              })
            }
          >
            <div className="metric-card-top">
              <div className="metric-icon fees-bg">₹</div>

              <button
                type="button"
                className="pay-now-badge-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/student/fees");
                }}
              >
                Pay Now →
              </button>
            </div>

            <h3>Pending Fees</h3>

            <div className="metric-value">
              {feeLoading
                ? "Loading..."
                : `₹ ${totalPendingFees.toLocaleString("en-IN")}`}
            </div>

            <p className="metric-subtext">
              {feeLoading
                ? "Loading fee details..."
                : nextDueDate
                  ? `Next Due: ${new Date(nextDueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`
                  : "No pending fees"}
            </p>
          </div>

          {/* Pending Assignments Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Homework", description: "View your assignments, due dates and submit your homework.", icon: "📝", path: "/student/homework" })}>
            <div className="metric-card-top">
              <div className="metric-icon homework-bg">📝</div>
              <span className="link-text">View All →</span>
            </div>
            <h3>Pending Assignments</h3>
            <div className="metric-value">2</div>
            <p className="metric-subtext invisible">Active assignments</p>
          </div>

          {/* Latest Result Card */}
          <div className="metric-card" onClick={() => openFeaturePopup({ title: "Results", description: "View your examination marks, subjects and result details.", icon: "📊", path: "/student/results" })}>
            <div className="metric-card-top">
              <div className="metric-icon results-bg">🏆</div>
              <span className="link-text">View Result →</span>
            </div>
            <h3>Latest Result</h3>
            <div className="metric-value">84.5%</div>
            <p className="metric-subtext">Class 10 - Annual Exam</p>
          </div>

        </section>

        {/* =====================================
            STUDENT PROFILE SUMMARY & LIVE CLASSES / NOTICES
        ====================================== */}
        <section className="dashboard-middle-grid">

          {/* Today's Classes Panel */}
          <div className="dashboard-panel todays-classes-panel">
            <div className="panel-header-inline">
              <h2>Today's Classes</h2>
              <button className="text-btn" onClick={() => navigate("/student/timetable")}>View Timetable →</button>
            </div>

            <div className="classes-list">
              <div className="class-row">
                <span className="class-no">1</span>
                <span className="class-time">08:00 - 09:00</span>
                <span className="class-name">Mathematics</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge live-badge">● Live</span>
              </div>
              <div className="class-row">
                <span className="class-no">2</span>
                <span className="class-time">09:00 - 10:00</span>
                <span className="class-name">Science</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">3</span>
                <span className="class-time">10:00 - 11:00</span>
                <span className="class-name">English</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">4</span>
                <span className="class-time">11:00 - 12:00</span>
                <span className="class-name">Social Science</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge upcoming-badge">Upcoming</span>
              </div>
              <div className="class-row">
                <span className="class-no">5</span>
                <span className="class-time">12:00 - 01:00</span>
                <span className="class-name">Computer</span>
                <span className="class-meta">Class 10 - A</span>
                <span className="badge pending-badge">Pending</span>
              </div>
            </div>
          </div>

          {/* Recent Notices Panel */}
          <div className="dashboard-panel notices-panel">
            <div className="panel-header-inline">
              <h2>Recent Notices</h2>
              <span className="text-btn">View All →</span>
            </div>

            <div className="notices-list">
              <div className="notice-item">
                <span className="notice-dot blue"></span>
                <div>
                  <p>School will remain closed on 12 Oct 2025 due to local holiday.</p>
                  <small>09 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot orange"></span>
                <div>
                  <p>Internal exam schedule has been updated.</p>
                  <small>08 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot red"></span>
                <div>
                  <p>Fee payment reminder for October 2025.</p>
                  <small>05 Oct 2025</small>
                </div>
              </div>
              <div className="notice-item">
                <span className="notice-dot blue"></span>
                <div>
                  <p>PTM will be held on 18 Oct 2025.</p>
                  <small>03 Oct 2025</small>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* =====================================
            ANALYTICS, FEES & QUICK LINKS GRID
        ====================================== */}
        <section className="dashboard-lower-grid">

          {/* Academic Performance Table */}
          <div className="dashboard-panel performance-panel">
            <div className="panel-header-inline">
              <h2>Academic Performance</h2>
              <button className="text-btn" onClick={() => navigate("/student/results")}>View All Results →</button>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Mathematics</td><td><strong>85</strong> / 100</td><td><span className="grade-pill green">A</span></td></tr>
                <tr><td>Science</td><td><strong>78</strong> / 100</td><td><span className="grade-pill yellow">B+</span></td></tr>
                <tr><td>English</td><td><strong>88</strong> / 100</td><td><span className="grade-pill green">A</span></td></tr>
                <tr><td>Social Science</td><td><strong>82</strong> / 100</td><td><span className="grade-pill green">A-</span></td></tr>
                <tr><td>Computer</td><td><strong>90</strong> / 100</td><td><span className="grade-pill green">A+</span></td></tr>
              </tbody>
            </table>
          </div>


          {/* Fees & Payments Table */}
          <div className="dashboard-panel fees-panel">
            <div className="panel-header-inline">
              <h2>Fees &amp; Payments</h2>

              <button
                className="text-btn"
                onClick={() => navigate("/student/fees")}
              >
                View All →
              </button>
            </div>

            {feeLoading ? (
              <p>Loading fee details...</p>
            ) : feeError ? (
              <p className="error-message">{feeError}</p>
            ) : feeInvoices.length === 0 ? (
              <p>No fee invoices found.</p>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Particulars</th>
                      <th>Total Amount</th>
                      <th>Paid</th>
                      <th>Pending</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {feeInvoices.map((item) => {
                      const total = Number(item.amount || 0);
                      const paid = Number(item.paid_amount || 0);

                      const pending =
                        item.due_amount !== undefined &&
                          item.due_amount !== null
                          ? Math.max(0, Number(item.due_amount) || 0)
                          : Math.max(0, total - paid);

                      const status =
                        pending <= 0
                          ? "Paid"
                          : paid > 0
                            ? "Partially Paid"
                            : "Pending";

                      return (
                        <tr key={item.id}>
                          <td>
                            {item.fee_particulars?.toLowerCase().includes("monthly fee")
                              ? "Tuition Fees"
                              : item.fee_particulars || "School Fees"}
                            {/* {item.fee_structure_name || item.fee_structure?.name || "Fee"} */}

                            {item.due_date && (
                              <small style={{ display: "block" }}>
                                Due: {new Date(item.due_date).toLocaleDateString("en-IN")}
                              </small>
                            )}
                          </td>

                          <td>₹ {total.toLocaleString("en-IN")}</td>
                          <td>₹ {paid.toLocaleString("en-IN")}</td>
                          <td>₹ {pending.toLocaleString("en-IN")}</td>

                          <td>
                            <span
                              className={`status-badge ${status === "Paid"
                                ? "paid"
                                : status === "Pending"
                                  ? "pending"
                                  : "partial"
                                }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <button
              className="primary-pay-btn"
              onClick={() => navigate("/student/fees")}
            >
              💳 Pay Fees
            </button>
          </div>


          {/* Quick Links Grid */}
          <div className="dashboard-panel quick-links-panel">
            <div className="panel-header">
              <h2>Quick Links</h2>
            </div>
            <div className="quick-links-grid">
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Library", description: "Access school library books and digital resources.", icon: "📚", path: "/student/library" })}>
                <span className="tile-icon">📚</span>
                <span>Library</span>
              </button>
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Transport", description: "View bus routes, pickup points and vehicle details.", icon: "🚌", path: "/student/transport" })}>
                <span className="tile-icon">🚌</span>
                <span>Transport</span>
              </button>
              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Timetable", description: "Check your daily and weekly class timetable.", icon: "📅", path: "/student/timetable" })}>
                <span className="tile-icon">📅</span>
                <span>Timetable</span>
              </button>

              
<button
  className="quick-link-tile"
  onClick={() =>
    openFeaturePopup({
      title: "Admit Card",
      description:
        "View your released examination admit cards and print or save them as PDF.",
      icon: "🎫",
      path: "/student/admit-Card",
    })
  }
>
  <span className="tile-icon">🎫</span>
  <span>Admit Card</span>
</button>

              <button className="quick-link-tile" onClick={() => openFeaturePopup({ title: "Messages", description: "Communicate with teachers and school administration.", icon: "💬", path: "/student/messages" })}>
                <span className="tile-icon">💬</span>
                <span>Messages</span>
              </button>
            </div>
          </div>

        </section>

      </div>

      {/* =====================================
          FEATURE POPUP / MODAL
      ====================================== */}
      {selectedFeature && (
        <div className="feature-modal-overlay" onClick={closeFeaturePopup}>
          <div className="feature-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={closeFeaturePopup} aria-label="Close">×</button>
            <div className="modal-icon">{selectedFeature.icon}</div>
            <h2>{selectedFeature.title}</h2>
            <p>{selectedFeature.description}</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={closeFeaturePopup}>Cancel</button>
              <button className="modal-view-btn" onClick={handleOpenFeature}>View Details →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;