function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">S</div>
        <div>
          <h2>SchoolERP</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-title">MAIN MENU</p>

        <a href="#" className="menu-item active">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="#" className="menu-item">
          <span>👨‍🎓</span>
          Students
        </a>

        <a href="#" className="menu-item">
          <span>👨‍🏫</span>
          Teachers
        </a>

        <a href="#" className="menu-item">
          <span>📅</span>
          Attendance
        </a>

        <a href="#" className="menu-item">
          <span>📝</span>
          Examinations
        </a>

        <a href="#" className="menu-item">
          <span>💳</span>
          Fees
        </a>

        <p className="menu-title">MANAGEMENT</p>

        <a href="#" className="menu-item">
          <span>📚</span>
          Academics
        </a>

        <a href="#" className="menu-item">
          <span>📖</span>
          Library
        </a>

        <a href="#" className="menu-item">
          <span>🚌</span>
          Transport
        </a>

        <a href="#" className="menu-item">
          <span>⚙️</span>
          Settings
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="help-box">
          <strong>Need Help?</strong>
          <p>Contact school support</p>
          <button>Get Support</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;