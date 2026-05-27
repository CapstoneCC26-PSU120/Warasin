import { createFileRoute, useRouter, Link, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Heart, Sparkles, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/result_/face")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const { data } = await api.get("/auth/me");
          return data.user;
        },
      });
      if (!user) {
        throw redirect({ to: "/login" });
      }
    } catch (e) {
      throw redirect({ to: "/login" });
    }
  },
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
    name: "Bahagia",
    color: "#22c55e",
    textColor: "text-emerald-600",
    bgGradient: "from-emerald-50 via-teal-50/20 to-sky-50/10",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    summaryText: "Anda terlihat bahagia dan santai! Hargai momen damai ini. 🌿",
    suggestions: [
      "Bagikan energi positif Anda! Hubungi teman dekat atau keluarga untuk menyebarkan kebahagiaan.",
      "Lakukan hobi favorit atau aktivitas kreatif saat motivasi dan energi Anda sedang tinggi.",
      "Luangkan waktu sejenak untuk bersyukur dan tuliskan tiga hal yang membuat Anda tersenyum hari ini.",
    ],
  },
  Surprise: {
    name: "Terkejut",
    color: "#06b6d4",
    textColor: "text-cyan-600",
    bgGradient: "from-cyan-50 via-teal-50/20 to-indigo-50/10",
    badgeBg: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    summaryText: "Ekspresi Anda menunjukkan rasa terkejut atau gembira. Tetaplah penasaran! ✨",
    suggestions: [
      "Salurkan energi aktif dan bersemangat ini untuk mencoba hal baru atau mempelajari keterampilan baru.",
      "Sambut perasaan baru ini dan tetap berpikiran terbuka untuk kejutan menyenangkan hari ini.",
      "Tuliskan atau gambar ide-ide segar dan spontan yang muncul di benak Anda saat ini.",
    ],
  },
  Sad: {
    name: "Sedih",
    color: "#3b82f6",
    textColor: "text-blue-600",
    bgGradient: "from-blue-50 via-indigo-50/20 to-sky-50/10",
    badgeBg: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    summaryText: "Anda tampak agak sedih atau murung. Sangat wajar untuk merasa seperti ini. 🌤️",
    suggestions: [
      "Bersikaplah lembut pada diri sendiri hari ini. Beri diri Anda izin untuk melambat, istirahat, dan memulihkan energi.",
      "Cobalah menulis buku harian atau jurnal untuk mengekspresikan pikiran Anda dan meringankan beban pikiran.",
      "Manjakan diri Anda dengan kenyamanan hangat seperti secangkir teh chamomile atau mendengarkan daftar lagu yang menenangkan.",
    ],
  },
  Disgust: {
    name: "Terganggu / Jijik",
    color: "#f59e0b",
    textColor: "text-amber-600",
    bgGradient: "from-amber-50 via-orange-50/20 to-rose-50/10",
    badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    summaryText: "Ada sedikit kekesalan atau ketidaknyamanan dalam ekspresi Anda. Ambil istirahat sejenak. 🌸",
    suggestions: [
      "Menjauhlah secara fisik atau visual dari objek atau lingkungan yang membuat Anda tidak nyaman.",
      "Tarik napas dalam-dalam secara perlahan sebanyak 5 kali untuk mengatur ulang fokus dan meredakan kekesalan.",
      "Dengarkan musik instrumental yang menenangkan atau suara alam untuk menenangkan diri Anda.",
    ],
  },
  Fear: {
    name: "Takut",
    color: "#a855f7",
    textColor: "text-purple-600",
    bgGradient: "from-purple-50 via-pink-50/20 to-indigo-50/10",
    badgeBg: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    summaryText: "Wajah Anda menunjukkan tanda-tanda ketegangan, kekhawatiran, atau kecemasan. Anda aman di sini. 💙",
    suggestions: [
      "Perlambat napas Anda: lakukan teknik box breathing (tarik napas 4 detik, tahan 4 detik, embuskan 4 detik, tahan 4 detik) untuk menenangkan sistem saraf.",
      "Gunakan teknik grounding: sebutkan 5 benda yang bisa dilihat, 4 benda yang bisa disentuh, dan 3 suara yang bisa didengar di sekitar Anda.",
      "Ingatlah bahwa perasaan cemas adalah keadaan sementara seperti ombak yang pasti akan mereda.",
    ],
  },
  Angry: {
    name: "Marah",
    color: "#ef4444",
    textColor: "text-rose-600",
    bgGradient: "from-rose-50 via-red-50/20 to-orange-50/10",
    badgeBg: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    summaryText: "Anda menunjukkan ketegangan fisik atau frustrasi yang meningkat. Mari lepaskan itu perlahan. 🌊",
    suggestions: [
      "Mari kendurkan ketegangan: rilekskan rahang Anda, turunkan bahu Anda, dan buka kepalan tangan Anda.",
      "Cobalah jalan cepat sejenak atau lakukan peregangan fisik sederhana untuk meredakan adrenalin yang menumpuk.",
      "Hembuskan napas perlahan melalui mulut, bayangkan gelombang kedamaian yang mendinginkan dan merilekskan tubuh Anda.",
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
        <h1 className="text-2xl font-bold mb-2">Hasil Analisis Wajah Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Silakan unggah foto terlebih dahulu di halaman pemeriksaan untuk melihat analisis emosi AI.
        </p>
        <Button asChild variant="hero">
          <Link to="/measurement">Mulai Pemeriksaan Wajah</Link>
        </Button>
      </div>
    );
  }
  const theme = EMOTION_THEMES[predicted_class] || EMOTION_THEMES.Happy;

  const emotionNameMap: Record<string, string> = {
    Happy: "Bahagia",
    Surprise: "Terkejut",
    Sad: "Sedih",
    Disgust: "Jijik / Terganggu",
    Fear: "Takut",
    Angry: "Marah",
  };

  // Order other probabilities to show high to low, or standardized
  const sortedProbabilities = Object.entries(predictions_probability)
    .map(([name, val]) => ({ name: emotionNameMap[name] || name, val: (val as number) * 100 }))
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
            Analisis Emosi Wajah AI
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            Anda sedang merasa{" "}
            <span className={`${theme.textColor} transition-colors duration-500`}>
              {theme.name}
            </span>{" "}
            saat ini
          </h1>

          {/* Meter and Chart Row */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-2">
            {/* Left: Circular confidence */}
            <div className="flex flex-col items-center gap-2">
              <CircularConfidence emotion={predicted_class} color={theme.color} />
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Emosi Utama
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-36 bg-slate-200/70" />

            {/* Right: Breakdown list */}
            <div className="flex-1 w-full space-y-3.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Rincian Emosi
              </h3>
              {sortedProbabilities.map(({ name, val }) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span
                      className={
                        name === theme.name
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      {name}
                    </span>
                    <span
                      className={
                        name === theme.name
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
                        backgroundColor: name === theme.name ? theme.color : "#94a3b8",
                        opacity: name === theme.name ? 1 : 0.45,
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
                Saran tindakan kesadaran (mindfulness)
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
              Periksa kembali
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              <Home className="w-4 h-4 text-slate-500" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
