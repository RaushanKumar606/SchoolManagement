import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { teacherService } from "../services/teacherService";

export default function TeacherLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calling the existing teacher login API service
      const response = await teacherService.login({
        employee_id: employeeId,
        password: password
      });

      if (response.success) {
        // Save teacher session details to localStorage
        localStorage.setItem("employee_id", response.employee_id);
        localStorage.setItem("teacher_name", response.name);
        localStorage.setItem("role", "teacher");

        // Redirect to Teacher Dashboard
        navigate("/teacher/dashboard");
      } else {
        setError(response.error || "Invalid Employee ID or Password");
      }
    } catch (err) {
      console.error(err);
      setError("Network error or backend server is down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f7f6" }}>
      <form 
        onSubmit={handleTeacherLogin} 
        style={{ background: "white", padding: "35px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", width: "380px", border: "1px solid #eaeaea" }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: "0 0 5px 0", color: "#333" }}>👨‍🏫 Teacher Portal</h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Sign in using your Employee ID</p>
        </div>

        {error && (
          <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "5px", fontSize: "13px", marginBottom: "15px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#444" }}>Employee ID</label>
          <input 
            type="text" 
            value={employeeId} 
            onChange={(e) => setEmployeeId(e.target.value)} 
            required 
            placeholder="e.g. TCH102"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "14px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#444" }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "14px" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", transition: "background 0.2s" }}
        >
          {loading ? "Signing in..." : "Login to Dashboard"}
        </button>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px" }}>
          <span style={{ color: "#666" }}>New Teacher? </span>
          <Link to="/teacher/register" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>Register here</Link>
        </div>
      </form>
    </div>
  );
}