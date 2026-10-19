
import { useEffect, useState } from "react";
import { academicAdminService } from "../../services/academicAdminService";
// import "./AcademicManagement.css";

const tabs = [
  "Academic Years",
  "Classes",
  "Sections",
  "Subjects",
  "Class Subjects",
];

export default function AcademicManagement() {
  const [activeTab, setActiveTab] = useState("Academic Years");
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
    display_order: 1,
    academic_year: "",
    school_class: "",
    capacity: 40,
    code: "",
    subject: "",
    is_optional: false,

  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        yearData,
        classData,
        sectionData,
        subjectData,
        classSubjectData,
      ] = await Promise.all([
        academicAdminService.getAcademicYears(),
        academicAdminService.getClasses(),
        academicAdminService.getSections(),
        academicAdminService.getSubjects(),
        academicAdminService.getClassSubjects(),
      ]);

      const normalize = (data) =>
        Array.isArray(data) ? data : data?.results || [];

      setYears(normalize(yearData));
      setClasses(normalize(classData));
      setSections(normalize(sectionData));
      setSubjects(normalize(subjectData));
      setClassSubjects(normalize(classSubjectData));

    } catch (err) {
      setError(err.message || "Failed to load academic data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (activeTab === "Academic Years") {
        await academicAdminService.createAcademicYear({
          name: form.name.trim(),
          start_date: form.start_date,
          end_date: form.end_date,
          is_active: form.is_active,
        });
      } else if (activeTab === "Classes") {

        const academicYearId = form.academic_year;

        if (!academicYearId) {
          setError("Please select an academic year.");
          return;
        }

        await academicAdminService.createClass({
          name: form.name.trim(),
          display_order: Number(form.display_order),
          academic_year_id: Number(academicYearId),
        });
      } else if (activeTab === "Sections") {
        await academicAdminService.createSection({
          name: form.name.trim(),
          capacity: Number(form.capacity),
          school_class_id: Number(form.school_class),
        });
      } else if (activeTab === "Subjects") {
        await academicAdminService.createSubject({
          name: form.name.trim(),
          code: form.code.trim(),
          is_active: true,
        });
      }
      else if (activeTab === "Class Subjects") {
        if (!form.school_class || !form.subject) {
          setError("Please select both class and subject.");
          return;
        }

        await academicAdminService.createClassSubject({
          school_class: Number(form.school_class),
          subject: Number(form.subject),
          is_optional: form.is_optional,
        });
      }

      setSuccess(`${activeTab.slice(0, -1)} saved successfully.`);

      setForm((previous) => ({
        ...previous,
        name: "",
        start_date: "",
        end_date: "",
        display_order: 1,
        academic_year: "",
        school_class: "",
        capacity: 40,
        code: "",
      }));

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save data.");
    }
  }

  async function handleDelete(type, id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      if (type === "year") {
        await academicAdminService.deleteAcademicYear(id);
      } else if (type === "class") {
        await academicAdminService.deleteClass(id);
      } else if (type === "section") {
        await academicAdminService.deleteSection(id);
      } else if (type === "subject") {
        await academicAdminService.deleteSubject(id);
      }
      else if (type === "classSubject") {
        await academicAdminService.deleteClassSubject(id);
      }

      setSuccess("Record deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete record.");
    }
  }

  const currentData = {
    "Academic Years": years,
    Classes: classes,
    Sections: sections,
    Subjects: subjects,
    "Class Subjects": classSubjects,
  }[activeTab] || [];

  return (
    <main className="academic-page">
      <header className="academic-header">
        <div>
          <span className="academic-eyebrow">SCHOOL ADMINISTRATION</span>
          <h1>Academic Management</h1>
          <p>Manage academic years, classes, sections and subjects.</p>
        </div>

        <button className="academic-refresh" onClick={loadData}>
          ↻ Refresh
        </button>
      </header>

      <nav className="academic-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              setError("");
              setSuccess("");
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {error && <div className="academic-alert error">{error}</div>}
      {success && <div className="academic-alert success">{success}</div>}

      <div className="academic-layout">
        <section className="academic-card">
          <h2>Add {activeTab.slice(0, -1)}</h2>

          <form onSubmit={handleSubmit} className="academic-form">
            {activeTab === "Academic Years" && (
              <>
                <label>
                  Academic year name
                  <input
                    name="name"
                    placeholder="2026-2027"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Start date
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  End date
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="academic-checkbox">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  Set as active academic year
                </label>
              </>
            )}

            {activeTab === "Classes" && (
              <>
                <label>
                  Class name
                  <input
                    name="name"
                    placeholder="Class 10"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Academic year
                  <select
                    name="academic_year"
                    value={form.academic_year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select academic year</option>
                    {years.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Display order
                  <input
                    type="number"
                    name="display_order"
                    min="1"
                    value={form.display_order}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}

            {activeTab === "Sections" && (
              <>
                <label>
                  Section name
                  <input
                    name="name"
                    placeholder="A"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Class
                  <select
                    name="school_class"
                    value={form.school_class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Student capacity
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}

            {activeTab === "Subjects" && (
              <>
                <label>
                  Subject name
                  <input
                    name="name"
                    placeholder="Mathematics"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Subject code
                  <input
                    name="code"
                    placeholder="MATH"
                    value={form.code}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}

            {activeTab === "Class Subjects" && (
              <>
                <label>
                  Select class
                  <select
                    name="school_class"
                    value={form.school_class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} —{" "}
                        {item.academic_year_name || item.academic_year?.name || ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Select subject
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.code})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="academic-checkbox">
                  <input
                    type="checkbox"
                    name="is_optional"
                    checked={form.is_optional}
                    onChange={handleChange}
                  />
                  Optional subject
                </label>
              </>
            )}

            <button className="academic-submit" type="submit" disabled={loading}>
              {loading ? "Please wait..." : `Save ${activeTab.slice(0, -1)}`}
            </button>
          </form>
        </section>

        <section className="academic-card academic-records">
          <div className="academic-records-heading">
            <h2>{activeTab}</h2>
            <span>{currentData.length} records</span>
          </div>

          {loading ? (
            <p className="academic-muted">Loading records...</p>
          ) : currentData.length === 0 ? (
            <p className="academic-muted">No records found. Add your first record.</p>
          ) : (
            <div className="academic-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        {activeTab === "Academic Years" && (
                          `${item.start_date || "—"} – ${item.end_date || "—"}`
                        )}

                        {activeTab === "Classes" && (
                          item.academic_year_name ||
                          item.academic_year?.name ||
                          `Academic Year ID: ${item.academic_year_id ?? item.academic_year ?? "—"}`
                        )}

                        {activeTab === "Sections" && (
                          item.school_class_name ||
                          item.school_class?.name ||
                          `Class ID: ${item.school_class_id ?? item.school_class ?? "—"}`
                        )}

                        {activeTab === "Subjects" && (
                          item.code || item.subject_code || "—"
                        )}

                        {activeTab === "Class Subjects" && (
                          `${item.class_name || "Class"} — ${item.subject_name || "Subject"
                          }${item.is_optional ? " (Optional)" : ""}`
                        )}
                      </td>
                      <td>
                        <button
                          className="academic-delete"
                          onClick={() =>
                            handleDelete(
                              {
                                "Academic Years": "year",
                                Classes: "class",
                                Sections: "section",
                                Subjects: "subject",
                                "Class Subjects": "classSubject",
                              }[activeTab],
                              item.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
