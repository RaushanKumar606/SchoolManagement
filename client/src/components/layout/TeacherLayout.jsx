
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function TeacherLayout() {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f9",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "30px",
            textAlign: "center",
            color: "#ffc107",
          }}
        >
          Teacher Portal
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: 1,
          }}
        >
          <Link
            to="/teacher/dashboard"
            style={navLinkStyle}
          >
            Dashboard
          </Link>

          <Link
            to="/teacher/profile"
            style={navLinkStyle}
          >
            My Profile
          </Link>

          <Link
            to="/teacher/classes"
            style={navLinkStyle}
          >
            My Classes
          </Link>

          <Link
            to="/teacher/attendance"
            style={navLinkStyle}
          >
            Mark Attendance
          </Link>

          <Link
            to="/teacher/marks"
            style={navLinkStyle}
          >
            Upload Marks
          </Link>

          <Link
            to="/teacher/assignments"
            style={navLinkStyle}
          >
            Assignments
          </Link>

          <Link
            to="/teacher/timetable"
            style={navLinkStyle}
          >
            Timetable
          </Link>

          <Link
            to="/teacher/salary"
            style={navLinkStyle}
          >
            My Salary
          </Link>
        </nav>

        {/* =====================================================
            LOGOUT
        ===================================================== */}
        <button
          onClick={handleLogout}
          style={logoutBtnStyle}
        >
          Logout
        </button>
      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >

        {/* ===================================================
            TOP NAVBAR
        =================================================== */}
        <header
          style={{
            height: "60px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 30px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <span
            style={{
              fontWeight: "500",
              color: "#333",
            }}
          >
            Welcome, {user?.username || "Teacher"}
          </span>
        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}
        <main
          style={{
            padding: "30px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
}


// =========================================================
// NAV LINK STYLE
// =========================================================

const navLinkStyle = {
  color: "#cfd8dc",
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "4px",
  transition: "background 0.2s",
  display: "block",
};


// =========================================================
// LOGOUT BUTTON
// =========================================================

const logoutBtnStyle = {
  padding: "10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "auto",
};