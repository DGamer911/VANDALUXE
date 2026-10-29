import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Package,
  UserRound,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CalendarDays,
  Save,
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

async function adminFetch(path, options = {}) {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 401
          ? "Your admin session has expired."
          : "The request could not be completed.")
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
        styles[String(label).toLowerCase()] ||
        "bg-gray-500/10 text-gray-300"
      }`}
    >
      {label}
    </span>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <section className="min-w-0 rounded bg-dark-soft p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={17} className="text-gray" />
        <h2 className="font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray/10 py-3 last:border-0">
      <span className="text-sm text-gray">{label}</span>
      <span className="min-w-0 break-words text-right text-sm">
        {value || "—"}
      </span>
    </div>
  );
}

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [nextStatus, setNextStatus] = React.useState("");

  const toggleSidebar = () =>
    setIsSideBarOpen((previous) => !previous);

  const loadOrder = React.useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");
    setNotice("");

    try {
      const data = await adminFetch(
        `/api/orders/admin/${encodeURIComponent(id)}`
      );

      // Supports either { order: {...} } or a direct order object.
      const result = data.order || data;

      if (!result?._id) {
        throw new Error("The server did not return a valid order.");
      }

      setOrder(result);
      setNextStatus(result.orderStatus || "pending");
    } catch (err) {
      setError(err.message || "Unable to load order details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async () => {
    if (!order || !nextStatus || nextStatus === order.orderStatus) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const data = await adminFetch(
        `/api/orders/admin/${encodeURIComponent(id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ orderStatus: nextStatus }),
        }
      );

      const updated = data.order || data;

      // Prefer the updated order returned by the backend.
      if (updated?._id && updated.orderStatus) {
        setOrder(updated);
        setNextStatus(updated.orderStatus);
      } else {
        await loadOrder(true);
      }

      setNotice("Order status updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    } finally {
      setSaving(false);
    }
  };

  const customer = order?.customer || {};
  const items = order?.orderItems || order?.items || [];

  const customerName =
    customer.name ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    "Unknown customer";

  return (
    <section className="flex min-h-screen overflow-x-hidden bg-dark text-white">
      <SideBar isOpen={isSideBarOpen} />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={toggleSidebar}
          pageName="Order Details"
        />

        <main className="min-h-[calc(100vh-73px)] space-y-5 overflow-y-auto bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                aria-label="Back to orders"
                className="mt-1 rounded border border-gray/20 p-2 text-gray transition hover:border-white hover:text-white"
              >
                <ArrowLeft size={17} />
              </button>

              <div>
                <h1 className="text-xl font-semibold">Order Details</h1>
                <p className="mt-1 break-all font-mono text-xs text-gray">
                  {order?._id || id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadOrder(true)}
              disabled={loading || refreshing}
              className="flex items-center gap-2 rounded border border-gray/20 p-2 text-sm text-gray transition hover:border-white hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={15}
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
              <button
                type="button"
                onClick={() => loadOrder(true)}
                className="mt-2 underline"
              >
                Try again
              </button>

              {error.toLowerCase().includes("session") && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="ml-3 underline"
                >
                  Admin login
                </button>
              )}
            </div>
          )}

          {notice && (
            <p
              role="status"
              className="rounded border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-300"
            >
              {notice}
            </p>
          )}

          {loading && !order ? (
            <p className="py-16 text-center text-sm text-gray">
              Loading order from MongoDB...
            </p>
          ) : !order ? (
            <section className="rounded bg-dark-soft p-8 text-center">
              <Package size={32} className="mx-auto mb-3 text-gray" />
              <h2 className="font-medium">Order unavailable</h2>
              <p className="mt-2 text-sm text-gray">
                This order could not be found or retrieved.
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="mt-5 rounded border border-gray/20 px-4 py-2 text-sm hover:border-white"
              >
                Back to orders
              </button>
            </section>
          ) : (
            <>
              <section className="flex flex-wrap items-center justify-between gap-4 rounded bg-dark-soft p-4">
                <div>
                  <p className="text-sm text-gray">Order reference</p>
                  <p className="mt-1 font-mono text-lg">
                    #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-2 text-xs text-gray">
                    <CalendarDays
                      size={13}
                      className="mr-1 inline"
                    />
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div>
                    <p className="mb-2 text-xs text-gray">Payment</p>
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray">Order</p>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>
              </section>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 space-y-4">
                  <InfoCard icon={Package} title="Ordered Products">
                    {items.length === 0 ? (
                      <p className="py-5 text-sm text-gray">
                        No order items were returned by the server.
                      </p>
                    ) : (
                      <div className="divide-y divide-gray/10">
                        {items.map((item, index) => {
                          const quantity = Number(item.quantity) || 0;
                          const unitPrice = Number(item.unitPrice ?? item.price) || 0;
                          const lineTotal =
                            item.lineTotal != null
                              ? Number(item.lineTotal)
                              : unitPrice * quantity;

                          return (
                            <div
                              key={item._id || item.productId || index}
                              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                  {item.name ||
                                    item.productName ||
                                    item.product?.name ||
                                    "Product"}
                                </p>
                                <p className="mt-1 text-xs text-gray">
                                  Size: {item.size || "—"} · Qty: {quantity}
                                </p>
                                <p className="mt-1 text-xs text-gray">
                                  {formatCurrency(unitPrice)} per item
                                </p>
                              </div>

                              <p className="whitespace-nowrap font-medium">
                                {formatCurrency(lineTotal)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </InfoCard>

                  <InfoCard icon={UserRound} title="Customer Information">
                    <DetailRow label="Name" value={customerName} />
                    <DetailRow
                      label="Email"
                      value={customer.email}
                    />
                    <DetailRow
                      label="Phone"
                      value={customer.phone}
                    />
                  </InfoCard>

                  <InfoCard icon={MapPin} title="Delivery Information">
                    <DetailRow
                      label="Address"
                      value={
                        order.shippingAddress ||
                        order.address ||
                        customer.address
                      }
                    />
                    <DetailRow
                      label="Delivery note"
                      value={order.deliveryNote || customer.deliveryNote}
                    />
                    <p className="mt-3 text-xs text-gray">
                      Delivery fees are handled separately and are not
                      included in the order total unless your backend
                      explicitly stores them there.
                    </p>
                  </InfoCard>
                </div>

                <div className="min-w-0 space-y-4">
                  <InfoCard icon={CreditCard} title="Payment Summary">
                    <DetailRow
                      label="Subtotal"
                      value={formatCurrency(
                        order.subtotal ??
                          items.reduce(
                            (sum, item) =>
                              sum +
                              (item.lineTotal != null
                                ? Number(item.lineTotal) || 0
                                : (Number(item.unitPrice ?? item.price) || 0) *
                                  (Number(item.quantity) || 0)),
                            0
                          )
                      )}
                    />
                    <DetailRow
                      label="Payment status"
                      value={<StatusBadge status={order.paymentStatus} />}
                    />
                    <DetailRow
                      label="Payment reference"
                      value={
                        order.paymentReference ||
                        order.paymentRef ||
                        order.reference
                      }
                    />
                    <div className="mt-4 border-t border-gray/20 pt-4">
                      <p className="text-sm text-gray">Order total</p>
                      <p className="mt-2 break-words text-2xl font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </InfoCard>

                  <InfoCard icon={Phone} title="Contact Details">
                    <div className="space-y-4">
                      <p className="flex items-start gap-3 break-all text-sm text-gray">
                        <Mail size={16} className="mt-0.5 shrink-0" />
                        {customer.email || "No email recorded"}
                      </p>
                      <p className="flex items-start gap-3 text-sm text-gray">
                        <Phone size={16} className="mt-0.5 shrink-0" />
                        {customer.phone || "No phone recorded"}
                      </p>
                    </div>
                  </InfoCard>

                  <section className="rounded bg-dark-soft p-4">
                    <h2 className="font-medium">Update Order Status</h2>
                    <p className="mt-1 text-xs text-gray">
                      This changes the fulfilment status, not the payment status.
                    </p>

                    <label
                      htmlFor="order-status"
                      className="mb-2 mt-4 block text-sm text-gray"
                    >
                      New status
                    </label>

                    <select
                      id="order-status"
                      value={nextStatus}
                      onChange={(event) => setNextStatus(event.target.value)}
                      className="w-full rounded border border-gray/20 bg-dark px-3 py-3 text-sm outline-none focus:border-white/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={updateStatus}
                      disabled={
                        saving ||
                        !nextStatus ||
                        nextStatus === order.orderStatus
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-accent2 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Save size={15} />
                      {saving ? "Saving..." : "Save Status"}
                    </button>
                  </section>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}

export default OrderDetails;