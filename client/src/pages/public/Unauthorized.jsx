import { useNavigate } from "react-router-dom";
// import { ShieldX, ArrowLeft, Home } from "lucide-react";
import "./Unauthorized.css";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">

        <div className="unauthorized-icon">
          <ShieldX size={48} strokeWidth={1.7} />
        </div>

        <span className="unauthorized-code">ERROR 403</span>

        <h1>Access Denied</h1>

        <p className="unauthorized-message">
          Sorry! You don't have permission to access this page.
          Please contact your administrator if you think this is a mistake.
        </p>

        <div className="unauthorized-actions">
          <button
            className="unauthorized-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            className="unauthorized-home-btn"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            Home
          </button>
        </div>

        <div className="unauthorized-footer">
          <span>403</span>
          <span>•</span>
          <span>School Management System</span>
        </div>

      </div>
    </div>
  );
}

export default Unauthorized;