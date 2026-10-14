import { useNavigate } from "react-router-dom";
// import "./AccountantDashboard.css";

function AccountantDashboard() {
  const navigate = useNavigate();

  return (
    <div className="accountant-dashboard">

      <aside className="accountant-sidebar">
        <div className="sidebar-logo">
          <h2>School System</h2>
          <span>Accountant</span>
        </div>

        <nav>
          <button className="active">
            📊
            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              navigate("/accountant/employees")
            }
          >
            👨‍🏫
            <span>Employees</span>
          </button>

          <button
            onClick={() =>
              navigate("/accountant/salary-structure")
            }
          >
            💰
            <span>Salary Structure</span>
          </button>

          <button
            onClick={() =>
              navigate("/accountant/salary-slips")
            }
          >
            📄
            <span>Salary Slips</span>
          </button>

          <button
            onClick={() =>
              navigate("/accountant/fees-invoice")
            }
          >
            🧾
            <span>Fees Invoice</span>
          </button>
        </nav>
      </aside>

      <main className="accountant-main">

        <header className="accountant-header">
          <div>
            <h1>Accountant Dashboard</h1>
            <p>
              Manage salaries, employees and fees.
            </p>
          </div>
        </header>

        <section className="accountant-content">

          <div className="welcome-box">
            <h2>Welcome, Accountant</h2>

            <p>
              Select a module below to manage
              accounting operations.
            </p>
          </div>

          <div className="accountant-module-grid">

            {/* Employees */}

            <div
              className="accountant-module-card"
              onClick={() =>
                navigate("/accountant/employees")
              }
            >
              <div className="module-icon">
                👨‍🏫
              </div>

              <div>
                <h3>Employees</h3>
                <p>
                  Manage teachers and employee
                  information.
                </p>
              </div>

              <span className="module-arrow">
                →
              </span>
            </div>

            {/* Salary Structure */}

            <div
              className="accountant-module-card"
              onClick={() =>
                navigate(
                  "/accountant/salary-structure"
                )
              }
            >
              <div className="module-icon">
                💰
              </div>

              <div>
                <h3>Salary Structure</h3>
                <p>
                  Manage employee salary structures.
                </p>
              </div>

              <span className="module-arrow">
                →
              </span>
            </div>

            {/* Salary Slip */}

            <div
              className="accountant-module-card"
              onClick={() =>
                navigate(
                  "/accountant/salary-slips"
                )
              }
            >
              <div className="module-icon">
                📄
              </div>

              <div>
                <h3>Salary Slips</h3>
                <p>
                  Create, approve and pay salary
                  slips.
                </p>
              </div>

              <span className="module-arrow">
                →
              </span>
            </div>

            {/* Fees Invoice */}

            <div
              className="accountant-module-card"
              onClick={() =>
                navigate(
                  "/accountant/fees-invoice"
                )
              }
            >
              <div className="module-icon">
                🧾
              </div>

              <div>
                <h3>Fees Invoice</h3>
                <p>
                  Manage student fees invoices and
                  payments.
                </p>
              </div>

              <span className="module-arrow">
                →
              </span>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AccountantDashboard;