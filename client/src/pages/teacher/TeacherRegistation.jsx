
import { useState } from "react";
import { Link } from "react-router-dom";
import { teacherService } from "../../services/teacherService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  primary_subject: "",
  qualification: "",
  password: "",

  // message: "",
};

function TeacherRegistation() {

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);
    setLoading(true);

    try {
     const data = await teacherService.register(form);

      setSuccess(data);
      setForm(initialForm);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="admission-success-page">
        <div className="admission-success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>Application Submitted</h1>

          <p>
            Your admission application has been successfully
            submitted to the school.
          </p>

          {/* <div className="application-number">
            <span>Application Number</span>
            <strong>{success.application_number}</strong>
          </div> */}

          <p>
            Please keep this application number for future
            reference.
          </p>

          <div className="success-actions">
            <button
              onClick={() => setSuccess(null)}
              className="primary-button"
            >
              Submit Another Application
            </button>

            <Link to="/" className="secondary-button">
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="admission-page">

      {/* Header */}

      <header className="admission-header">

        <div className="admission-header-inner">

          <Link to="/" className="school-brand">
            <div className="school-logo">
              S
            </div>

            <div>
              <strong>Springfield School</strong>
              <span>Admission Portal</span>
            </div>
          </Link>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>

      </header>

      {/* Hero */}

      <section className="admission-hero">

        <div>

          <p>
            Complete the application form below to begin
            the Hiring process at Springfield School.
          </p>

        </div>

      </section>

      {/* Form */}

      <main className="admission-container">

        <div className="admission-form-wrapper">

          <div className="form-introduction">

            <h2>Teacher Hiring Process</h2>

            <p>
              Please provide accurate information. Our
              Hiring team will review your Process
              and contact you.
            </p>

            <div className="application-steps">

              <div className="step active">
                <span>1</span>
                <div>
                  <strong>Application</strong>
                  <small>Fill the form</small>
                </div>
              </div>

              <div className="step">
                <span>2</span>
                <div>
                  <strong>Review</strong>
                  <small>School reviews</small>
                </div>
              </div>

              <div className="step">
                <span>3</span>
                <div>
                  <strong>Decision</strong>
                  <small>Hiring status</small>
                </div>
              </div>

            </div>

          </div>

          <form
            className="admission-form"
            onSubmit={handleSubmit}
          >

            {/* Student Information */}

            <section className="form-section">

              <h3>Teacher Information</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>First Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="form-group">
                  <label>Middle Name</label>

                  <input
                    type="text"
                    name="middle_name"
                    value={form.middle_name}
                    onChange={handleChange}
                  />
                </div> */}

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="form-group">
                  <label>Date of Birth *</label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                {/* USED TO GENDER */}

                {/* <div className="form-group">
                  <label>Gender *</label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div> */}

                 <div className="form-group">
                  <label>Department *</label>

                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label> Primary_Subject *</label>

                  <select
                    name="primary_subject"
                    value={form.primary_subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Class
                    </option>

                    <option value="Math">Math</option>
                    <option value="Physice">Physice</option>
                    <option value="Computer">Computer</option>

                    {Array.from(
                      { length: 12 },
                      (_, i) => (
                        <option
                          key={i + 1}
                          value={`Class ${i + 1}`}
                        >
                          Class {i + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Qualification *</label>

                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type=""
                    name="phone"                    value={form.phone}
                    onChange={handleChange}
                   required
                  />
                </div>

              </div>
            </section>

            <div className="form-group">
                  <label>Password *</label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
            

            {/* Message */}

            {/* <section className="form-section">

              <h3>Additional Information</h3>

              <div className="form-group">

                <label>
                  Message / Additional Information
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information..."
                />

              </div>

            </section> */}

            {/* Error */}

            {error && (
              <div className="admission-error">
                {error}
              </div>
            )}

            {/* Submit */}

            <div className="form-submit-area">

              <p>
                By submitting this form, you confirm that
                the information provided is correct.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="submit-admission-button"
              >
                  {loading ? "Submitting..." : "Register"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default TeacherRegistation;