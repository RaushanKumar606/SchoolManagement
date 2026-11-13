// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import "./Admin.css";
// function StudentLayout() {
//   const { user, logoutUser } = useAuth();

//   return (
//     <div className="student-layout">

//       {/* Sidebar */}
//       <aside className="sidebar">

//         <h2>School ERP</h2>

//         <p>
//           Student Portal
//         </p>

//         <nav>

       

//           <NavLink
//             to="/student/dashboard"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Dashboard
//           </NavLink>

          

//           <NavLink
//             to="/student/timetable"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Timetable
//           </NavLink>

//           <NavLink
//             to="/student/homework"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Homework
//           </NavLink>

// <NavLink
//             to="/student/admit-Card"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Admit Card Downlode
//           </NavLink>
          

//           <NavLink
//             to="/student/results"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Results
//           </NavLink>



         

//           <NavLink
//             to="/student/fees"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Fees
//           </NavLink>

//           <NavLink
//             to="/student/MySubjects"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 My Subject
//           </NavLink>


//           {/* <NavLink
//             to="/student/My-Attendance"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 Attendance
//           </NavLink> */}

//            <NavLink
//             to="/student/My-Attendance"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//            🏠 Attendance
//           </NavLink>



//           <NavLink
//             to="/student/profile"
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "active" : ""}`
//             }
//           >
//             🏠 My Profile
//           </NavLink>

          
//         </nav>

//         <button onClick={logoutUser}>
//           Logout
//         </button>

//       </aside>

//       {/* Main */}
//       <div className="main-content">

//         {/* Topbar */}
//         <header className="topbar">

//           <div>
//             <h3>Student Portal</h3>
//           </div>

//           <div>
//             <span>
//               {user?.username}
//             </span>
//           </div>

//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <Outlet />
//         </main>

//       </div>

//     </div>
//   );
// }

// export default StudentLayout;




import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./StudentLayout.css";

const studentMenu = [
  { path: "/student/dashboard", icon: "⌂", label: "Dashboard", end: true },
  { path: "/student/timetable", icon: "▦", label: "Timetable" },
  { path: "/student/homework", icon: "▤", label: "Homework" },
  { path: "/student/admit-Card", icon: "▣", label: "Admit Card" },
  { path: "/student/results", icon: "▥", label: "Results" },
  { path: "/student/fees", icon: "₹", label: "Fees" },
  { path: "/student/MySubjects", icon: "▧", label: "My Subjects" },
  { path: "/student/My-Attendance", icon: "◷", label: "Attendance" },
  { path: "/student/profile", icon: "◎", label: "My Profile" },
];

function StudentLayout() {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = user?.username || "Student";
  const initial = username.charAt(0).toUpperCase();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="student-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="student-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`student-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="student-brand">
          <div className="student-brand-icon">S</div>
          <div>
            <h2>School ERP</h2>
            <span>Learning Management</span>
          </div>

          <button
            type="button"
            className="student-close-menu"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="student-portal-label">STUDENT PORTAL</div>

        <nav className="student-navigation">
          <p className="student-nav-heading">MENU</p>

          {studentMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `student-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="student-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="student-nav-arrow">›</span>
            </NavLink>
          ))}
        </nav>

        <div className="student-sidebar-bottom">
          <div className="student-help-card">
            <div className="student-help-icon">?</div>
            <div>
              <strong>Need Help?</strong>
              <p>Contact your school admin.</p>
            </div>
          </div>

          <button
            type="button"
            className="student-logout-btn"
            onClick={logoutUser}
          >
            <span className="student-logout-icon">↪</span>
            <span>Logout</span>
          </button>

          <div className="student-sidebar-footer">
            © {new Date().getFullYear()} School ERP
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="student-main">
        {/* Topbar */}
        <header className="student-topbar">
          <div className="student-topbar-left">
            <button
              type="button"
              className="student-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <div>
              <h3>Student Portal</h3>
              <p>Welcome back! Continue your learning journey.</p>
            </div>
          </div>

          <div className="student-topbar-right">
            <div className="student-user-info">
              <div className="student-user-avatar">{initial}</div>
              <div className="student-user-details">
                <strong>{username}</strong>
                <span>Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="student-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
