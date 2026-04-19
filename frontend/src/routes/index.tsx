import { SiteFooter } from "#/components/SiteFooter";
import { Button } from "#/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Camera,
  CheckCircle2,
  Clock,
  Heart,
  LineChart,
  MessageCircle,
  Quote,
  ShieldCheck,
  Smile,
  Sparkles,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-calm.png";
import { SiteHeader } from "#/components/SiteHeader";

export const Route = createFileRoute("/")({ component: Index });

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-glow">
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
          accent
            ? "bg-accent-gradient text-accent-foreground"
            : "bg-primary text-primary-foreground"
        } shadow-soft`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-6 text-center shadow-card">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-8 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-glow">
      <div className="mb-4 text-5xl font-bold text-primary/20">{number}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-8 shadow-card">
      <Quote className="mb-4 h-6 w-6 text-accent-bright" />
      <p className="text-foreground">"{quote}"</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {name.charAt(0)}
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero relative overflow-hidden">
          <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:py-28 md:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-accent-bright" />
                AI-powered wellbeing check
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Check your <span className="text-primary">stress level</span> in
                a <span className="text-accent-bright">moment</span>.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground font-inter">
                Take a deep breath. Snap a face photo or chat with our friendly
                bot, and get a calm, clear read on how you're really feeling —
                anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/measurement">Start free check</Link>
                </Button>
                <Button asChild variant="soft" size="xl">
                  <Link to="/history">View history</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Private & secure
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent-bright" />
                  No sign-up needed
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/30 blur-3xl" />
              <div className="relative animate-float overflow-hidden rounded-[2rem] bg-card shadow-glow">
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
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Two ways to check in with{" "}
              <span className="text-accent-bright">yourself</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pick whichever feels right today. Both take less than a minute.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<Camera className="h-6 w-6" />}
              title="Face Photo Analysis"
              description="Upload a selfie and our model reads micro-expressions to estimate your current stress level."
              accent
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Chat with our Bot"
              description="Have a short, friendly conversation. The bot reflects on your answers and shares a thoughtful score."
            />
          </div>
        </section>

        {/* Why CalmCheck — marketing */}
        <section className="bg-sky-soft py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                Why CalmCheck
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Your daily companion for a{" "}
                <span className="text-accent-bright">balanced mind</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Stress builds up quietly. CalmCheck gives you a gentle,
                science-inspired way to notice it early — so you can act before
                it takes over.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Brain className="h-6 w-6" />}
                title="Smart insights"
                description="Personalised tips based on your stress pattern — from breathing to grounding rituals."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="Just 60 seconds"
                description="No long forms. Open the app, check in, and get back to your day feeling lighter."
                accent
              />
              <FeatureCard
                icon={<Smile className="h-6 w-6" />}
                title="Built for everyone"
                description="Student, parent, or professional — CalmCheck adapts to where you are right now."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How it <span className="text-primary">works</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps. Zero pressure.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Choose your check-in"
              description="Snap a quick selfie or chat with our friendly bot — whichever feels easiest today."
            />
            <Step
              number="02"
              title="Get your score"
              description="Our AI gently analyses your input and shares a clear, calm read on your stress level."
            />
            <Step
              number="03"
              title="See your trend"
              description="Track how you're doing over days and weeks, and celebrate the calmer moments."
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-sky-soft py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Loved by people who care about their{" "}
                <span className="text-accent-bright">wellbeing</span>
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Testimonial
                quote="I check in every morning with my coffee. It's become my favourite tiny ritual."
                name="Aisha M."
                role="Designer"
              />
              <Testimonial
                quote="The chat feels like talking to a thoughtful friend, not a cold algorithm."
                name="Daniel K."
                role="Teacher"
              />
              <Testimonial
                quote="Watching my stress trend go down week by week has genuinely changed my habits."
                name="Priya R."
                role="Student"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Small habit,{" "}
              <span className="text-accent-bright">big difference</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Stat
              icon={<LineChart />}
              value="98%"
              label="Users feel more aware after one check"
            />
            <Stat
              icon={<Heart />}
              value="60s"
              label="Average time to complete a session"
            />
            <Stat
              icon={<ShieldCheck />}
              value="100%"
              label="Private — your data stays yours"
            />
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid gap-12 rounded-3xl border border-border bg-card p-10 shadow-card md:grid-cols-2 md:items-center md:p-14">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <Zap className="h-3.5 w-3.5" /> Everything you need
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                A calmer you, one check-in at a time
              </h2>
              <p className="text-muted-foreground">
                CalmCheck blends gentle AI with mindful design — so checking in
                feels less like a test, and more like a moment for yourself.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Two friendly check-in modes — face or chat",
                "Personalised, science-inspired suggestions",
                "Beautiful trend history at your fingertips",
                "Zero ads, zero tracking, fully private",
                "Works on any device, anytime, anywhere",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-glow md:p-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
            <div className="relative space-y-4 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready for a <span className="text-accent">brighter</span>{" "}
                moment?
              </h2>
              <p className="mx-auto max-w-xl text-primary-foreground/80">
                Your wellbeing matters. Start your first stress check now — it's
                free, fast, and gentle.
              </p>
              <div className="flex justify-center pt-2">
                <Button asChild variant="accent" size="xl">
                  <Link to="/measurement">Begin now</Link>
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
