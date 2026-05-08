import { useState, useRef, useEffect } from "react";
import { questions } from "@/lib/questions";
import { answerSchema } from "@/lib/questions.schema";
import api from "@/lib/api";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

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
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const currentQ = questions[currentStep];

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const success = await handleOptionSelect({ label: inputValue, value: inputValue });
    if (success !== false) {
      setInputValue("");
    }
  };

  const handleOptionSelect = async (option: { label: string; value: any }) => {
    setErrorMsg(""); // Clear previous error

    const schema = (answerSchema.shape as any)[currentQ.field];
    if (schema) {
      const validationResult = schema.safeParse(option.value);
      if (!validationResult.success) {
        const errorMsg =
          validationResult.error.issues?.[0]?.message ||
          validationResult.error.errors?.[0]?.message ||
          "Input tidak valid";
        setErrorMsg(errorMsg);
        return false;
      }
      option.value = validationResult.data;
    }

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
        const response = await api.post("/chatbot/answer", newAnswers);
        console.log(response.data.result);
        const { score, category, advice } = response.data.result;

        setMessages((prev) => [
          ...prev,
          {
            id: "done",
            sender: "bot",
            text: "All done! Redirecting you to your results...",
          },
        ]);

        // Short delay so user can see the final message before redirect
        setTimeout(() => {
          navigate({
            to: "/result" as any,
            state: { score, category, advice } as any,
          });
        }, 1000);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: "error",
            sender: "bot",
            text: "Oops, something went wrong while saving your answers.",
          },
        ]);
        setIsSubmitting(false);
      }
    }
    return true;
  };

  const currentOptions = currentStep < questions.length ? questions[currentStep].options : null;

  return (
    <div className="flex flex-col h-[550px] w-full max-w-3xl mx-auto border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden ">
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
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
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
            <p className="text-xs font-medium text-slate-400 px-1">Select an option to reply:</p>
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
            {errorMsg && <p className="text-xs text-red-500 px-1">{errorMsg}</p>}
          </div>
        ) : currentStep < questions.length ? (
          <form onSubmit={handleTextSubmit} className="flex flex-col gap-2 relative">
            {errorMsg && (
              <div className="absolute -top-14 left-0 right-0 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium border border-red-100 shadow-sm z-10 flex items-center animate-in slide-in-from-bottom-2 fade-in duration-200">
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder={(currentQ as any).placeholder || "Ketik jawabanmu di sini..."}
                className="w-full px-5 py-3.5 bg-slate-50 rounded-full border border-slate-200 focus:outline-none focus:border-[#128cfc] text-sm text-slate-700 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-[#128cfc] hover:bg-[#006bd6] disabled:bg-slate-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
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
