import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput, useLogin } from "../hooks/useAuth";
import { Activity, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-linear-to-br from-sky-50 via-white to-amber-50/60">
      {/* Decorative blobs */}
      <div className="blob blob-blue animate-blob w-80 h-80 -top-32 -left-32" />
      <div className="blob blob-yellow animate-blob-delay-2 w-72 h-72 -bottom-28 -right-28" />
      <div className="blob blob-pink animate-blob-delay-4 w-56 h-56 top-1/4 right-0" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5 mb-8 animate-fade-up">
        <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-soft">
          <Activity size={22} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          Waras<span className="text-accent-bright">in</span>
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 glass w-full max-w-md rounded-3xl shadow-card p-8 animate-fade-up-delay-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1.5">Selamat datang kembali 👋</h1>
          <p className="text-muted-foreground text-sm">Masuk untuk melanjutkan perjalanan kesehatan mental Anda.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Mail size={17} />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="email@contoh.com"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
              />
            </div>
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Lock size={17} />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-sm font-medium text-center animate-fade-up border border-destructive/20">
              {(error as any)?.response?.data?.message || "Gagal masuk"}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-xl transition-all duration-200 mt-1 flex items-center justify-center gap-2 shadow-sm hover:shadow-soft active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sedang masuk...
              </span>
            ) : (
              <>
                Masuk
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="relative flex items-center py-3">
            <div className="grow border-t border-border" />
            <span className="shrink-0 mx-4 text-muted-foreground text-xs font-medium">atau</span>
            <div className="grow border-t border-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-background border border-border hover:bg-muted text-foreground font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-3">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </form>
      </div>

      {/* Footer Text */}
      <p className="relative z-10 mt-8 text-muted-foreground text-xs animate-fade-up-delay-2">
        Dengan melanjutkan, Anda menyetujui ketentuan kami yang <span className="text-accent-bright font-medium">tenang dan bersahabat</span>.
      </p>
    </div>
  );
}
