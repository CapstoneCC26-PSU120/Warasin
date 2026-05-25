import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Heart, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/result_/face")({
  component: FaceResultPage,
});

type EmotionProbability = {
  Angry: number;
  Disgust: number;
  Fear: number;
  Happy: number;
  Sad: number;
  Surprise: number;
};

// Emotion theme configuration for visual premium design
type EmotionTheme = {
  name: string;
  color: string;
  textColor: string;
  bgGradient: string;
  badgeBg: string;
  summaryText: string;
  suggestions: string[];
};

const EMOTION_THEMES: Record<string, EmotionTheme> = {
  Happy: {
    name: "Happy",
    color: "#22c55e",
    textColor: "text-emerald-600",
    bgGradient: "from-emerald-50 via-teal-50/20 to-sky-50/10",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    summaryText: "You are looking happy and relaxed! Cherish these moments of peace. 🌿",
    suggestions: [
      "Keep sharing your positive vibes! Call a close friend or family member to spread the joy.",
      "Engage in a favorite hobby or creative task while your motivation and energy are high.",
      "Take a moment to practice gratitude and write down three things that made you smile today.",
    ],
  },
  Surprise: {
    name: "Surprise",
    color: "#06b6d4",
    textColor: "text-cyan-600",
    bgGradient: "from-cyan-50 via-teal-50/20 to-indigo-50/10",
    badgeBg: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    summaryText: "Your expression shows a spark of surprise or excitement. Stay curious! ✨",
    suggestions: [
      "Channel this active, excited energy into trying something new or learning a fresh skill.",
      "Embrace the novelty of this feeling and keep an open mind for pleasant surprises later in the day.",
      "Write down or sketch out any fresh, spontaneous ideas that come to you right now.",
    ],
  },
  Sad: {
    name: "Sad",
    color: "#3b82f6",
    textColor: "text-blue-600",
    bgGradient: "from-blue-50 via-indigo-50/20 to-sky-50/10",
    badgeBg: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    summaryText: "You seem a bit downcast or sad. It is completely okay to feel this way. 🌤️",
    suggestions: [
      "Be extremely gentle with yourself today. Give yourself permission to slow down, rest, and recharge.",
      "Try writing in a journal or dairy to express your thoughts and ease the heavy weight in your mind.",
      "Treat yourself to a small, warm comfort like a hot cup of chamomile tea or listening to a cozy playlist.",
    ],
  },
  Disgust: {
    name: "Disgust",
    color: "#f59e0b",
    textColor: "text-amber-600",
    bgGradient: "from-amber-50 via-orange-50/20 to-rose-50/10",
    badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    summaryText:
      "There is some irritation or mild aversion in your expression. Take a brief break. 🌸",
    suggestions: [
      "Step away physically or visually from whatever object or environment is causing you discomfort.",
      "Take 5 slow, deep breaths to reset your focus and let the initial irritation wash away.",
      "Listen to some soothing instrumental or nature soundscapes to ground and center yourself.",
    ],
  },
  Fear: {
    name: "Fear",
    color: "#a855f7",
    textColor: "text-purple-600",
    bgGradient: "from-purple-50 via-pink-50/20 to-indigo-50/10",
    badgeBg: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    summaryText: "Your face carries signs of tension, worry, or anxiety. You are safe here. 💙",
    suggestions: [
      "Slow your breathing down: practice box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) to calm the nervous system.",
      "Ground yourself in the room: name 5 things you can see, 4 things you can touch, and 3 things you can hear.",
      "Remember that feelings of anxiety are temporary wave-like states that will safely pass.",
    ],
  },
  Angry: {
    name: "Angry",
    color: "#ef4444",
    textColor: "text-rose-600",
    bgGradient: "from-rose-50 via-red-50/20 to-orange-50/10",
    badgeBg: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    summaryText: "You are showing elevated physical tension or frustration. Let's release it. 🌊",
    suggestions: [
      "Let's release immediate tension: unclench your jaw, drop your shoulders, and relax your hands.",
      "Try a short, fast-paced walk or do simple physical stretches to disperse built-up adrenaline.",
      "Breathe slowly out through your mouth, visualizing a peaceful wave cooling and relaxing your body.",
    ],
  },
};

function CircularConfidence({ emotion, color }: { emotion: string; color: string }) {
  const radius = 60;

  const emojis: Record<string, string> = {
    Happy: "😊",
    Surprise: "😲",
    Sad: "😢",
    Disgust: "🤢",
    Fear: "😨",
    Angry: "😠",
  };

  const emoji = emojis[emotion] || "😊";

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        {/* Glowing solid circle with emotion's color */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}35)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl select-none filter drop-shadow-sm">{emoji}</span>
      </div>
    </div>
  );
}

function FaceResultPage() {
  const router = useRouter();
  const rawState = router.state.location.state as any;

  // Verify and unpack state robustly
  let predicted_class = "";
  let predictions_probability: EmotionProbability | undefined;

  if (rawState && typeof rawState === "object") {
    // Structure 1: Outer object (with .success and .data)
    if (rawState.data && typeof rawState.data === "object" && rawState.data.predicted_class) {
      predicted_class = rawState.data.predicted_class;
      predictions_probability = rawState.data.predictions_probability;
    }
    // Structure 2: Direct data object (with .predicted_class and .predictions_probability directly)
    else if (rawState.predicted_class) {
      predicted_class = rawState.predicted_class;
      predictions_probability = rawState.predictions_probability;
    }
  }

  if (!predicted_class || !predictions_probability) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-3 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">No Face Analysis Result</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Please upload a photo first on the measurement page to see the AI emotion analysis.
        </p>
        <Button asChild variant="hero">
          <Link to="/measurement">Start Face Check-in</Link>
        </Button>
      </div>
    );
  }
  const theme = EMOTION_THEMES[predicted_class] || EMOTION_THEMES.Happy;

  // Order other probabilities to show high to low, or standardized
  const sortedProbabilities = Object.entries(predictions_probability)
    .map(([name, val]) => ({ name, val: (val as number) * 100 }))
    .sort((a, b) => b.val - a.val);

  return (
    <div
      className={`min-h-screen flex flex-col bg-linear-to-b ${theme.bgGradient} relative overflow-hidden transition-all duration-500`}
    >
      {/* Decorative blobs */}
      <div className="blob blob-blue animate-blob w-96 h-96 -top-48 -right-48 opacity-25" />
      <div className="blob blob-yellow animate-blob-delay-2 w-80 h-80 bottom-0 -left-40 opacity-20" />
      <div className="blob blob-pink animate-blob-delay-4 w-60 h-60 top-1/3 left-1/3 opacity-15" />

      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-2xl glass rounded-3xl shadow-card border border-slate-200/60 px-6 md:px-10 py-10 md:py-12 flex flex-col items-center gap-8 animate-fade-up">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 border px-4 py-1.5 rounded-full text-xs font-semibold ${theme.badgeBg}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Face Emotion Analysis
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            You are{" "}
            <span className={`${theme.textColor} transition-colors duration-500`}>
              {theme.name}
            </span>{" "}
            now
          </h1>

          {/* Meter and Chart Row */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-2">
            {/* Left: Circular confidence */}
            <div className="flex flex-col items-center gap-2">
              <CircularConfidence emotion={predicted_class} color={theme.color} />
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Primary Emotion
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-36 bg-slate-200/70" />

            {/* Right: Breakdown list */}
            <div className="flex-1 w-full space-y-3.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Emotion Breakdown
              </h3>
              {sortedProbabilities.map(({ name, val }) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span
                      className={
                        name === predicted_class
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      {name}
                    </span>
                    <span
                      className={
                        name === predicted_class
                          ? "text-foreground font-semibold"
                          : "text-slate-400"
                      }
                    >
                      {Math.round(val)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${val}%`,
                        backgroundColor: name === predicted_class ? theme.color : "#94a3b8",
                        opacity: name === predicted_class ? 1 : 0.45,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary line */}
          <p className="text-muted-foreground text-sm text-center max-w-md leading-relaxed mt-2">
            {theme.summaryText}
          </p>

          {/* Suggestions Box */}
          <div className="w-full bg-white/45 border border-slate-200/50 rounded-2xl px-6 py-5 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-accent-bright" />
              <span className={`text-sm font-bold ${theme.textColor}`}>
                Suggested mindfulness actions
              </span>
            </div>
            <ul className="space-y-2.5">
              {theme.suggestions.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                >
                  <span className="mt-1 text-accent-bright shrink-0 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3.5 w-full justify-center mt-3">
            <Link
              to="/measurement"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-soft active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Measure again
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              <Home className="w-4 h-4 text-slate-500" />
              Go home
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
