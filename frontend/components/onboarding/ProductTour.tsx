"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X } from "lucide-react";

interface ProductTourProps {
  open: boolean;
  onFinish: () => void;
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    target: "[data-tour='wallet']",
    title: "Wallet",
    message: "Start by connecting your Stellar wallet.",
  },
  {
    target: "[data-tour='swap']",
    title: "Swap",
    message: "Exchange XLM and USDC using LuminaDex liquidity pools.",
    href: "/swap",
  },
  {
    target: "[data-tour='liquidity']",
    title: "Liquidity",
    message:
      "Provide liquidity within a custom price range and earn trading fees.",
    href: "/liquidity",
  },
  {
    target: "[data-tour='portfolio']",
    title: "Portfolio",
    message: "Track your active liquidity positions and assets.",
    href: "/portfolio",
  },
  {
    target: null,
    title: "Transaction Review",
    message:
      "Always review your exchange rate, slippage, price impact and minimum received before confirming transactions.",
  },
];

export default function ProductTour({ open, onFinish, onClose }: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = TOUR_STEPS[stepIndex];

  const goNext = useCallback(() => {
    if (stepIndex >= TOUR_STEPS.length - 1) {
      onFinish();
      return;
    }
    setStepIndex((value) => Math.min(value + 1, TOUR_STEPS.length - 1));
  }, [onFinish, stepIndex]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") setStepIndex((value) => Math.max(0, value - 1));
    }

    function updateRect() {
      if (!step.target) {
        setRect(null);
        return;
      }
      const target = document.querySelector(step.target);
      setRect(target?.getBoundingClientRect() ?? null);
    }

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, onClose, open, step.target]);

  const popoverStyle = useMemo<CSSProperties>(() => {
    if (typeof window === "undefined") {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    if (!rect) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    const width = Math.min(360, window.innerWidth - 32);
    const left = Math.min(
      Math.max(16, rect.left + rect.width / 2 - width / 2),
      window.innerWidth - width - 16
    );
    const below = rect.bottom + 18;
    const top =
      below + 220 > window.innerHeight
        ? Math.max(16, rect.top - 236)
        : below;
    return { left, top, width };
  }, [rect]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130]">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {rect && (
            <motion.div
              className="pointer-events-none fixed rounded-[22px] border border-cyan-300/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.55),0_0_34px_rgba(72,200,255,0.35)]"
              initial={false}
              animate={{
                left: rect.left - 8,
                top: rect.top - 8,
                width: rect.width + 16,
                height: rect.height + 16,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
          )}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
            className="fixed w-[calc(100vw-32px)] max-w-[360px] rounded-[24px] border border-white/10 bg-[#0c0d14]/95 p-5 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
            style={popoverStyle}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              aria-label="Close tour"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/80">
              {stepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <h2 id="tour-title" className="mt-2 text-lg font-extrabold">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              {step.message}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/65 transition hover:text-white disabled:opacity-35"
              >
                Back
              </button>
              <div className="flex gap-1.5" aria-hidden="true">
                {TOUR_STEPS.map((item, index) => (
                  <span
                    key={item.title}
                    className={`h-1.5 rounded-full transition-all ${
                      index === stepIndex ? "w-5 bg-cyan-300" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
              {step.href ? (
                <Link
                  href={step.href}
                  onClick={() => window.setTimeout(goNext, 120)}
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold"
                >
                  {stepIndex === TOUR_STEPS.length - 1
                    ? "Start Using LuminaDex"
                    : "Next"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
