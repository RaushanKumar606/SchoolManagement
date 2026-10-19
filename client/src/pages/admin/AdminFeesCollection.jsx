
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getFeeInvoices,
  getFeeDashboard,
  getFeeStructures,
} from "../../services/feeCollectionService";
import "./Admin.css";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

function getStudent(invoice) {
  return invoice?.student && typeof invoice.student === "object"
    ? invoice.student
    : {};
}

function getStudentName(invoice) {
  const student = getStudent(invoice);

  return (
    invoice.student_name ||
    student.name ||
    [student.first_name, student.middle_name, student.last_name]
      .filter(Boolean)
      .join(" ") ||
    invoice.name ||
    "—"
  );
}

function getStudentId(invoice) {
  const student = getStudent(invoice);

  return (
    invoice.student_id ||
    student.student_id ||
    invoice.admission_number ||
    student.admission_number ||
    (typeof invoice.student === "string" ||
    typeof invoice.student === "number"
      ? String(invoice.student)
      : "")
  );
}

function getClassName(invoice) {
  const student = getStudent(invoice);
  const schoolClass =
    invoice.school_class ||
    invoice.class_name ||
    student.school_class ||
    student.class_name;

  if (typeof schoolClass === "string") return schoolClass;
  if (typeof schoolClass === "number") return `Class ${schoolClass}`;

  return (
    schoolClass?.name ||
    schoolClass?.display_name ||
    invoice.class ||
    "—"
  );
}

function getSection(invoice) {
  const student = getStudent(invoice);
  const section = invoice.section || student.section;

  if (typeof section === "string") return section;

  return section?.name || "—";
}

function getInvoiceStatus(invoice) {
  const due = Number(invoice.due_amount ?? 0);
  const status = String(invoice.status || "").toUpperCase();

  if (status === "CANCELLED") return "CANCELLED";
  if (status === "OVERDUE") return "OVERDUE";
  if (status === "PAID" || due <= 0) return "PAID";
  if (status === "PARTIAL") return "PARTIAL";

  return status || "PENDING";
}

function getAcademicYear(invoice) {
  const year = invoice.academic_year;

  if (typeof year === "string" || typeof year === "number") {
    return String(year);
  }

  return year?.name || "";
}

export default function FeesCollection() {
  const [invoices, setInvoices] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [feeStructures, setFeeStructures] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getFeeInvoices(),
        getFeeDashboard(),
        getFeeStructures(),
      ]);

      const [invoiceResult, dashboardResult, structureResult] = results;

      if (invoiceResult.status === "fulfilled") {
        setInvoices(invoiceResult.value);
      } else {
        setInvoices([]);
        throw invoiceResult.reason;
      }

      if (dashboardResult.status === "fulfilled") {
        const response = dashboardResult.value;
        setDashboard(response?.data ?? response ?? {});
      }

      if (structureResult.status === "fulfilled") {
        setFeeStructures(structureResult.value);
      }
    } catch (err) {
      setError(
        err?.message ||
          "Fee data load nahi ho saka. Login aur API endpoint check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classes = useMemo(() => {
    const names = new Set();

    invoices.forEach((invoice) => {
      const name = getClassName(invoice);
      if (name !== "—") names.add(name);
    });

    feeStructures.forEach((structure) => {
      const schoolClass =
        structure.school_class || structure.class_name;

      const name =
        typeof schoolClass === "object"
          ? schoolClass?.name || schoolClass?.display_name
          : schoolClass;

      if (name) names.add(String(name));
    });

    return [...names].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [invoices, feeStructures]);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const searchableText = [
        getStudentId(invoice),
        getStudentName(invoice),
        getClassName(invoice),
        getSection(invoice),
        invoice.invoice_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesClass =
        classFilter === "ALL" || getClassName(invoice) === classFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        getInvoiceStatus(invoice) === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [invoices, search, classFilter, statusFilter]);

  const totals = useMemo(() => {
    const activeInvoices = invoices.filter(
      (invoice) => getInvoiceStatus(invoice) !== "CANCELLED"
    );

    return {
      total: activeInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount ?? 0),
        0
      ),
      paid: activeInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.paid_amount ?? 0),
        0
      ),
      pending: activeInvoices.reduce(
        (sum, invoice) => sum + Math.max(0, Number(invoice.due_amount ?? 0)),
        0
      ),
    };
  }, [invoices]);

  const summary = dashboard || {};

  return (
    <main className="fee-page">
      <header className="fee-page-header">
        <div>
          <p className="fee-eyebrow">SCHOOL ADMINISTRATION</p>
          <h1>Fee Collection</h1>
          <p className="fee-subtitle">
            Student fee records, collections and outstanding balances.
          </p>
        </div>

        <button
          type="button"
          className="fee-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      {error && (
        <div className="fee-error" role="alert">
          {error}
          <button type="button" onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      <section className="fee-summary-grid">
        <article className="fee-summary-card">
          <span className="fee-summary-icon blue">₹</span>
          <p>Total Invoiced</p>
          <h2>
            {money(summary.total_invoiced ?? totals.total)}
          </h2>
          <small>Total non-cancelled invoices</small>
        </article>

        <article className="fee-summary-card">
          <span className="fee-summary-icon green">✓</span>
          <p>Total Collected</p>
          <h2>
            {money(summary.total_collected ?? totals.paid)}
          </h2>
          <small>Recorded payments</small>
        </article>

        <article className="fee-summary-card">
          <span className="fee-summary-icon orange">⌛</span>
          <p>Total Pending</p>
          <h2>
            {money(summary.total_due ?? totals.pending)}
          </h2>
          <small>Outstanding invoice balance</small>
        </article>
      </section>

      <section className="fee-records-panel">
        <div className="fee-records-heading">
          <div>
            <h2>Student Fee Records</h2>
            <p>Search by student ID, name or invoice number.</p>
          </div>

          <span className="fee-record-count">
            {filteredInvoices.length} records
          </span>
        </div>

        <div className="fee-filters">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Student ID, name, invoice..."
            aria-label="Search fee records"
          />

          <select
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            aria-label="Filter by class"
          >
            <option value="ALL">All Classes</option>
            {classes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by fee status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="fee-empty-state">Loading fee records...</div>
        ) : (
          <div className="fee-table-wrapper">
            <table className="fee-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Class / Section</th>
                  <th>Invoice</th>
                  <th>Total Fee</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const status = getInvoiceStatus(invoice);

                  return (
                    <tr key={invoice.id ?? invoice.invoice_number ?? index}>
                      <td>{getStudentId(invoice) || "—"}</td>
                      <td className="fee-student-name">
                        {getStudentName(invoice)}
                      </td>
                      <td>
                        {getClassName(invoice)}
                        {getSection(invoice) !== "—"
                          ? ` / ${getSection(invoice)}`
                          : ""}
                      </td>
                      <td>{invoice.invoice_number || invoice.id || "—"}</td>
                      <td>{money(invoice.amount)}</td>
                      <td className="fee-paid-amount">
                        {money(invoice.paid_amount)}
                      </td>
                      <td className="fee-pending-amount">
                        {money(invoice.due_amount)}
                      </td>
                      <td>
                        <span
                          className={`fee-status fee-status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="fee-no-results">
                      {invoices.length
                        ? "No matching fee records found."
                        : "No fee invoices found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="fee-table-note">
          Fee records are view-only. Payments and invoices are not modified
          from this page.
        </p>
      </section>
    </main>
  );
}
