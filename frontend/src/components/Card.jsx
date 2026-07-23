"use client";

import { memo, useId } from "react";
import { cn } from "@/lib/utils";

function Card({
  children,
  title,
  description,
  action,
  className,
}) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-bg-panel shadow-sm",
        className
      )}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {title && (
              <h3
                id={titleId}
                className="text-sm font-semibold text-zinc-100"
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                id={descriptionId}
                className="mt-0.5 text-xs text-zinc-300"
              >
                {description}
              </p>
            )}
          </div>

          {action}
        </header>
      )}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

export default memo(Card);