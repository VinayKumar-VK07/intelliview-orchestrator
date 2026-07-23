"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
  Settings,
  Shield,
  Video,
  UserCircle,
} from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/interview", label: "Interview", icon: Video },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/candidates", label: "Candidates", icon: UserCircle },
  { href: "/workers", label: "Workers", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobile = false, onNavigate }) {
  const pathname = usePathname();
  const navRef = useRef([]);

  const handleKeyDown = (e, index) => {
    const total = items.length;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        navRef.current[(index + 1) % total]?.focus();
        break;

      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        navRef.current[(index - 1 + total) % total]?.focus();
        break;

      case "Home":
        e.preventDefault();
        navRef.current[0]?.focus();
        break;

      case "End":
        e.preventDefault();
        navRef.current[total - 1]?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <aside
      tabIndex={-1}
      className={cn(
        mobile
          ? "flex w-full flex-col"
          : "hidden w-60 shrink-0 border-r border-border bg-bg-panel md:flex md:flex-col"
      )}
      aria-label="Primary Sidebar"
    >
      {/* Logo */}

      <div
        className="flex h-14 items-center gap-2 border-b border-border px-5"
        aria-labelledby="sidebar-title"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white"
          aria-hidden="true"
        >
          <Shield size={16} />
        </div>

        <div>
          <h1
            id="sidebar-title"
            className="text-sm font-semibold text-zinc-100"
          >
            AI-Intelliview
          </h1>

          <p className="text-[10px] uppercase tracking-wider text-zinc-400">
            Orchestrator
          </p>
        </div>
      </div>

      {/* Navigation */}

      <nav
        role="navigation"
        aria-labelledby="sidebar-title"
        className="flex-1 space-y-1 p-3"
      >        {items.map((item, index) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => (navRef.current[index] = el)}
              onClick={onNavigate}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 outline-none",

                active
                  ? "bg-accent text-white shadow-md"
                  : "text-zinc-200 hover:bg-bg-card hover:text-white",

                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
              )}
            >
              <Icon
                size={18}
                aria-hidden="true"
                className="shrink-0"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}

      <footer
        id="sidebar-footer"
        aria-label="Application information"
        className="border-t border-border p-4 text-[11px] text-zinc-400"
      >
        <p>v0.2.0</p>
        <p>© Mukta Redij</p>
      </footer>
    </aside>
  );
}