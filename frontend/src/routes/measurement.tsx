import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Chatbot } from "@/components/Chatbot";
import React, { useState, useRef } from "react";
import { Camera, MessageCircle, Upload, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/measurement")({
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

      const response = await api.post("/face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.data) {
        navigate({
          to: "/result",
          search: { id: response.data.data.id || undefined },
          state: response.data.data,
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to analyze face. Please try again.");
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
            Take a deep breath
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            How are you feeling <span className="text-accent-bright">today</span>?
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Choose your preferred way to check in. Both methods are quick and gentle.
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
            Face
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
            Chat
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-3xl animate-fade-up-delay-2">
          {activeTab === "face" ? (
            <div className="glass rounded-3xl p-8 shadow-card w-full min-h-[400px]">
              <h2 className="text-xl font-semibold text-foreground mb-2">Upload a face photo</h2>
              <p className="text-muted-foreground mb-10 text-sm">
                A clear, well-lit selfie works best. Your image stays on your device.
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
                <span className="font-medium text-foreground">Upload File</span>
                <span className="text-xs text-muted-foreground mt-1.5">PNG or JPG, up to 10MB</span>
              </div>

              {isUploading && (
                <div className="mt-8 flex flex-col items-center justify-center text-primary animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="font-medium">Analyzing your face...</p>
                </div>
              )}
            </div>
          ) : (
            <Chatbot />
          )}
        </div>
      </main>
    </div>
  );
}
