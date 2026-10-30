
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./Admin.css";
import { useAuth } from "../../hooks/useAuth";

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">📚</div>

          <div>
            <h4>Data Click Education</h4>
            <small>Management System</small>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">S</div>

          <div>
            <h5>Super Administrator</h5>
            <span>⭐ {user?.username}</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          {/* MAIN */}
          <p className="nav-heading">MAIN</p>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏠 Dashboard
          </NavLink>


          {/* STUDENTS */}
          <p className="nav-heading">STUDENTS</p>

          <NavLink
            to="/admin/admission_enquiry"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🔓 Admission Enquiry
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            👥 All Students
          </NavLink>

          <NavLink
            to="/admin/admissions/new"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 New Admission
          </NavLink>

           <NavLink
            to="/admin/academics"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 AcademicManagement
          </NavLink>
          <NavLink
            to="/admin/teacherAssigment"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 TeacherAssignment 
          </NavLink>


<NavLink
            to="/admin/timetable"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 TimeTable 
          </NavLink>



          {/* FEES */}
          <p className="nav-heading">FEES</p>

          <NavLink
            to="/admin/fees/structure"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📋 Fee Structure
          </NavLink>

          <NavLink
            to="/admin/fees/collection"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            💰 Fee Collection
          </NavLink>

          <NavLink
            to="/admin/fees/quick-collect"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            ⚡ Quick Fee Collect
          </NavLink>


          {/* ACADEMICS */}
          <p className="nav-heading">ACADEMICS</p>

          <NavLink
            to="/admin/attendance"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📅 Attendance
          </NavLink>

          <NavLink
            to="/admin/exams"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 Marks Entry
          </NavLink>


          {/* PEOPLE */}
          <p className="nav-heading">PEOPLE</p>

          <NavLink
            to="/admin/teachers"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            👨‍🏫 Teachers
          </NavLink>

          <NavLink
            to="/admin/parents"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            👨‍👩‍👧 Parents
          </NavLink>


          {/* ACADEMIC SETUP */}
          <p className="nav-heading">ACADEMIC SETUP</p>

          <NavLink
            to="/admin/classes"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🏫 Classes & Sections
          </NavLink>

          <NavLink
            to="/admin/subjects"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            📚 Subjects
          </NavLink>

          <NavLink
            to="/admin/timetable"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🗓️ Timetable
          </NavLink>


          {/* ================= ACCOUNTANT ================= */}

  <p className="nav-heading">FINANCE</p>
  <NavLink
            to="/admin/accountants/register"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            💰 Accountant
          </NavLink>

          {/* SYSTEM */}
          <p className="nav-heading">SYSTEM</p>

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            🔔 Notifications
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            👤 Profile
          </NavLink>

        </nav>
      </aside>


      {/* MAIN */}
      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, Super Administrator!</p>
          </div>

          <div className="header-actions">

            <span className="academic-year">
              📅 2027-28
            </span>

            <div className="header-icons">

              <span className="icon circle green"></span>
              <span className="icon circle purple"></span>
              <span className="icon circle blue"></span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          </div>

        </header>


        {/* CHILD PAGE */}
        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;