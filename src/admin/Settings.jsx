import React from "react";
import {
  Settings as SettingsIcon,
  Bell,
  ShieldCheck,
  Monitor,
  Save,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";

const STORAGE_KEY = "vandaluxe_admin_preferences";

const DEFAULT_SETTINGS = {
  compactView: false,
  confirmDelete: true,
  showUnreadNotifications: true,
};

function getAdminToken() {
  return (
    sessionStorage.getItem("vandaluxe_admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function Settings() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch {
      setError("Unable to load saved preferences. Default settings are active.");
    }
  }, []);

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
    setError("");
  }

  function saveSettings(event) {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setError("");
    } catch {
      setSaved(false);
      setError(
        "Your browser could not save these preferences. Check available storage and try again."
      );
    }
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
    setError("");
  }

  const token = getAdminToken();

  return (
    <section className="min-h-screen overflow-x-hidden bg-dark text-white lg:pl-[200px]">
      <SideBar isOpen={isSidebarOpen} />

      <div className="min-w-0">
        <AdminHeader
          pageName="Settings"
          onMenuClick={() => setIsSidebarOpen((previous) => !previous)}
        />

        <main className="space-y-5 bg-dark p-4 md:p-5">
          <div>
            <h1 className="text-xl font-semibold">Admin Settings</h1>
            <p className="mt-1 text-sm text-gray">
              Manage your dashboard preferences and session information.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {saved && (
            <div
              role="status"
              className="rounded border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-300"
            >
              Your browser preferences have been saved.
            </div>
          )}

          <section className="rounded border border-gray/10 bg-dark-soft">
            <div className="flex items-center gap-3 border-b border-gray/20 p-4">
              <div className="rounded bg-dark p-2 text-gray">
                <Monitor size={19} strokeWidth={1.5} />
              </div>

              <div>
                <h2 className="font-semibold">Dashboard appearance</h2>
                <p className="mt-1 text-xs text-gray">
                  Personal display preferences for this browser.
                </p>
              </div>
            </div>

            <form onSubmit={saveSettings}>
              <div className="divide-y divide-gray/10">
                <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">Compact display</p>
                    <p className="mt-1 text-xs text-gray">
                      Save your preference for a more compact admin interface.
                      This setting is stored but won't change page layouts until
                      the pages are connected to it.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.compactView}
                    onChange={(event) =>
                      updateSetting("compactView", event.target.checked)
                    }
                    className="h-4 w-4 shrink-0 accent-white"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 border-t border-gray/20 p-4">
                <div className="rounded bg-dark p-2 text-gray">
                  <ShieldCheck size={19} strokeWidth={1.5} />
                </div>

                <div>
                  <h2 className="font-semibold">Security and actions</h2>
                  <p className="mt-1 text-xs text-gray">
                    Confirmation preferences for administrative actions.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray/10">
                <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Confirm before deleting
                    </p>
                    <p className="mt-1 text-xs text-gray">
                      Preference for confirmation dialogs before destructive
                      actions. Individual pages must use this preference for it
                      to affect their behavior.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.confirmDelete}
                    onChange={(event) =>
                      updateSetting("confirmDelete", event.target.checked)
                    }
                    className="h-4 w-4 shrink-0 accent-white"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 border-t border-gray/20 p-4">
                <div className="rounded bg-dark p-2 text-gray">
                  <Bell size={19} strokeWidth={1.5} />
                </div>

                <div>
                  <h2 className="font-semibold">Notification preferences</h2>
                  <p className="mt-1 text-xs text-gray">
                    Choose how unread-message indicators should be handled.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray/10">
                <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Show unread notifications
                    </p>
                    <p className="mt-1 text-xs text-gray">
                      Preference for displaying unread notification indicators.
                      The notifications page must be connected to this setting
                      for it to change its behavior.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.showUnreadNotifications}
                    onChange={(event) =>
                      updateSetting(
                        "showUnreadNotifications",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 shrink-0 accent-white"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray/20 p-4">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="flex items-center gap-2 rounded border border-gray/20 px-3 py-2 text-sm text-gray transition hover:border-white hover:text-white"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  <Save size={15} />
                  Save preferences
                </button>
              </div>
            </form>
          </section>

          <section className="rounded border border-gray/10 bg-dark-soft p-4">
            <div className="flex items-center gap-3">
              <div className="rounded bg-dark p-2 text-gray">
                <ShieldCheck size={19} strokeWidth={1.5} />
              </div>

              <div>
                <h2 className="font-semibold">Admin session</h2>
                <p className="mt-1 text-sm text-gray">
                  Your current browser authentication status.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded border border-gray/20 bg-dark p-3">
              <div>
                <p className="text-sm font-medium">Authentication token</p>
                <p className="mt-1 text-xs text-gray">
                  {token
                    ? "A token is present in browser storage."
                    : "No admin token was found in browser storage."}
                </p>
              </div>

              <span
                className={`rounded px-2 py-1 text-xs ${
                  token
                    ? "bg-green-500/10 text-green-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                {token ? "Token present" : "Not found"}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray">
              A stored token does not guarantee that your session is valid.
              Your backend verifies it when protected endpoints are accessed.
            </p>

            {!token && (
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="mt-4 flex items-center gap-2 rounded border border-gray/20 px-3 py-2 text-sm text-gray transition hover:border-white hover:text-white"
              >
                Go to admin login
                <ExternalLink size={15} />
              </button>
            )}
          </section>

          <p className="text-xs text-gray">
            Preferences are saved in this browser only. Store-wide settings,
            profile editing, password changes, and persistent notification
            delivery are not connected to a backend settings API yet.
          </p>
        </main>
      </div>
    </section>
  );
}

export default Settings;