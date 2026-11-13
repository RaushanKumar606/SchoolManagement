
import { useEffect, useState } from "react";
import "./AdmissionEnquiry.css";

const initialForm = {
  student_name: "",
  parent_name: "",
  phone: "",
  email: "",
  date_of_birth: "",
  applying_for_class: "",
  previous_school: "",
  enquiry_date: new Date().toISOString().slice(0, 10),
  address: "",
  message: "",
  status: "NEW",
};

const demoEnquiries = [
  {
    id: 1,
    student_name: "Rahul Kumar",
    parent_name: "Rajesh Kumar",
    phone: "9876543210",
    applying_for_class: "10",
    enquiry_date: "2026-11-10",
    status: "NEW",
  },
  {
    id: 2,
    student_name: "Priya Kumari",
    parent_name: "Amit Kumar",
    phone: "9876543211",
    applying_for_class: "5",
    enquiry_date: "2026-11-09",
    status: "FOLLOW_UP",
  },
];

export default function AdmissionEnquiry() {
  const [form, setForm] = useState(initialForm);
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Replace demo data with backend GET API.
  useEffect(() => {
    setEnquiries(demoEnquiries);
  }, []);

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
    setLoading(true);

    try {
      // TODO: Connect your admission enquiry create API here.
      const newEnquiry = {
        ...form,
        id: Date.now(),
      };

      setEnquiries((previous) => [newEnquiry, ...previous]);
      setForm({
        ...initialForm,
        enquiry_date: new Date().toISOString().slice(0, 10),
      });

      setShowForm(false);
      setSuccess("Admission enquiry added successfully.");
    } catch (err) {
      setError(err.message || "Unable to save enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, status) => {
    setEnquiries((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      `${item.student_name} ${item.parent_name} ${item.phone}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const total = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "NEW").length;
  const followUps = enquiries.filter(
    (e) => e.status === "FOLLOW_UP"
  ).length;
  const confirmed = enquiries.filter(
    (e) => e.status === "ADMITTED"
  ).length;

  return (
    <main className="enquiry-page">
      <header className="enquiry-header">
        <div>
          <span className="enquiry-eyebrow">
            ADMISSION MANAGEMENT
          </span>
          <h1>Admission Enquiries</h1>
          <p>Manage student enquiries and admission follow-ups.</p>
        </div>

        <button
          className="enquiry-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + New Enquiry
        </button>
      </header>

      {error && <div className="enquiry-alert error">{error}</div>}
      {success && <div className="enquiry-alert success">{success}</div>}

      <section className="enquiry-stats">
        <div className="enquiry-stat-card">
          <span>Total Enquiries</span>
          <strong>{total}</strong>
        </div>
        <div className="enquiry-stat-card">
          <span>New Enquiries</span>
          <strong>{newCount}</strong>
        </div>
        <div className="enquiry-stat-card">
          <span>Follow Ups</span>
          <strong>{followUps}</strong>
        </div>
        <div className="enquiry-stat-card">
          <span>Admissions Confirmed</span>
          <strong>{confirmed}</strong>
        </div>
      </section>

      {showForm && (
        <section className="enquiry-panel">
          <div className="enquiry-panel-heading">
            <div>
              <h2>New Admission Enquiry</h2>
              <p>Enter prospective student details.</p>
            </div>
            <button
              className="enquiry-close-btn"
              type="button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="enquiry-form-grid">
              <label>
                Student Name *
                <input
                  name="student_name"
                  value={form.student_name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </label>

              <label>
                Parent Name *
                <input
                  name="parent_name"
                  value={form.parent_name}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  required
                />
              </label>

              <label>
                Mobile Number *
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </label>

              <label>
                Date of Birth
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                />
              </label>

              <label>
                Applying for Class *
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
              </label>

              <label>
                Previous School
                <input
                  name="previous_school"
                  value={form.previous_school}
                  onChange={handleChange}
                  placeholder="Previous school name"
                />
              </label>

              <label>
                Enquiry Date *
                <input
                  type="date"
                  name="enquiry_date"
                  value={form.enquiry_date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="enquiry-full">
                Address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter residential address"
                  rows="3"
                />
              </label>

              <label className="enquiry-full">
                Enquiry Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter enquiry details..."
                  rows="3"
                />
              </label>
            </div>

            <div className="enquiry-form-actions">
              <button
                type="button"
                className="enquiry-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="enquiry-primary-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit Enquiry"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="enquiry-panel">
        <div className="enquiry-panel-heading">
          <div>
            <h2>Recent Enquiries</h2>
            <p>View and manage all admission enquiries.</p>
          </div>
          <span className="enquiry-count">
            {filteredEnquiries.length} records
          </span>
        </div>

        <div className="enquiry-filters">
          <input
            type="search"
            placeholder="Search student, parent or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="ADMITTED">Admitted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="enquiry-empty">
            No admission enquiries found.
          </div>
        ) : (
          <div className="enquiry-table-wrap">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Parent</th>
                  <th>Mobile</th>
                  <th>Class</th>
                  <th>Enquiry Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredEnquiries.map((item) => (
                  <tr key={item.id}>
                    <td className="enquiry-student-name">
                      {item.student_name}
                    </td>
                    <td>{item.parent_name}</td>
                    <td>{item.phone}</td>
                    <td>Class {item.applying_for_class}</td>
                    <td>{item.enquiry_date}</td>
                    <td>
                      <span
                        className={`enquiry-status status-${item.status.toLowerCase()}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item.id, e.target.value)
                        }
                      >
                        <option value="NEW">New</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="ADMITTED">Admitted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
