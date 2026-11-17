
import { Link } from "react-router-dom";
import "./Footer.css";
import schoolLogo from "../../assets/schoolLogo.png";
const SCHOOL = {
  rightLogo: schoolLogo,
};


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


function Footer({ teacherHiringOpen = false }) {
  return (
    <footer className="footer">

      <div className="section-container footer-grid">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-school-brand">

            <div className="school-logo">
              <img src={schoolLogo} alt="Springfield School" />
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
          <Link to="/admission/apply">Admissions</Link>
        </div>

        {/* INFORMATION */}
        <div className="footer-column">
          <h4>Information</h4>

          <a href="/#events">Events</a>
          <a href="/#contact">Contact</a>

          <Link to="/login">Student Login</Link>

          {teacherHiringOpen ? (
            <Link to="/register">Teacher Registration</Link>
          ) : (
            <span className="footer-coming-soon">
              Teacher Hiring-Soon
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
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
