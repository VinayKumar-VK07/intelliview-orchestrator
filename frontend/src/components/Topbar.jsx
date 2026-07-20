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
import { cn } from "@/lib/utils";
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
      className="flex h-14 items-center justify-between border-b border-border bg-bg-panel px-4 md:px-5"
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setMobile(true)}
          aria-label="Open navigation menu"
          aria-controls="mobile-sidebar"
          className="rounded-md p-2 text-zinc-300 hover:bg-bg-card hover:text-white focus:outline-none focus:ring-2 focus:ring-accent md:hidden"
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
          className="flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 hover:border-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
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

      {/* Right Side */}
      <div className="flex items-center gap-2">

        {/* Connection Status */}
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
            className="flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300"
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
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </Tooltip>

        {/* Theme Button */}
        <Tooltip content={`Theme : ${themeLabel}`}>
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Current theme ${themeLabel}. Change theme`}
            className="rounded-md border border-border bg-bg-card p-2 text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <ThemeIcon size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Keyboard Help */}
        <Tooltip content="Keyboard shortcuts">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-shortcuts-help")
              )
            }
            aria-label="Show keyboard shortcuts"
            className="rounded-md border border-border bg-bg-card p-2 text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Keyboard size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Lock */}
        <Tooltip content="Lock screen">
          <button
            type="button"
            aria-label="Lock screen"
            onClick={() => {
              localStorage.setItem(
                "intelliview_screen_lock",
                "locked"
              );
              window.location.reload();
            }}
            className="rounded-md border border-border bg-bg-card p-2 text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Lock size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* API Token Form */}
        {showForm ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setToken(draft.trim() || null);
              setShowForm(false);
            }}
            className="flex items-center gap-2"
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
              aria-label="API Token"
              className="rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 hover:bg-bg-panel focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Cancel
            </button>
          </form>
        ) : token ? (
          <button
            type="button"
            onClick={() => setToken(null)}
            aria-label="Sign out"
            className="flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-zinc-300 hover:border-red-500 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
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