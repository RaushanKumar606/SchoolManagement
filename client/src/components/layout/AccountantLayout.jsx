
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AccountantLayout.css";

const menuItems = [
  { label: "Dashboard", path: "/accountant/dashboard", icon: "▦" },
  { label: "StudentFeePay", path: "/accountant/student-fees-payment", icon: "👥" },
  { label: "Fee Collection", path: "/accountant/fees", icon: "₹" },
  { label: "Payment Records", path: "/accountant/salary-slips", icon: "▤" },
  { label: "Fee Reports", path: "/accountant/fees-invoice", icon: "▥" },
  { label: "Staff Salary & Payroll", path: "/accountant/salary-structure", icon: "◈" },
    { label: "Employees", path: "/accountant/employees", icon: "👥" },
];

function AccountantLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Accountant";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  return (
    <div className="accountant-layout">
      <aside className="accountant-sidebar">
        <div className="accountant-brand">
          <div className="accountant-brand-icon">S</div>
          <div>
            <h2>School ERP</h2>
            <p>Finance Management</p>
          </div>
        </div>

        <div className="accountant-menu-label">MAIN MENU</div>

        <nav className="accountant-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/accountant/dashboard"}
              className={({ isActive }) =>
                `accountant-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="accountant-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="accountant-sidebar-footer">
          <div className="accountant-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="accountant-user-details">
            <strong>{username}</strong>
            <span>Accountant</span>
          </div>
          <button
            type="button"
            className="accountant-logout"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      <div className="accountant-content">
        <header className="accountant-topbar">
          <div>
            <span className="accountant-topbar-eyebrow">
              SCHOOL MANAGEMENT SYSTEM
            </span>
            <h1>Accountant Panel</h1>
          </div>

          <div className="accountant-topbar-user">
            <div className="accountant-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{username}</strong>
              <span>Finance & Accounts</span>
            </div>
          </div>
        </header>

        <main className="accountant-page-content">
          <Outlet />
        </main>

        <footer className="accountant-footer">
          School ERP · Finance Management
        </footer>
      </div>
    </div>
  );
}

export default AccountantLayout;
