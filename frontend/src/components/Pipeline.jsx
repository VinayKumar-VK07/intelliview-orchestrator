"use client";

import { memo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Film,
  Mic,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    status: "QUEUED",
    label: "Queued",
    icon: Clock,
  },
  {
    status: "VIDEO_PROCESSING",
    label: "Video",
    icon: Film,
  },
  {
    status: "AUDIO_PROCESSING",
    label: "Audio",
    icon: Mic,
  },
  {
    status: "EVALUATING",
    label: "Evaluate",
    icon: BarChart3,
  },
  {
    status: "COMPLETED",
    label: "Done",
    icon: CheckCircle2,
  },
];

function stageIndex(status) {
  switch (status) {
    case "CREATED":
      return -1;
    case "QUEUED":
      return 0;
    case "VIDEO_PROCESSING":
    case "PROCESSING":
      return 1;
    case "AUDIO_PROCESSING":
      return 2;
    case "EVALUATING":
      return 3;
    case "COMPLETED":
      return 4;
    default:
      return -2;
  }
}

function Pipeline({ current, className }) {
  const currentIndex = stageIndex(current);

  const isFailed =
    current === "FAILED" ||
    current === "TIMEOUT" ||
    current === "CANCELLED";

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="list"
      aria-label="Interview processing pipeline"
    >
      {STAGES.map((stage, index) => {
        const reached = index <= currentIndex;
        const active = index === currentIndex && !isFailed;
        const failedStage = isFailed && index === currentIndex;

        const Icon = failedStage
          ? AlertCircle
          : active
          ? Loader2
          : stage.icon;

        let stageStatus = "Pending";

        if (failedStage) {
          stageStatus = "Failed";
        } else if (active) {
          stageStatus = "In progress";
        } else if (reached) {
          stageStatus = "Completed";
        }

        return (
          <div
            key={stage.status}
            className="flex items-center gap-1.5"
            role="listitem"
            aria-current={active ? "step" : undefined}
          >
            <div
              role="img"
              aria-label={`${stage.label}: ${stageStatus}`}
              title={`${stage.label}: ${stageStatus}`}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full transition-colors",

                failedStage &&
                  "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30",

                active &&
                  "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30",

                !reached &&
                  !active &&
                  !failedStage &&
                  "bg-bg-card text-muted",

                reached &&
                  !active &&
                  !failedStage &&
                  "bg-emerald-500/15 text-emerald-400"
              )}
            >
              <Icon
                size={12}
                aria-hidden="true"
                focusable="false"
                className={active ? "animate-spin" : ""}
              />
            </div>

            <span className="sr-only">
              {stage.label} — {stageStatus}
            </span>

            {index < STAGES.length - 1 && (
              <div
                aria-hidden="true"
                className={cn(
                  "h-px w-6 transition-colors",
                  index < currentIndex
                    ? "bg-emerald-500/40"
                    : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default memo(Pipeline);