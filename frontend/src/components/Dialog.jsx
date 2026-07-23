"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function Dialog({ open, onOpenChange, children }) {
  const containerRef = useRef(null);
  const previousActiveRef = useRef(null);

  const reduceMotion = useReducedMotion();
  const dialogTitleId = useId();

  useEffect(() => {
    if (!open) return;

    previousActiveRef.current = document.activeElement;

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const focusables =
        containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);

      const firstFocusable =
        focusables && focusables.length > 0
          ? focusables[0]
          : containerRef.current;

      firstFocusable?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }

      if (e.key !== "Tab") return;

      const elements = Array.from(
        containerRef.current.querySelectorAll(
          FOCUSABLE_SELECTOR
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (elements.length === 0) {
        e.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (
          document.activeElement === first ||
          !containerRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (
          document.activeElement === last ||
          !containerRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";

      previousActiveRef.current?.focus?.();
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          tabIndex={-1}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm outline-none"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -20,
                    scale: 0.96,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    y: -20,
                    scale: 0.96,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="w-full"
            onClick={(e) => e.stopPropagation()}
        >
            {typeof children === "function"
              ? children(dialogTitleId)
              : children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DialogContent({
  children,
  className,
  onClose,
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-bg-panel shadow-2xl",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          title="Close dialog"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-zinc-300 transition-colors hover:bg-bg-card hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X
            size={18}
            aria-hidden="true"
          />
        </button>
      )}

      {children}
    </div>
  );
}

function DialogTitle({
  children,
  className,
  id,
}) {
  return (
    <h2
      id={id}
      className={cn(
        "text-base font-semibold text-zinc-100",
        className
      )}
    >
      {children}
    </h2>
  );
}

export {
  Dialog,
  DialogContent,
  DialogTitle,
};