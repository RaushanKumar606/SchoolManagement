import { useCallback, useEffect, useMemo, useState } from "react";
import { adminService } from "../../services/adminStudentService";
import "./Student.css";

function Student() {
  // =========================================================
  // STUDENT STATES
  // =========================================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // SEARCH / FILTER STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // =========================================================
  // PAGINATION STATES
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // =========================================================
  // CLASS / SECTION STATES
  // =========================================================

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicLoading, setAcademicLoading] = useState(false);

  // =========================================================
  // STUDENT DETAILS STATES
  // =========================================================

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // EDIT FORM
  // =========================================================

  const [editForm, setEditForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",

    father_name: "",
    mother_name: "",
    parent_phone: "",
    parent_email: "",

    address: "",
    city: "",
    state: "",
    postal_code: "",

    school_class: "",
    section: "",
    academic_year: "",

    is_active: true,
  });

  // =========================================================
  // FETCH CLASSES
  // =========================================================

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setAcademicLoading(true);
        setError("");

        const data = await adminService.getClasses();

        if (Array.isArray(data)) {
          setClasses(data);
        } else if (Array.isArray(data?.results)) {
          setClasses(data.results);
        } else {
          setClasses([]);
        }
      } catch (err) {
        console.error("Classes fetch error:", err);

        setError(
          err.message || "Failed to load classes"
        );
      } finally {
        setAcademicLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // =========================================================
  // FETCH SECTIONS WHEN CLASS CHANGES
  // =========================================================

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setError("");

        if (!selectedClass) {
          setSections([]);
          return;
        }

        const data = await adminService.getSections(
          selectedClass
        );

        if (Array.isArray(data)) {
          setSections(data);
        } else if (Array.isArray(data?.results)) {
          setSections(data.results);
        } else {
          setSections([]);
        }
      } catch (err) {
        console.error("Sections fetch error:", err);

        setError(
          err.message || "Failed to load sections"
        );
      }
    };

    fetchSections();
  }, [selectedClass]);

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);
        setError("");

        const data = await adminService.getStudents({
          school_class: selectedClass,
          section: selectedSection,
          search: search.trim(),
          page,
        });

        // ================================================
        // NON-PAGINATED RESPONSE
        // ================================================

        if (Array.isArray(data)) {
          setStudents(data);

          setTotalStudentsCount(data.length);

          setNextPage(null);
          setPreviousPage(null);

          return;
        }

        // ================================================
        // PAGINATED RESPONSE
        // ================================================

        setStudents(
          Array.isArray(data?.results)
            ? data.results
            : []
        );

        setTotalStudentsCount(
          data?.count || 0
        );

        setNextPage(
          data?.next || null
        );

        setPreviousPage(
          data?.previous || null
        );
      } catch (err) {
        console.error(
          "Student fetch error:",
          err
        );

        setError(
          err.message ||
            "Failed to load students"
        );

        setStudents([]);
        setTotalStudentsCount(0);
        setNextPage(null);
        setPreviousPage(null);
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      selectedClass,
      selectedSection,
      search,
    ]
  );

  // =========================================================
  // LOAD STUDENTS
  // =========================================================
  //
  // Search ke liye debounce.
  // Class / Section / Page change par bhi isi effect
  // se API call hogi.
  //
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(currentPage);
    }, 400);

    return () => clearTimeout(timer);
  }, [
    fetchStudents,
    currentPage,
    selectedClass,
    selectedSection,
    search,
  ]);

  // =========================================================
  // CLASS CHANGE
  // =========================================================

  const handleClassChange = (e) => {
    const classId = e.target.value;

    setSelectedClass(classId);

    // New class select hone par section reset
    setSelectedSection("");

    // First page par wapas
    setCurrentPage(1);
  };

  // =========================================================
  // SECTION CHANGE
  // =========================================================

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);

    // Filter change hone par first page
    setCurrentPage(1);
  };

  // =========================================================
  // SEARCH CHANGE
  // =========================================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    // New search par first page
    setCurrentPage(1);
  };

  // =========================================================
  // TOTAL STUDENTS
  // =========================================================
  //
  // Important:
  // Ye backend ka total count hai.
  // Agar 150 students hain aur page size 20 hai,
  // to yaha 150 dikhega.
  //
  // =========================================================

  const totalStudents = useMemo(() => {
    return totalStudentsCount;
  }, [totalStudentsCount]);

  // =========================================================
  // ACTIVE STUDENTS
  // =========================================================
  //
  // Current loaded page ke active students.
  // Complete database active count ke liye separate
  // aggregate API banana better hoga.
  //
  // =========================================================

  const activeStudents = useMemo(() => {
    return students.filter(
      (student) => student.is_active
    ).length;
  }, [students]);

  // =========================================================
  // INACTIVE STUDENTS
  // =========================================================

  const inactiveStudents = useMemo(() => {
    return students.filter(
      (student) => !student.is_active
    ).length;
  }, [students]);

  // =========================================================
  // VIEW STUDENT
  // =========================================================

  const handleView = async (student) => {
    try {
      setError("");

      const data =
        await adminService.getStudentById(
          student.id
        );

      setSelectedStudent(data);
      setShowDetails(true);
    } catch (err) {
      console.error(
        "Student details error:",
        err
      );

      setError(
        err.message ||
          "Failed to load student details"
      );
    }
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleEdit = (student) => {
    setSelectedStudent(student);

    setEditForm({
      first_name:
        student.first_name || "",

      middle_name:
        student.middle_name || "",

      last_name:
        student.last_name || "",

      date_of_birth:
        student.date_of_birth || "",

      gender:
        student.gender || "",

      father_name:
        student.father_name || "",

      mother_name:
        student.mother_name || "",

      parent_phone:
        student.parent_phone || "",

      parent_email:
        student.parent_email || "",

      address:
        student.address || "",

      city:
        student.city || "",

      state:
        student.state || "",

      postal_code:
        student.postal_code || "",

      school_class:
        student.school_class || "",

      section:
        student.section || "",

      academic_year:
        student.academic_year || "",

      is_active:
        student.is_active ?? true,
    });

    setShowDetails(false);
    setShowEdit(true);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // UPDATE STUDENT
  // =========================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedStudent =
        await adminService.updateStudent(
          selectedStudent.id,
          editForm
        );

      // ================================================
      // UPDATE CURRENT TABLE
      // ================================================

      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? updatedStudent
            : student
        )
      );

      // ================================================
      // UPDATE SELECTED STUDENT
      // ================================================

      setSelectedStudent(
        updatedStudent
      );

      setShowEdit(false);
      setShowDetails(true);
    } catch (err) {
      console.error(
        "Update student error:",
        err
      );

      setError(
        err.message ||
          "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDelete = async (student) => {
    const studentName =
      student.student_name ||
      `${student.first_name || ""} ${
        student.last_name || ""
      }`.trim();

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${studentName}?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await adminService.deleteStudent(
        student.id
      );

      // Remove from current table
      setStudents((prev) =>
        prev.filter(
          (item) =>
            item.id !== student.id
        )
      );

      // Update total count
      setTotalStudentsCount(
        (prev) =>
          Math.max(prev - 1, 0)
      );

      // Close modal if same student
      if (
        selectedStudent?.id ===
        student.id
      ) {
        setSelectedStudent(null);
        setShowDetails(false);
        setShowEdit(false);
      }
    } catch (err) {
      console.error(
        "Delete student error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete student"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const handlePrevious = () => {
    if (!previousPage || loading) {
      return;
    }

    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const handleNext = () => {
    if (!nextPage || loading) {
      return;
    }

    setCurrentPage((prev) =>
      prev + 1
    );
  };

  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedStudent(null);
  };

  // =========================================================
  // CLOSE EDIT
  // =========================================================

  const closeEdit = () => {
    setShowEdit(false);
    setSelectedStudent(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="accountant-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">
        <div>
          <h1>Student Management</h1>

          <p>
            Manage all students, search by student
            name or ID, view complete details,
            update records and manage student status.
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="student-error">
          {error}
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="student-stat-grid">

        {/* TOTAL */}

        <div className="student-stat-card">
          <span>Total Students</span>

          <strong>
            {totalStudents}
          </strong>
        </div>

        {/* ACTIVE */}

        <div className="student-stat-card">
          <span>
            Active Students
          </span>

          <strong>
            {activeStudents}
          </strong>
        </div>

        {/* INACTIVE */}

        <div className="student-stat-card">
          <span>
            Inactive Students
          </span>

          <strong>
            {inactiveStudents}
          </strong>
        </div>

      </div>

      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <div className="student-filter-section">

        {/* SEARCH */}

        <div className="student-search">
          <input
            type="text"
            placeholder="Search by name, Student ID or phone..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* CLASS */}

        <div>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            disabled={academicLoading}
          >
            <option value="">
              All Classes
            </option>

            {classes.map(
              (schoolClass) => (
                <option
                  key={schoolClass.id}
                  value={schoolClass.id}
                >
                  {schoolClass.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* SECTION */}

        <div>
          <select
            value={selectedSection}
            onChange={
              handleSectionChange
            }
            disabled={!selectedClass}
          >
            <option value="">
              {selectedClass
                ? "All Sections"
                : "Select Class First"}
            </option>

            {sections.map(
              (section) => (
                <option
                  key={section.id}
                  value={section.id}
                >
                  {section.name}
                </option>
              )
            )}
          </select>
        </div>

      </div>

      {/* =====================================================
          STUDENT TABLE
      ===================================================== */}

      <div className="student-table-container">

        {/* TABLE HEADER */}

        <div className="student-table-header">

          <h2>
            All Students
          </h2>

          <span>
            {totalStudents} Students
          </span>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="student-loading">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          /* EMPTY */
          <div className="student-empty">
            No students found.
          </div>
        ) : (
          /* TABLE */
          <div className="student-table-wrapper">

            <table className="student-table">

              <thead>
                <tr>
                  <th>
                    Student ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Class
                  </th>

                  <th>
                    Section
                  </th>

                  <th>
                    Parent Phone
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {students.map(
                  (student) => (
                    <tr
                      key={student.id}
                    >

                      {/* STUDENT ID */}

                      <td>
                        <strong>
                          {
                            student.student_id
                          }
                        </strong>
                      </td>

                      {/* NAME */}

                      <td>
                        {
                          student.student_name
                        }
                      </td>

                      {/* CLASS */}

                      <td>
                        {
                          student.class_name
                        }
                      </td>

                      {/* SECTION */}

                      <td>
                        {
                          student.section_name
                        }
                      </td>

                      {/* PHONE */}

                      <td>
                        {
                          student.parent_phone
                        }
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            student.is_active
                              ? "student-status active"
                              : "student-status inactive"
                          }
                        >
                          {student.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="student-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                student
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deleting}
                            onClick={() =>
                              handleDelete(
                                student
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="student-pagination">

          <button
            type="button"
            disabled={
              !previousPage ||
              loading
            }
            onClick={
              handlePrevious
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage}
          </span>

          <button
            type="button"
            disabled={
              !nextPage ||
              loading
            }
            onClick={handleNext}
          >
            Next
          </button>

        </div>

      </div>

      {/* =====================================================
          STUDENT DETAILS MODAL
      ===================================================== */}

      {showDetails &&
        selectedStudent && (
          <div className="student-modal-overlay">

            <div className="student-modal">

              {/* HEADER */}

              <div className="student-modal-header">

                <h2>
                  Student Details
                </h2>

                <button
                  type="button"
                  onClick={
                    closeDetails
                  }
                >
                  ×
                </button>

              </div>

              {/* DETAILS */}

              <div className="student-details-grid">

                <div>
                  <label>
                    Student ID
                  </label>

                  <p>
                    {
                      selectedStudent.student_id
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Name
                  </label>

                  <p>
                    {
                      selectedStudent.student_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Class
                  </label>

                  <p>
                    {
                      selectedStudent.class_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Section
                  </label>

                  <p>
                    {
                      selectedStudent.section_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Academic Year
                  </label>

                  <p>
                    {
                      selectedStudent.academic_year_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Date of Birth
                  </label>

                  <p>
                    {
                      selectedStudent.date_of_birth
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Gender
                  </label>

                  <p>
                    {
                      selectedStudent.gender
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Father Name
                  </label>

                  <p>
                    {
                      selectedStudent.father_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Mother Name
                  </label>

                  <p>
                    {
                      selectedStudent.mother_name
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Parent Phone
                  </label>

                  <p>
                    {
                      selectedStudent.parent_phone
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Parent Email
                  </label>

                  <p>
                    {
                      selectedStudent.parent_email
                    }
                  </p>
                </div>

                <div>
                  <label>
                    City
                  </label>

                  <p>
                    {selectedStudent.city}
                  </p>
                </div>

                <div>
                  <label>
                    State
                  </label>

                  <p>
                    {selectedStudent.state}
                  </p>
                </div>

                <div>
                  <label>
                    Postal Code
                  </label>

                  <p>
                    {
                      selectedStudent.postal_code
                    }
                  </p>
                </div>

                <div>
                  <label>
                    Status
                  </label>

                  <p>
                    {selectedStudent.is_active
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>

                <div className="student-address">
                  <label>
                    Address
                  </label>

                  <p>
                    {
                      selectedStudent.address
                    }
                  </p>
                </div>

              </div>

              {/* FOOTER */}

              <div className="student-modal-footer">

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(
                      selectedStudent
                    )
                  }
                >
                  Edit Student
                </button>

                <button
                  type="button"
                  onClick={
                    closeDetails
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          EDIT STUDENT MODAL
      ===================================================== */}

      {showEdit &&
        selectedStudent && (
          <div className="student-modal-overlay">

            <div className="student-modal large">

              {/* HEADER */}

              <div className="student-modal-header">

                <h2>
                  Edit Student
                </h2>

                <button
                  type="button"
                  onClick={
                    closeEdit
                  }
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleUpdate
                }
              >

                <div className="student-edit-grid">

                  {/* FIRST NAME */}

                  <div>
                    <label>
                      First Name
                    </label>

                    <input
                      name="first_name"
                      value={
                        editForm.first_name
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  {/* MIDDLE NAME */}

                  <div>
                    <label>
                      Middle Name
                    </label>

                    <input
                      name="middle_name"
                      value={
                        editForm.middle_name
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* LAST NAME */}

                  <div>
                    <label>
                      Last Name
                    </label>

                    <input
                      name="last_name"
                      value={
                        editForm.last_name
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  {/* DOB */}

                  <div>
                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="date_of_birth"
                      value={
                        editForm.date_of_birth
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  {/* GENDER */}

                  <div>
                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={
                        editForm.gender
                      }
                      onChange={
                        handleChange
                      }
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

                  {/* FATHER */}

                  <div>
                    <label>
                      Father Name
                    </label>

                    <input
                      name="father_name"
                      value={
                        editForm.father_name
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* MOTHER */}

                  <div>
                    <label>
                      Mother Name
                    </label>

                    <input
                      name="mother_name"
                      value={
                        editForm.mother_name
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label>
                      Parent Phone
                    </label>

                    <input
                      name="parent_phone"
                      value={
                        editForm.parent_phone
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label>
                      Parent Email
                    </label>

                    <input
                      type="email"
                      name="parent_email"
                      value={
                        editForm.parent_email
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* CLASS */}

                  <div>
                    <label>
                      Class ID
                    </label>

                    <input
                      type="number"
                      name="school_class"
                      value={
                        editForm.school_class
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* SECTION */}

                  <div>
                    <label>
                      Section ID
                    </label>

                    <input
                      type="number"
                      name="section"
                      value={
                        editForm.section
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* ACADEMIC YEAR */}

                  <div>
                    <label>
                      Academic Year ID
                    </label>

                    <input
                      type="number"
                      name="academic_year"
                      value={
                        editForm.academic_year
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* CITY */}

                  <div>
                    <label>
                      City
                    </label>

                    <input
                      name="city"
                      value={
                        editForm.city
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* STATE */}

                  <div>
                    <label>
                      State
                    </label>

                    <input
                      name="state"
                      value={
                        editForm.state
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* POSTAL CODE */}

                  <div>
                    <label>
                      Postal Code
                    </label>

                    <input
                      name="postal_code"
                      value={
                        editForm.postal_code
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="student-edit-full">
                    <label>
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={
                        editForm.address
                      }
                      onChange={
                        handleChange
                      }
                      rows="3"
                    />
                  </div>

                  {/* ACTIVE */}

                  <div className="student-active-checkbox">

                    <label>
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={
                          editForm.is_active
                        }
                        onChange={
                          handleChange
                        }
                      />

                      Active Student
                    </label>

                  </div>

                </div>

                {/* FORM FOOTER */}

                <div className="student-modal-footer">

                  <button
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Updating..."
                      : "Update Student"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      closeEdit
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

    </div>
  );
}

export default Student;