"use client";

import { useAppStore } from "@/lib/store";
import { useThemeStore } from "@/lib/theme";
import { useEffect, useState } from "react";
import {
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  Monitor,
  Search,
  Keyboard,
  Radio,
  Lock,
} from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import { Tooltip } from "@/components/Tooltip";
import { useWebSocket } from "@/hooks/useWebSocket";

function Topbar() {
  const { token, setToken } = useAppStore();

  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycle);

  const setMobile = useUIStore((s) => s.setMobileSidebar);

  const [draft, setDraft] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setDraft(token || "");
  }, [token]);

  const { connected } = useWebSocket({
    path: "/monitoring/ws/metrics",
    enabled: !!token,
  });

  const ThemeIcon =
    theme === "dark"
      ? Moon
      : theme === "light"
      ? Sun
      : Monitor;

  const themeLabel =
    theme === "dark"
      ? "Dark"
      : theme === "light"
      ? "Light"
      : "System";

  return (
    <header
      role="banner"
      aria-label="Application header"
      className="flex h-14 items-center justify-between border-b border-border bg-bg-panel px-4 md:px-5"
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">

        {/* Mobile Navigation Button */}
        <button
          type="button"
          onClick={() => setMobile(true)}
          aria-label="Open navigation menu"
          aria-controls="mobile-sidebar"
          className="inline-flex items-center justify-center rounded-md border border-transparent p-2 text-zinc-300 transition-colors duration-200 hover:bg-bg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel md:hidden"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-command-palette"))
          }
          aria-label="Open search"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 transition-colors duration-200 hover:border-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
        >
          <Search size={14} aria-hidden="true" />

          <span className="hidden sm:inline">
            Search…
          </span>

          <kbd
            className="hidden rounded border border-border bg-bg-panel px-1 text-[10px] sm:inline"
            aria-hidden="true"
          >
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">        {/* Connection Status */}
        <Tooltip
          content={
            connected
              ? "Live updates connected"
              : "Live updates disconnected"
          }
        >
          <div
            role="status"
            aria-live="polite"
            aria-label={
              connected
                ? "Connected to live updates"
                : "Disconnected from live updates"
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300"
          >
            <Radio
              size={12}
              aria-hidden="true"
              className={
                connected
                  ? "text-green-400"
                  : "text-red-400"
              }
            />

            <span
              className={
                connected
                  ? "font-medium text-green-400"
                  : "font-medium text-red-400"
              }
            >
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip content={`Theme: ${themeLabel}`}>
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Current theme ${themeLabel}. Change theme`}
            title={`Current theme: ${themeLabel}`}
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card p-2 text-zinc-300 transition-colors duration-200 hover:bg-bg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          >
            <ThemeIcon size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Keyboard Shortcuts */}
        <Tooltip content="Keyboard shortcuts">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-shortcuts-help")
              )
            }
            aria-label="Open keyboard shortcuts"
            title="Keyboard shortcuts"
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card p-2 text-zinc-300 transition-colors duration-200 hover:bg-bg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          >
            <Keyboard size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Lock Screen */}
        <Tooltip content="Lock screen">
          <button
            type="button"
            aria-label="Lock application"
            title="Lock screen"
            onClick={() => {
              localStorage.setItem(
                "intelliview_screen_lock",
                "locked"
              );
              window.location.reload();
            }}
            className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card p-2 text-zinc-300 transition-colors duration-200 hover:bg-bg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          >
            <Lock size={15} aria-hidden="true" />
          </button>
        </Tooltip>        {/* API Token */}
        {showForm ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setToken(draft.trim() || null);
              setShowForm(false);
            }}
            className="flex items-center gap-2"
            aria-label="API token form"
          >
            <label htmlFor="api-token" className="sr-only">
              API Token
            </label>

            <input
              id="api-token"
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="API Token"
              autoComplete="off"
              aria-label="API Token"
              className="rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
            />

            <button
              type="submit"
              aria-label="Save API Token"
              className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Cancel API Token"
              className="inline-flex items-center justify-center rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 transition-colors duration-200 hover:bg-bg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
            >
              Cancel
            </button>
          </form>
        ) : token ? (
          <button
            type="button"
            onClick={() => setToken(null)}
            aria-label="Sign out"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 transition-colors duration-200 hover:border-red-500 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          >
            <LogOut size={14} aria-hidden="true" />

            <span className="hidden sm:inline">
              Sign Out
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            aria-label="Set API Token"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          >
            <LogIn size={14} aria-hidden="true" />

            <span className="hidden sm:inline">
              Set API Token
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

export { Topbar };