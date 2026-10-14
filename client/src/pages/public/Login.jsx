
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { teacherService } from "../../services/teacherService";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigateByRole = (role) => {
    
    switch (role) {
      case ROLES.SCHOOL_ADMIN:
        navigate("/admin/dashboard");
        break;

      case ROLES.TEACHER:
    
        navigate("/teacher/dashboard");
        break;

      case ROLES.STUDENT:
        navigate("/student/dashboard");
        break;

      case ROLES.PARENT:
        navigate("/parent/dashboard");
        break;

      default:
        setError(`Invalid user role: ${role}`);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!username.trim() || !password) {
    setError("Please enter username and password.");
    return;
  }

  setLoading(true);

  try {
    const enteredUsername = username.trim();

    // =====================================================
    // TEACHER LOGIN
    // =====================================================

    const isTeacher = enteredUsername
      .toUpperCase()
      .startsWith("TCH-");

    let response;

    if (isTeacher) {
      response = await teacherService.login({
        employee_id: enteredUsername,
        password: password,
      });

      if (!response?.access) {
        setError(
          response?.detail ||
          response?.message ||
          response?.error ||
          "Teacher login failed."
        );
        return;
      }

    } else {

      response = await login(
        enteredUsername,
        password
      );
  
      if (!response?.access) {
        setError(
          response?.detail ||
          response?.message ||
          "Invalid username or password."
        );
        return;
      }
    }
    const role =
      response.role ||
      response.user?.role;

    const userData = {
      id:
        response.user_id ||
        response.user?.id,

      username:
        response.username ||
        response.user?.username ||
        response.employee_id ||
        enteredUsername,

      role: role,
    };
    loginUser(userData);

    // =====================================================
    // FIRST LOGIN / PASSWORD CHANGE
    // =====================================================

    // if (response.must_change_password === true) {

    //   navigate("/change-password", {
    //     state: {
    //       username: userData.username,
    //       role: userData.role,
    //     },
    //   });

    //   return;
    // }

    // =====================================================
    // STUDENT TEMPORARY PASSWORD
    // =====================================================

    const isTemporaryPassword =
      password.startsWith("Student@") ||
      response.is_first_login === true;

    if (isTemporaryPassword) {
      navigate("/change-password", {
        state: {
          username: userData.username,
          role: userData.role,
        },
      });

      return;
    }

    navigateByRole(role);

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    setError(
      error?.message ||
      "Login failed. Please try again."
    );

  } finally {

    setLoading(false);

  }
};


  return (
    <div className="login-page">

      {/* Left Section */}
      <div className="login-brand-section">
        <div className="brand-overlay">

          <div className="school-logo">
            <span>🎓</span>
          </div>

          <h1>School Management</h1>

          <p>
            One platform to manage students, teachers,
            attendance, academics and administration.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span>✓</span>
              <p>Student Management</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Teacher & Staff Management</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Attendance & Academics</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Fees & Administration</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Section */}
      <div className="login-form-section">

        <div className="login-card">

          <div className="login-header">
            <div className="mobile-logo">
              🎓
            </div>

            <h2>Welcome Back</h2>

            <p>
              Sign in to access your school account
            </p>
          </div>

          {error && (
            <div className="login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="username">
                Username / Employee ID
              </label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => {
                  setError(
                    "Please contact your school administrator to reset your password."
                  );
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="arrow">→</span>
                </>
              )}
            </button>

          </form>

          <div className="login-footer">
            <span>Secure School Portal</span>
            <span>•</span>
            <span>Authorized Users Only</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;

