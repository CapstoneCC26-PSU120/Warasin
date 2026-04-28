import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Chatbot } from "@/components/Chatbot";
import { useState } from "react";
import { Camera, MessageCircle, Upload } from "lucide-react";

export const Route = createFileRoute("/measurement")({
  component: MeasurementPage,
});

function MeasurementPage() {
  const [activeTab, setActiveTab] = useState<"face" | "chat">("chat");

  return (
    <div className="min-h-screen bg-[#dff0fa]">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10 md:py-16 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 mb-6 shadow-sm border border-slate-100">
            <span className="text-[#fca120]">✨</span> Take a deep breath
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            How are you feeling <span className="text-[#fca120]">today</span>?
          </h1>
          <p className="text-slate-600 text-lg max-w-lg mx-auto">
            Choose your preferred way to check in. Both methods are quick and gentle.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex bg-white/40 p-1.5 rounded-full mb-10 backdrop-blur-sm border border-white/60 shadow-sm">
          <button
            onClick={() => setActiveTab("face")}
            className={`flex items-center gap-2 px-10 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "face"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            <Camera className="w-4 h-4" />
            Face
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-10 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "chat"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-3xl">
          {activeTab === "face" ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 w-full min-h-[450px]">
              <h2 className="text-xl font-medium text-slate-800 mb-2">Upload a face photo</h2>
              <p className="text-slate-500 mb-10 text-sm">A clear, well-lit selfie works best. Your image stays on your device.</p>

              <div className="border-2 border-dashed border-[#b6d6fc] rounded-2xl bg-[#f4f9ff] flex flex-col items-center justify-center p-16 transition-colors hover:bg-[#ebf4ff] cursor-pointer group">
                <div className="w-14 h-14 bg-[#d0e6ff] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Upload className="w-6 h-6 text-[#128cfc]" />
                </div>
                <span className="font-medium text-slate-700">Click to upload</span>
                <span className="text-xs text-slate-500 mt-1">PNG or JPG, up to 10MB</span>
              </div>
            </div>
          ) : (
            <Chatbot />
          )}
        </div>
      </main>
    </div>
  );
}
