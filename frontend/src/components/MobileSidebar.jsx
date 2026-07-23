"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function MobileSidebar({ open, onClose, children }) {
  const sidebarRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement;

    requestAnimationFrame(() => {
      sidebarRef.current?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable =
        sidebarRef.current?.querySelectorAll(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ) || [];

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocusRef.current?.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            id="mobile-sidebar"
            ref={sidebarRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            tabIndex={-1}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
            }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-bg-panel shadow-2xl outline-none md:hidden",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              title="Close menu"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-zinc-300 transition-colors hover:bg-bg-card hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X
                size={18}
                aria-hidden="true"
              />
            </button>

            <nav
              aria-label="Primary mobile navigation"
              className="h-full"
            >
              {children}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export { MobileSidebar };