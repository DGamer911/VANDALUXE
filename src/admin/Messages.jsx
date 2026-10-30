
import React from "react";
import {
  Search,
  RefreshCw,
  Mail,
  MailOpen,
  Trash2,
  ArrowLeft,
  Phone,
  CalendarDays,
  Inbox,
  X,
} from "lucide-react";

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
          : "The request could not be completed.")
    );
  }

  return data;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Messages() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [busyId, setBusyId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const loadMessages = React.useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const data = await adminRequest("/api/admin/messages");

      const list = Array.isArray(data)
        ? data
        : data.messages || data.data || [];

      setMessages(list);
    } catch (err) {
      setError(err.message || "Unable to load messages.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const unreadCount = messages.filter((message) => !message.isRead).length;

  const filteredMessages = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages
      .filter((message) => {
        if (filter === "unread" && message.isRead) return false;
        if (filter === "read" && !message.isRead) return false;

        const searchable = [
          message.name,
          message.email,
          message.phone,
          message.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return !query || searchable.includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }, [messages, search, filter]);

  const selectedMessage = messages.find(
    (message) => message._id === selectedId
  );

  async function openMessage(message) {
    setSelectedId(message._id);
    setNotice("");
    setError("");

    if (message.isRead) return;

    setBusyId(message._id);

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
    } catch (err) {
      setError(err.message || "Unable to mark message as read.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleRead(message) {
    setBusyId(message._id);
    setError("");
    setNotice("");

    try {
      if (!message.isRead) {
        await adminRequest(
          `/api/admin/messages/${message._id}/read`,
          { method: "PATCH" }
        );
      } else {
        setNotice(
          "Your current API supports marking messages as read, but not marking them unread."
        );
        return;
      }

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
    } catch (err) {
      setError(err.message || "Unable to update message.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMessage(message) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name || "this customer"}? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(message._id);
    setError("");
    setNotice("");

    try {
      await adminRequest(`/api/admin/messages/${message._id}`, {
        method: "DELETE",
      });

      setMessages((current) =>
        current.filter((item) => item._id !== message._id)
      );

      if (selectedId === message._id) setSelectedId(null);

      setNotice("Message deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete message.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-dark text-white lg:pl-[200px]">
      <SideBar isOpen={isSidebarOpen} />

      <div className="min-w-0">
        <AdminHeader
          pageName="Messages"
          onMenuClick={() => setIsSidebarOpen((previous) => !previous)}
        />

        <main className="space-y-5 bg-dark p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Customer Messages</h1>
              <p className="mt-1 text-sm text-gray">
                Manage enquiries sent through your store.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadMessages(true)}
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

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              { label: "Total Messages", value: messages.length },
              { label: "Unread Messages", value: unreadCount },
              {
                label: "Read Messages",
                value: messages.length - unreadCount,
              },
            ].map((item) => (
              <div key={item.label} className="rounded bg-dark-soft p-4">
                <p className="text-sm text-gray">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold">
                  {loading ? "—" : item.value}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              <span>{error}</span>
              {error.toLowerCase().includes("session") && (
                <button
                  onClick={() => (window.location.href = "/admin/login")}
                  className="underline"
                >
                  Log in again
                </button>
              )}
            </div>
          )}

          {notice && (
            <div className="flex items-center justify-between gap-3 rounded border border-gray/20 bg-dark-soft p-3 text-sm text-gray">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded border border-gray/10 bg-dark-soft">
            <div className="space-y-3 border-b border-gray/20 p-4">
              <div className="flex items-center gap-2 rounded border border-gray/20 bg-dark px-3">
                <Search size={17} className="shrink-0 text-gray" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or message..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All messages"],
                  ["unread", "Unread"],
                  ["read", "Read"],
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
            </div>

            {loading ? (
              <p className="p-10 text-center text-sm text-gray">
                Loading customer messages...
              </p>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-12 text-center">
                <Inbox size={30} className="text-gray" strokeWidth={1.3} />
                <p className="font-medium">No messages found</p>
                <p className="text-sm text-gray">
                  Messages from your customers will appear here.
                </p>
              </div>
            ) : (
              <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="divide-y divide-gray/10 lg:border-r lg:border-gray/20">
                  {filteredMessages.map((message) => (
                    <button
                      key={message._id}
                      type="button"
                      onClick={() => openMessage(message)}
                      className={`w-full p-4 text-left transition hover:bg-dark-soft2/40 ${
                        selectedId === message._id
                          ? "bg-dark-soft2/60"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            message.isRead ? "bg-gray/30" : "bg-blue-400"
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p
                              className={`truncate text-sm ${
                                message.isRead
                                  ? "font-normal text-gray"
                                  : "font-semibold text-white"
                              }`}
                            >
                              {message.name}
                            </p>
                            <span className="text-xs text-gray">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-gray">
                            {message.email}
                          </p>

                          <p className="mt-2 line-clamp-2 text-sm text-gray">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="min-w-0 p-4 md:p-5">
                  {!selectedMessage ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                      <Mail
                        size={30}
                        className="text-gray"
                        strokeWidth={1.3}
                      />
                      <p className="text-sm text-gray">
                        Select a message to read its full details.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setSelectedId(null)}
                            className="mb-3 flex items-center gap-1 text-xs text-gray hover:text-white lg:hidden"
                          >
                            <ArrowLeft size={14} />
                            Back to messages
                          </button>

                          <h2 className="break-words text-lg font-semibold">
                            {selectedMessage.name}
                          </h2>
                          <p className="mt-1 break-all text-sm text-gray">
                            {selectedMessage.email}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded px-2 py-1 text-xs ${
                            selectedMessage.isRead
                              ? "bg-dark text-gray"
                              : "bg-blue-500/10 text-blue-300"
                          }`}
                        >
                          {selectedMessage.isRead ? "Read" : "Unread"}
                        </span>
                      </div>

                      <div className="my-5 space-y-3 border-y border-gray/20 py-4 text-sm">
                        <p className="flex items-center gap-2 break-all text-gray">
                          <Mail size={15} className="shrink-0" />
                          {selectedMessage.email}
                        </p>

                        {selectedMessage.phone && (
                          <p className="flex items-center gap-2 text-gray">
                            <Phone size={15} className="shrink-0" />
                            {selectedMessage.phone}
                          </p>
                        )}

                        <p className="flex items-center gap-2 text-gray">
                          <CalendarDays size={15} className="shrink-0" />
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>

                      <h3 className="text-sm font-medium">Message</h3>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray">
                        {selectedMessage.message}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="flex items-center gap-2 rounded bg-white px-3 py-2 text-sm text-black transition hover:bg-gray-200"
                        >
                          <Mail size={15} />
                          Reply by email
                        </a>

                        <button
                          type="button"
                          disabled={Boolean(busyId)}
                          onClick={() => toggleRead(selectedMessage)}
                          className="flex items-center gap-2 rounded border border-gray/20 px-3 py-2 text-sm text-gray transition hover:border-white hover:text-white disabled:opacity-50"
                        >
                          {selectedMessage.isRead ? (
                            <MailOpen size={15} />
                          ) : (
                            <Mail size={15} />
                          )}
                          {selectedMessage.isRead
                            ? "Already read"
                            : "Mark as read"}
                        </button>

                        <button
                          type="button"
                          disabled={Boolean(busyId)}
                          onClick={() => deleteMessage(selectedMessage)}
                          className="flex items-center gap-2 rounded border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </section>
  );
}

export default Messages;
