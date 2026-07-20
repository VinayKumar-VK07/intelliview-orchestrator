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
    <div className={cn("relative", className)}>
      {/* Accessible Label */}
      <label htmlFor={id} className="sr-only">
        Search
      </label>

      {/* Search Icon */}
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
      />

      {/* Search Input */}
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
        spellCheck={false}
        className={cn(
          "w-full rounded-md border border-border",
          "bg-bg-card py-2 pl-9 pr-3",
          "text-sm text-zinc-100",
          "placeholder:text-zinc-400",
          "focus:outline-none",
          "focus:ring-2 focus:ring-accent",
          "focus:border-accent",
          "transition-colors duration-200"
        )}
      />

      {/* Screen Reader Description */}
      <span id={`${id}-description`} className="sr-only">
        Type to search results.
      </span>
    </div>
  );
}

export { SearchInput };