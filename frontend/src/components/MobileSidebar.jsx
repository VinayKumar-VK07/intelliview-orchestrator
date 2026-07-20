"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function MobileSidebar({ open, onClose, children }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Save currently focused element
    const previousFocus = document.activeElement;

    // Focus sidebar when opened
    sidebarRef.current?.focus();

    const handleKeyDown = (e) => {
      // Close on Escape
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Trap keyboard focus inside sidebar
      if (e.key === "Tab") {
        const focusableElements = sidebarRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";

      // Restore previous focus
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            ref={sidebarRef}
            id="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
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
              "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-bg-panel shadow-2xl outline-none md:hidden"
            )}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="absolute right-3 top-3 z-10 rounded-md p-2 text-zinc-300 hover:bg-bg-card hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* Navigation Content */}
            <nav aria-label="Mobile Navigation" className="h-full">
              {children}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export { MobileSidebar };