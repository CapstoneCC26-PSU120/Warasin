import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Chatbot } from "@/components/Chatbot";
import React, { useState, useRef } from "react";
import { Camera, MessageCircle, Upload, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/measurement")({
  beforeLoad: async ({ context }) => {
    // Ambil token dari URL query param (dari Google OAuth redirect)
    // dan simpan ke localStorage SEBELUM memanggil /api/auth/me
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Bersihkan token dari URL tanpa reload
      params.delete("token");
      const newPath = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newPath);
    }

    try {
      const user = await context.queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const { data } = await api.get("/auth/me");
          return data.user;
        },
        staleTime: 0,
      });
      if (!user) {
        throw redirect({ to: "/login" });
      }
    } catch (e: any) {
      if (e?.isRedirect) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: MeasurementPage,
});

function MeasurementPage() {
  const [activeTab, setActiveTab] = useState<"face" | "chat">("chat");
  const navigate = useNavigate({ from: "/measurement" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/face/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data.data);

      if (response.data && response.data.data) {
        navigate({
          to: "/result/face",
          state: response.data.data,
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Gagal menganalisis wajah. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="blob blob-blue animate-blob w-96 h-96 -top-48 -right-48 opacity-30" />
      <div className="blob blob-yellow animate-blob-delay-2 w-80 h-80 top-1/2 -left-40 opacity-20" />
      <div className="blob blob-pink animate-blob-delay-4 w-64 h-64 bottom-0 right-1/4 opacity-15" />

      <SiteHeader />

      <main className="relative z-10 container mx-auto px-4 py-10 md:py-16 flex flex-col items-center">
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent-bright" />
            Tarik napas dalam-dalam
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Bagaimana perasaanmu <span className="text-accent-bright">hari ini</span>?
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Pilih cara yang kamu sukai untuk masuk. Kedua metode ini cepat dan menenangkan.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex glass p-1.5 rounded-full mb-10 shadow-sm animate-fade-up-delay-1">
          <button
            onClick={() => setActiveTab("face")}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "face"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="w-4 h-4" />
            Wajah
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "chat"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Obrolan
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-3xl animate-fade-up-delay-2">
          {activeTab === "face" ? (
            <div className="glass rounded-3xl p-8 shadow-card w-full">
              <h2 className="text-xl font-semibold text-foreground mb-2">Unggah foto wajah</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Selfie yang jelas dan cukup cahaya bekerja paling baik. Gambarmu tetap berada di
                perangkatmu.
              </p>

              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="image/png, image/jpeg"
                capture="user"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleFileChange}
              />

              <div
                className={`border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 flex flex-col items-center justify-center p-10 transition-all duration-300 hover:bg-primary/10 hover:border-primary/50 cursor-pointer group ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:bg-primary/20">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-foreground">Unggah Berkas</span>
                <span className="text-xs text-muted-foreground mt-1.5">
                  PNG atau JPG, hingga 10MB
                </span>
              </div>

              {isUploading && (
                <div className="mt-8 flex flex-col items-center justify-center text-primary animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="font-medium">Menganalisis wajahmu...</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground/50 mt-6 italic">
                *Warasin dapat membuat kesalahan
              </p>
            </div>
          ) : (
            <Chatbot />
          )}
        </div>
      </main>
    </div>
  );
}
