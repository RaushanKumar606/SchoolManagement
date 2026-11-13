
// import { Outlet, Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

// export default function TeacherLayout() {
//   const navigate = useNavigate();
//   const { logoutUser, user } = useAuth();

//   const handleLogout = () => {
//     logoutUser();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         minHeight: "100vh",
//         fontFamily: "Arial, sans-serif",
//         backgroundColor: "#f4f6f9",
//       }}
//     >
//       {/* =====================================================
//           SIDEBAR
//       ===================================================== */}
//       <aside
//         style={{
//           width: "250px",
//           backgroundColor: "#343a40",
//           color: "#fff",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           boxSizing: "border-box",
//         }}
//       >
//         <h2
//           style={{
//             fontSize: "20px",
//             marginBottom: "30px",
//             textAlign: "center",
//             color: "#ffc107",
//           }}
//         >
//           Teacher Portal
//         </h2>

//         <nav
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "8px",
//             flex: 1,
//           }}
//         >
//           <Link
//             to="/teacher/dashboard"
//             style={navLinkStyle}
//           >
//             Dashboard
//           </Link>

//           <Link
//             to="/teacher/profile"
//             style={navLinkStyle}
//           >
//             My Profile
//           </Link>
//           <Link
//             to="/teacher/my-courses/"
//             style={navLinkStyle}
//           >
//             Teacher Classes
//           </Link>

//           <Link
//             to="/teacher/attendance"
//             style={navLinkStyle}
//           >
//             Mark Attendance
//           </Link>

//           <Link
//             to="/teacher/marks"
//             style={navLinkStyle}
//           >
//             Upload Marks
//           </Link>

//           <Link
//             to="/teacher/assignments"
//             style={navLinkStyle}
//           >
//             Assignments
//           </Link>

//           <Link
//             to="/teacher/timetable"
//             style={navLinkStyle}
//           >
//             Timetable
//           </Link>

//           <Link
//             to="/teacher/salary"
//             style={navLinkStyle}
//           >
//             My Salary
//           </Link>
//         </nav>

//         {/* =====================================================
//             LOGOUT
//         ===================================================== */}
//         <button
//           onClick={handleLogout}
//           style={logoutBtnStyle}
//         >
//           Logout
//         </button>
//       </aside>


//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           minWidth: 0,
//         }}
//       >

//         {/* ===================================================
//             TOP NAVBAR
//         =================================================== */}
//         <header
//           style={{
//             height: "60px",
//             backgroundColor: "#fff",
//             borderBottom: "1px solid #dee2e6",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             padding: "0 30px",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
//           }}
//         >
//           <span
//             style={{
//               fontWeight: "500",
//               color: "#333",
//             }}
//           >
//             Welcome, {user?.username || "Teacher"}
//           </span>
//         </header>


//         {/* ===================================================
//             PAGE CONTENT
//         =================================================== */}
//         <main
//           style={{
//             padding: "30px",
//             flex: 1,
//             overflowY: "auto",
//           }}
//         >
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }


// // =========================================================
// // NAV LINK STYLE
// // =========================================================

// const navLinkStyle = {
//   color: "#cfd8dc",
//   textDecoration: "none",
//   padding: "10px 15px",
//   borderRadius: "4px",
//   transition: "background 0.2s",
//   display: "block",
// };


// // =========================================================
// // LOGOUT BUTTON
// // =========================================================

// const logoutBtnStyle = {
//   padding: "10px",
//   backgroundColor: "#dc3545",
//   color: "white",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontWeight: "bold",
//   marginTop: "auto",
// };




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
  { path: "/teacher/salary", label: "My Salary", icon: "₹" },
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
