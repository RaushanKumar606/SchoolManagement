import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employee_id");

  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }

    teacherService.getTeacherDetails(employeeId)
      .then((res) => {
        if (res.success) {
          setProfile(res.data);
        } else {
          setError(res.error || "Failed to load profile");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Network error. Could not fetch profile.");
        setLoading(false);
      });
  }, [employeeId, navigate]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Profile...</div>;
  if (error) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>👨‍🏫 Teacher Profile Details</h2>
        <Link to="/teacher/dashboard">
          <button style={{ padding: "8px 15px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", border: "1px solid #ddd" }}>
        
        {/* Basic Info Header */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#007bff", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "bold", marginRight: "20px" }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "T"}
          </div>
          <div>
            <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{profile?.name}</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Subject Expert: <strong>{profile?.subject}</strong></p>
          </div>
        </div>

        {/* Detailed Grid Information */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", marginBottom: "25px" }}>
          <div style={infoBoxStyle}>
            <span style={labelStyle}>Employee ID</span>
            <span style={valueStyle}>{profile?.employeeId}</span>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Department</span>
            <span style={valueStyle}>{profile?.department}</span>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Email Address</span>
            <span style={valueStyle}>{profile?.email || "N/A"}</span>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Phone Number</span>
            <span style={valueStyle}>{profile?.phone || "N/A"}</span>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Qualification</span>
            <span style={valueStyle}>{profile?.qualification || "N/A"}</span>
          </div>
        </div>

        {/* Assigned Classes Section */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>📚 Allocated Classes & Subjects</h4>
          {profile?.classes && profile.classes.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {profile.classes.map((cls, index) => (
                <li key={index} style={{ marginBottom: "5px", fontSize: "14px", color: "#444" }}>
                  {cls.className} — <strong>{cls.subject}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "14px", color: "#666" }}>No classes currently assigned.</p>
          )}
        </div>

      </div>
    </div>
  );
}

const infoBoxStyle = {
  background: "#f9f9f9",
  padding: "12px 15px",
  borderRadius: "6px",
  border: "1px solid #eaeaea",
  display: "flex",
  flexDirection: "column"
};

const labelStyle = {
  fontSize: "12px",
  color: "#777",
  marginBottom: "4px"
};

const valueStyle = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#333"
};