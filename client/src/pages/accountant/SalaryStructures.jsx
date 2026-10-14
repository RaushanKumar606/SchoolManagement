import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
import "./SalaryStructure.css";

function SalaryStructure() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [structures, setStructures] = useState([]);
  const [filter, setFilter] = useState("TEACHER");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonType, setComingSoonType] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [processingId, setProcessingId] = useState(null);

  const [formData, setFormData] = useState({
    employee: "",
    employee_type: "TEACHER",
    basic_salary: "",
    house_rent_allowance: "",
    transport_allowance: "",
    other_allowance: "",
    other_deduction: "",
    effective_from: "",
    effective_to: "",
    is_active: true,
  });

  // =====================================================
  // LOAD SALARY STRUCTURES
  // API CALL ONLY WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchSalaryStructures();
  }, []);

  const fetchSalaryStructures = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await accountantService.getSalaryStructures();

      if (response?.success) {
        setStructures(response.data || []);
      } else {
        setError(
          response?.message ||
            "Unable to load salary structures."
        );
      }
    } catch (err) {
      console.error(
        "Salary Structure API Error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading salary structures."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const handleFilterChange = (value) => {
    if (
      value === "STAFF" ||
      value === "HR"
    ) {
      setComingSoonType(value);
      setShowComingSoon(true);
      return;
    }

    setFilter(value);
  };

  // =====================================================
  // GET EMPLOYEE ROLE / TYPE
  // =====================================================

  const getEmployeeType = (structure) => {
    return String(
      structure.employee_type ||
        structure.employee_role ||
        structure.employee?.role ||
        ""
    ).toUpperCase();
  };

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = (structure) => {
    return (
      structure.employee_name ||
      structure.employee_username ||
      structure.employee?.username ||
      "N/A"
    );
  };

  // =====================================================
  // FILTER STRUCTURES
  // =====================================================

  const filteredStructures =
    structures.filter((structure) => {
      return (
        getEmployeeType(structure) ===
        filter
      );
    });

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // OPEN CREATE FORM
  // =====================================================

  const handleCreate = () => {
    setEditingId(null);

    setFormData({
      employee: "",
      employee_type: "TEACHER",
      basic_salary: "",
      house_rent_allowance: "",
      transport_allowance: "",
      other_allowance: "",
      other_deduction: "",
      effective_from: "",
      effective_to: "",
      is_active: true,
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (structure) => {
    setEditingId(structure.id);

    setFormData({
      employee:
        structure.employee || "",

      employee_type:
        structure.employee_type ||
        "TEACHER",

      basic_salary:
        structure.basic_salary || "",

      house_rent_allowance:
        structure.house_rent_allowance ||
        "",

      transport_allowance:
        structure.transport_allowance ||
        "",

      other_allowance:
        structure.other_allowance ||
        "",

      other_deduction:
        structure.other_deduction ||
        "",

      effective_from:
        structure.effective_from || "",

      effective_to:
        structure.effective_to || "",

      is_active:
        structure.is_active !== false,
    });

    setShowForm(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setProcessingId(
        editingId || "create"
      );

      setError("");

      const payload = {
        employee: Number(
          formData.employee
        ),

        employee_type:
          "TEACHER",

        basic_salary:
          formData.basic_salary || 0,

        house_rent_allowance:
          formData.house_rent_allowance ||
          0,

        transport_allowance:
          formData.transport_allowance ||
          0,

        other_allowance:
          formData.other_allowance ||
          0,

        other_deduction:
          formData.other_deduction ||
          0,

        effective_from:
          formData.effective_from,

        effective_to:
          formData.effective_to ||
          null,

        is_active:
          formData.is_active,
      };

      let response;

      if (editingId) {
        response =
          await accountantService.updateSalaryStructure(
            editingId,
            payload
          );
      } else {
        response =
          await accountantService.createSalaryStructure(
            payload
          );
      }

      if (response?.success) {
        setShowForm(false);
        setEditingId(null);

        await fetchSalaryStructures();
      } else {
        setError(
          response?.message ||
            "Unable to save salary structure."
        );
      }
    } catch (err) {
      console.error(
        "Salary Structure Save Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save salary structure."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this salary structure?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      const response =
        await accountantService.deleteSalaryStructure(
          id
        );

      if (response?.success) {
        await fetchSalaryStructures();
      } else {
        setError(
          response?.message ||
            "Unable to delete salary structure."
        );
      }
    } catch (err) {
      console.error(
        "Salary Structure Delete Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete salary structure."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="salary-structure-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="salary-structure-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={handleBack}
          >
            ←
          </button>

          <div>
            <h1>
              Salary Structure
            </h1>

            <p>
              Manage Teacher salary structures
            </p>
          </div>

        </div>

        <div className="header-actions">

          <div className="salary-filter">

            <label>
              Employee Type
            </label>

            <select
              value={filter}
              onChange={(e) =>
                handleFilterChange(
                  e.target.value
                )
              }
            >
              <option value="TEACHER">
                Teacher
              </option>

              <option value="STAFF">
                Staff
              </option>

              <option value="HR">
                HR
              </option>
            </select>

          </div>

          {filter === "TEACHER" && (
            <button
              className="create-button"
              onClick={handleCreate}
            >
              + Add Salary Structure
            </button>
          )}

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="salary-structure-content">

        {/* ERROR */}

        {error && (

          <div className="salary-error">

            <span>
              {error}
            </span>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>

        )}

        {/* LOADING */}

        {loading ? (

          <div className="salary-loading">

            <div className="loader-spinner"></div>

            <p>
              Loading salary structures...
            </p>

          </div>

        ) : (

          <div className="salary-structure-card">

            <div className="table-header">

              <div>

                <h2>
                  Teacher Salary Structures
                </h2>

                <p>
                  {filteredStructures.length} structure
                  {filteredStructures.length !==
                  1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Employee
                    </th>

                    <th>
                      Basic Salary
                    </th>

                    <th>
                      HRA
                    </th>

                    <th>
                      Transport
                    </th>

                    <th>
                      Other Allowance
                    </th>

                    <th>
                      Deduction
                    </th>

                    <th>
                      Net Salary
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredStructures.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="10"
                        className="empty-row"
                      >
                        No teacher salary structures found.
                      </td>

                    </tr>

                  ) : (

                    filteredStructures.map(
                      (
                        structure,
                        index
                      ) => (

                        <tr
                          key={
                            structure.id
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>

                            <div className="employee-cell">

                              <div className="employee-avatar">

                                {getEmployeeName(
                                  structure
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {getEmployeeName(
                                    structure
                                  )}
                                </strong>

                                <small>
                                  {structure.employee_username ||
                                    ""}
                                </small>

                              </div>

                            </div>

                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              structure.basic_salary
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              structure.house_rent_allowance
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              structure.transport_allowance
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              structure.other_allowance
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              structure.other_deduction
                            )}
                          </td>

                          <td>

                            <strong>
                              ₹{" "}
                              {formatMoney(
                                structure.net_salary
                              )}
                            </strong>

                          </td>

                          <td>

                            {structure.is_active ? (

                              <span className="status-badge status-active">
                                Active
                              </span>

                            ) : (

                              <span className="status-badge status-inactive">
                                Inactive
                              </span>

                            )}

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    structure
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    structure.id
                                  )
                                }
                                disabled={
                                  processingId ===
                                  structure.id
                                }
                              >
                                {processingId ===
                                structure.id
                                  ? "..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="salary-form-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Salary Structure"
                    : "Add Salary Structure"}
                </h2>

                <p>
                  Teacher salary information
                </p>

              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="salary-form"
            >

              {/* EMPLOYEE */}

              <div className="form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="number"
                  name="employee"
                  value={
                    formData.employee
                  }
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  required
                  disabled={Boolean(
                    editingId
                  )}
                />

              </div>

              {/* TYPE */}

              <div className="form-group">

                <label>
                  Employee Type
                </label>

                <select
                  name="employee_type"
                  value="TEACHER"
                  disabled
                >
                  <option value="TEACHER">
                    Teacher
                  </option>
                </select>

              </div>

              <div className="form-grid">

                {/* BASIC */}

                <div className="form-group">

                  <label>
                    Basic Salary
                  </label>

                  <input
                    type="number"
                    name="basic_salary"
                    value={
                      formData.basic_salary
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

                {/* HRA */}

                <div className="form-group">

                  <label>
                    House Rent Allowance
                  </label>

                  <input
                    type="number"
                    name="house_rent_allowance"
                    value={
                      formData.house_rent_allowance
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />

                </div>

                {/* TRANSPORT */}

                <div className="form-group">

                  <label>
                    Transport Allowance
                  </label>

                  <input
                    type="number"
                    name="transport_allowance"
                    value={
                      formData.transport_allowance
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />

                </div>

                {/* OTHER ALLOWANCE */}

                <div className="form-group">

                  <label>
                    Other Allowance
                  </label>

                  <input
                    type="number"
                    name="other_allowance"
                    value={
                      formData.other_allowance
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />

                </div>

                {/* DEDUCTION */}

                <div className="form-group">

                  <label>
                    Other Deduction
                  </label>

                  <input
                    type="number"
                    name="other_deduction"
                    value={
                      formData.other_deduction
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />

                </div>

                {/* EFFECTIVE FROM */}

                <div className="form-group">

                  <label>
                    Effective From
                  </label>

                  <input
                    type="date"
                    name="effective_from"
                    value={
                      formData.effective_from
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* EFFECTIVE TO */}

                <div className="form-group">

                  <label>
                    Effective To
                  </label>

                  <input
                    type="date"
                    name="effective_to"
                    value={
                      formData.effective_to
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* ACTIVE */}

              <label className="checkbox-group">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    formData.is_active
                  }
                  onChange={handleChange}
                />

                <span>
                  Active Salary Structure
                </span>

              </label>

              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={
                    processingId ===
                    (editingId || "create")
                  }
                >
                  {processingId ===
                  (editingId || "create")
                    ? "Saving..."
                    : editingId
                    ? "Update Structure"
                    : "Create Structure"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          COMING SOON MODAL
      ================================================= */}

      {showComingSoon && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowComingSoon(false)
          }
        >

          <div
            className="coming-soon-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="coming-soon-icon">
              🚧
            </div>

            <h2>
              Coming Soon
            </h2>

            <p>
              {comingSoonType ===
              "STAFF"
                ? "Staff salary structure management is currently under development."
                : "HR salary structure management is currently under development."}
            </p>

            <button
              onClick={() =>
                setShowComingSoon(false)
              }
            >
              Okay
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default SalaryStructure;