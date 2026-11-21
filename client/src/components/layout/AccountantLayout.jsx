
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AccountantLayout.css";

const menuItems = [
  { label: "Dashboard", path: "/accountant/dashboard", icon: "📊" },
  { label: "Student Fee Payment", path: "/accountant/student-fees-payment", icon: "🎓" },
  { label: "Fee Collection", path: "/accountant/fees", icon: "💰" },
  { label: "Fee Reports", path: "/accountant/fees-invoice", icon: "📈" },
  { label: "Employees", path: "/accountant/employees", icon: "👥" },
  { label: "Salary Structures", path: "/accountant/salary-structure", icon: "📋" },
  { label: "Staff Salary & Payroll", path: "/accountant/salary-Payroll", icon: "💵" },
  { label: "Payment Records", path: "/accountant/salary-slips", icon: "🧾" },
{ label: "My Profile", path: "/accountant/profile", icon: "👤" },
];

function AccountantLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="accountant-layout">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="accountant-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`accountant-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="accountant-brand">
          <div className="accountant-brand-icon">S</div>

          <div className="accountant-brand-text">
            <h2>School ERP</h2>
            <p>Finance Management</p>
          </div>

          <button
            type="button"
            className="accountant-mobile-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* MENU */}
        <div className="accountant-menu-label">
          MAIN MENU
        </div>

        <nav className="accountant-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/accountant/dashboard"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `accountant-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="accountant-nav-icon">
                {item.icon}
              </span>

              <span className="accountant-nav-text">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
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

      {/* MAIN CONTENT */}
      <div className="accountant-content">

        {/* TOPBAR */}
        <header className="accountant-topbar">

          <div className="accountant-topbar-left">

            <button
              type="button"
              className="accountant-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div>
              <span className="accountant-topbar-eyebrow">
                SCHOOL MANAGEMENT SYSTEM
              </span>

              <h1>Accountant Panel</h1>
            </div>

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

        {/* PAGE CONTENT */}
        <main className="accountant-page-content">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="accountant-footer">
          © {new Date().getFullYear()} School ERP · Finance Management
        </footer>

      </div>
    </div>
  );
}

export default AccountantLayout;
