
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import "./TeacherProfile.css";

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

    let isMounted = true;

    teacherService
      .getTeacherDetails(employeeId)
      .then((res) => {
        if (!isMounted) return;

        if (res.success) {
          setProfile(res.data);
        } else {
          setError(res.error || "Failed to load profile");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        if (isMounted) {
          setError("Network error. Could not fetch profile.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [employeeId, navigate]);

  if (loading) {
    return (
      <div className="teacher-profile-state">
        <div className="profile-loader"></div>
        <h3>Loading Profile</h3>
        <p>Please wait while we fetch your information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-profile-state">
        <div className="profile-error-icon">!</div>
        <h3>Unable to Load Profile</h3>
        <p>{error}</p>
        <button
          className="profile-back-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="teacher-profile-state">
        <h3>Profile Not Found</h3>
        <p>No teacher profile information is available.</p>
        <Link to="/teacher/dashboard" className="profile-back-button">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const initial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "T";

  return (
    <div className="teacher-profile-page">

      {/* Page Header */}
      <div className="teacher-profile-heading">
        <div>
          <span className="profile-eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>View your personal and professional information.</p>
        </div>

        <Link to="/teacher/dashboard" className="profile-back-button">
          <span>←</span> Dashboard
        </Link>
      </div>

      {/* Profile Banner */}
      <div className="teacher-profile-banner">
        <div className="profile-banner-pattern"></div>

        <div className="profile-banner-content">
          <div className="teacher-avatar">
            {initial}
          </div>

          <div className="teacher-banner-details">
            <span className="teacher-role-label">
              TEACHER PROFILE
            </span>

            <h2>{profile.name || "Teacher"}</h2>

            <p>
              {profile.subject || "Subject not specified"}
            </p>
          </div>

          <div className="teacher-id-badge">
            <span>EMPLOYEE ID</span>
            <strong>{profile.employeeId || employeeId}</strong>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="teacher-profile-content">

        <section className="profile-section-card">
          <div className="profile-section-heading">
            <div className="profile-section-icon">▣</div>
            <div>
              <h3>Personal Information</h3>
              <p>Your registered contact and personal details</p>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span className="profile-info-icon">✉</span>
              <div>
                <label>Email Address</label>
                <strong>{profile.email || "N/A"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-icon">☎</span>
              <div>
                <label>Phone Number</label>
                <strong>{profile.phone || "N/A"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-icon">ID</span>
              <div>
                <label>Employee ID</label>
                <strong>{profile.employeeId || employeeId}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-icon">⌂</span>
              <div>
                <label>Department</label>
                <strong>{profile.department || "N/A"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-icon">✧</span>
              <div>
                <label>Qualification</label>
                <strong>{profile.qualification || "N/A"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-icon">▤</span>
              <div>
                <label>Subject Expert</label>
                <strong>{profile.subject || "N/A"}</strong>
              </div>
            </div>

          </div>
        </section>

        {/* Allocated Classes */}
        <section className="profile-section-card">
          <div className="profile-section-heading">
            <div className="profile-section-icon">▦</div>
            <div>
              <h3>Allocated Classes & Subjects</h3>
              <p>Classes and subjects assigned to you</p>
            </div>
          </div>

          {profile.classes && profile.classes.length > 0 ? (
            <div className="allocated-classes-grid">
              {profile.classes.map((cls, index) => (
                <div className="allocated-class-card" key={index}>
                  <div className="allocated-class-icon">
                    {index + 1}
                  </div>

                  <div className="allocated-class-details">
                    <span>CLASS</span>
                    <h4>{cls.className || "Class"}</h4>
                    <p>{cls.subject || "Subject not specified"}</p>
                  </div>

                  <span className="allocated-class-arrow">↗</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-allocated-classes">
              <div>▦</div>
              <h4>No Classes Assigned</h4>
              <p>
                Currently, there are no classes or subjects
                allocated to your profile.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
