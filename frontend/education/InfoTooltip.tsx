"use client";

import { CircleHelp } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

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
  return (
    <Tooltip
      content={content}
      side={side}
      className="max-w-[min(260px,calc(100vw-32px))]"
    >
      <button
        type="button"
        aria-label={label}
        onClick={(event) => {
          event.preventDefault();
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      >
        <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
