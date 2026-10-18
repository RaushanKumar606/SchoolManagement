import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountantService from "../../services/accountantService";
// import "./FeesStructure.css";

function FeesStructure() {
  const navigate = useNavigate();

  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    class_name: "",
    academic_year: "",
    admission_fee: "",
    tuition_fee: "",
    exam_fee: "",
    transport_fee: "",
    library_fee: "",
    other_fee: "",
  });

  // =====================================================
  // LOAD FEES STRUCTURES
  // API CALL ONLY WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await accountantService.getFeesStructures();

      if (response?.success) {
        setFeeStructures(response.data || []);
      } else {
        setError(
          response?.message ||
            "Unable to load fees structures."
        );
      }
    } catch (err) {
      console.error(
        "Fees Structure API Error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading fees structures."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = () => {
    setEditingId(null);

    setFormData({
      class_name: "",
      academic_year: "",
      admission_fee: "",
      tuition_fee: "",
      exam_fee: "",
      transport_fee: "",
      library_fee: "",
      other_fee: "",
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (fee) => {
    setEditingId(fee.id);

    setFormData({
      class_name: fee.class_name || "",
      academic_year: fee.academic_year || "",
      admission_fee: fee.admission_fee || "",
      tuition_fee: fee.tuition_fee || "",
      exam_fee: fee.exam_fee || "",
      transport_fee: fee.transport_fee || "",
      library_fee: fee.library_fee || "",
      other_fee: fee.other_fee || "",
    });

    setShowForm(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        class_name: formData.class_name,
        academic_year: formData.academic_year,

        admission_fee:
          Number(formData.admission_fee) || 0,

        tuition_fee:
          Number(formData.tuition_fee) || 0,

        exam_fee:
          Number(formData.exam_fee) || 0,

        transport_fee:
          Number(formData.transport_fee) || 0,

        library_fee:
          Number(formData.library_fee) || 0,

        other_fee:
          Number(formData.other_fee) || 0,
      };

      let response;

      if (editingId) {
        response =
          await accountantService.updateFeesStructure(
            editingId,
            payload
          );
      } else {
        response =
          await accountantService.createFeesStructure(
            payload
          );
      }

      if (response?.success) {
        setShowForm(false);
        setEditingId(null);

        await fetchFeeStructures();
      } else {
        setError(
          response?.message ||
            "Unable to save fees structure."
        );
      }
    } catch (err) {
      console.error(
        "Fees Structure Save Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save fees structure."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fees structure?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response =
        await accountantService.deleteFeesStructure(
          id
        );

      if (response?.success) {
        await fetchFeeStructures();
      } else {
        setError(
          response?.message ||
            "Unable to delete fees structure."
        );
      }
    } catch (err) {
      console.error(
        "Fees Structure Delete Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete fees structure."
      );
    }
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const getTotal = (fee) => {
    return (
      Number(fee.admission_fee) +
      Number(fee.tuition_fee) +
      Number(fee.exam_fee) +
      Number(fee.transport_fee) +
      Number(fee.library_fee) +
      Number(fee.other_fee)
    );
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/accountant/dashboard");
  };

  return (
    <div className="fees-structure-page">

      {/* HEADER */}

      <header className="fees-structure-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={handleBack}
          >
            ←
          </button>

          <div>
            <h1>
              Fees Structure
            </h1>

            <p>
              Manage student fee structures
            </p>
          </div>

        </div>

        <button
          className="create-button"
          onClick={handleCreate}
        >
          + Add Fees Structure
        </button>

      </header>

      {/* CONTENT */}

      <main className="fees-structure-content">

        {/* ERROR */}

        {error && (
          <div className="fees-error">

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

          <div className="fees-loading">

            <div className="loader-spinner"></div>

            <p>
              Loading fees structures...
            </p>

          </div>

        ) : (

          <section className="fees-table-card">

            <div className="table-header">

              <div>

                <h2>
                  Fee Structures
                </h2>

                <p>
                  {feeStructures.length} structure
                  {feeStructures.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Class</th>
                    <th>Academic Year</th>
                    <th>Admission</th>
                    <th>Tuition</th>
                    <th>Exam</th>
                    <th>Transport</th>
                    <th>Library</th>
                    <th>Other</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {feeStructures.length === 0 ? (

                    <tr>

                      <td
                        colSpan="11"
                        className="empty-row"
                      >
                        No fees structures found.
                      </td>

                    </tr>

                  ) : (

                    feeStructures.map(
                      (fee, index) => (

                        <tr
                          key={fee.id}
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <strong>
                              {fee.class_name ||
                                "N/A"}
                            </strong>
                          </td>

                          <td>
                            {fee.academic_year ||
                              "N/A"}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.admission_fee
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.tuition_fee
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.exam_fee
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.transport_fee
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.library_fee
                            )}
                          </td>

                          <td>
                            ₹{" "}
                            {formatMoney(
                              fee.other_fee
                            )}
                          </td>

                          <td>
                            <strong>
                              ₹{" "}
                              {formatMoney(
                                fee.total_fee ??
                                  getTotal(fee)
                              )}
                            </strong>
                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-button"
                                onClick={() =>
                                  handleEdit(
                                    fee
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDelete(
                                    fee.id
                                  )
                                }
                              >
                                Delete
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

          </section>

        )}

      </main>

      {/* CREATE / EDIT MODAL */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="fees-form-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Fees Structure"
                    : "Add Fees Structure"}
                </h2>

                <p>
                  Enter class-wise fee details
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
              className="fees-form"
            >

              <div className="form-grid">

                {/* CLASS */}

                <div className="form-group">

                  <label>
                    Class
                  </label>

                  <input
                    type="text"
                    name="class_name"
                    value={
                      formData.class_name
                    }
                    onChange={handleChange}
                    placeholder="e.g. Class 10"
                    required
                  />

                </div>

                {/* ACADEMIC YEAR */}

                <div className="form-group">

                  <label>
                    Academic Year
                  </label>

                  <input
                    type="text"
                    name="academic_year"
                    value={
                      formData.academic_year
                    }
                    onChange={handleChange}
                    placeholder="e.g. 2026-27"
                    required
                  />

                </div>

                {/* ADMISSION */}

                <div className="form-group">

                  <label>
                    Admission Fee
                  </label>

                  <input
                    type="number"
                    name="admission_fee"
                    value={
                      formData.admission_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

                {/* TUITION */}

                <div className="form-group">

                  <label>
                    Tuition Fee
                  </label>

                  <input
                    type="number"
                    name="tuition_fee"
                    value={
                      formData.tuition_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

                {/* EXAM */}

                <div className="form-group">

                  <label>
                    Exam Fee
                  </label>

                  <input
                    type="number"
                    name="exam_fee"
                    value={
                      formData.exam_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

                {/* TRANSPORT */}

                <div className="form-group">

                  <label>
                    Transport Fee
                  </label>

                  <input
                    type="number"
                    name="transport_fee"
                    value={
                      formData.transport_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

                {/* LIBRARY */}

                <div className="form-group">

                  <label>
                    Library Fee
                  </label>

                  <input
                    type="number"
                    name="library_fee"
                    value={
                      formData.library_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

                {/* OTHER */}

                <div className="form-group">

                  <label>
                    Other Fee
                  </label>

                  <input
                    type="number"
                    name="other_fee"
                    value={
                      formData.other_fee
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />

                </div>

              </div>

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
                >
                  {editingId
                    ? "Update Structure"
                    : "Create Structure"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default FeesStructure;