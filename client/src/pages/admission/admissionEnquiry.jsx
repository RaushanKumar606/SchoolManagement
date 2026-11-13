
import { useState } from "react";
import "./admissionEnquiry.css";

const initialForm = {
  student_name: "",
  date_of_birth: "",
  gender: "",
  applying_for_class: "",
  parent_name: "",
  relation: "",
  phone: "",
  alternate_phone: "",
  email: "",
  previous_school: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  message: "",
};

export default function AdmissionEnquiry() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Admission Enquiry:", form);

    // TODO: Connect Django admission enquiry API here.
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="public-admission-page">
      <div className="admission-banner">
        <h1>Admission Enquiry</h1>
        <p>Start your child's journey towards a bright future.</p>
      </div>

      <div className="admission-container">
        <div className="admission-intro">
          <h2>Enquiry Form</h2>
          <p>
            Please fill in the details below. Our admission team
            will contact you shortly.
          </p>
          <span>* Required fields</span>
        </div>

        {submitted && (
          <div className="admission-success">
            Your admission enquiry has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admission-section-heading">
            <span>01</span>
            <div>
              <h3>Student Information</h3>
              <p>Enter the student's basic details.</p>
            </div>
          </div>

          <div className="admission-grid">
            <div className="admission-field">
              <label>Student Full Name *</label>
              <input
                name="student_name"
                value={form.student_name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="admission-field">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admission-field">
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="admission-field">
              <label>Applying for Class *</label>
              <select
                name="applying_for_class"
                value={form.applying_for_class}
                onChange={handleChange}
                required
              >
                <option value="">Select class</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admission-section-heading">
            <span>02</span>
            <div>
              <h3>Parent / Guardian Information</h3>
              <p>Enter parent or guardian contact details.</p>
            </div>
          </div>

          <div className="admission-grid">
            <div className="admission-field">
              <label>Parent / Guardian Name *</label>
              <input
                name="parent_name"
                value={form.parent_name}
                onChange={handleChange}
                placeholder="Enter parent name"
                required
              />
            </div>

            <div className="admission-field">
              <label>Relationship *</label>
              <select
                name="relation"
                value={form.relation}
                onChange={handleChange}
                required
              >
                <option value="">Select relationship</option>
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="GUARDIAN">Guardian</option>
              </select>
            </div>

            <div className="admission-field">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="admission-field">
              <label>Alternate Mobile Number</label>
              <input
                type="tel"
                name="alternate_phone"
                value={form.alternate_phone}
                onChange={handleChange}
                placeholder="Alternate mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>

            <div className="admission-field full-width">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="admission-section-heading">
            <span>03</span>
            <div>
              <h3>Previous School Information</h3>
              <p>Provide previous education details, if applicable.</p>
            </div>
          </div>

          <div className="admission-grid">
            <div className="admission-field full-width">
              <label>Previous School Name</label>
              <input
                name="previous_school"
                value={form.previous_school}
                onChange={handleChange}
                placeholder="Enter previous school name"
              />
            </div>
          </div>

          <div className="admission-section-heading">
            <span>04</span>
            <div>
              <h3>Address Information</h3>
              <p>Enter your current residential address.</p>
            </div>
          </div>

          <div className="admission-grid">
            <div className="admission-field full-width">
              <label>Full Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House number, street, locality"
                required
              />
            </div>

            <div className="admission-field">
              <label>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="admission-field">
              <label>State *</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="admission-field">
              <label>PIN Code *</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="admission-field admission-message">
            <label>Additional Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Any questions or additional information..."
            />
          </div>

          <div className="admission-submit-area">
            <p>Our admission team will contact you after reviewing your enquiry.</p>
            <button type="submit">Submit Enquiry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
