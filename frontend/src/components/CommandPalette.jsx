"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Users,
  BarChart3,
  Settings,
  Search,
  Play,
  RefreshCcw,
  Trash2,
  Zap,
  Video,
  UserCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/Dialog";

const NAV_ITEMS = [
  { id: "nav:overview", label: "Overview", icon: LayoutDashboard, action: "/" },
  { id: "nav:interview", label: "Interview", icon: Video, action: "/interview" },
  { id: "nav:sessions", label: "Sessions", icon: Activity, action: "/sessions" },
  { id: "nav:candidates", label: "Candidates", icon: UserCircle, action: "/candidates" },
  { id: "nav:workers", label: "Workers", icon: Users, action: "/workers" },
  { id: "nav:analytics", label: "Analytics", icon: BarChart3, action: "/analytics" },
  { id: "nav:settings", label: "Settings", icon: Settings, action: "/settings" },
];

const ACTIONS = [
  { id: "act:start", label: "Start new interview", icon: Play, action: "start" },
  { id: "act:live", label: "Start live interview", icon: Video, action: "live-interview" },
  { id: "act:refresh", label: "Refresh all data", icon: RefreshCcw, action: "refresh" },
  { id: "act:detect", label: "Run failure detection", icon: Zap, action: "detect" },
  { id: "act:clear", label: "Clear session cache", icon: Trash2, action: "clear-cache" },
];

export function CommandPalette({
  open,
  onOpenChange,
  onAction,
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  function handleSelect(id) {
    const nav = NAV_ITEMS.find((n) => n.id === id);

    if (nav) {
      router.push(nav.action);
      onOpenChange(false);
      return;
    }

    const act = ACTIONS.find((a) => a.id === id);

    if (act) {
      onAction?.(act.action);
      onOpenChange(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <DialogTitle className="sr-only">
          Command Palette
        </DialogTitle>

        <Command
          label="Command Palette"
          className="bg-bg-panel"
        >
          {/* Search */}

          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search
              size={16}
              aria-hidden="true"
              className="text-zinc-400"
            />

            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              aria-label="Search commands"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
            />

            <kbd
              aria-hidden="true"
              className="rounded border border-border bg-bg-card px-1.5 py-0.5 text-[10px] text-zinc-400"
            >
              ESC
            </kbd>
          </div>

          {/* Results */}

          <Command.List
            className="max-h-80 overflow-y-auto p-2"
            aria-label="Command results"
          >
            <Command.Empty className="px-3 py-6 text-center text-sm text-zinc-400">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className="text-xs uppercase tracking-wide text-zinc-400"
            >
              {NAV_ITEMS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item.id)}
                  aria-label={item.label}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-200 transition-colors aria-selected:bg-accent aria-selected:text-white focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <item.icon
                    size={16}
                    aria-hidden="true"
                  />

                  <span>{item.label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-border" />

            <Command.Group
              heading="Actions"
              className="text-xs uppercase tracking-wide text-zinc-400"
            >
              {ACTIONS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item.id)}
                  aria-label={item.label}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-200 transition-colors aria-selected:bg-accent aria-selected:text-white focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <item.icon
                    size={16}
                    aria-hidden="true"
                  />

                  <span>{item.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}

          <footer className="flex items-center justify-between border-t border-border bg-bg-card/60 px-4 py-2 text-[10px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg-card px-1">
                  ↑↓
                </kbd>
                navigate
              </span>

              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-bg-card px-1">
                  ↵
                </kbd>
                select
              </span>
            </div>

            <span>Powered by cmdk</span>
          </footer>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;