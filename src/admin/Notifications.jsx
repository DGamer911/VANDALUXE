import React from "react";
import {
  Bell,
  Mail,
  RefreshCw,
  CheckCheck,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import SideBar from "../../components/SideBar";
import AdminHeader from "../../components/AdminHeader";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function getAdminToken() {
  return (
    sessionStorage.getItem("vandaluxe_admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function adminRequest(path, options = {}) {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 401
          ? "Your admin session has expired. Please log in again."
          : "Unable to complete the request.")
    );
  }

  return data;
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Notifications() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [filter, setFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [busyId, setBusyId] = React.useState("");

  const loadNotifications = React.useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const data = await adminRequest("/api/admin/messages");

      setMessages(
        Array.isArray(data) ? data : data.messages || data.data || []
      );
    } catch (err) {
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unread = messages.filter((message) => !message.isRead);

  const notifications = React.useMemo(() => {
    return [...messages]
      .filter((message) => filter === "all" || !message.isRead)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }, [messages, filter]);

  async function markRead(message) {
    if (message.isRead || busyId) return;

    setBusyId(message._id);
    setError("");
    setNotice("");

    try {
      await adminRequest(
        `/api/admin/messages/${message._id}/read`,
        { method: "PATCH" }
      );

      setMessages((current) =>
        current.map((item) =>
          item._id === message._id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item
        )
      );

      setNotice("Notification marked as read.");
    } catch (err) {
      setError(err.message || "Unable to update notification.");
    } finally {
      setBusyId("");
    }
  }

  async function markAllRead() {
    const unreadMessages = messages.filter((message) => !message.isRead);

    if (!unreadMessages.length || busyId) return;

    setBusyId("all");
    setError("");
    setNotice("");

    let failed = 0;

    for (const message of unreadMessages) {
      try {
        await adminRequest(
          `/api/admin/messages/${message._id}/read`,
          { method: "PATCH" }
        );

        setMessages((current) =>
          current.map((item) =>
            item._id === message._id
              ? {
                  ...item,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : item
          )
        );
      } catch {
        failed += 1;
      }
    }

    setBusyId("");

    if (failed) {
      setError(
        `${failed} notification(s) could not be marked as read. Please refresh and retry.`
      );
    } else {
      setNotice("All notifications marked as read.");
    }
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-dark text-white lg:pl-[200px]">
      <SideBar isOpen={isSidebarOpen} />

      <div className="min-w-0">
        <AdminHeader
          pageName="Notifications"
          onMenuClick={() => setIsSidebarOpen((previous) => !previous)}
        />

        <main className="space-y-5 bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Notifications</h1>
              <p className="mt-1 text-sm text-gray">
                Keep up with new customer enquiries and unread messages.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadNotifications(true)}
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
              className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
              {error.toLowerCase().includes("session") && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="ml-2 underline"
                >
                  Log in again
                </button>
              )}
            </div>
          )}

          {notice && (
            <p className="rounded border border-gray/20 bg-dark-soft p-3 text-sm text-gray">
              {notice}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded bg-dark-soft p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray">Total notifications</p>
                <Bell size={18} className="text-gray" />
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {loading ? "—" : messages.length}
              </p>
            </div>

            <div className="rounded bg-dark-soft p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray">Unread</p>
                <Mail size={18} className="text-gray" />
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {loading ? "—" : unread.length}
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded border border-gray/10 bg-dark-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray/20 p-4">
              <div className="flex gap-2">
                {[
                  ["all", "All activity"],
                  ["unread", "Unread only"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded border px-3 py-2 text-sm transition ${
                      filter === value
                        ? "border-white/30 bg-dark-soft2 text-white"
                        : "border-gray/20 text-gray hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={markAllRead}
                disabled={!unread.length || Boolean(busyId)}
                className="flex items-center gap-2 rounded border border-gray/20 px-3 py-2 text-sm text-gray transition hover:border-white hover:text-white disabled:opacity-40"
              >
                <CheckCheck size={15} />
                {busyId === "all" ? "Updating..." : "Mark all read"}
              </button>
            </div>

            {loading ? (
              <p className="p-10 text-center text-sm text-gray">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-12 text-center">
                <Inbox size={32} className="text-gray" strokeWidth={1.3} />
                <h2 className="font-medium">You're all caught up</h2>
                <p className="max-w-sm text-sm text-gray">
                  {filter === "unread"
                    ? "There are no unread customer messages."
                    : "Customer-message notifications will appear here when enquiries arrive."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray/10">
                {notifications.map((message) => (
                  <article
                    key={message._id}
                    className={`flex items-start gap-3 p-4 transition hover:bg-dark-soft2/30 ${
                      !message.isRead ? "bg-dark-soft2/15" : ""
                    }`}
                  >
                    <div
                      className={`mt-1 rounded p-2 ${
                        message.isRead
                          ? "bg-dark text-gray"
                          : "bg-blue-500/10 text-blue-300"
                      }`}
                    >
                      <Mail size={18} strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-medium">
                          New customer enquiry
                        </h2>
                        {!message.isRead && (
                          <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-300">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray">
                        <span className="text-white">{message.name}</span>
                        {" sent you a message."}
                      </p>

                      <p className="mt-2 line-clamp-2 break-words text-sm text-gray">
                        {message.message}
                      </p>

                      <p className="mt-2 text-xs text-gray">
                        {formatDate(message.createdAt)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!message.isRead) markRead(message);
                            navigate("/admin/messages");
                          }}
                          className="flex items-center gap-1 text-xs text-white transition hover:text-gray"
                        >
                          View messages
                          <ArrowUpRight size={14} />
                        </button>

                        {!message.isRead && (
                          <button
                            type="button"
                            disabled={Boolean(busyId)}
                            onClick={() => markRead(message)}
                            className="text-xs text-gray transition hover:text-white disabled:opacity-50"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <p className="text-xs text-gray">
            Notifications are derived from customer messages in your database.
            Separate order, stock, and payment notifications require additional
            backend support.
          </p>
        </main>
      </div>
    </section>
  );
}

export default Notifications;