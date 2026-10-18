
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/apiRequest";
import "./Accountant.css";


const quickActions = [
  {
    title: "Collect Student Fee",
    description: "Search students and record fee payments",
    icon: "💰",
    path: "/accountant/student-fees-payment",
    color: "#16a34a",
  },
  {
    title: "Teacher Salary",
    description: "Manage salary structures and salary slips",
    icon: "👨‍🏫",
    path: "/accountant/salary-structure",
    color: "#2563eb",
  },
  {
    title: "Staff Payroll",
    description: "Manage staff payroll and salary payments",
    icon: "👥",
    path: "/accountant/salary-structure",
    color: "#9333ea",
  },
  {
    title: "Payment History",
    description: "Review fee and salary transactions",
    icon: "🧾",
    path: "/accountant/salary-slips",
    color: "#d97706",
  },
  {
    title: "Fee Records",
    description: "Check paid, pending and partial fees",
    icon: "📄",
    path: "/accountant/fees-invoice",
    color: "#0891b2",
  },
  {
    title: "Finance Reports",
    description: "Review collections and expenses",
    icon: "📊",
    // path: "/accountant/reports",
    color: "#db2777",
  },
];

const initialStats = [
  {
    title: "Total Collected",
    value: "₹0",
    subtitle: "Successful fee payments",
    icon: "💵",
    color: "#16a34a",
  },
  {
    title: "Outstanding Due",
    value: "₹0",
    subtitle: "Fees remaining to collect",
    icon: "⏳",
    color: "#ea580c",
  },
  {
    title: "Today's Collection",
    value: "₹0",
    subtitle: "Collected today",
    icon: "📈",
    color: "#2563eb",
  },
  {
    title: "Pending Invoices",
    value: "0",
    subtitle: "Invoices awaiting payment",
    icon: "📋",
    color: "#9333ea",
  },
];

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getNumber(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
  }

  return 0;
}

function getDashboardStats(data) {
  const source = data?.data ?? data ?? {};

  return [
    {
      ...initialStats[0],
      value: formatCurrency(
        getNumber(
          source.total_collected,
          source.total_collection,
          source.total_paid,
          source.total_revenue
        )
      ),
    },
    {
      ...initialStats[1],
      value: formatCurrency(
        getNumber(
          source.outstanding_due,
          source.total_due,
          source.pending_amount
        )
      ),
    },
    {
      ...initialStats[2],
      value: formatCurrency(
        getNumber(
          source.today_collection,
          source.today_collected,
          source.today_total
        )
      ),
    },
    {
      ...initialStats[3],
      value: String(
        getNumber(
          source.pending_invoices,
          source.pending_invoice_count,
          source.pending_count
        )
      ),
    },
  ];
}

function AccountantDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError("");

      try {
        // Uses the existing API helper, including its token-refresh logic.
        const response = await apiRequest("/fees/dashboard/");

        if (!active) return;

        setStats(getDashboardStats(response));
      } catch (error) {
        if (!active) return;

        setLoadError(
          "Dashboard totals could not be loaded. Please check your login and fees dashboard API."
        );
        console.error("Accountant dashboard error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="accountant-dashboard">
      <header className="accountant-dashboard-header">
        <div>
          <h1>FINANCE MANAGEMENT</h1>
          <p>
            Manage student fees, teacher salaries, staff payroll and financial
            records from one place.
          </p>
        </div>

        <button
          type="button"
          className="accountant-refresh-button"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {loadError && (
        <div className="accountant-dashboard-alert" role="status">
          {loadError}
        </div>
      )}

      <section className="accountant-stats-grid" aria-label="Financial summary">
        {stats.map((stat) => (
          <article className="accountant-stat-card" key={stat.title}>
            <div
              className="accountant-stat-icon"
              style={{ "--stat-color": stat.color }}
            >
              {stat.icon}
            </div>

            <div className="accountant-stat-content">
              <p>{stat.title}</p>
              <h2>{loading ? "Loading..." : stat.value}</h2>
              <span>{stat.subtitle}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="accountant-quick-actions">
        <div className="accountant-section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Choose a task to get started.</p>
          </div>
        </div>

        <div className="accountant-quick-actions-grid">
          {quickActions.map((action) => (
            <button
              type="button"
              className="accountant-quick-action-card"
              key={action.title}
              onClick={() => navigate(action.path)}
              style={{ "--action-color": action.color }}
            >
              <span className="accountant-action-icon" aria-hidden="true">
                {action.icon}
              </span>

              <span className="accountant-action-content">
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </span>

              <span className="accountant-action-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="accountant-dashboard-note">
        <span aria-hidden="true">ℹ️</span>
        <p>
          Record every student fee payment through Collect Student Fee and
          verify the receipt before closing the transaction.
        </p>
      </section>
    </main>
  );
}

export default AccountantDashboard;
