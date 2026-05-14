import { useState, useRef, useEffect } from "react";
import { questions } from "@/lib/questions";
import { answerSchema } from "@/lib/questions.schema";
import api from "@/lib/api";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const BOT_NAME = "Wara";
const BOT_AVATAR = "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=warasin-calm&backgroundColor=c0aede";

function TypingIndicator() {
  return (
    <div className="flex justify-start message-slide-in-left">
      <div className="flex items-end gap-2.5">
        <img
          src={BOT_AVATAR}
          alt={BOT_NAME}
          className="h-8 w-8 rounded-full bg-primary-soft ring-2 ring-white shadow-sm shrink-0"
        />
        <div className="px-5 py-3.5 bg-white shadow-sm border border-slate-100/80 rounded-2xl rounded-bl-sm">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      sender: "bot",
      text: "Halo! 👋 Aku Wara, teman ngobrolmu. Santai aja ya, aku cuma mau tanya-tanya ringan buat bantu kamu kenal diri sendiri lebih baik.\n\n" + questions[0].question,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const currentQ = questions[currentStep];

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Transition phrases to make the bot feel more human
  const transitionPhrases = [
    "Oke, noted! 📝 ",
    "Baik, aku paham. ",
    "Siap! ",
    "Makasih infonya! ",
    "Oke, lanjut ya. ",
    "Got it! ✨ ",
    "Baik banget. ",
    "Noted ya! ",
  ];

  const getTransition = () =>
    transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];

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
      // Show typing indicator then next question
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "_bot",
            sender: "bot",
            text: getTransition() + questions[nextStep].question,
          },
        ]);
      }, 800 + Math.random() * 600);
    } else {
      // Finished all questions
      setIsSubmitting(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "submit",
            sender: "bot",
            text: "Makasih banget udah jawab semuanya! 💙 Bentar ya, aku proses dulu hasilnya...",
          },
        ]);
      }, 600);

      try {
        const response = await api.post("/chatbot/answer", newAnswers);
        console.log(response.data.result);
        const { score, category, advice } = response.data.result;

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: "done",
                sender: "bot",
                text: "Selesai! ✨ Aku udah selesai analisisnya. Yuk lihat hasilnya!",
              },
            ]);

            // Short delay so user can see the final message before redirect
            setTimeout(() => {
              navigate({
                to: "/result" as any,
                state: { score, category, advice } as any,
              });
            }, 1200);
          }, 800);
        }, 1500);
      } catch (err) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "error",
            sender: "bot",
            text: "Aduh, maaf ya, ada yang error nih. 😔 Coba ulangi lagi ya!",
          },
        ]);
        setIsSubmitting(false);
      }
    }
    return true;
  };

  const currentOptions = currentStep < questions.length ? questions[currentStep].options : null;

  // Progress percentage
  const progress = Math.round((currentStep / questions.length) * 100);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto rounded-3xl shadow-card overflow-hidden border border-slate-200/60 relative">
      {/* Background decoration inside chat */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="blob blob-blue animate-blob w-48 h-48 -top-20 -right-20 opacity-20" />
        <div className="blob blob-yellow animate-blob-delay-2 w-36 h-36 bottom-20 -left-16 opacity-15" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 p-4 border-b border-slate-100/80 bg-white/90 backdrop-blur-sm">
        <div className="relative online-dot">
          <img
            src={BOT_AVATAR}
            alt={BOT_NAME}
            className="h-11 w-11 rounded-full bg-primary-soft ring-2 ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 text-sm">{BOT_NAME}</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[12px] text-slate-400">Teman ceritamu yang penuh empati</p>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">{progress}%</span>
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50/80 to-white/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end message-slide-in-right" : "justify-start message-slide-in-left"}`}
          >
            {msg.sender === "bot" ? (
              <div className="flex items-end gap-2.5 max-w-[80%]">
                <img
                  src={BOT_AVATAR}
                  alt={BOT_NAME}
                  className="h-8 w-8 rounded-full bg-primary-soft ring-2 ring-white shadow-sm shrink-0"
                />
                <div className="px-4 py-3 text-[14px] leading-relaxed bg-white text-slate-700 shadow-sm border border-slate-100/80 rounded-2xl rounded-bl-sm whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[75%] px-4 py-3 text-[14px] leading-relaxed bg-gradient-to-br from-primary to-primary/90 text-white rounded-2xl rounded-br-sm shadow-sm">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        {isSubmitting && !isTyping && (
          <div className="flex justify-start message-slide-in-left">
            <div className="flex items-end gap-2.5">
              <img
                src={BOT_AVATAR}
                alt={BOT_NAME}
                className="h-8 w-8 rounded-full bg-primary-soft ring-2 ring-white shadow-sm shrink-0"
              />
              <div className="px-5 py-3 text-[14px] leading-relaxed bg-white text-slate-500 shadow-sm border border-slate-100/80 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Menganalisis jawabanmu...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input / Options Area */}
      <div className="relative z-10 p-4 border-t border-slate-100/80 bg-white/95 backdrop-blur-sm">
        {currentOptions ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] font-medium text-slate-400 px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pilih salah satu:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-primary/5 text-primary border border-primary/15 hover:bg-primary hover:text-white hover:border-primary hover:shadow-sm active:scale-95 transition-all duration-200"
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
              <div className="absolute -top-14 left-0 right-0 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium border border-red-100 shadow-sm z-10 flex items-center animate-fade-up">
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
                className="w-full px-5 py-3.5 bg-slate-50/80 rounded-full border border-slate-200/80 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-sm text-slate-700 transition-all placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 shadow-sm"
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
              placeholder="Sesi selesai ✨"
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
