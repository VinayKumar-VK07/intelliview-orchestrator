"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  id = "search-input",
}) {
  return (
    <div
      className={cn("relative", className)}
      role="search"
      aria-label="Search"
    >
      <label
        htmlFor={id}
        className="sr-only"
      >
        Search
      </label>

      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
      />

      <input
        id={id}
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        aria-describedby={`${id}-description`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="search"
        className={cn(
          "w-full rounded-md border border-border",
          "bg-bg-card py-2 pl-10 pr-3",
          "text-sm text-zinc-100",
          "placeholder:text-zinc-400",
          "transition-all duration-200",
          "focus:border-accent",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-accent",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-bg"
        )}
      />

      <span
        id={`${id}-description`}
        className="sr-only"
      >
        Type to search results.
      </span>
    </div>
  );
}

export { SearchInput };