
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Teacher.css";

const teacherMenu = [
  { path: "/teacher/dashboard", label: "Dashboard", icon: "⌂", end: true },
  { path: "/teacher/profile", label: "My Profile", icon: "◎" },
  { path: "/teacher/my-courses/", label: "Teacher Classes", icon: "▦" },
  { path: "/teacher/attendance", label: "Mark Attendance", icon: "◷" },
  { path: "/teacher/marks", label: "Upload Marks", icon: "▤" },
  { path: "/teacher/assignments", label: "Assignments", icon: "▧" },
  { path: "/teacher/timetable", label: "Timetable", icon: "▣" },
  { path: "/teacher/my-salary", label: "My Salary", icon: "₹" },
];

export default function TeacherLayout() {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = user?.username || "Teacher";
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="teacher-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="teacher-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`teacher-sidebar ${
          sidebarOpen ? "teacher-sidebar-open" : ""
        }`}
      >
        {/* Brand */}
        <div className="teacher-brand">
          <div className="teacher-brand-logo">T</div>

          <div className="teacher-brand-text">
            <h2>School ERP</h2>
            <span>Learning Management</span>
          </div>

          <button
            type="button"
            className="teacher-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Portal label */}
        <div className="teacher-portal-label">
          TEACHER PORTAL
        </div>

        {/* Navigation */}
        <nav className="teacher-navigation">
          <p className="teacher-nav-heading">MAIN MENU</p>

          {teacherMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `teacher-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="teacher-nav-icon">{item.icon}</span>
              <span className="teacher-nav-label">{item.label}</span>
              <span className="teacher-nav-arrow">›</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom */}
        <div className="teacher-sidebar-bottom">
          <div className="teacher-help-card">
            <div className="teacher-help-icon">?</div>
            <div>
              <strong>Need Help?</strong>
              <p>Contact school administration.</p>
            </div>
          </div>

          <button
            type="button"
            className="teacher-logout-btn"
            onClick={handleLogout}
          >
            <span className="teacher-logout-icon">↪</span>
            Logout
          </button>

          <div className="teacher-sidebar-footer">
            © {new Date().getFullYear()} School ERP
          </div>
        </div>
      </aside>

      {/* Main section */}
      <div className="teacher-main">
        {/* Topbar */}
        <header className="teacher-topbar">
          <div className="teacher-topbar-left">
            <button
              type="button"
              className="teacher-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div>
              <h3>Teacher Dashboard</h3>
              <p>Manage your classes and academic activities.</p>
            </div>
          </div>

          <div className="teacher-topbar-right">
            <div className="teacher-user-info">
              <div className="teacher-user-avatar">{initial}</div>

              <div className="teacher-user-details">
                <strong>{username}</strong>
                <span>Teacher</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="teacher-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
