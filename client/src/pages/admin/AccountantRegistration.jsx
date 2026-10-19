
import { useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import "./Accountant.css";

function AccountantRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest(
        "/accountants/create/",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );
      console.log("Accountant creation response:", response);

      setMessage("Accountant account created successfully.");
      setFormData({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accountant-registration">
      <div className="accountant-registration-card">
        <div className="accountant-registration-header">
          <div className="accountant-registration-icon">👨‍💼</div>
          <h2>Register Accountant</h2>
          <p>Create an account for your school's accountant.</p>
        </div>

        {message && (
          <div className="accountant-alert success">{message}</div>
        )}

        {error && (
          <div className="accountant-alert error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="accountant-form-grid">
            <div className="accountant-field">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="accountant-field">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="accountant-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>

            <div className="accountant-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="accountant@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="accountant-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
              />
            </div>

            <div className="accountant-field">
              <label htmlFor="password">Temporary Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            className="accountant-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Accountant"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountantRegistration;
