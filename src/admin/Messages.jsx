
import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  Search,
  Clock,
  UserRound,
  Phone,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function getAdminToken() {
  return (
    sessionStorage.getItem("adminToken") ||
    sessionStorage.getItem("admin_token") ||
    sessionStorage.getItem("token")
  );
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getErrorMessage(result, fallback) {
  return result?.message || result?.error || fallback;
}

async function parseResponse(response) {
  return response.json().catch(() => ({}));
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const selectedMessage =
    messages.find((item) => item._id === selectedId) || null;

  const unreadCount = messages.filter(
    (item) => !item.isRead
  ).length;

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error(
          "Admin token not found. Sign in again to view messages."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await parseResponse(response);

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session may have expired. Sign in again."
        );
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to load messages.")
        );
      }

      const list = Array.isArray(result.data) ? result.data : [];

      setMessages(list);

      setSelectedId((currentId) => {
        if (currentId && list.some((item) => item._id === currentId)) {
          return currentId;
        }

        return list[0]?._id ?? null;
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const markAsRead = async (message) => {
    if (message.isRead || actionLoading) return;

    setError("");

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/messages/${message._id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Could not mark message as read.")
        );
      }

      setMessages((current) =>
        current.map((item) =>
          item._id === message._id
            ? {
                ...item,
                ...(result.data || {}),
                isRead: true,
                readAt:
                  result.data?.readAt || new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Could not update message.");
    }
  };

  const selectMessage = (message) => {
    setSelectedId(message._id);
    setNotice("");
    markAsRead(message);
  };

  const deleteSelected = async () => {
    if (!selectedMessage || actionLoading) return;

    const confirmed = window.confirm(
      "Delete this message permanently?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/messages/${selectedMessage._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Could not delete message.")
        );
      }

      const deletedId = selectedMessage._id;

      setMessages((current) => {
        const remaining = current.filter(
          (item) => item._id !== deletedId
        );

        setSelectedId((currentSelectedId) =>
          currentSelectedId === deletedId
            ? remaining[0]?._id ?? null
            : currentSelectedId
        );

        return remaining;
      });

      setNotice("Message deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete message.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const term = search.trim().toLowerCase();

    const searchableFields = [
      message.name,
      message.email,
      message.phone,
      message.message,
    ];

    const matchesSearch =
      !term ||
      searchableFields.some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !message.isRead) ||
      (filter === "read" && message.isRead);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-white p-4 text-neutral-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Customer support
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Messages
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              View and manage messages sent through your contact page.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Total messages</p>
            <p className="mt-2 text-3xl font-semibold">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Unread</p>
            <p className="mt-2 text-3xl font-semibold">
              {unreadCount}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-neutral-200 p-4 sm:col-span-1">
            <p className="text-sm text-neutral-500">Read</p>
            <p className="mt-2 text-3xl font-semibold">
              {messages.length - unreadCount}
            </p>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <p role="status" className="mb-4 text-sm text-neutral-600">
            {notice}
          </p>
        )}

        <section className="grid min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.4fr)]">
          <div className="border-b border-neutral-200 lg:border-b-0 lg:border-r">
            <div className="space-y-3 border-b border-neutral-200 p-4">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3">
                <Search
                  size={17}
                  className="shrink-0 text-neutral-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages..."
                  aria-label="Search messages"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <div className="flex gap-2">
                {["all", "unread", "read"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                      filter === value
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {loading && messages.length === 0 ? (
                <p className="p-6 text-sm text-neutral-500">
                  Loading messages...
                </p>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare
                    size={28}
                    className="mx-auto mb-3 text-neutral-300"
                  />

                  <p className="text-sm font-medium">
                    No messages found
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    New contact form submissions will appear here.
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <button
                    type="button"
                    key={message._id}
                    onClick={() => selectMessage(message)}
                    aria-pressed={selectedId === message._id}
                    className={`block w-full border-b border-neutral-100 p-4 text-left transition hover:bg-neutral-50 ${
                      selectedId === message._id
                        ? "bg-neutral-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                        {message.isRead ? (
                          <MailOpen
                            size={17}
                            className="text-neutral-500"
                          />
                        ) : (
                          <Mail size={17} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {message.name || "Unknown sender"}
                          </p>

                          {!message.isRead && (
                            <span
                              className="mt-1 size-2 shrink-0 rounded-full bg-blue-600"
                              aria-label="Unread"
                            />
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {message.email || "No email provided"}
                        </p>

                        <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-neutral-600">
                          {message.message || "No message content"}
                        </p>

                        <p className="mt-3 text-xs text-neutral-400">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">
            {!selectedMessage ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <Mail
                  size={32}
                  className="mb-3 text-neutral-300"
                />

                <p className="font-medium">Select a message</p>

                <p className="mt-1 text-sm text-neutral-500">
                  Choose a message from the list to read it.
                </p>
              </div>
            ) : (
              <article>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 pb-5">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedMessage.isRead
                          ? "bg-neutral-100 text-neutral-600"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {selectedMessage.isRead ? "Read" : "Unread"}
                    </span>

                    <h2 className="mt-4 text-2xl font-semibold">
                      Message details
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                      <Clock size={15} />
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {actionLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="space-y-5 py-6">
                  <div className="flex items-start gap-3">
                    <UserRound
                      size={18}
                      className="mt-0.5 text-neutral-400"
                    />

                    <div>
                      <p className="text-xs text-neutral-500">
                        Full name
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedMessage.name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 text-neutral-400"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">
                        Email address
                      </p>

                      <a
                        href={`mailto:${selectedMessage.email || ""}`}
                        className="mt-1 block break-all text-sm underline underline-offset-4"
                      >
                        {selectedMessage.email || "Not provided"}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={18}
                        className="mt-0.5 text-neutral-400"
                      />

                      <div>
                        <p className="text-xs text-neutral-500">
                          Phone number
                        </p>

                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="mt-1 block text-sm underline underline-offset-4"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-neutral-200 pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Message
                    </p>

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700">
                      {selectedMessage.message || "No message content"}
                    </p>
                  </div>
                </div>

                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      "Re: Your message to Vandaluxe"
                    )}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                  >
                    Reply by email
                    <ExternalLink size={15} />
                  </a>
                )}
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
