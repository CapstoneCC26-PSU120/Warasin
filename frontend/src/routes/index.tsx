import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Camera,
  CheckCircle2,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero.png";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({ component: Index });

/* ─── Emoji floating pill ─── */
function FloatingEmoji({ emoji, className }: { emoji: string; className?: string }) {
  return (
    <span
      className={`absolute text-2xl md:text-3xl select-none pointer-events-none animate-float ${className ?? ""}`}
      style={{ animationDelay: `${Math.random() * 3}s` }}
    >
      {emoji}
    </span>
  );
}

/* ─── Bento-style feature tile ─── */
function BentoCard({
  icon,
  title,
  description,
  color,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow ${className ?? ""}`}
    >
      {/* Decorative corner glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: color }}
      />
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
        style={{ background: color + "20", color }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Numbered step with connecting line ─── */
function PlayfulStep({
  number,
  emoji,
  title,
  description,
  isLast,
}: {
  number: number;
  emoji: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-5 relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-linear-to-b from-primary/30 to-transparent" />
      )}
      {/* Number bubble */}
      <div className="relative shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shadow-sm">
        {emoji}
      </div>
      <div className="pb-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">
            Langkah {number}
          </span>
        </div>
        <h3 className="mt-1 text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Testimonial card with playful avatar ─── */
function TestimonialCard({
  quote,
  name,
  role,
  emoji,
}: {
  quote: string;
  name: string;
  role: string;
  emoji: string;
}) {
  return (
    <div className="group relative glass rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-foreground text-sm leading-relaxed italic">"{quote}"</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
          {emoji}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Blobs */}
          <div className="blob blob-blue animate-blob w-[500px] h-[500px] -top-56 -left-40" />
          <div className="blob blob-yellow animate-blob-delay-2 w-[400px] h-[400px] top-20 -right-40" />
          <div className="blob blob-pink animate-blob-delay-4 w-[300px] h-[300px] bottom-0 left-1/3" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: Copy */}
              <div className="space-y-7 animate-fade-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  AI-powered stress check
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-foreground">
                  Your mind
                  <br />
                  <span className="text-primary">deserves</span>{" "}
                  <span className="relative inline-block">
                    <span className="text-accent-bright">a break</span>
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                    >
                      <path
                        d="M2 8c30-6 60-4 90-2s70 4 106-2"
                        stroke="rgb(251, 191, 36)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-draw"
                      />
                    </svg>
                  </span>
                </h1>

                <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
                  Luangkan waktu 60 detik. Ambil foto selfie atau mengobrol dengan Wara — asisten AI
                  kami yang ramah — dan temukan bagaimana perasaan Anda yang sebenarnya hari ini.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button asChild variant="hero" size="xl">
                    <Link to="/measurement">
                      Mulai pemeriksaan
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="soft" size="xl">
                    <Link to="/history">Riwayat saya</Link>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-5 text-sm text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-primary" /> Pribadi & aman
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-pink-400" /> Gratis selamanya
                  </span>
                </div>
              </div>

              {/* Right: Hero image with playful frame */}
              <div className="relative animate-fade-up-delay-1">
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-br from-primary/20 via-transparent to-amber-300/20 blur-2xl" />

                {/* Main image card */}
                <div className="relative animate-float rounded-[2rem] overflow-hidden shadow-glow ring-1 ring-white/40">
                  <img
                    src={heroImage}
                    alt="A person meditating peacefully under soft blue clouds and a warm yellow sun"
                    width={1280}
                    height={960}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ BENTO FEATURES ═══════════ */}
        <section className="container mx-auto px-4 py-24 relative overflow-hidden">
          <div className="blob blob-green animate-blob-delay-2 w-72 h-72 -top-24 -right-24" />

          <div className="relative z-10">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="inline-block mb-4 text-3xl">🎯</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Dua cara untuk <span className="text-primary">memeriksa diri</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
                Pilih cara yang paling cocok untukmu. Keduanya memakan waktu kurang dari satu menit.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <BentoCard
                icon={<Camera className="h-6 w-6" />}
                title="📸 Pindai Wajah"
                description="Unggah foto selfie — AI kami membaca ekspresi mikro wajah untuk memperkirakan tingkat stres Anda saat ini secara lembut."
                color="#60a5fa"
                className="lg:col-span-1"
              />
              <BentoCard
                icon={<MessageCircle className="h-6 w-6" />}
                title="💬 Obrolan dengan Wara"
                description="Lakukan percakapan singkat yang hangat. Wara mendengarkan, merenungkan, dan memberikan skor yang dipikirkan matang-matang."
                color="#f472b6"
                className="lg:col-span-1"
              />
              <BentoCard
                icon={<Brain className="h-6 w-6" />}
                title="🧠 Wawasan Pintar"
                description="Tips yang dipersonalisasi berdasarkan pola Anda — dari latihan pernapasan hingga ritual menenangkan diri."
                color="#a78bfa"
                className="lg:col-span-1"
              />
              <BentoCard
                icon={<Timer className="h-5 w-5" />}
                title="⚡ Cukup 60 Detik"
                description="Tanpa formulir panjang. Buka aplikasi, lakukan pemeriksaan, dan kembali beraktivitas dengan perasaan lebih ringan."
                color="#fbbf24"
                className="lg:col-span-1"
              />
              <BentoCard
                icon={<TrendingUp className="h-5 w-5" />}
                title="📊 Pantau Tren Anda"
                description="Pantau tren stres Anda selama berhari-hari dan berminggu-minggu. Rayakan momen yang lebih tenang!"
                color="#34d399"
                className="lg:col-span-2"
              />
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="relative overflow-hidden py-24">
          <div className="blob blob-pink animate-blob w-80 h-80 -bottom-32 -left-32" />
          <div className="blob blob-yellow animate-blob-delay-4 w-56 h-56 top-16 -right-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: Steps */}
              <div>
                <span className="inline-block mb-4 text-3xl">🪜</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
                  Cara <span className="text-primary">kerjanya</span>
                </h2>
                <p className="text-muted-foreground mb-10 max-w-sm">
                  Tiga langkah mudah. Tanpa tekanan. Semua tentang ketenangan.
                </p>
                <div>
                  <PlayfulStep
                    number={1}
                    emoji="📱"
                    title="Pilih metode pemeriksaan"
                    description="Ambil foto selfie atau buka obrolan dengan Wara — mana saja yang terasa tepat hari ini."
                  />
                  <PlayfulStep
                    number={2}
                    emoji="🤖"
                    title="Dapatkan skor Anda"
                    description="AI kami menganalisis masukan Anda dengan lembut dan membagikan gambaran stres Anda secara jelas."
                  />
                  <PlayfulStep
                    number={3}
                    emoji="📈"
                    title="Pantau perkembangan Anda"
                    description="Pantau bagaimana perkembangan Anda dari waktu ke waktu dan rayakan setiap momen tenang."
                    isLast
                  />
                </div>
              </div>

              {/* Right: Fun stats grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="glass rounded-3xl p-7 text-center shadow-card col-span-2">
                  <span className="text-5xl mb-3 block">🎯</span>
                  <div className="text-4xl font-extrabold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pengguna merasa lebih sadar diri setelah hanya satu kali pemeriksaan
                  </div>
                </div>
                <div className="glass rounded-3xl p-6 text-center shadow-card">
                  <span className="text-3xl mb-2 block">⚡</span>
                  <div className="text-2xl font-extrabold text-foreground">60d</div>
                  <div className="text-xs text-muted-foreground mt-1">Rata-rata sesi</div>
                </div>
                <div className="glass rounded-3xl p-6 text-center shadow-card">
                  <span className="text-3xl mb-2 block">🔒</span>
                  <div className="text-2xl font-extrabold text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">Pribadi & aman</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="relative overflow-hidden py-24 bg-linear-to-b from-transparent via-primary/3 to-transparent">
          <div className="blob blob-blue animate-blob-delay-2 w-64 h-64 -bottom-24 -left-24" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <span className="inline-block mb-4 text-3xl">💬</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Telah dipercaya oleh <span className="text-accent-bright">banyak orang</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
                Cerita nyata dari orang-orang yang mulai memeriksa kesejahteraan mereka.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto justify-evenly">
              <TestimonialCard
                quote="Saya melakukannya setiap pagi sambil minum kopi. Ini telah menjadi ritual kecil favorit saya."
                name="Naufal M."
                role="Desainer"
                emoji="🎨"
              />
              <TestimonialCard
                quote="Berkat Warasin, saya menjadi lebih aware terhadap kesehatan mental saya setiap harinya."
                name="Adib K."
                role="Guru"
                emoji="📚"
              />
              <TestimonialCard
                quote="Melihat tren stres saya menurun dari minggu ke minggu benar-benar mengubah kebiasaan saya."
                name="Willy R."
                role="Mahasiswa"
                emoji="🎓"
              />
            </div>
          </div>
        </section>

        {/* ═══════════ BENEFITS CHECKLIST ═══════════ */}
        <section className="container mx-auto px-4 py-24">
          <div className="relative overflow-hidden grid gap-12 rounded-[2rem] border border-border/60 bg-card p-10 shadow-card md:grid-cols-2 md:items-center md:p-14">
            {/* Background blob inside card */}
            <div className="blob blob-green animate-blob-delay-2 w-64 h-64 -bottom-24 -right-24 opacity-30" />

            <div className="space-y-5 relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5" /> Semua yang Anda butuhkan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Diri yang lebih tenang,
                <br />
                <span className="text-primary">satu pemeriksaan</span> setiap kalinya
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Warasin memadukan AI yang ramah dengan desain penuh kesadaran — sehingga melakukan
                pemeriksaan terasa tidak seperti ujian, melainkan momen berharga untuk diri Anda
                sendiri.
              </p>
            </div>

            <ul className="space-y-4 relative z-10">
              {[
                { text: "Dua metode pemeriksaan ramah — wajah atau obrolan", emoji: "🤝" },
                { text: "Saran yang dipersonalisasi & terinspirasi dari sains", emoji: "🔬" },
                { text: "Riwayat tren yang indah di ujung jari Anda", emoji: "📊" },
                { text: "Tanpa iklan, tanpa pelacakan, sepenuhnya pribadi", emoji: "🛡️" },
                { text: "Dapat diakses di perangkat apa pun, kapan pun, di mana pun", emoji: "🌍" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-background/60 border border-border/40 transition-all duration-200 hover:bg-primary/5 hover:border-primary/20"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                  <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary/60" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="container mx-auto px-4 pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-primary to-primary/80 p-12 md:p-20 text-primary-foreground shadow-glow text-center">
            {/* Decorative blobs */}
            <div className="blob blob-yellow animate-blob w-56 h-56 -top-24 -left-24 opacity-40" />
            <div className="blob blob-pink animate-blob-delay-2 w-48 h-48 -bottom-20 -right-20 opacity-30" />

            {/* Floating emojis */}
            <FloatingEmoji emoji="🌟" className="top-8 left-[10%]" />
            <FloatingEmoji emoji="💙" className="bottom-8 right-[10%]" />
            <FloatingEmoji emoji="✨" className="top-12 right-[20%] hidden md:block" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-5xl block">🧠</span>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Ready for a <span className="text-amber-300">brighter</span> day?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto">
                Kesejahteraan Anda sangat penting. Mulai pemeriksaan stres pertama Anda sekarang —
                gratis, cepat, dan dirancang dengan penuh 💛 untuk Anda.
              </p>
              <div className="flex justify-center pt-2">
                <Button asChild variant="accent" size="xl">
                  <Link to="/measurement">
                    Let's go!
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
