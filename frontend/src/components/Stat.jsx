"use client";

import { memo, useId } from "react";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  hint,
  trend,
  icon,
  className,
}) {
  const labelId = useId();
  const hintId = useId();

  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-zinc-300";

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-bg-panel p-5",
        className
      )}
      aria-labelledby={labelId}
      aria-describedby={hint ? hintId : undefined}
    >
      <div className="flex items-center justify-between">
        <h3
          id={labelId}
          className="text-xs uppercase tracking-wide text-zinc-300"
        >
          {label}
        </h3>

        {icon && (
          <span
            className="text-zinc-300"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <div
        className="mt-2 text-2xl font-semibold text-zinc-50"
        role="status"
        aria-live="polite"
      >
        {value}
      </div>

      {hint && (
        <div
          id={hintId}
          className={cn("mt-1 text-xs", trendColor)}
        >
          {hint}
        </div>
      )}
    </section>
  );
}

export default memo(Stat);