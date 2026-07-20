"use client";

import { memo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/Dialog";
import Pipeline from "@/components/Pipeline";
import { StatusBadge, Badge } from "@/components/Badge";
import { Shimmer } from "@/components/Shimmer";
import { useAppStore } from "@/lib/store";
import { formatDate, riskColor, formatRelative } from "@/lib/utils";
import {
  Activity,
  Calendar,
  Cpu,
  Hash,
  RefreshCw,
  User,
  Film,
  Mic,
  MessageSquare,
  Clock,
} from "lucide-react";
import useSWR from "swr";
import { MomentTimeline } from "@/hooks/useMomentTracking";

function SessionDetailImpl({ sessionId, onClose }) {
  const token = useAppStore((s) => s.token);
  const open = sessionId !== null;

  const { data, error, isLoading, mutate } = useSWR(
    open && token ? `/session-status/${sessionId}` : null,
    { refreshInterval: 2000 }
  );

  const { data: momentsData } = useSWR(
    open && token ? `/moments/${sessionId}` : null,
    { refreshInterval: 5000 }
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onClose={onClose}
        className="max-w-2xl"
        aria-labelledby="session-detail-title"
        aria-describedby="session-detail-description"
      >
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle
                id="session-detail-title"
                className="focus:outline-none"
              >
                Session detail
              </DialogTitle>

              <p
                id="session-detail-description"
                className="mt-0.5 font-mono text-xs text-muted"
              >
                Session ID: {sessionId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {data && (
                <StatusBadge
                  status={data.status}
                  aria-label={`Current session status: ${data.status}`}
                />
              )}

              <button
                type="button"
                onClick={() => mutate()}
                aria-label="Refresh session details"
                title="Refresh session details"
                className="rounded-md border border-border bg-bg-card p-1.5 text-muted transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
              >
                <RefreshCw size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
            >
              Failed to load session.
            </div>
          )}

          {isLoading && !data && (
            <div
              role="status"
              aria-live="polite"
              aria-label="Loading session details"
              className="space-y-3"
            >
              <Shimmer className="h-12 w-full" />
              <Shimmer className="h-12 w-full" />
              <Shimmer className="h-20 w-full" />
            </div>
          )}

          {data && (
            <div className="space-y-5">
              <section
                aria-labelledby="pipeline-heading"
              >
                <h3
                  id="pipeline-heading"
                  className="text-xs font-medium uppercase tracking-wide text-muted"
                >
                  Pipeline
                </h3>

                <div
                  className="mt-2 rounded-md border border-border bg-bg-card p-3"
                  role="region"
                  aria-label="Interview processing pipeline"
                >
                  <Pipeline current={data.status} />
                </div>
              </section>

              <section
                aria-labelledby="session-information-heading"
              >
                <h3
                  id="session-information-heading"
                  className="sr-only"
                >
                  Session information
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Candidate"
                    value={data.candidate_id}
                    icon={User}
                  />

                  <Field
                    label="Assigned worker"
                    value={data.assigned_node ?? "—"}
                    icon={Cpu}
                  />

                  <Field
                    label="Created"
                    value={formatDate(
                      data.created_at ?? data.updated_at
                    )}
                    icon={Calendar}
                  />

                  <Field
                    label="Started"
                    value={formatRelative(data.start_time)}
                    icon={Activity}
                  />

                  <Field
                    label="Ended"
                    value={formatRelative(data.end_time)}
                    icon={Activity}
                  />

                  <Field
                    label="Risk score"
                    icon={Hash}
                    value={
                      data.risk_score != null ? (
                        <Badge
                          variant={riskColor(data.risk_score)}
                          aria-label={`Risk score ${data.risk_score.toFixed(
                            3
                          )}`}
                        >
                          {data.risk_score.toFixed(3)}
                        </Badge>
                      ) : (
                        "—"
                      )
                    }
                  />
                </div>
              </section>

              {data.video_analysis && (
                <section aria-labelledby="video-analysis-heading">
                  <h3
                    id="video-analysis-heading"
                    className="text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    Video Analysis
                  </h3>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {data.video_analysis.confidence_score != null && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Video confidence score"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Film size={10} aria-hidden="true" />
                          <span>Confidence</span>
                        </div>

                        <div className="mt-1 text-sm text-zinc-200">
                          {(
                            data.video_analysis.confidence_score * 100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    )}

                    {data.video_analysis.facial_expressions && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Detected facial expressions"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Film size={10} aria-hidden="true" />
                          <span>Expression</span>
                        </div>

                        <div className="mt-1 text-sm text-zinc-200">
                          {Object.entries(
                            data.video_analysis.facial_expressions
                          )
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([k]) => k)
                            .join(", ") || "—"}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}              {data.audio_analysis && (
                <section aria-labelledby="audio-analysis-heading">
                  <h3
                    id="audio-analysis-heading"
                    className="text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    Audio Analysis
                  </h3>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {data.audio_analysis.sentiment && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Audio sentiment"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Mic size={10} aria-hidden="true" />
                          <span>Sentiment</span>
                        </div>

                        <div className="mt-1 text-sm capitalize text-zinc-200">
                          {data.audio_analysis.sentiment}
                        </div>
                      </div>
                    )}

                    {data.audio_analysis.clarity_score != null && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Audio clarity score"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Mic size={10} aria-hidden="true" />
                          <span>Clarity</span>
                        </div>

                        <div className="mt-1 text-sm text-zinc-200">
                          {(data.audio_analysis.clarity_score * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}

                    {data.audio_analysis.speech_pace != null && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Speech pace"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Mic size={10} aria-hidden="true" />
                          <span>Speech pace</span>
                        </div>

                        <div className="mt-1 text-sm text-zinc-200">
                          {data.audio_analysis.speech_pace} wpm
                        </div>
                      </div>
                    )}

                    {data.audio_analysis.filler_words != null && (
                      <div
                        className="rounded-md border border-border bg-bg-card px-3 py-2.5"
                        role="group"
                        aria-label="Number of filler words"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                          <Mic size={10} aria-hidden="true" />
                          <span>Filler words</span>
                        </div>

                        <div className="mt-1 text-sm text-zinc-200">
                          {data.audio_analysis.filler_words}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {data.ai_feedback && (
                <section aria-labelledby="ai-feedback-heading">
                  <h3
                    id="ai-feedback-heading"
                    className="text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    AI Feedback
                  </h3>

                  <div className="mt-2 rounded-md border border-border bg-bg-card px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <MessageSquare
                        size={12}
                        className="mt-0.5 shrink-0 text-accent"
                        aria-hidden="true"
                      />

                      <p className="text-sm text-zinc-300">
                        {data.ai_feedback}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {momentsData?.moments?.length > 0 && (
                <section aria-labelledby="moment-timeline-heading">
                  <h3
                    id="moment-timeline-heading"
                    className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    <Clock size={10} aria-hidden="true" />
                    Moment Timeline
                  </h3>

                  <div
                    className="mt-2 rounded-md border border-border bg-bg-card p-3"
                    role="region"
                    aria-label="Moment timeline"
                  >
                    <MomentTimeline moments={momentsData.moments} />
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div
      className="rounded-md border border-border bg-bg-card px-3 py-2.5"
      role="group"
      aria-label={label}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
        <Icon
          size={10}
          aria-hidden="true"
          focusable="false"
        />
        <span>{label}</span>
      </div>

      <div className="mt-1 text-sm text-zinc-200">
        {value}
      </div>
    </div>
  );
}

const SessionDetail = memo(SessionDetailImpl);

export default SessionDetail;