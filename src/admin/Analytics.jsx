import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  Wallet,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAdminToken() {
  return (
    sessionStorage.getItem("vandaluxe_admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function adminFetch(path) {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 401
          ? "Your admin session has expired. Please log in again."
          : "Unable to retrieve analytics.")
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

function formatCompactCurrency(amount) {
  const value = Number(amount) || 0;

  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}m`;
  }

  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1)}k`;
  }

  return `₦${value.toFixed(0)}`;
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="min-w-0 rounded bg-dark-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray">{label}</p>
        <Icon size={18} className="shrink-0 text-gray" />
      </div>

      <p className="mt-4 break-words text-2xl font-semibold">{value}</p>

      <p className="mt-2 text-xs text-gray">{description}</p>
    </div>
  );
}

function ProgressRow({ label, count, total, color = "bg-accent2" }) {
  const percentage =
    total > 0 ? Math.min(100, (count / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="capitalize text-gray">{label}</span>
        <span className="shrink-0">
          {count}{" "}
          <span className="text-xs text-gray">
            ({percentage.toFixed(0)}%)
          </span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-dark">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function Analytics() {
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [stats, setStats] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");

  const toggleSidebar = () =>
    setIsSideBarOpen((previous) => !previous);

  const loadAnalytics = React.useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [statsData, ordersData] = await Promise.all([
        adminFetch("/api/orders/admin/stats"),
        adminFetch("/api/orders/admin"),
      ]);

      const orderList = Array.isArray(ordersData)
        ? ordersData
        : ordersData.orders;

      if (!Array.isArray(orderList)) {
        throw new Error(
          "The orders endpoint did not return an orders array."
        );
      }

      setStats(statsData);
      setOrders(orderList);
    } catch (err) {
      setError(err.message || "Unable to load store analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const metrics = React.useMemo(() => {
    const paidOrders = orders.filter(
      (order) =>
        String(order.paymentStatus || "").toLowerCase() === "paid"
    );

    const deliveredOrders = orders.filter(
      (order) =>
        String(order.orderStatus || "").toLowerCase() === "delivered"
    );

    // Revenue includes only orders whose stored payment status is paid.
    const paidRevenue = paidOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0
    );

    const averagePaidOrder =
      paidOrders.length > 0 ? paidRevenue / paidOrders.length : 0;

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        key: [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-"),
        label: date.toLocaleDateString("en-NG", {
          weekday: "short",
        }),
        orders: 0,
        revenue: 0,
      };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    for (const order of orders) {
      if (!order.createdAt) continue;

      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) continue;

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      const day = dayMap.get(key);
      if (!day) continue;

      day.orders += 1;

      if (String(order.paymentStatus || "").toLowerCase() === "paid") {
        day.revenue += Number(order.total) || 0;
      }
    }

    const statusCounts = {};
    const paymentCounts = {};

    for (const order of orders) {
      const status = String(order.orderStatus || "unknown").toLowerCase();
      const payment = String(
        order.paymentStatus || "unknown"
      ).toLowerCase();

      statusCounts[status] = (statusCounts[status] || 0) + 1;
      paymentCounts[payment] = (paymentCounts[payment] || 0) + 1;
    }

    return {
      paidOrders,
      deliveredOrders,
      paidRevenue,
      averagePaidOrder,
      days,
      statusCounts,
      paymentCounts,
    };
  }, [orders]);

  const maxDailyOrders = Math.max(
    1,
    ...metrics.days.map((day) => day.orders)
  );

  const maxDailyRevenue = Math.max(
    1,
    ...metrics.days.map((day) => day.revenue)
  );

  const statusColors = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    processing: "bg-purple-400",
    shipped: "bg-indigo-400",
    delivered: "bg-green-400",
    cancelled: "bg-red-400",
  };

  const paymentColors = {
    paid: "bg-green-400",
    pending: "bg-yellow-400",
    failed: "bg-red-400",
    refunded: "bg-orange-400",
  };

  return (
    <section className="flex min-h-screen overflow-x-hidden bg-dark text-white">
      <SideBar isOpen={isSideBarOpen} />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={toggleSidebar}
          pageName="Analytics"
        />

        <main className="min-h-[calc(100vh-73px)] space-y-5 overflow-y-auto bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Store Analytics</h1>
              <p className="mt-1 text-sm text-gray">
                Understand sales, orders and payment performance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadAnalytics(true)}
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

          {error && (
            <div
              role="alert"
              className="rounded border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <p>{error}</p>

              {(error.toLowerCase().includes("session") ||
                error.toLowerCase().includes("admin")) && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="mt-2 underline"
                >
                  Return to admin login
                </button>
              )}

              <button
                type="button"
                onClick={() => loadAnalytics(true)}
                className="ml-3 underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading && !stats ? (
            <p className="py-12 text-center text-sm text-gray">
              Loading analytics from MongoDB...
            </p>
          ) : stats ? (
            <>
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={ShoppingBag}
                  label="Total Orders"
                  value={stats.totalOrders ?? orders.length}
                  description="Orders recorded by the store"
                />

                <StatCard
                  icon={Wallet}
                  label="Paid Revenue"
                  value={formatCurrency(metrics.paidRevenue)}
                  description="Paid orders in the retrieved dataset"
                />

                <StatCard
                  icon={CheckCircle2}
                  label="Paid Orders"
                  value={metrics.paidOrders.length}
                  description="Orders with paid payment status"
                />

                <StatCard
                  icon={TrendingUp}
                  label="Average Paid Order"
                  value={formatCurrency(metrics.averagePaidOrder)}
                  description="Paid revenue divided by paid orders"
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="min-w-0 rounded bg-dark-soft p-4">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                      Orders Over Time
                    </h2>
                    <p className="mt-1 text-sm text-gray">
                      Number of orders created in the last seven days.
                    </p>
                  </div>

                  <div className="flex h-48 items-end justify-between gap-2">
                    {metrics.days.map((day) => (
                      <div
                        key={day.key}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-xs text-gray">
                          {day.orders}
                        </span>

                        <div className="flex h-32 w-full items-end justify-center">
                          <div
                            title={`${day.orders} orders`}
                            className="w-full max-w-10 rounded-t bg-accent2 transition-all"
                            style={{
                              height: `${
                                day.orders === 0
                                  ? 3
                                  : Math.max(
                                      8,
                                      (day.orders / maxDailyOrders) * 100
                                    )
                              }%`,
                            }}
                          />
                        </div>

                        <span className="text-xs text-gray">
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded bg-dark-soft p-4">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                      Paid Revenue
                    </h2>
                    <p className="mt-1 text-sm text-gray">
                      Recorded paid revenue by order creation date.
                    </p>
                  </div>

                  <div className="flex h-48 items-end justify-between gap-2">
                    {metrics.days.map((day) => (
                      <div
                        key={day.key}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="max-w-full truncate text-[10px] text-gray">
                          {formatCompactCurrency(day.revenue)}
                        </span>

                        <div className="flex h-32 w-full items-end justify-center">
                          <div
                            title={formatCurrency(day.revenue)}
                            className="w-full max-w-10 rounded-t bg-accent4 transition-all"
                            style={{
                              height: `${
                                day.revenue === 0
                                  ? 3
                                  : Math.max(
                                      8,
                                      (day.revenue / maxDailyRevenue) * 100
                                    )
                              }%`,
                            }}
                          />
                        </div>

                        <span className="text-xs text-gray">
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="min-w-0 space-y-5 rounded bg-dark-soft p-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Order Status Breakdown
                    </h2>
                    <p className="mt-1 text-sm text-gray">
                      Current fulfilment status of retrieved orders.
                    </p>
                  </div>

                  {Object.keys(metrics.statusCounts).length === 0 ? (
                    <p className="py-5 text-sm text-gray">
                      No order data available.
                    </p>
                  ) : (
                    Object.entries(metrics.statusCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([status, count]) => (
                        <ProgressRow
                          key={status}
                          label={status}
                          count={count}
                          total={orders.length}
                          color={statusColors[status] || "bg-accent2"}
                        />
                      ))
                  )}
                </div>

                <div className="min-w-0 space-y-5 rounded bg-dark-soft p-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Payment Breakdown
                    </h2>
                    <p className="mt-1 text-sm text-gray">
                      Recorded payment statuses, including failed and pending
                      payments.
                    </p>
                  </div>

                  {Object.keys(metrics.paymentCounts).length === 0 ? (
                    <p className="py-5 text-sm text-gray">
                      No payment data available.
                    </p>
                  ) : (
                    Object.entries(metrics.paymentCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([status, count]) => (
                        <ProgressRow
                          key={status}
                          label={status}
                          count={count}
                          total={orders.length}
                          color={paymentColors[status] || "bg-accent2"}
                        />
                      ))
                  )}
                </div>
              </section>

              <section className="rounded bg-dark-soft p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Recent Order Activity
                    </h2>
                    <p className="mt-1 text-sm text-gray">
                      Latest orders returned by your orders API.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/orders")}
                    className="rounded border border-gray/20 px-3 py-2 text-sm transition hover:border-white"
                  >
                    View all orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray">
                    No orders to display.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray/20 text-gray">
                          <th className="px-3 py-3 font-normal">Order</th>
                          <th className="px-3 py-3 font-normal">Date</th>
                          <th className="px-3 py-3 font-normal">Total</th>
                          <th className="px-3 py-3 font-normal">Payment</th>
                          <th className="px-3 py-3 font-normal">Details</th>
                        </tr>
                      </thead>

                      <tbody>
                        {[...orders]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt || 0) -
                              new Date(a.createdAt || 0)
                          )
                          .slice(0, 5)
                          .map((order) => (
                            <tr
                              key={order._id}
                              className="border-b border-gray/10 last:border-0"
                            >
                              <td className="px-3 py-4 font-mono text-xs">
                                #{String(order._id).slice(-8).toUpperCase()}
                              </td>

                              <td className="px-3 py-4 text-gray">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString(
                                      "en-NG"
                                    )
                                  : "—"}
                              </td>

                              <td className="px-3 py-4">
                                {formatCurrency(order.total)}
                              </td>

                              <td className="px-3 py-4">
                                <span className="capitalize">
                                  {order.paymentStatus || "unknown"}
                                </span>
                              </td>

                              <td className="px-3 py-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/admin/orders/${order._id}`)
                                  }
                                  className="text-sm underline underline-offset-4 hover:text-gray"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <p className="flex items-start gap-2 text-xs text-gray">
                <CalendarDays size={14} className="mt-0.5 shrink-0" />
                Revenue and charts are calculated from orders returned by the
                API. If the endpoint is paginated, these figures describe only
                the returned orders, not necessarily the entire store history.
                Refund accounting and delivery charges are not independently
                inferred.
              </p>
            </>
          ) : null}
        </main>
      </div>
    </section>
  );
}

export default Analytics;