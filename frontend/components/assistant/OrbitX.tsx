"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Bug,
  ChevronLeft,
  CircleHelp,
  Lightbulb,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AssistantAction,
  AssistantAnswer,
  getContextualQuestions,
  getPageExplanation,
} from "@/lib/assistant/knowledge";
import { getAssistantResponse } from "@/lib/assistant/response";
import { submitFeedback } from "@/lib/feedback/submitFeedback";
import { FeedbackType } from "@/lib/feedback/types";
import { useWallet } from "@/hooks/useWallet";
import StarRating from "@/components/assistant/StarRating";

type AssistantMode = "home" | "chat" | "feedback" | "rating" | "feature" | "bug" | "success";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  steps?: string[];
  actions?: AssistantAction[];
};

const HINT_KEY = "OrbitX_assistant_hint_seen";
const FEEDBACK_CATEGORIES = [
  "General feedback",
  "Bug",
  "Feature request",
  "UX/UI",
  "Swap",
  "Liquidity",
  "Wallet",
  "Performance",
  "Other",
];

export default function OrbitX() {
  const pathname = usePathname();
  const { address } = useWallet();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("home");
  const [hintVisible, setHintVisible] = useState(false);
  const [successQueued, setSuccessQueued] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const feedbackContext = useMemo(
    () => ({
      route: pathname,
      walletAddress: address ?? undefined,
      walletConnected: Boolean(address),
      network: "Stellar Testnet",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      screenSize:
        typeof window !== "undefined"
          ? `${window.innerWidth}x${window.innerHeight}`
          : undefined,
    }),
    [address, pathname]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getStoredFlag(HINT_KEY)) return;
    const showId = window.setTimeout(() => setHintVisible(true), 1600);
    const hideId = window.setTimeout(() => {
      setHintVisible(false);
      setStoredFlag(HINT_KEY);
    }, 7600);
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
    };
  }, []);

  useEffect(() => {
    function handleOpenAssistant(event: Event) {
      const detail = (event as CustomEvent<{ mode?: AssistantMode }>).detail;
      setMode(detail?.mode ?? "home");
      setOpen(true);
    }

    window.addEventListener("OrbitX:open-assistant", handleOpenAssistant);
    window.addEventListener("Orbitx:open-assistant", handleOpenAssistant);
    return () => {
      window.removeEventListener("OrbitX:open-assistant", handleOpenAssistant);
      window.removeEventListener("Orbitx:open-assistant", handleOpenAssistant);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function openAssistant(nextMode: AssistantMode = "home") {
    setMode(nextMode);
    setOpen(true);
    setHintVisible(false);
    if (typeof window !== "undefined") {
      setStoredFlag(HINT_KEY);
    }
  }

  function handleSuccess(queued: boolean) {
    setSuccessQueued(queued);
    setMode("success");
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {hintVisible && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="mb-3 max-w-[220px] rounded-2xl border border-white/10 bg-[#11121b]/95 p-3 text-sm text-white/75 shadow-2xl backdrop-blur-xl"
            >
              <div className="font-bold text-white">Need help?</div>
              <div className="mt-0.5 text-xs text-white/55">Ask OrbitX anytime.</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-label="Ask OrbitX"
          onClick={() => openAssistant()}
          className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/12 bg-[#10121c]/92 px-4 text-sm font-bold text-white shadow-[0_14px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-[#151827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:h-13"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Ask OrbitX</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-end sm:justify-end sm:p-6">
            <motion.button
              type="button"
              aria-label="Close OrbitX Assistant"
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-0"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="OrbitX-assistant-title"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative flex h-[min(680px,calc(100dvh-24px))] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0c0d14]/96 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl sm:h-[640px] sm:w-[410px] sm:rounded-[28px]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
                <div className="flex items-start gap-3">
                  {mode !== "home" && (
                    <button
                      type="button"
                      aria-label="Back to assistant home"
                      onClick={() => setMode("home")}
                      className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  <div>
                    <h2 id="OrbitX-assistant-title" className="flex items-center gap-2 text-base font-extrabold">
                      <Sparkles className="h-4 w-4 text-cyan-200" />
                      OrbitX Assistant
                    </h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/48">
                      Get help, learn OrbitX, or share feedback.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close assistant"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {mode === "home" && (
                <AssistantHome
                  pathname={pathname}
                  onMode={setMode}
                  onQuestion={(question) => {
                    setPendingQuestion(question);
                    setMode("chat");
                  }}
                />
              )}
              {mode === "chat" && (
                <AssistantChat
                  pathname={pathname}
                  pendingQuestion={pendingQuestion}
                  onPendingQuestionHandled={() => setPendingQuestion(null)}
                />
              )}
              {mode === "feedback" && (
                <FeedbackForm
                  type="general"
                  title="How was your experience?"
                  prompt="What would you like to share?"
                  submitLabel="Submit Feedback"
                  context={feedbackContext}
                  onSuccess={handleSuccess}
                />
              )}
              {mode === "rating" && (
                <FeedbackForm
                  type="rating"
                  title="Rate OrbitX"
                  prompt="Thanks! What made you choose this rating?"
                  submitLabel="Submit Rating"
                  context={feedbackContext}
                  onSuccess={handleSuccess}
                  ratingFirst
                />
              )}
              {mode === "feature" && (
                <FeedbackForm
                  type="feature"
                  title="What would make OrbitX better?"
                  prompt="Tell us the feature you'd like to see..."
                  secondaryPrompt="Why would this be useful?"
                  submitLabel="Submit Suggestion"
                  context={feedbackContext}
                  onSuccess={handleSuccess}
                />
              )}
              {mode === "bug" && (
                <FeedbackForm
                  type="bug"
                  title="What went wrong?"
                  prompt="Problem description"
                  secondaryPrompt="What were you trying to do?"
                  submitLabel="Submit Report"
                  context={feedbackContext}
                  onSuccess={handleSuccess}
                />
              )}
              {mode === "success" && (
                <SuccessState
                  queued={successQueued}
                  onAsk={() => setMode("chat")}
                  onClose={() => setOpen(false)}
                />
              )}
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function AssistantHome({
  pathname,
  onMode,
  onQuestion,
}: {
  pathname: string;
  onMode: (mode: AssistantMode) => void;
  onQuestion: (question: string) => void;
}) {
  const contextualQuestions = getContextualQuestions(pathname);
  const actions = [
    { label: "How do I Swap?", icon: MessageCircle, onClick: () => onQuestion("How do I swap XLM for USDC?") },
    { label: "How does Liquidity work?", icon: Bot, onClick: () => onQuestion("How does liquidity work?") },
    { label: "Explain this page", icon: CircleHelp, onClick: () => onQuestion("Explain this page") },
    { label: "Ask a question", icon: Send, onClick: () => onMode("chat") },
    { label: "Rate OrbitX", icon: Sparkles, onClick: () => onMode("rating") },
    { label: "Suggest a feature", icon: Lightbulb, onClick: () => onMode("feature") },
    { label: "Report a problem", icon: Bug, onClick: () => onMode("bug") },
    { label: "Share feedback", icon: MessageCircle, onClick: () => onMode("feedback") },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xl font-extrabold">Hi</p>
        <p className="mt-1 text-sm text-white/58">How can I help you with OrbitX?</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left text-sm font-semibold text-white/78 transition hover:border-cyan-300/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <Icon className="h-4 w-4 shrink-0 text-cyan-200/85" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Suggested here</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {contextualQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onQuestion(question)}
              className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/62 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssistantChat({
  pathname,
  pendingQuestion,
  onPendingQuestionHandled,
}: {
  pathname: string;
  pendingQuestion: string | null;
  onPendingQuestionHandled: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    answerToMessage(getPageExplanation(pathname), "assistant"),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading) return;
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "user", content: trimmed },
      ]);
      setInput("");
      setLoading(true);
      try {
        const answer = await getAssistantResponse(trimmed, { pathname });
        setMessages((current) => [...current, answerToMessage(answer, "assistant")]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: "I couldn't answer that right now, but OrbitX is still working normally. Try asking again in a moment.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, pathname]
  );

  useEffect(() => {
    function handleAsk(event: Event) {
      const question = (event as CustomEvent<{ question?: string }>).detail?.question;
      if (question) void ask(question);
    }
    window.addEventListener("Orbitx:ask", handleAsk);
    window.addEventListener("OrbitX:ask", handleAsk);
    return () => {
      window.removeEventListener("Orbitx:ask", handleAsk);
      window.removeEventListener("OrbitX:ask", handleAsk);
    };
  }, [ask]);

  useEffect(() => {
    if (!pendingQuestion) return;
    const id = window.setTimeout(() => {
      void ask(pendingQuestion);
      onPendingQuestionHandled();
    }, 0);
    return () => window.clearTimeout(id);
  }, [ask, onPendingQuestionHandled, pendingQuestion]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <AssistantMessage key={message.id} message={message} />
        ))}
        {loading && (
          <div className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
            OrbitX is typing...
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about OrbitX..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/35"
            maxLength={320}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send question"
            className="btn-primary inline-flex h-10 w-10 items-center justify-center disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setMessages([answerToMessage(getPageExplanation(pathname), "assistant")])}
          className="mt-2 text-xs font-semibold text-white/40 hover:text-white"
        >
          Clear conversation
        </button>
      </form>
    </div>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl border px-3 py-2 text-sm leading-relaxed ${isUser
          ? "border-cyan-300/25 bg-cyan-300/12 text-white"
          : "border-white/10 bg-white/[0.04] text-white/72"
          }`}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
          {isUser ? "You" : "OrbitX"}
        </div>
        <div className="mt-1">{message.content}</div>
        {message.steps && (
          <ol className="mt-2 space-y-1.5">
            {message.steps.map((step, index) => (
              <li key={step} className="flex gap-2 text-xs text-white/65">
                <span className="font-bold text-cyan-200">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
        {message.actions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action) =>
              action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/76 hover:text-white"
                >
                  {action.label} <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackForm({
  type,
  title,
  prompt,
  secondaryPrompt,
  submitLabel,
  context,
  onSuccess,
  ratingFirst = false,
}: {
  type: FeedbackType;
  title: string;
  prompt: string;
  secondaryPrompt?: string;
  submitLabel: string;
  context: Parameters<typeof submitFeedback>[1];
  onSuccess: (queued: boolean) => void;
  ratingFirst?: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState(type === "bug" ? "Bug" : type === "feature" ? "Feature request" : "General feedback");
  const [message, setMessage] = useState("");
  const [secondary, setSecondary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (type === "rating" && rating === 0) {
      setError("Choose a rating before submitting.");
      return;
    }
    if (!message.trim() && type !== "rating") {
      setError("Add a short message before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await submitFeedback(
      {
        type,
        rating: rating || undefined,
        category,
        message: [message.trim(), secondaryPrompt && secondary.trim() ? `${secondaryPrompt}: ${secondary.trim()}` : ""]
          .filter(Boolean)
          .join("\n\n") || `Rating: ${rating}`,
        metadata: type === "bug" ? { safeContextAttached: true } : undefined,
      },
      context
    );
    setSubmitting(false);
    onSuccess(result.queued);
  }

  return (
    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-4">
      <h3 className="text-lg font-extrabold text-white">{title}</h3>
      {type === "bug" && (
        <p className="mt-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-xs leading-relaxed text-white/55">
          We attach safe context like route, browser, screen size, timestamp, wallet connected status, and network. Never include seed phrases, private keys, passwords, or signing payloads.
        </p>
      )}
      {(ratingFirst || type === "general") && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/35">How was your experience?</p>
          <StarRating value={rating} onChange={setRating} />
          {rating > 0 && <p className="mt-2 text-xs text-white/45">Thanks! What made you choose this rating?</p>}
        </div>
      )}
      <label className="mt-4 block">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">{prompt}</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={type === "feature" ? "Tell us the feature you'd like to see..." : "Write a few details..."}
          maxLength={1200}
          className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/35"
        />
      </label>
      {secondaryPrompt && (
        <label className="mt-3 block">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">{secondaryPrompt}</span>
          <textarea
            value={secondary}
            onChange={(event) => setSecondary(event.target.value)}
            maxLength={700}
            className="mt-2 min-h-20 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/35"
          />
        </label>
      )}
      <label className="mt-3 block">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Category</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#10121c] p-3 text-sm text-white outline-none focus:border-cyan-300/35"
        >
          {FEEDBACK_CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      {error && <p className="mt-3 text-xs font-semibold text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-5 flex min-h-12 w-full items-center justify-center gap-2 text-sm font-bold disabled:opacity-45"
      >
        {submitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}

function SuccessState({
  queued,
  onAsk,
  onClose,
}: {
  queued: boolean;
  onAsk: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-black">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-extrabold">
        {queued ? "Feedback saved locally" : "Feedback submitted"}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/58">
        {queued
          ? "We couldn't submit your feedback right now. Your feedback has been kept locally. Please try again later."
          : "Thanks for helping us improve OrbitX."}
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onAsk} className="btn-primary min-h-11 flex-1 px-4 text-sm font-bold">
          Ask another question
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white/70 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function answerToMessage(answer: AssistantAnswer, role: "assistant"): ChatMessage {
  return {
    id: createMessageId(),
    role,
    content: `${answer.title}: ${answer.body}`,
    steps: answer.steps,
    actions: answer.actions,
  };
}

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getStoredFlag(key: string) {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function setStoredFlag(key: string) {
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // Storage can be unavailable in private or embedded browser contexts.
  }
}
