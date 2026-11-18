
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import schoolLogo from "../../assets/schoolLogo.png";
import { getPublicApplicationSettings } from "../../services/applicationSettingsService";

import "./Navbar.css";

function SchoolLogo({ src }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="report-logo-placeholder">SCHOOL</div>;
  }

  return (
    <img
      className="report-logo"
      src={src}
      alt="School Logo"
      onError={() => setImageError(true)}
    />
  );
}

function Navbar({
  schoolLogo: customSchoolLogo = "",
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applicationSettings, setApplicationSettings] = useState(null);

  const closeMenu = () => setMobileMenuOpen(false);

  // Fetch public application settings
  useEffect(() => {
    let isMounted = true;

    const fetchApplicationSettings = async () => {
      try {
        const response = await getPublicApplicationSettings();

        if (isMounted) {
          setApplicationSettings(response);
        }
      } catch (error) {
        console.error("Failed to fetch application settings:", error);

        if (isMounted) {
          setApplicationSettings({
            student_admission: false,
            teacher_hiring: false,
          });
        }
      }
    };

    fetchApplicationSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const studentAdmissionOpen =
    applicationSettings?.student_admission === true;

  const teacherHiringOpen =
    applicationSettings?.teacher_hiring === true;

  const logoToDisplay = customSchoolLogo || schoolLogo;

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* SCHOOL BRAND */}
        <Link to="/" className="school-brand" onClick={closeMenu}>
          <div className="school-logo">
            <SchoolLogo src={logoToDisplay} />
          </div>

          <div className="school-brand-text">
            <h2>Springfield School</h2>
            <span>Knowledge • Character • Excellence</span>
          </div>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVIGATION */}
        <nav
          className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}
        >
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/academics" onClick={closeMenu}>
  Academics
</Link>
         <Link to="/facilities" onClick={closeMenu}>
  Facilities
</Link>


          {studentAdmissionOpen && (
            <Link to="/admission/apply" onClick={closeMenu}>
              Admissions
            </Link>
          )}

          <Link to="/events" onClick={closeMenu}>
  Events
</Link>
          <a href="#contact" onClick={closeMenu}>Contact</a>

          {/* MOBILE ACTIONS */}
          <div className="mobile-nav-actions">
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            {teacherHiringOpen ? (
              <Link
                to="/register"
                className="admission-btn"
                onClick={closeMenu}
              >
                Teacher Hiring
              </Link>
            ) : (
              <button
                type="button"
                className="coming-soon-btn"
                disabled
              >
                {applicationSettings === null
                  ? "Loading..."
                  : "Teacher Hiring - Soon"}
              </button>
            )}
          </div>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          {teacherHiringOpen ? (
            <Link to="/register" className="admission-btn">
              Teacher Hiring
            </Link>
          ) : (
            <button
              type="button"
              className="coming-soon-btn"
              disabled
            >
              {applicationSettings === null
                ? "Loading..."
                : "Teacher Hiring - Soon"}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
