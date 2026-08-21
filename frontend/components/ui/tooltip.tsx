"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";

type TooltipChildProps = {
  "aria-describedby"?: string;
};

interface TooltipProps {
  children: ReactElement<TooltipChildProps>;
  content: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  delayMs?: number;
  className?: string;
  disabled?: boolean;
}

const VIEWPORT_MARGIN = 12;
const TOOLTIP_OFFSET = 10;
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayMs = 120,
  className,
  disabled = false,
}: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({
    top: 0,
    left: 0,
    visibility: "hidden",
  });

  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    if (disabled || !content) return;
    clearTimers();
    showTimerRef.current = window.setTimeout(() => setOpen(true), delayMs);
  }, [clearTimers, content, delayMs, disabled]);

  const hide = useCallback(() => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(() => setOpen(false), 80);
  }, [clearTimers]);

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const width = tooltipRect.width;
    const height = tooltipRect.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let resolvedSide = side;
    const hasRoom = {
      top: triggerRect.top >= height + TOOLTIP_OFFSET + VIEWPORT_MARGIN,
      bottom:
        viewportHeight - triggerRect.bottom >=
        height + TOOLTIP_OFFSET + VIEWPORT_MARGIN,
      left: triggerRect.left >= width + TOOLTIP_OFFSET + VIEWPORT_MARGIN,
      right:
        viewportWidth - triggerRect.right >=
        width + TOOLTIP_OFFSET + VIEWPORT_MARGIN,
    };

    if (!hasRoom[resolvedSide]) {
      if (resolvedSide === "top" && hasRoom.bottom) resolvedSide = "bottom";
      else if (resolvedSide === "bottom" && hasRoom.top) resolvedSide = "top";
      else if (resolvedSide === "left" && hasRoom.right) resolvedSide = "right";
      else if (resolvedSide === "right" && hasRoom.left) resolvedSide = "left";
    }

    let top = 0;
    let left = 0;

    if (resolvedSide === "top" || resolvedSide === "bottom") {
      top =
        resolvedSide === "top"
          ? triggerRect.top - height - TOOLTIP_OFFSET
          : triggerRect.bottom + TOOLTIP_OFFSET;

      if (align === "start") left = triggerRect.left;
      else if (align === "end") left = triggerRect.right - width;
      else left = triggerRect.left + triggerRect.width / 2 - width / 2;
    } else {
      left =
        resolvedSide === "left"
          ? triggerRect.left - width - TOOLTIP_OFFSET
          : triggerRect.right + TOOLTIP_OFFSET;

      if (align === "start") top = triggerRect.top;
      else if (align === "end") top = triggerRect.bottom - height;
      else top = triggerRect.top + triggerRect.height / 2 - height / 2;
    }

    left = Math.min(
      Math.max(VIEWPORT_MARGIN, left),
      viewportWidth - width - VIEWPORT_MARGIN
    );
    top = Math.min(
      Math.max(VIEWPORT_MARGIN, top),
      viewportHeight - height - VIEWPORT_MARGIN
    );

    setPosition({
      position: "fixed",
      top: Math.round(top),
      left: Math.round(left),
      visibility: "visible",
    });
  }, [align, side]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    setPosition((current) => ({ ...current, visibility: "hidden" }));
    const frame = window.requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition, content]);

  const describedBy =
    open && !disabled && isValidElement<TooltipChildProps>(children)
      ? [children.props["aria-describedby"], tooltipId].filter(Boolean).join(" ")
      : undefined;
  const child =
    describedBy && isValidElement<TooltipChildProps>(children)
      ? cloneElement(children, { "aria-describedby": describedBy })
      : children;
  const canUseDOM = typeof document !== "undefined";

  function handleKeyDown(event: ReactKeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex align-middle"
        onPointerOver={(event) => {
          const previousTarget = event.relatedTarget;
          if (
            previousTarget instanceof Node &&
            event.currentTarget.contains(previousTarget)
          ) {
            return;
          }
          if (event.pointerType !== "touch") show();
        }}
        onPointerOut={(event) => {
          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
            return;
          }
          hide();
        }}
        onFocus={show}
        onBlur={hide}
        onKeyDown={handleKeyDown}
      >
        {child}
      </span>
      {canUseDOM && open && !disabled
        ? createPortal(
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              style={position}
              className={cn(
                "pointer-events-none z-[220] max-w-[min(280px,calc(100vw-24px))] rounded-lg border border-white/10 bg-[#11121b]/95 px-3 py-2 text-left text-xs leading-relaxed text-white/80 shadow-2xl shadow-black/60 backdrop-blur-xl",
                className
              )}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  );
}
