
import { useCallback, useEffect, useState } from "react";

import { academicAdminService } from "../../services/academicAdminService";

import {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} from "../../services/feeService";



const emptyForm = {
  academic_year: "",
  school_class: "",
  monthly_fee: "0",
  admission_fee: "0",
  exam_fee: "0",
  transport_fee: "0",
  other_fee: "0",
  is_active: true,
};

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

function getErrorMessage(error) {
  if (typeof error === "string") return error;

  if (error?.message) return error.message;

  if (error && typeof error === "object") {
    return Object.entries(error)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);

        return `${key}: ${message}`;
      })
      .join(" | ");
  }

  return "Request failed. Please try again.";
}

function getYearId(fee) {
  return typeof fee.academic_year === "object"
    ? fee.academic_year?.id
    : fee.academic_year;
}

function getClassId(fee) {
  return typeof fee.school_class === "object"
    ? fee.school_class?.id
    : fee.school_class;
}

function AdminFeesStructure() {
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);

  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const monthlyFee = Number(form.monthly_fee) || 0;
  const yearlyFee = monthlyFee * 12;

  const totalAnnualFee =
    yearlyFee +
    (Number(form.admission_fee) || 0) +
    (Number(form.exam_fee) || 0) +
    (Number(form.transport_fee) || 0) +
    (Number(form.other_fee) || 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  // =========================================
  // LOAD ACADEMIC YEARS AND CLASSES
  // =========================================
  const loadAcademicData = useCallback(async () => {
    const [yearResponse, classResponse] = await Promise.all([
      academicAdminService.getAcademicYears(),
      academicAdminService.getClasses(),
    ]);

    setYears(getList(yearResponse));
    setClasses(getList(classResponse));
  }, []);

  // =========================================
  // LOAD FEE STRUCTURES
  // =========================================
  const loadFees = useCallback(async () => {
    const response = await getFeeStructures();
    setFees(getList(response));
  }, []);

  // =========================================
  // LOAD ALL PAGE DATA
  // =========================================
  const loadPage = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([loadAcademicData(), loadFees()]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loadAcademicData, loadFees]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  // =========================================
  // GENERAL FORM CHANGE
  // =========================================
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================
  // FILTER CLASSES BY ACADEMIC YEAR
  // =========================================
  const handleAcademicYearChange = async (event) => {
    const academicYearId = event.target.value;

    setForm((previous) => ({
      ...previous,
      academic_year: academicYearId,
      school_class: "",
    }));

    setError("");
    setSuccess("");

    if (!academicYearId) {
      setClasses([]);
      return;
    }

    setLoadingClasses(true);

    try {
      const response = await academicAdminService.getClasses(
        academicYearId
      );

      setClasses(getList(response));
    } catch (err) {
      setError(getErrorMessage(err));
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  // =========================================
  // RESET FORM
  // =========================================
  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // =========================================
  // CREATE OR UPDATE FEE STRUCTURE
  // =========================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.academic_year || !form.school_class) {
      setError("Please select both Academic Year and Class.");
      return;
    }

    const numericFields = [
      "monthly_fee",
      "admission_fee",
      "exam_fee",
      "transport_fee",
      "other_fee",
    ];

    for (const field of numericFields) {
      const value = Number(form[field]);

      if (
        form[field] === "" ||
        !Number.isFinite(value) ||
        value < 0
      ) {
        setError(`${field.replaceAll("_", " ")} must be a valid non-negative amount.`);
        return;
      }
    }

    const payload = {
      academic_year: Number(form.academic_year),
      school_class: Number(form.school_class),
      monthly_fee: Number(form.monthly_fee),
      yearly_fee: yearlyFee,
      admission_fee: Number(form.admission_fee),
      exam_fee: Number(form.exam_fee),
      transport_fee: Number(form.transport_fee),
      other_fee: Number(form.other_fee),
      is_active: form.is_active,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await updateFeeStructure(editingId, payload);
        setSuccess("Fee structure updated successfully.");
      } else {
        await createFeeStructure(payload);
        setSuccess("Fee structure created successfully.");
      }

      setForm({ ...emptyForm });
      setEditingId(null);

      await Promise.all([loadFees(), loadAcademicData()]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // EDIT FEE STRUCTURE
  // =========================================
  const handleEdit = async (fee) => {
    setError("");
    setSuccess("");

    const yearId = getYearId(fee);
    const classId = getClassId(fee);

    setEditingId(fee.id);

    setForm({
      academic_year: String(yearId ?? ""),
      school_class: String(classId ?? ""),
      monthly_fee: String(fee.monthly_fee ?? "0"),
      admission_fee: String(fee.admission_fee ?? "0"),
      exam_fee: String(fee.exam_fee ?? "0"),
      transport_fee: String(fee.transport_fee ?? "0"),
      other_fee: String(fee.other_fee ?? "0"),
      is_active: fee.is_active ?? true,
    });

    if (yearId) {
      setLoadingClasses(true);

      try {
        const response = await academicAdminService.getClasses(yearId);
        setClasses(getList(response));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingClasses(false);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================================
  // DELETE FEE STRUCTURE
  // =========================================
  const handleDelete = async (fee) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee structure?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteFeeStructure(fee.id);

      setSuccess("Fee structure deleted successfully.");

      if (editingId === fee.id) {
        setForm({ ...emptyForm });
        setEditingId(null);
      }

      await loadFees();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // =========================================
  // DISPLAY ACADEMIC YEAR NAME
  // =========================================
  const getYearName = (fee) => {
    if (
      fee.academic_year &&
      typeof fee.academic_year === "object"
    ) {
      return (
        fee.academic_year.name ??
        fee.academic_year.academic_year ??
        `Year ${fee.academic_year.id ?? ""}`
      );
    }

    const year = years.find(
      (item) => String(item.id) === String(fee.academic_year)
    );

    return (
      year?.name ??
      year?.academic_year ??
      `Year ${fee.academic_year ?? ""}`
    );
  };

  // =========================================
  // DISPLAY CLASS NAME
  // =========================================
  const getClassName = (fee) => {
    if (
      fee.school_class &&
      typeof fee.school_class === "object"
    ) {
      return (
        fee.school_class.name ??
        fee.school_class.display_name ??
        `Class ${fee.school_class.id ?? ""}`
      );
    }

    const schoolClass = classes.find(
      (item) => String(item.id) === String(fee.school_class)
    );

    return (
      schoolClass?.name ??
      schoolClass?.display_name ??
      `Class ${fee.school_class ?? ""}`
    );
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="admin-fees-page">
      <div className="admin-fees-header">
        <div>
          <span className="admin-fees-eyebrow">
            FINANCE MANAGEMENT
          </span>

          <h1>Class-wise Fee Structure</h1>

          <p>
            Create and manage fees for each academic year and class.
          </p>
        </div>

        <button
          type="button"
          className="afs-refresh-btn"
          onClick={loadPage}
          disabled={loading || saving}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="afs-alert afs-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="afs-alert afs-alert-success" role="status">
          {success}
        </div>
      )}

      {/* SUMMARY */}
      <div className="afs-summary-grid">
        <div className="afs-summary-card">
          <span>Total Fee Structures</span>
          <strong>{fees.length}</strong>
        </div>

        <div className="afs-summary-card">
          <span>Active Structures</span>
          <strong>
            {fees.filter((fee) => fee.is_active).length}
          </strong>
        </div>

        <div className="afs-summary-card">
          <span>Academic Years</span>
          <strong>{years.length}</strong>
        </div>

        <div className="afs-summary-card">
          <span>Classes</span>
          <strong>{classes.length}</strong>
        </div>
      </div>

      {/* FEE FORM */}
      <section className="afs-panel">
        <div className="afs-panel-heading">
          <div>
            <h2>
              {editingId !== null
                ? "Edit Fee Structure"
                : "Create Fee Structure"}
            </h2>

            <p>
              Enter fee details for a particular academic year and class.
            </p>
          </div>

          {editingId !== null && (
            <button
              type="button"
              className="afs-cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="afs-form-grid">
            <div className="afs-field">
              <label htmlFor="academic_year">
                Academic Year *
              </label>

              <select
                id="academic_year"
                name="academic_year"
                value={form.academic_year}
                onChange={handleAcademicYearChange}
                required
              >
                <option value="">Select academic year</option>

                {years.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name ??
                      year.academic_year ??
                      year.title ??
                      `Year ${year.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="afs-field">
              <label htmlFor="school_class">Class *</label>

              <select
                id="school_class"
                name="school_class"
                value={form.school_class}
                onChange={handleChange}
                disabled={!form.academic_year || loadingClasses}
                required
              >
                <option value="">
                  {loadingClasses
                    ? "Loading classes..."
                    : !form.academic_year
                      ? "Select academic year first"
                      : "Select class"}
                </option>

                {classes.map((schoolClass) => (
                  <option
                    key={schoolClass.id}
                    value={schoolClass.id}
                  >
                    {schoolClass.name ??
                      schoolClass.display_name ??
                      `Class ${schoolClass.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="afs-field">
              <label htmlFor="monthly_fee">Monthly Fee (₹) *</label>

              <input
                id="monthly_fee"
                name="monthly_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.monthly_fee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="afs-field">
              <label htmlFor="yearly_fee">
                Yearly Tuition Fee (₹)
              </label>

              <input
                id="yearly_fee"
                type="text"
                value={formatMoney(yearlyFee)}
                readOnly
              />

              <small>
                Automatically calculated: monthly fee × 12
              </small>
            </div>

            <div className="afs-field">
              <label htmlFor="admission_fee">
                Admission Fee (₹)
              </label>

              <input
                id="admission_fee"
                name="admission_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.admission_fee}
                onChange={handleChange}
              />
            </div>

            <div className="afs-field">
              <label htmlFor="exam_fee">Exam Fee (₹)</label>

              <input
                id="exam_fee"
                name="exam_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.exam_fee}
                onChange={handleChange}
              />
            </div>

            <div className="afs-field">
              <label htmlFor="transport_fee">
                Transport Fee (₹)
              </label>

              <input
                id="transport_fee"
                name="transport_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.transport_fee}
                onChange={handleChange}
              />
            </div>

            <div className="afs-field">
              <label htmlFor="other_fee">Other Fee (₹)</label>

              <input
                id="other_fee"
                name="other_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.other_fee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* TOTAL */}
          <div className="afs-total-box">
            <div>
              <span>Total Annual Fee</span>
              <strong>{formatMoney(totalAnnualFee)}</strong>
            </div>

            <label className="afs-active-toggle">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="afs-form-actions">
            <button
              type="button"
              className="afs-cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="afs-primary-btn"
              disabled={saving || loading || loadingClasses}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Fee Structure"
                  : "Create Fee Structure"}
            </button>
          </div>
        </form>
      </section>

      {/* FEE STRUCTURE TABLE */}
      <section className="afs-panel">
        <div className="afs-panel-heading">
          <div>
            <h2>Fee Structures</h2>
            <p>All configured class-wise fees.</p>
          </div>

          <span className="afs-count">
            {fees.length} records
          </span>
        </div>

        {loading ? (
          <div className="afs-empty">
            Loading fee structures...
          </div>
        ) : fees.length === 0 ? (
          <div className="afs-empty">
            No fee structures found. Create the first fee structure above.
          </div>
        ) : (
          <div className="afs-table-wrapper">
            <table className="afs-table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Class</th>
                  <th>Monthly</th>
                  <th>Yearly Tuition</th>
                  <th>Admission</th>
                  <th>Exam</th>
                  <th>Transport</th>
                  <th>Other</th>
                  <th>Total Annual</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => {
                  const annualTuition =
                    Number(
                      fee.yearly_fee ??
                        Number(fee.monthly_fee ?? 0) * 12
                    );

                  const total =
                    annualTuition +
                    Number(fee.admission_fee ?? 0) +
                    Number(fee.exam_fee ?? 0) +
                    Number(fee.transport_fee ?? 0) +
                    Number(fee.other_fee ?? 0);

                  return (
                    <tr key={fee.id}>
                      <td>{getYearName(fee)}</td>
                      <td>{getClassName(fee)}</td>
                      <td>{formatMoney(fee.monthly_fee)}</td>
                      <td>{formatMoney(annualTuition)}</td>
                      <td>{formatMoney(fee.admission_fee)}</td>
                      <td>{formatMoney(fee.exam_fee)}</td>
                      <td>{formatMoney(fee.transport_fee)}</td>
                      <td>{formatMoney(fee.other_fee)}</td>

                      <td className="afs-total-cell">
                        {formatMoney(total)}
                      </td>

                      <td>
                        <span
                          className={`afs-status ${
                            fee.is_active
                              ? "afs-status-active"
                              : "afs-status-inactive"
                          }`}
                        >
                          {fee.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="afs-row-actions">
                          <button
                            type="button"
                            className="afs-edit-btn"
                            onClick={() => handleEdit(fee)}
                            disabled={saving}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="afs-delete-btn"
                            onClick={() => handleDelete(fee)}
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminFeesStructure;
