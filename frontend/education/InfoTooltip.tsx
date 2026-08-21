"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  label?: string;
  side?: "top" | "bottom";
}

export default function InfoTooltip({
  content,
  label = "More information",
  side = "top",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      >
        <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute left-1/2 z-[90] w-[min(260px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-white/12 bg-[#11121b]/95 px-3 py-2 text-left text-xs leading-relaxed text-white/78 shadow-2xl shadow-black/50 backdrop-blur-xl ${
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
