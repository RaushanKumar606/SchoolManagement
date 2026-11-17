
import { useState } from "react";
import { Link } from "react-router-dom";
import schoolLogo from "../../assets/schoolLogo.png";
import "./Navbar.css";


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


function Navbar({
  schoolLogo = "",
  teacherHiringOpen = false,
  applicationSettings = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
   <>
   <header className="navbar">
     <div className="nav-container">
   
       {/* SCHOOL BRAND */}
       <Link to="/" className="school-brand">
         <div className="school-logo">
           <SchoolLogo src={SCHOOL.rightLogo} />
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
         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
         aria-label="Toggle navigation menu"
         aria-expanded={mobileMenuOpen}
       >
         <span></span>
         <span></span>
         <span></span>
       </button>
   
       {/* NAVIGATION */}
       <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
         <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
         <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
         <a href="#academics" onClick={() => setMobileMenuOpen(false)}>Academics</a>
         <a href="#facilities" onClick={() => setMobileMenuOpen(false)}>Facilities</a>
         <Link to="/admission/apply" onClick={() => setMobileMenuOpen(false)}>Admissions</Link>
         <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
         <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
   
         {/* MOBILE ACTIONS */}
         <div className="mobile-nav-actions">
           <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
             Login
           </Link>
   
           {teacherHiringOpen ? (
             <Link
               to="/register"
               className="admission-btn"
               onClick={() => setMobileMenuOpen(false)}
             >
               Teacher Hiring
             </Link>
           ) : (
             <button type="button" className="coming-soon-btn" disabled>
               {applicationSettings === null
                 ? "Loading..."
                 : "Teacher Hiring-Soon"}
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
           <button type="button" className="coming-soon-btn" disabled>
             {applicationSettings === null
               ? "Loading..."
               : "Teacher Hiring-Soon"}
           </button>
         )}
       </div>
   
     </div>
   </header>
   </>
  );
}

export default Navbar;
