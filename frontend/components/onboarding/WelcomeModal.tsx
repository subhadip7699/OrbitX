"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onStart: () => void;
  onSkip: () => void;
  onClose: () => void;
}

const STEPS = [
  "Connect your Stellar wallet.",
  "Swap XLM and USDC or explore available liquidity pools.",
  "Provide liquidity within a selected price range.",
  "Track your positions from Portfolio.",
];

export default function WelcomeModal({
  open,
  onStart,
  onSkip,
  onClose,
}: WelcomeModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.button
            type="button"
            aria-label="Skip onboarding"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[calc(100vh-32px)] w-full max-w-[520px] overflow-y-auto rounded-[28px] border border-white/10 bg-[#0c0d14]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-6"
          >
            <button
              type="button"
              aria-label="Close onboarding"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                Beginner guide
              </span>
              <h2
                id="onboarding-title"
                className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                Welcome to LuminaDex
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Trade and provide concentrated liquidity on Stellar with a
                simple, transparent experience.
              </p>

              <div className="mt-5 grid gap-3">
                {STEPS.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Step {index + 1}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-white/58">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onStart}
                  className="btn-primary inline-flex min-h-12 flex-1 items-center justify-center gap-2 px-5 text-sm font-bold"
                >
                  Start Tour <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white/72 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <Check className="h-4 w-4" /> Skip for now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
