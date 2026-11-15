
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService";
import "./ChangePass.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);

      setSuccess("Your password has been changed successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-card">

        {/* LEFT SIDE */}
        <div className="reset-info">
          <div className="reset-brand">
            <div className="reset-brand-icon">S</div>
            <span>School Management</span>
          </div>

          <div className="reset-info-content">
            <div className="reset-lock-icon">🔐</div>

            <h1>Secure Your Account</h1>

            <p>
              Keep your account safe by creating a strong
              password that only you know.
            </p>

            <div className="reset-security-list">
              <div>✓ Protect your personal information</div>
              <div>✓ Use a unique password</div>
              <div>✓ Never share your password</div>
            </div>
          </div>

          <div className="reset-info-footer">
            Secure Access · School Management System
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="reset-form-section">

          <div className="reset-heading">
            <span className="reset-eyebrow">ACCOUNT SECURITY</span>
            <h2>Change Password</h2>
            <p>
              Enter your current password and choose a new one.
            </p>
          </div>

          {error && (
            <div className="reset-message reset-error">
              <span>!</span>
              {error}
            </div>
          )}

          {success && (
            <div className="reset-message reset-success">
              <span>✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handlePasswordReset}>

            {/* CURRENT PASSWORD */}
            <div className="reset-field">
              <label>Current Password</label>

              <div className="reset-input-wrapper">
                <span className="reset-input-icon">🔒</span>

                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="reset-field">
              <label>New Password</label>

              <div className="reset-input-wrapper">
                <span className="reset-input-icon">🔑</span>

                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>

              <small>Minimum 8 characters required.</small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="reset-field">
              <label>Confirm New Password</label>

              <div className="reset-input-wrapper">
                <span className="reset-input-icon">🔐</span>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="reset-submit-btn"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="reset-bottom-text">
            Your account security is our priority.
          </div>

        </div>
      </div>

    </div>
  );
}

export default ResetPassword;
