import { createFileRoute, useRouter, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { RefreshCw, History, Heart, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import testHistory from "@/lib/testHistory.json";

export const Route = createFileRoute("/result")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || undefined,
    };
  },
  component: ResultPage,
});

type ResultState = {
  score: number;
  category: string;
  advice: string;
};

function getScoreColor(score: number): string {
  if (score < 35) return "#22c55e";
  if (score < 65) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(category: string): string {
  return category;
}

function CircularProgress({ score, color }: { score: number; color: string }) {
  const radius = 60;
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
              "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
            circleRef.current.style.strokeDashoffset = String(strokeDashoffset);
          }
        });
      });
    }
  }, [score, strokeDashoffset, circumference]);

  return (
    <div className="relative flex items-center justify-center w-44 h-44">
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        {/* Track */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-100"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground font-medium mt-1">/ 100</span>
      </div>
    </div>
  );
}

function ResultPage() {
  const router = useRouter();
  const { id } = useSearch({ from: "/result" });
  const state = router.state.location.state as unknown as ResultState | undefined;

  // Fetch history if ID is provided and state is missing
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["history", id],
    queryFn: async () => {
      const res = await api.get("/chatbot/history");
      return res.data.find((item: any) => item.id === id);
    },
    enabled: !!id && !state,
  });

  const testItem = testHistory.data[0];
  const finalResult =
    state ||
    (historyData
      ? {
          score: historyData.score,
          category: historyData.category,
          advice: historyData.advice,
        }
      : (!id || id === "test" || testHistory.data.some((item: any) => item.id === id) 
          ? {
              score: testHistory.data.find((item: any) => item.id === id)?.score || testItem.score,
              category: testHistory.data.find((item: any) => item.id === id)?.category || testItem.category,
              advice: testHistory.data.find((item: any) => item.id === id)?.advice || testItem.advice,
            }
          : null));


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading historical record...</p>
      </div>
    );
  }

  if (!finalResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">No Result Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the measurement details you're looking for.
        </p>
        <Button asChild variant="hero">
          <Link to="/measurement">Take a new test</Link>
        </Button>
      </div>
    );
  }

  const { score, category, advice } = finalResult;
  const color = getScoreColor(score);

  const safeAdvice = advice || "We couldn't generate specific advice for this measurement.";
  const adviceItems = safeAdvice
    .split(/(?<=[.!?])\s+|\n/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-sky-50/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="blob blob-blue animate-blob w-96 h-96 -top-48 -right-48 opacity-25" />
      <div className="blob blob-yellow animate-blob-delay-2 w-80 h-80 bottom-0 -left-40 opacity-20" />
      <div className="blob blob-green animate-blob-delay-4 w-56 h-56 top-1/3 left-1/4 opacity-15" />

      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-lg glass rounded-3xl shadow-card border border-slate-200/60 px-10 py-12 flex flex-col items-center gap-7 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/15 px-4 py-1.5 rounded-full text-xs font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5 text-accent-bright" />
            Stress Analysis Result
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            Your stress level is <span style={{ color }}>{getScoreLabel(category)}</span>
          </h1>

          {/* Circular Progress */}
          <CircularProgress score={score} color={color} />

          {/* Summary line */}
          <p className="text-muted-foreground text-sm text-center max-w-xs leading-relaxed">
            {score < 35
              ? "You're doing great! Keep up the healthy habits. 🌿"
              : score < 65
                ? "You're carrying some weight. A few gentle steps can ease the day. 🌤️"
                : "Your stress is elevated. Please consider reaching out for support. 💙"}
          </p>

          {/* Suggestions Box */}
          <div className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-6 py-5 space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent-bright" />
              <span className="text-sm font-semibold text-primary">Gentle suggestions</span>
            </div>
            <ul className="space-y-2">
              {adviceItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-accent-bright shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full justify-center mt-2">
            <Link
              to="/measurement"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-soft active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Check again
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-all duration-200 active:scale-[0.98]"
            >
              <History className="w-4 h-4" />
              View history
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
