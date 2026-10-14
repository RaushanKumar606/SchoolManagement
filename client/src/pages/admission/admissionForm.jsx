import { useState } from "react";
import { Link } from "react-router-dom";
import { submitAdmission } from "../../services/admissionService";


const initialForm = {
  student_first_name: "",
  student_middle_name: "",
  student_last_name: "",
  date_of_birth: "",
  gender: "",
  applying_for_class: "",
  previous_school: "",

  father_name: "",
  mother_name: "",
  parent_phone: "",
  parent_email: "",

  address: "",
  city: "",
  state: "",
  postal_code: "",

  message: "",
};

function AdmissionForm() {
  
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
      const data = await submitAdmission(form);

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

          <div className="application-number">
            <span>Application Number</span>
            <strong>{success.application_number}</strong>
          </div>

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

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>

      </header>

      {/* Hero */}

      <section className="admission-hero">

        <div>

          <span className="hero-label">
            ADMISSIONS 2026–27
          </span>

        </div>

      </section>

      {/* Form */}

      <main className="admission-container">

        <div className="admission-form-wrapper">

          <div className="form-introduction">

            <h2>Student Admission Application</h2>

            <p>
              Please provide accurate information. Our
              admission team will review your application
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
                  <small>Admission status</small>
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

              <h3>Student Information</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>First Name *</label>

                  <input
                    type="text"
                    name="student_first_name"
                    value={form.student_first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Middle Name</label>

                  <input
                    type="text"
                    name="student_middle_name"
                    value={form.student_middle_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>

                  <input
                    type="text"
                    name="student_last_name"
                    value={form.student_last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
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
                </div>

                <div className="form-group">
                  <label>Applying for Class *</label>

                  <select
                    name="applying_for_class"
                    value={form.applying_for_class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Class
                    </option>

                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>

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

                <div className="form-group full-width">
                  <label>Previous School</label>

                  <input
                    type="text"
                    name="previous_school"
                    value={form.previous_school}
                    onChange={handleChange}
                    placeholder="Previous school name"
                  />
                </div>

              </div>

            </section>

            {/* Parent Information */}

            <section className="form-section">

              <h3>Parent / Guardian Information</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Father's Name *</label>

                  <input
                    type="text"
                    name="father_name"
                    value={form.father_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mother's Name *</label>

                  <input
                    type="text"
                    name="mother_name"
                    value={form.mother_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Parent Phone *</label>

                  <input
                    type="tel"
                    name="parent_phone"
                    value={form.parent_phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Parent Email *</label>

                  <input
                    type="email"
                    name="parent_email"
                    value={form.parent_email}
                    onChange={handleChange}
                    placeholder="parent@example.com"
                    required
                  />
                </div>

              </div>

            </section>

            {/* Address */}

            <section className="form-section">

              <h3>Address Information</h3>

              <div className="form-grid">

                <div className="form-group full-width">
                  <label>Address *</label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>

                  <input
                    type="text"
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

            </section>

            {/* Message */}

            <section className="form-section">

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

            </section>

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
                {loading
                  ? "Submitting..."
                  : "Submit Admission Application"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AdmissionForm;