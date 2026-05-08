import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RefreshCw, History, Heart } from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

type ResultState = {
  score: number;
  category: string;
  advice: string;
};

function getScoreColor(score: number): string {
  if (score < 35) return "#22c55e"; // green
  if (score < 65) return "#fca120"; // yellow/orange
  return "#ef4444"; // red
}

function getScoreLabel(category: string): string {
  return category;
}

function CircularProgress({
  score,
  color,
}: {
  score: number;
  color: string;
}) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (circleRef.current) {
            circleRef.current.style.transition =
              "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
            circleRef.current.style.strokeDashoffset =
              String(strokeDashoffset);
          }
        });
      });
    }
  }, [score, strokeDashoffset, circumference]);

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#e8f0fe"
          strokeWidth="12"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-xs text-slate-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function ResultPage() {
  const router = useRouter();
  const state = router.state.location.state as unknown as ResultState | undefined;

  // Fallback if no state (e.g. direct navigation)
  const score = state?.score ?? 0;
  const category = state?.category ?? "Unknown";
  const advice = state?.advice ?? "No advice available.";

  const color = getScoreColor(score);

  // Parse advice into bullet list if separated by periods or newlines
  const adviceItems = advice
    .split(/(?<=[.!?])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-hero">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        {/* Card */}
        <div
          className="w-full max-w-lg bg-white rounded-3xl shadow-card border border-slate-100 px-10 py-12 flex flex-col items-center gap-6"
          style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) both" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#f0f7ff] border border-[#d6e8ff] px-4 py-1.5 rounded-full text-xs font-medium text-[#006bd6]">
            <span className="text-[#fca120]">✨</span>
            Result of stress analysis
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-tight">
            Your stress level is{" "}
            <span style={{ color }}>{getScoreLabel(category)}</span>
          </h1>

          {/* Circular Progress */}
          <CircularProgress score={score} color={color} />

          {/* Summary line */}
          <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed">
            {score < 35
              ? "You're doing great! Keep up the healthy habits."
              : score < 65
                ? "You're carrying some weight. A few gentle steps can ease the day."
                : "Your stress is elevated. Please consider reaching out for support."}
          </p>

          {/* Suggestions Box */}
          <div className="w-full bg-[#f5f9ff] border border-[#dbeafe] rounded-2xl px-6 py-5 space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#fca120]" />
              <span className="text-sm font-semibold text-[#006bd6]">
                Gentle suggestions
              </span>
            </div>
            <ul className="space-y-2">
              {adviceItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-0.5 text-[#fca120] shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full justify-center mt-2">
            <Link
              to="/measurement"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#128cfc] hover:bg-[#006bd6] text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Check again
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#d6e8ff] text-[#006bd6] text-sm font-medium hover:bg-[#f0f7ff] transition-all duration-200"
            >
              <History className="w-4 h-4" />
              View history
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
