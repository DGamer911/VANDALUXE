import React from "react";
import { Search, RefreshCw, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAdminToken() {
  return (
    sessionStorage.getItem("vandaluxe_admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function fetchAdminStats() {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}/api/orders/admin/stats`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 401
          ? "Your admin session is invalid or has expired. Please log in again."
          : "Unable to load dashboard data.")
    );
  }

  return data;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function shortenId(id) {
  return id ? String(id).slice(-8).toUpperCase() : "—";
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-300",
    confirmed: "bg-blue-500/10 text-blue-300",
    processing: "bg-purple-500/10 text-purple-300",
    shipped: "bg-indigo-500/10 text-indigo-300",
    delivered: "bg-green-500/10 text-green-300",
    cancelled: "bg-red-500/10 text-red-300",
    paid: "bg-green-500/10 text-green-300",
    failed: "bg-red-500/10 text-red-300",
    refunded: "bg-orange-500/10 text-orange-300",
  };

  const label = status || "unknown";

  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs capitalize ${
        styles[label] || "bg-gray-500/10 text-gray-300"
      }`}
    >
      {label}
    </span>
  );
}

function AdminPanel() {
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");

  const toggleSidebar = () => {
    setIsSideBarOpen((previous) => !previous);
  };

  const loadStats = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  const recentOrders = React.useMemo(() => {
    const orders = stats?.recentOrders || [];
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      const searchable = [
        order._id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
        order.paymentStatus,
        order.orderStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [stats, search]);

  const cards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      style: "bg-dark-soft",
    },
    {
      label: "Paid Orders",
      value: stats?.paidOrders ?? 0,
      style: "bg-accent2",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      style: "bg-accent3",
    },
    {
      label: "Delivered Orders",
      value: stats?.deliveredOrders ?? 0,
      style: "bg-accent4",
    },
  ];

  return (
    <section className="flex min-h-screen overflow-x-hidden bg-dark text-white">
      <SideBar isOpen={isSideBarOpen} />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={toggleSidebar}
          pageName="Dashboard"
        />

        <main className="min-h-[calc(100vh-73px)] space-y-5 overflow-y-auto bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Dashboard Overview</h1>
              <p className="mt-1 text-sm text-gray">
                Your store's live order activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded bg-dark-soft p-2 text-sm text-gray">
                {new Date().toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button
                type="button"
                onClick={() => loadStats(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-2 rounded border border-gray/20 p-2 text-sm text-gray transition hover:border-white hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <p>{error}</p>

              {error.toLowerCase().includes("session") ||
              error.toLowerCase().includes("admin") ? (
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="mt-2 underline"
                >
                  Return to admin login
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => loadStats(true)}
                className="ml-3 underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`${card.style} min-w-0 rounded p-4`}
              >
                <p className="text-sm text-gray">{card.label}</p>

                <p className="mt-3 text-3xl font-semibold">
                  {loading && !stats ? "—" : card.value}
                </p>
              </div>
            ))}
          </div>

          <section className="rounded bg-dark-soft p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <p className="mt-1 text-sm text-gray">
                  The five most recent orders recorded in your database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="flex items-center gap-2 rounded border border-gray/20 p-2 text-sm transition hover:border-white"
              >
                View all orders
                <ExternalLink size={15} />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded border border-gray/20 bg-dark px-3">
              <Search size={17} className="shrink-0 text-gray" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search recent orders..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray"
              />
            </div>

            {loading && !stats ? (
              <p className="py-10 text-center text-sm text-gray">
                Loading orders from MongoDB...
              </p>
            ) : stats && recentOrders.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray">
                {search
                  ? "No recent orders match your search."
                  : "No orders have been placed yet."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray/20 text-gray">
                      <th className="px-3 py-3 font-normal">Order ID</th>
                      <th className="px-3 py-3 font-normal">Customer</th>
                      <th className="px-3 py-3 font-normal">Date</th>
                      <th className="px-3 py-3 font-normal">Total</th>
                      <th className="px-3 py-3 font-normal">Payment</th>
                      <th className="px-3 py-3 font-normal">Order Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray/10 last:border-0"
                      >
                        <td className="px-3 py-4 font-mono text-xs">
                          {shortenId(order._id)}
                        </td>

                        <td className="px-3 py-4">
                          <p>{order.customer?.name || "Unknown"}</p>
                          <p className="mt-1 text-xs text-gray">
                            {order.customer?.email || "—"}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-gray">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-3 py-4">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="px-3 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>

                        <td className="px-3 py-4">
                          <StatusBadge status={order.orderStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="text-xs text-gray">
            Statistics are calculated from stored orders. Paid orders reflect
            the database payment status; delivery fees are handled separately.
          </p>
        </main>
      </div>
    </section>
  );
}

export default AdminPanel;