"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
  compact = false,
}: {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rate LuminaDex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`Rate ${star} out of 5`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          onClick={() => onChange(star)}
          className={`${compact ? "h-8 w-8" : "h-10 w-10"} inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] transition hover:border-yellow-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200/70`}
        >
          <Star
            className={`${compact ? "h-4 w-4" : "h-5 w-5"} ${
              star <= active ? "fill-yellow-200 text-yellow-200" : "text-white/35"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
