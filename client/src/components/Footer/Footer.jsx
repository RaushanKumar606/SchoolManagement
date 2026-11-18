
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import schoolLogo from "../../assets/schoolLogo.png";
import { getPublicApplicationSettings } from "../../services/applicationSettingsService";

import "./Footer.css";

function SchoolLogo({ src }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="report-logo-placeholder">
        SCHOOL
      </div>
    );
  }

  return (
    <img
      className="report-logo"
      src={src}
      alt="Springfield School"
      onError={() => setImageError(true)}
    />
  );
}

function Footer() {
  const [applicationSettings, setApplicationSettings] = useState(null);

  // Fetch application availability from backend
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

  return (
    <footer className="footer">

      <div className="section-container footer-grid">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-school-brand">

            <div className="school-logo">
              <SchoolLogo src={schoolLogo} />
            </div>

            <div>
              <h2>Springfield School</h2>
              <span>Knowledge • Character • Excellence</span>
            </div>

          </Link>

          <p>
            Inspiring young minds to learn, lead and make
            a positive difference in the world.
          </p>

        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">

          <h4>Quick Links</h4>

          <Link to="/about">About Us</Link>

          <a href="/#academics">Academics</a>

          <a href="/#facilities">Facilities</a>

          {studentAdmissionOpen ? (
            <Link to="/admission/apply">
              Admissions
            </Link>
          ) : (
            <span className="footer-coming-soon">
              Admissions - Coming Soon
            </span>
          )}

        </div>

        {/* INFORMATION */}
        <div className="footer-column">

          <h4>Information</h4>

          <a href="/#events">Events</a>

          <a href="/#contact">Contact</a>

          <Link to="/login">
            Student Login
          </Link>

          {teacherHiringOpen ? (
            <Link to="/register">
              Teacher Registration
            </Link>
          ) : (
            <span className="footer-coming-soon">
              {applicationSettings === null
                ? "Loading..."
                : "Teacher Hiring - Soon"}
            </span>
          )}

        </div>

        {/* CONTACT */}
        <div className="footer-column footer-contact">

          <h4>Contact Us</h4>

          <p>
            <span>📍</span> 123 School Road
          </p>

          <p>
            <span>📞</span> +91 98765 43210
          </p>

          <p>
            <span>✉️</span> info@springfieldschool.edu
          </p>

        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Springfield School.
          All rights reserved.
        </p>

        <div>
          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <span>•</span>

          <Link to="/terms">
            Terms & Conditions
          </Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
