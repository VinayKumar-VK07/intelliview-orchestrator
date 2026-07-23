"use client";

import { Shimmer } from "@/components/Shimmer";
import {
  IllustrationEmpty,
  IllustrationError,
} from "@/components/Illustrations";
import { cn } from "@/lib/utils";

function Skeleton({ className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Shimmer className={className} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-300"
    >
      <div className="flex items-center gap-3">
        <IllustrationError
          className="h-12 w-16 shrink-0"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-medium">
            Something went wrong
          </h3>

          <p className="mt-1 text-xs text-rose-300">
            {error?.message || "An unexpected error occurred."}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              aria-label="Retry loading"
              className="mt-2 rounded-md border border-rose-500/30 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-bg-panel"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  className,
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-border py-10 text-center",
        className
      )}
    >
      <IllustrationEmpty
        className="mb-3 h-20 w-32"
        aria-hidden="true"
      />

      <h3 className="text-sm font-medium text-zinc-200">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-xs text-zinc-300">
          {description}
        </p>
      )}
    </section>
  );
}

export {
  EmptyState,
  ErrorState,
  Skeleton,
};