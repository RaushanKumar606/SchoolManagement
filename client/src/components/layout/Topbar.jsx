
    import { logout } from "../services/api";

function Topbar({ onLogout }) {
  const handleLogout = () => {
    logout();
    onLogout();
  };
  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">School Administration</p>
        <h2>Dashboard</h2>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          🔍
          <input
            type="text"
            placeholder="Search students, teachers..."
          />
        </div>

        <button className="notification-btn">
          🔔
          <span></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">RK</div>
          <div>
            <strong>Admin</strong>
            <small>School Administrator</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;