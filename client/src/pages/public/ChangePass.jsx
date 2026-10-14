import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword(
        currentPassword,
        newPassword
      );
      setSuccess("Password changed successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {

      setError(err.message || "Failed to change password.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {success}
        </p>
      )}

      <form onSubmit={handlePasswordReset}>

        <div>
          <label>Current Password</label>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm New Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>

      </form>
    </div>
  );
}

export default ResetPassword;