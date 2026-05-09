"use client";
import { useAppStore } from "@/lib/store";
import { useThemeStore } from "@/lib/theme";
import { useEffect, useState, useRef } from "react";
import { LogIn, LogOut, Menu, Moon, Sun, Monitor, Search, Keyboard, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";
import { Tooltip } from "@/components/Tooltip";
import { useWebSocket } from "@/hooks/useWebSocket";

export function Topbar() {
  const { token, setToken } = useAppStore();
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycle);
  const setMobile = useUIStore((s) => s.setMobileSidebar);
  const [draft, setDraft] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => { setDraft(token || ""); }, [token]);

  // Listen for custom events from providers to open palette/help
  useEffect(() => {
    const onPalette = () => setPaletteOpen(true);
    const onHelp = () => setHelpOpen(true);
    window.addEventListener("open-command-palette", onPalette);
    window.addEventListener("open-shortcuts-help", onHelp);
    return () => {
      window.removeEventListener("open-command-palette", onPalette);
      window.removeEventListener("open-shortcuts-help", onHelp);
    };
  }, []);

  const { connected } = useWebSocket({ path: "/monitoring/ws/metrics", enabled: !!token });

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-bg-panel px-4 md:px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobile(true)}
          className="rounded-md p-1.5 text-zinc-400 hover:bg-bg-card hover:text-zinc-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-zinc-200"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search…</span>
          <kbd className="hidden rounded border border-border bg-bg-panel px-1 text-[10px] sm:inline">⌘K</kbd>
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <Tooltip content={connected ? "Live updates connected" : "Live updates disconnected"}>
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-bg-card px-2.5 py-1.5 text-[10px] text-muted">
            <Radio size={11} className={connected ? "text-emerald-400" : "text-muted"} />
            <span className={cn("hidden sm:inline", connected && "text-emerald-400")}>
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </Tooltip>
        <Tooltip content={`Theme: ${themeLabel} (click to cycle)`}>
          <button
            onClick={cycleTheme}
            className="rounded-md border border-border bg-bg-card p-1.5 text-muted hover:text-zinc-200"
            aria-label="Toggle theme"
          >
            <ThemeIcon size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Keyboard shortcuts (?)">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-shortcuts-help"))}
            className="rounded-md border border-border bg-bg-card p-1.5 text-muted hover:text-zinc-200"
            aria-label="Show shortcuts"
          >
            <Keyboard size={14} />
          </button>
        </Tooltip>
        {showForm ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setToken(draft.trim() || null);
              setShowForm(false);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="API token"
              className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-xs text-zinc-100 placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-dark">
              Save
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-xs text-zinc-300 hover:bg-bg-panel">
              Cancel
            </button>
          </form>
        ) : token ? (
          <button
            onClick={() => setToken(null)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border border-border bg-bg-card px-3 py-1.5 text-xs text-zinc-300",
              "hover:border-rose-500/40 hover:text-rose-300"
            )}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-dark"
          >
            <LogIn size={14} />
            <span className="hidden sm:inline">Set API token</span>
          </button>
        )}
      </div>
    </header>
  );
}
