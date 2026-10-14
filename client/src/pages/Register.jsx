import { useState } from "react";
// import { registerUser } from "../services/authService";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await registerUser(form);

      setSuccess("Registration successful!");

      setForm({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "STUDENT",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo">
          S
        </div>

        <h1>Create Account</h1>

        <p>
          Register your SchoolERP account
        </p>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {success && (
          <div className="register-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>First Name</label>

          <input
            type="text"
            name="first_name"
            placeholder="Enter first name"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>

          <input
            type="text"
            name="last_name"
            placeholder="Enter last name"
            value={form.last_name}
            onChange={handleChange}
          />

          <label>Phone</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <label>Role</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="STUDENT">
              Student
            </option>

            <option value="PARENT">
              Parent
            </option>

            <option value="TEACHER">
              Teacher
            </option>
          </select>

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;