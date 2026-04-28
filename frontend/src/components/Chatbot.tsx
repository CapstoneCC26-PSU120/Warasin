import React, { useState, useRef, useEffect } from "react";
import { questions } from "@/lib/questions";
import api from "@/lib/api";
import { Send, Loader2, MessageCircle } from "lucide-react";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      sender: "bot",
      text: "Hi! I'm here to listen. " + questions[0].question,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = async (option: { label: string; value: any }) => {
    const currentQ = questions[currentStep];

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString() + "_user",
      sender: "user",
      text: option.label,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Save answer
    const newAnswers = { ...answers, [currentQ.field]: option.value };
    setAnswers(newAnswers);

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep < questions.length) {
      // Add next bot question with a slight delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "_bot",
            sender: "bot",
            text: questions[nextStep].question,
          },
        ]);
      }, 500);
    } else {
      // Finished all questions
      setIsSubmitting(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "submit",
            sender: "bot",
            text: "Thank you for sharing! Let me process your results...",
          },
        ]);
      }, 500);

      try {
        await api.post("/measurement/chatbot", newAnswers);
        setMessages((prev) => [
          ...prev,
          {
            id: "done",
            sender: "bot",
            text: "All done! Your results have been saved.",
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: "error",
            sender: "bot",
            text: "Oops, something went wrong while saving your answers.",
          },
        ]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const currentOptions =
    currentStep < questions.length ? questions[currentStep].options : null;

  return (
    <div className="flex flex-col h-[550px] w-full max-w-3xl mx-auto border border-slate-200/60 bg-white rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#128cfc] text-white">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-slate-800 text-sm">Calm Bot</h3>
          <p className="text-[13px] text-slate-500">Here to listen, gently</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fbff]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 text-[15px] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#128cfc] text-white rounded-2xl rounded-tr-sm"
                  : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isSubmitting && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-5 py-3 text-[15px] leading-relaxed bg-white text-slate-700 shadow-sm border border-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-500">Processing...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input / Options Area */}
      <div className="p-5 border-t border-slate-100 bg-white">
        {currentOptions ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-400 px-1">
              Select an option to reply:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className="px-5 py-2 text-sm font-medium rounded-full bg-[#f0f6ff] text-[#006bd6] hover:bg-[#128cfc] hover:text-white transition-all duration-200 border border-[#d6e8ff]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              disabled
              placeholder="Chat finished."
              className="w-full px-5 py-3.5 bg-slate-50 rounded-full border border-slate-200 focus:outline-none text-sm text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-slate-200 rounded-full flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
