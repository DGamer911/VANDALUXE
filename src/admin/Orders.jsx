import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  ShoppingBag,
  ChevronDown,
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
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(getAdminToken()
        ? { Authorization: `Bearer ${getAdminToken()}` }
        : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 401
          ? "Your admin session has expired. Please log in again."
          : "Unable to retrieve orders.")
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

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-NG", {
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
      className={`inline-flex whitespace-nowrap rounded px-2 py-1 text-xs capitalize ${
        styles[String(label).toLowerCase()] ||
        "bg-gray-500/10 text-gray-300"
      }`}
    >
      {label}
    </span>
  );
}

function Orders() {
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [orderStatus, setOrderStatus] = React.useState("all");
  const [paymentStatus, setPaymentStatus] = React.useState("all");

  const toggleSidebar = () =>
    setIsSideBarOpen((previous) => !previous);

  const loadOrders = React.useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      // Expected response: an array of orders, or { orders: [...] }.
      const data = await adminFetch("/api/orders/admin");
      const list = Array.isArray(data) ? data : data.orders;

      if (!Array.isArray(list)) {
        throw new Error(
          "The orders endpoint did not return an orders array."
        );
      }

      setOrders(list);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const searchable = [
        order._id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
        order.orderStatus,
        order.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const matchesOrderStatus =
        orderStatus === "all" ||
        String(order.orderStatus || "").toLowerCase() === orderStatus;

      const matchesPaymentStatus =
        paymentStatus === "all" ||
        String(order.paymentStatus || "").toLowerCase() ===
          paymentStatus;

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentStatus
      );
    });
  }, [orders, search, orderStatus, paymentStatus]);

  const totalValue = filteredOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  return (
    <section className="flex min-h-screen overflow-x-hidden bg-dark text-white">
      <SideBar isOpen={isSideBarOpen} />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={toggleSidebar}
          pageName="Orders"
        />

        <main className="min-h-[calc(100vh-73px)] space-y-5 overflow-y-auto bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Orders Management</h1>
              <p className="mt-1 text-sm text-gray">
                Manage customer purchases and fulfilment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadOrders(true)}
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
                onClick={() => loadOrders(true)}
                className="ml-3 underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded bg-dark-soft p-4">
              <p className="text-sm text-gray">Total Orders</p>
              <p className="mt-3 text-2xl font-semibold">
                {loading && orders.length === 0 ? "—" : orders.length}
              </p>
            </div>

            <div className="rounded bg-dark-soft p-4">
              <p className="text-sm text-gray">Awaiting Fulfilment</p>
              <p className="mt-3 text-2xl font-semibold">
                {loading && orders.length === 0
                  ? "—"
                  : orders.filter((order) =>
                      ["pending", "confirmed", "processing"].includes(
                        String(order.orderStatus || "").toLowerCase()
                      )
                    ).length}
              </p>
            </div>

            <div className="rounded bg-dark-soft p-4">
              <p className="text-sm text-gray">Filtered Order Value</p>
              <p className="mt-3 break-words text-xl font-semibold">
                {loading && orders.length === 0
                  ? "—"
                  : formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          <section className="rounded bg-dark-soft p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">All Orders</h2>
              <p className="mt-1 text-sm text-gray">
                {filteredOrders.length} matching{" "}
                {filteredOrders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px]">
              <div className="flex min-w-0 items-center gap-2 rounded border border-gray/20 bg-dark px-3">
                <Search size={17} className="shrink-0 text-gray" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ID, customer or email..."
                  className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray"
                />
              </div>

              <div className="relative">
                <select
                  value={orderStatus}
                  onChange={(event) => setOrderStatus(event.target.value)}
                  className="w-full appearance-none rounded border border-gray/20 bg-dark px-3 py-3 pr-9 text-sm text-white outline-none focus:border-white/50"
                  aria-label="Filter by order status"
                >
                  <option value="all">All order statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray"
                />
              </div>

              <div className="relative">
                <select
                  value={paymentStatus}
                  onChange={(event) => setPaymentStatus(event.target.value)}
                  className="w-full appearance-none rounded border border-gray/20 bg-dark px-3 py-3 pr-9 text-sm text-white outline-none focus:border-white/50"
                  aria-label="Filter by payment status"
                >
                  <option value="all">All payment statuses</option>
                  <option value="pending">Payment pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray"
                />
              </div>
            </div>

            {loading && orders.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray">
                Loading orders from MongoDB...
              </p>
            ) : error && orders.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray">
                Orders could not be loaded.
              </p>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag
                  size={30}
                  className="mx-auto mb-3 text-gray"
                />
                <p className="text-sm text-gray">
                  {orders.length === 0
                    ? "No orders have been placed yet."
                    : "No orders match your filters."}
                </p>
                {(search || orderStatus !== "all" ||
                  paymentStatus !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setOrderStatus("all");
                      setPaymentStatus("all");
                    }}
                    className="mt-3 text-sm underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray/20 text-gray">
                      <th className="px-3 py-3 font-normal">Order ID</th>
                      <th className="px-3 py-3 font-normal">Customer</th>
                      <th className="px-3 py-3 font-normal">Date</th>
                      <th className="px-3 py-3 font-normal">Total</th>
                      <th className="px-3 py-3 font-normal">Payment</th>
                      <th className="px-3 py-3 font-normal">Order Status</th>
                      <th className="px-3 py-3 font-normal">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray/10 transition hover:bg-white/[0.02] last:border-0"
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

                        <td className="whitespace-nowrap px-3 py-4 text-gray">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="px-3 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>

                        <td className="px-3 py-4">
                          <StatusBadge status={order.orderStatus} />
                        </td>

                        <td className="px-3 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/orders/${order._id}`)
                            }
                            className="inline-flex items-center gap-2 rounded border border-gray/20 px-3 py-2 text-xs transition hover:border-white"
                          >
                            <Eye size={14} />
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

          <p className="text-xs text-gray">
            Order totals are taken from stored orders. Delivery fees are handled
            separately.
          </p>
        </main>
      </div>
    </section>
  );
}

export default Orders;