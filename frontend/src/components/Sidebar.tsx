"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Activity, BarChart3, Settings, Shield,
} from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/workers", label: "Workers", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={cn(
      mobile ? "flex w-full flex-col" : "hidden w-60 shrink-0 border-r border-border bg-bg-panel md:flex md:flex-col"
    )}>
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
          <Shield size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-100">AI-Intelliview</div>
          <div className="text-[10px] uppercase tracking-wider text-muted">Orchestrator</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-accent/15 text-accent-light"
                  : "text-zinc-400 hover:bg-bg-card hover:text-zinc-100"
              )}
            >
              <it.icon size={16} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4 text-[10px] text-muted">
        v0.2.0 · © Mukta Redij
      </div>
    </aside>
  );
}
