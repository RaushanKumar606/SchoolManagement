import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Admin.css";
function StudentLayout() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="student-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2>School ERP</h2>

        <p>
          Student Portal
        </p>

        <nav>

       

          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Dashboard
          </NavLink>

          

          <NavLink
            to="/student/timetable"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Timetable
          </NavLink>
         

          <NavLink
            to="/student/attendance"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Attendance
          </NavLink>

         

          <NavLink
            to="/student/homework"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Homework
          </NavLink>


          

          <NavLink
            to="/student/results"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Results
          </NavLink>


         

          <NavLink
            to="/student/fees"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Fees
          </NavLink>





          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 My Profile
          </NavLink>

          
        </nav>

        <button onClick={logoutUser}>
          Logout
        </button>

      </aside>

      {/* Main */}
      <div className="main-content">

        {/* Topbar */}
        <header className="topbar">

          <div>
            <h3>Student Portal</h3>
          </div>

          <div>
            <span>
              {user?.username}
            </span>
          </div>

        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default StudentLayout;