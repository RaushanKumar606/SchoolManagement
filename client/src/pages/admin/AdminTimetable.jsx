


import { useCallback, useEffect, useMemo, useState } from "react";
import timetableService from "../../services/timetableService";
import { teacherService } from "../../services/teacherService";
import { academicAdminService } from "../../services/academicAdminService";
import "./AdminTimetable.css";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const emptyForm = {
  academic_year: "",
  school_class: "",
  section: "",
  subject: "",
  teacher: "",
  day: "MONDAY",
  start_time: "",
  end_time: "",
  room_number: "",
};

const getId = (item) =>
  item?.id ??
  item?.pk ??
  item?.value ??
  item?.teacher_id ??
  item?.subject_id ??
  item?.school_class_id ??
  item?.class_id ??
  item?.section_id ??
  "";

const getList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  return [];
};

const getRelationId = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key];

    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        const nestedId = value.id ?? value.pk ?? value.value;
        if (nestedId !== undefined && nestedId !== null) {
          return String(nestedId);
        }
      } else {
        return String(value);
      }
    }
  }

  return "";
};

const getTeacherName = (allocation) => {
  const teacher = allocation?.teacher_details ?? allocation?.teacher_data ??
    (typeof allocation?.teacher === "object" ? allocation.teacher : null);

  return (
    allocation?.teacher_name ||
    allocation?.name ||
    teacher?.name ||
    teacher?.full_name ||
    teacher?.username ||
    teacher?.user?.username ||
    (typeof allocation?.teacher === "string" ? allocation.teacher : "") ||
    ""
  );
};

const getTeacherId = (allocation) =>
  getRelationId(allocation, [
    "teacher_id",
    "teacher",
    "allocated_teacher_id",
  ]);

const getYearId = (allocation) =>
  getRelationId(allocation, [
    "academic_year_id",
    "academic_year",
    "year_id",
  ]);

const getClassId = (allocation) =>
  getRelationId(allocation, [
    "school_class_id",
    "school_class",
    "class_id",
    "class",
  ]);

const getSectionId = (allocation) =>
  getRelationId(allocation, ["section_id", "section"]);

const getSubjectId = (allocation) =>
  getRelationId(allocation, ["subject_id", "subject"]);

function AdminTimetable() {
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [yearResponse, subjectResponse, allocationResponse, timetableResponse] =
        await Promise.all([
          academicAdminService.getAcademicYears(),
          academicAdminService.getSubjects(),
          teacherService.getSubjectAllocations(),
          timetableService.getAdminTimetables(),
        ]);

      setYears(getList(yearResponse));
      setSubjects(getList(subjectResponse));
      setAllocations(getList(allocationResponse));
      setTimetables(getList(timetableResponse));
    } catch (err) {
      setError(
        err?.message ||
          "Timetable data load nahi hua. API endpoints aur login token check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    let cancelled = false;

    async function loadClasses() {
      setClasses([]);
      setSections([]);
      setForm((prev) => ({
        ...prev,
        school_class: "",
        section: "",
        subject: "",
        teacher: "",
      }));

      if (!form.academic_year) return;

      try {
        const response = await academicAdminService.getClasses(
          form.academic_year
        );

        if (!cancelled) setClasses(getList(response));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Classes load nahi hui.");
        }
      }
    }

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, [form.academic_year]);

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      setSections([]);
      setForm((prev) => ({
        ...prev,
        section: "",
        subject: "",
        teacher: "",
      }));

      if (!form.school_class) return;

      try {
        const response = await academicAdminService.getSections(
          form.school_class
        );

        if (!cancelled) setSections(getList(response));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Sections load nahi hui.");
        }
      }
    }

    loadSections();

    return () => {
      cancelled = true;
    };
  }, [form.school_class]);

  const selectedTeachers = useMemo(() => {
    if (
      !form.school_class ||
      !form.section ||
      !form.subject
    ) {
      return [];
    }

    const matching = allocations.filter((allocation) => {
      const classId = getClassId(allocation);
      const sectionId = getSectionId(allocation);
      const subjectId = getSubjectId(allocation);
      const yearId = getYearId(allocation);

      const classMatches = classId === String(form.school_class);
      const sectionMatches = sectionId === String(form.section);
      const subjectMatches = subjectId === String(form.subject);

      // Some allocation APIs don't include academic_year.
      const yearMatches =
        !yearId || yearId === String(form.academic_year);

      return (
        classMatches &&
        sectionMatches &&
        subjectMatches &&
        yearMatches
      );
    });

    const unique = new Map();

    matching.forEach((allocation) => {
      const id = getTeacherId(allocation);
      const name = getTeacherName(allocation);

      if (id && name && !unique.has(id)) {
        unique.set(id, { id, name });
      }
    });

    return Array.from(unique.values());
  }, [
    allocations,
    form.academic_year,
    form.school_class,
    form.section,
    form.subject,
  ]);

  useEffect(() => {
    if (
      form.teacher &&
      !selectedTeachers.some(
        (teacher) => teacher.id === String(form.teacher)
      )
    ) {
      setForm((prev) => ({ ...prev, teacher: "" }));
    }
  }, [selectedTeachers, form.teacher]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setError("");
    setSuccess("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "school_class"
        ? { section: "", subject: "", teacher: "" }
        : {}),
      ...(name === "section" ? { subject: "", teacher: "" } : {}),
      ...(name === "subject" ? { teacher: "" } : {}),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const refreshTimetables = async () => {
    const response = await timetableService.getAdminTimetables();
    setTimetables(getList(response));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.academic_year ||
      !form.school_class ||
      !form.section ||
      !form.subject ||
      !form.teacher ||
      !form.day ||
      !form.start_time ||
      !form.end_time
    ) {
      setError("Please sabhi required fields fill karein.");
      return;
    }

    if (form.start_time >= form.end_time) {
      setError("End time, start time ke baad hona chahiye.");
      return;
    }

    if (
      !selectedTeachers.some(
        (teacher) => teacher.id === String(form.teacher)
      )
    ) {
      setError(
        "Selected teacher is class, section aur subject ke liye allocated nahi hai."
      );
      return;
    }

    const payload = {
      academic_year: Number(form.academic_year),
      school_class: Number(form.school_class),
      section: Number(form.section),
      subject: Number(form.subject),
      teacher: Number(form.teacher),
      day: form.day,
      start_time: form.start_time,
      end_time: form.end_time,
      room_number: form.room_number.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await timetableService.updateTimetable(editingId, payload);
        setSuccess("Timetable successfully update ho gaya.");
      } else {
        await timetableService.createTimetable(payload);
        setSuccess("Timetable successfully create ho gaya.");
      }

      resetForm();
      await refreshTimetables();
    } catch (err) {
      setError(
        err?.message ||
          "Timetable save nahi hua. Duplicate time slot aur API validation check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (item) => {
    setError("");
    setSuccess("");

    const academicYearId = getRelationId(item, [
      "academic_year_id",
      "academic_year",
    ]);
    const classId = getRelationId(item, [
      "school_class_id",
      "school_class",
      "class_id",
    ]);
    const sectionId = getRelationId(item, ["section_id", "section"]);
    const subjectId = getRelationId(item, ["subject_id", "subject"]);
    const teacherId = getRelationId(item, ["teacher_id", "teacher"]);

    setEditingId(item.id ?? item.pk);
    setForm({
      academic_year: academicYearId,
      school_class: classId,
      section: sectionId,
      subject: subjectId,
      teacher: teacherId,
      day: item.day || "MONDAY",
      start_time: String(item.start_time || "").slice(0, 5),
      end_time: String(item.end_time || "").slice(0, 5),
      room_number: item.room_number || "",
    });

    try {
      const [classResponse, sectionResponse] = await Promise.all([
        academicAdminService.getClasses(academicYearId),
        academicAdminService.getSections(classId),
      ]);

      setClasses(getList(classResponse));
      setSections(getList(sectionResponse));
    } catch (err) {
      setError(
        err?.message ||
          "Edit ke liye class/section data load nahi hua."
      );
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    const id = item.id ?? item.pk;
    if (!id) return;

    const confirmed = window.confirm(
      "Kya aap ye timetable entry delete karna chahte hain?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await timetableService.deleteTimetable(id);
      setSuccess("Timetable entry delete ho gayi.");
      if (String(editingId) === String(id)) resetForm();
      await refreshTimetables();
    } catch (err) {
      setError(err?.message || "Timetable delete nahi hua.");
    }
  };

  const displayName = (item) =>
    item?.name ||
    item?.title ||
    item?.display_name ||
    item?.subject_name ||
    item?.class_name ||
    item?.section_name ||
    "";

  const relationName = (item, objectKey, nameKeys = []) => {
    const relation = item?.[objectKey];

    if (relation && typeof relation === "object") {
      return (
        relation.name ||
        relation.title ||
        relation.full_name ||
        relation.username ||
        ""
      );
    }

    for (const key of nameKeys) {
      if (item?.[key]) return item[key];
    }

    return "";
  };

  const getTimetableLabel = (item, key, nameKeys = []) =>
    relationName(item, key, nameKeys) ||
    (typeof item?.[key] === "string" ? item[key] : "") ||
    "";

  return (
    <div className="admin-timetable-page">
      <div className="admin-timetable-header">
        <div>
          <h1>Manage Timetable</h1>
          <p>
            Class, section, subject aur allocated teacher ke basis par
            timetable manage karein.
          </p>
        </div>

        <button
          type="button"
          className="at-btn at-btn-secondary"
          onClick={loadInitialData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="at-alert at-alert-error">{error}</div>}
      {success && (
        <div className="at-alert at-alert-success">{success}</div>
      )}

      <section className="at-card">
        <h2>{editingId ? "Edit Timetable" : "Create Timetable"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="at-form-grid">
            <label>
              Academic Year *
              <select
                name="academic_year"
                value={form.academic_year}
                onChange={updateField}
                required
              >
                <option value="">Select academic year</option>
                {years.map((year) => (
                  <option key={getId(year)} value={getId(year)}>
                    {displayName(year) || year.name || getId(year)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Class *
              <select
                name="school_class"
                value={form.school_class}
                onChange={updateField}
                required
                disabled={!form.academic_year}
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={getId(item)} value={getId(item)}>
                    {item.display_name ||
                      item.name ||
                      item.class_name ||
                      getId(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Section *
              <select
                name="section"
                value={form.section}
                onChange={updateField}
                required
                disabled={!form.school_class}
              >
                <option value="">Select section</option>
                {sections.map((item) => (
                  <option key={getId(item)} value={getId(item)}>
                    {item.name || item.section_name || getId(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject *
              <select
                name="subject"
                value={form.subject}
                onChange={updateField}
                required
                disabled={!form.section}
              >
                <option value="">Select subject</option>
                {subjects.map((item) => (
                  <option key={getId(item)} value={getId(item)}>
                    {displayName(item) || getId(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Allocated Teacher *
              <select
                name="teacher"
                value={form.teacher}
                onChange={updateField}
                required
                disabled={!form.subject}
              >
                <option value="">
                  {!form.subject
                    ? "Pehle subject select karein"
                    : selectedTeachers.length
                    ? "Select allocated teacher"
                    : "Is selection ke liye teacher allocation nahi mila"}
                </option>

                {selectedTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>

              {form.subject && (
                <small className="at-help-text">
                  {selectedTeachers.length} matching allocated teacher(s)
                </small>
              )}
            </label>

            <label>
              Day *
              <select
                name="day"
                value={form.day}
                onChange={updateField}
                required
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Start Time *
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={updateField}
                required
              />
            </label>

            <label>
              End Time *
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Room Number
              <input
                type="text"
                name="room_number"
                value={form.room_number}
                onChange={updateField}
                placeholder="e.g. Room 101"
              />
            </label>
          </div>

          <div className="at-form-actions">
            <button
              type="submit"
              className="at-btn at-btn-primary"
              disabled={saving || loading}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Timetable"
                : "Save Timetable"}
            </button>

            {editingId && (
              <button
                type="button"
                className="at-btn at-btn-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="at-card">
        <div className="at-table-header">
          <h2>Timetable Entries</h2>
          <span>{timetables.length} entries</span>
        </div>

        {loading ? (
          <p className="at-empty">Loading timetable...</p>
        ) : timetables.length === 0 ? (
          <p className="at-empty">Abhi koi timetable entry nahi hai.</p>
        ) : (
          <div className="at-table-wrapper">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {timetables.map((item) => (
                  <tr key={item.id ?? item.pk}>
                    <td>
                      {getTimetableLabel(item, "academic_year", [
                        "academic_year_name",
                      ]) || getRelationId(item, ["academic_year_id"])}
                    </td>
                    <td>
                      {getTimetableLabel(item, "school_class", [
                        "class_name",
                        "school_class_name",
                      ]) || getRelationId(item, ["school_class_id"])}
                    </td>
                    <td>
                      {getTimetableLabel(item, "section", [
                        "section_name",
                      ]) || getRelationId(item, ["section_id"])}
                    </td>
                    <td>
                      {getTimetableLabel(item, "subject", [
                        "subject_name",
                      ]) || getRelationId(item, ["subject_id"])}
                    </td>
                    <td>
                      {getTeacherName(item) ||
                        getTimetableLabel(item, "teacher", [
                          "teacher_name",
                        ]) ||
                        getRelationId(item, ["teacher_id"]) ||
                        "Not assigned"}
                    </td>
                    <td>{item.day || "-"}</td>
                    <td>
                      {(item.start_time || "").slice(0, 5)} -{" "}
                      {(item.end_time || "").slice(0, 5)}
                    </td>
                    <td>{item.room_number || "-"}</td>
                    <td>
                      <div className="at-row-actions">
                        <button
                          type="button"
                          className="at-btn at-btn-small at-btn-secondary"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="at-btn at-btn-small at-btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminTimetable;