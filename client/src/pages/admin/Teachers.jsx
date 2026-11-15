
// import { useEffect, useState } from "react";
// import { teacherService } from "../../services/teacherService";
// import "./Teacher.css";

// function Teacher() {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   const fetchTeachers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await teacherService.getTeachers();

//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.results)
//           ? data.results
//           : Array.isArray(data?.teachers)
//             ? data.teachers
//             : [];

//       setTeachers(list);
//     } catch (err) {
//       console.error("Teacher fetch error:", err);
//       setError(err.message || "Failed to load teachers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   const filteredTeachers = teachers.filter((teacher) => {
//     const searchText = search.toLowerCase();

//     return [
//       teacher.name,
//       teacher.employee_id,
//       teacher.email,
//       teacher.phone,
//       teacher.department,
//       teacher.primary_subject,
//       teacher.status,
//     ].some((value) =>
//       String(value || "").toLowerCase().includes(searchText)
//     );
//   });

//   return (
//     <div className="teacher-page">
//       <div className="teacher-page-header">
//         <div>
//           <h1>Teacher Management</h1>
//           <p>View and manage all school teachers.</p>
//         </div>

//         <button
//           type="button"
//           className="teacher-refresh-btn"
//           onClick={fetchTeachers}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "↻ Refresh"}
//         </button>
//       </div>

//       <div className="teacher-stats">
//         <div className="teacher-stat-card">
//           <span>Total Teachers</span>
//           <h2>{teachers.length}</h2>
//         </div>

//         <div className="teacher-stat-card">
//           <span>Approved</span>
//           <h2>
//             {
//               teachers.filter(
//                 (teacher) =>
//                   String(teacher.status || "").toLowerCase() ===
//                     "approved" ||
//                   teacher.is_active === true
//               ).length
//             }
//           </h2>
//         </div>

//         <div className="teacher-stat-card">
//           <span>Pending</span>
//           <h2>
//             {
//               teachers.filter(
//                 (teacher) =>
//                   String(teacher.status || "").toLowerCase() ===
//                   "pending"
//               ).length
//             }
//           </h2>
//         </div>
//       </div>

//       <div className="teacher-table-card">
//         <div className="teacher-table-toolbar">
//           <h2>All Teachers</h2>

//           <input
//             type="search"
//             placeholder="Search name, ID, email, subject..."
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//           />
//         </div>

//         {loading ? (
//           <p className="teacher-message">Loading teacher data...</p>
//         ) : error ? (
//           <div className="teacher-error">
//             <p>{error}</p>
//             <button type="button" onClick={fetchTeachers}>
//               Try Again
//             </button>
//           </div>
//         ) : filteredTeachers.length === 0 ? (
//           <p className="teacher-message">
//             {teachers.length === 0
//               ? "No teachers found."
//               : "No teachers match your search."}
//           </p>
//         ) : (
//           <div className="teacher-table-wrapper">
//             <table className="teacher-table">
//               <thead>
//                 <tr>
//                   <th>Employee ID</th>
//                   <th>Teacher Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Department</th>
//                   <th>Subject</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredTeachers.map((teacher, index) => (
//                   <tr
//                     key={
//                       teacher.id ||
//                       teacher.employee_id ||
//                       index
//                     }
//                   >
//                     <td>
//                       {teacher.employee_id || "—"}
//                     </td>
//                     <td>{teacher.name || "—"}</td>
//                     <td>{teacher.email || "—"}</td>
//                     <td>{teacher.phone || "—"}</td>
//                     <td>{teacher.department || "—"}</td>
//                     <td>{teacher.primary_subject || "—"}</td>
//                     <td>
//                       <span
//                         className={`teacher-status ${
//                           String(
//                             teacher.status ||
//                               (teacher.is_active
//                                 ? "Approved"
//                                 : "Unknown")
//                           ).toLowerCase()
//                         }`}
//                       >
//                         {teacher.status ||
//                           (teacher.is_active
//                             ? "Approved"
//                             : "Unknown")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Teacher;



import { useCallback, useEffect, useMemo, useState } from "react";
import { teacherService } from "../../services/teacherService";
import "./Teacher.css";

const EMPTY_TEACHER = {
  name: "",
  employee_id: "",
  email: "",
  phone: "",
  department: "",
  primary_subject: "",
  qualification: "",
  is_active: false,
  status: "Approved",
  profile_photo: null,
  documents: {
    resume: null,
    qualification_certificate: null,
    experience_certificate: null,
  },
  classes: [],
};

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function getTeacherList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.teachers)) return response.teachers;
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_TEACHER);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --------------------------------
  // FETCH ALL APPROVED TEACHERS
  // --------------------------------

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await teacherService.getTeachers();

      setTeachers(getTeacherList(response));
    } catch (err) {
      console.error("Teacher fetch error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // --------------------------------
  // SEARCH TEACHERS
  // --------------------------------

  const filteredTeachers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return teachers;

    return teachers.filter((teacher) => {
      const searchableValues = [
        teacher.name,
        teacher.employee_id,
        teacher.email,
        teacher.phone,
        teacher.department,
        teacher.primary_subject,
        teacher.qualification,
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );
    });
  }, [teachers, search]);

  const totalTeachers = teachers.length;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.is_active === true
  ).length;

  const inactiveTeachers = totalTeachers - activeTeachers;

  // --------------------------------
  // VIEW TEACHER DETAILS
  // --------------------------------

  const handleViewTeacher = async (employeeId) => {
    try {
      setDetailLoading(true);
      setDetailError("");
      setSelectedTeacher(null);
      setShowEditModal(false);

      const response =
        await teacherService.getAdminTeacherDetails(employeeId);

      if (response?.success === false) {
        throw new Error(response.error || "Unable to load teacher.");
      }

      const teacherData = response?.teacher || response?.data || response;

      setSelectedTeacher({
        ...EMPTY_TEACHER,
        ...teacherData,
        documents: {
          ...EMPTY_TEACHER.documents,
          ...(teacherData?.documents || {}),
        },
        classes: Array.isArray(teacherData?.classes)
          ? teacherData.classes
          : [],
      });
    } catch (err) {
      console.error("Teacher detail error:", err);
      setDetailError(getErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedTeacher(null);
    setDetailError("");
  };

  // --------------------------------
  // OPEN EDIT MODAL
  // --------------------------------

  const handleEditOpen = () => {
    if (!selectedTeacher) return;

    setEditForm({
      name: selectedTeacher.name || "",
      employee_id: selectedTeacher.employee_id || "",
      email: selectedTeacher.email || "",
      phone: selectedTeacher.phone || "",
      department: selectedTeacher.department || "",
      primary_subject: selectedTeacher.primary_subject || "",
      qualification: selectedTeacher.qualification || "",
    });

    setEditError("");
    setSuccessMessage("");
    setShowEditModal(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------
  // UPDATE TEACHER
  // --------------------------------

  const handleUpdateTeacher = async (event) => {
    event.preventDefault();

    if (!selectedTeacher?.employee_id) {
      setEditError("Employee ID not found.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        department: editForm.department.trim(),
        primary_subject: editForm.primary_subject.trim(),
        qualification: editForm.qualification.trim(),
      };

      const response = await teacherService.updateTeacher(
        selectedTeacher.employee_id,
        payload
      );

      if (response?.success === false) {
        throw new Error(response.error || "Teacher update failed.");
      }

      const updatedTeacher = response?.teacher || {
        ...selectedTeacher,
        ...payload,
      };

      setSelectedTeacher((previous) => ({
        ...previous,
        ...updatedTeacher,
      }));

      setTeachers((previous) =>
        previous.map((teacher) =>
          teacher.employee_id === selectedTeacher.employee_id
            ? { ...teacher, ...updatedTeacher }
            : teacher
        )
      );

      setShowEditModal(false);
      setSuccessMessage("Teacher updated successfully.");

    } catch (err) {
      console.error("Teacher update error:", err);
      setEditError(getErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  // --------------------------------
  // DOCUMENT COMPONENT
  // --------------------------------

  const DocumentItem = ({ title, url }) => {
    return (
      <div className="teacher-document-item">
        <div className="teacher-document-info">
          <span className="teacher-document-icon">📄</span>

          <div>
            <h4>{title}</h4>
            <p>{url ? "Document available" : "Document not uploaded"}</p>
          </div>
        </div>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="teacher-document-view"
          >
            View
          </a>
        ) : (
          <span className="teacher-document-missing">Unavailable</span>
        )}
      </div>
    );
  };

  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <div className="teacher-page">

      {/* PAGE HEADER */}

      <div className="teacher-page-header">
        <div>
          <h1>Teacher Management</h1>
          <p>Manage all approved teachers and their information.</p>
        </div>

        <button
          type="button"
          className="teacher-refresh-btn"
          onClick={fetchTeachers}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="teacher-success-message">
          {successMessage}
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="teacher-stats">

        <div className="teacher-stat-card">
          <span>Total Teachers</span>
          <h2>{totalTeachers}</h2>
        </div>

        <div className="teacher-stat-card">
          <span>Active Teachers</span>
          <h2>{activeTeachers}</h2>
        </div>

        <div className="teacher-stat-card">
          <span>Inactive Teachers</span>
          <h2>{inactiveTeachers}</h2>
        </div>

      </div>

      {/* TEACHER TABLE */}

      <div className="teacher-table-card">

        <div className="teacher-table-toolbar">
          <div>
            <h2>All Teachers</h2>
            <p>{filteredTeachers.length} teacher(s) found</p>
          </div>

          <input
            type="search"
            placeholder="Search name, ID, email, subject..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="teacher-loading">
            Loading teachers...
          </div>
        ) : error ? (
          <div className="teacher-error">
            <p>{error}</p>
            <button type="button" onClick={fetchTeachers}>
              Try Again
            </button>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="teacher-empty">
            {search
              ? "No teachers match your search."
              : "No approved teachers found."}
          </div>
        ) : (
          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Teacher Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id || teacher.employee_id}>
                    <td>
                      <strong>{teacher.employee_id || "—"}</strong>
                    </td>

                    <td>{teacher.name || "—"}</td>

                    <td>{teacher.email || "—"}</td>

                    <td>{teacher.phone || "—"}</td>

                    <td>{teacher.department || "—"}</td>

                    <td>{teacher.primary_subject || "—"}</td>

                    <td>
                      <span
                        className={
                          teacher.is_active
                            ? "teacher-status active"
                            : "teacher-status inactive"
                        }
                      >
                        {teacher.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="teacher-view-btn"
                        onClick={() =>
                          handleViewTeacher(teacher.employee_id)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* TEACHER DETAILS MODAL */}

      {(selectedTeacher || detailLoading || detailError) && (
        <div className="teacher-modal-overlay">
          <div className="teacher-details-modal">

            <div className="teacher-modal-header">
              <div>
                <h2>Teacher Details</h2>
                <p>Complete teacher profile and information</p>
              </div>

              <button
                type="button"
                className="teacher-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <div className="teacher-loading">
                Loading teacher details...
              </div>
            ) : detailError ? (
              <div className="teacher-error">
                {detailError}
              </div>
            ) : selectedTeacher && (
              <div className="teacher-details-body">

                {/* PROFILE */}

                <div className="teacher-profile-header">

                  <div className="teacher-profile-avatar">
                    {selectedTeacher.profile_photo ? (
                      <img
                        src={selectedTeacher.profile_photo}
                        alt={selectedTeacher.name}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>
                        {selectedTeacher.name?.charAt(0)?.toUpperCase() || "T"}
                      </span>
                    )}
                  </div>

                  <div className="teacher-profile-heading">
                    <h3>{selectedTeacher.name}</h3>
                    <p>{selectedTeacher.employee_id}</p>
                    <span
                      className={
                        selectedTeacher.is_active
                          ? "teacher-status active"
                          : "teacher-status inactive"
                      }
                    >
                      {selectedTeacher.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="teacher-edit-btn"
                    onClick={handleEditOpen}
                  >
                    ✎ Edit Teacher
                  </button>

                </div>

                {/* PERSONAL DETAILS */}

                <div className="teacher-detail-section">
                  <h3>Personal & Professional Information</h3>

                  <div className="teacher-info-grid">

                    <div>
                      <label>Full Name</label>
                      <p>{selectedTeacher.name || "—"}</p>
                    </div>

                    <div>
                      <label>Employee ID</label>
                      <p>{selectedTeacher.employee_id || "—"}</p>
                    </div>

                    <div>
                      <label>Email</label>
                      <p>{selectedTeacher.email || "—"}</p>
                    </div>

                    <div>
                      <label>Phone</label>
                      <p>{selectedTeacher.phone || "—"}</p>
                    </div>

                    <div>
                      <label>Department</label>
                      <p>{selectedTeacher.department || "—"}</p>
                    </div>

                    <div>
                      <label>Primary Subject</label>
                      <p>{selectedTeacher.primary_subject || "—"}</p>
                    </div>

                    <div>
                      <label>Qualification</label>
                      <p>{selectedTeacher.qualification || "—"}</p>
                    </div>

                    <div>
                      <label>Application Status</label>
                      <p>{selectedTeacher.status || "Approved"}</p>
                    </div>

                  </div>
                </div>

                {/* DOCUMENTS */}

                <div className="teacher-detail-section">
                  <h3>Teacher Documents</h3>

                  <div className="teacher-documents-list">

                    <DocumentItem
                      title="Resume / CV"
                      url={selectedTeacher.documents?.resume}
                    />

                    <DocumentItem
                      title="Qualification Certificate"
                      url={
                        selectedTeacher.documents?.qualification_certificate
                      }
                    />

                    <DocumentItem
                      title="Experience Certificate"
                      url={
                        selectedTeacher.documents?.experience_certificate
                      }
                    />

                  </div>
                </div>

                {/* ALLOCATED CLASSES */}

                <div className="teacher-detail-section">
                  <h3>Assigned Classes & Subjects</h3>

                  {selectedTeacher.classes?.length > 0 ? (
                    <div className="teacher-table-wrapper">
                      <table className="teacher-table">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Subject Code</th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedTeacher.classes.map((item) => (
                            <tr key={item.allocationId}>
                              <td>{item.className || "—"}</td>
                              <td>{item.section || "—"}</td>
                              <td>{item.subject || "—"}</td>
                              <td>{item.subjectCode || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="teacher-empty">
                      No classes or subjects assigned yet.
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}

      {showEditModal && (
        <div className="teacher-modal-overlay">
          <div className="teacher-edit-modal">

            <div className="teacher-modal-header">
              <div>
                <h2>Edit Teacher</h2>
                <p>Update teacher information</p>
              </div>

              <button
                type="button"
                className="teacher-modal-close"
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateTeacher}
              className="teacher-edit-form"
            >

              {editError && (
                <div className="teacher-error">
                  {editError}
                </div>
              )}

              <div className="teacher-form-grid">

                <div className="teacher-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="teacher-form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    value={editForm.employee_id}
                    disabled
                  />
                </div>

                <div className="teacher-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="teacher-form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="teacher-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={editForm.department}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="teacher-form-group">
                  <label>Primary Subject</label>
                  <input
                    type="text"
                    name="primary_subject"
                    value={editForm.primary_subject}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="teacher-form-group full-width">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={editForm.qualification}
                    onChange={handleEditChange}
                  />
                </div>

              </div>

              <div className="teacher-form-actions">
                <button
                  type="button"
                  className="teacher-cancel-btn"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-save-btn"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Teacher;

