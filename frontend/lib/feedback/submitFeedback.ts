import { FeedbackContext, FeedbackSubmission } from "@/lib/feedback/types";

const QUEUE_KEY = "OrbitX_unsent_feedback";

export async function submitFeedback(
  submission: FeedbackSubmission,
  context: FeedbackContext
): Promise<{ queued: boolean }> {
  const payload: FeedbackSubmission = {
    ...submission,
    route: context.route,
    walletAddress: context.walletAddress,
    walletConnected: context.walletConnected,
    network: context.network,
    userAgent: context.userAgent,
    screenSize: context.screenSize,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Feedback request failed: ${response.status}`);
    }

    return { queued: false };
  } catch {
    queueFeedback(payload);
    return { queued: true };
  }
}

function queueFeedback(payload: FeedbackSubmission) {
  if (typeof window === "undefined") return;
  try {
    const current = JSON.parse(window.localStorage.getItem(QUEUE_KEY) || "[]") as FeedbackSubmission[];
    const next = [payload, ...current].slice(0, 20);
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  } catch {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify([payload]));
  }
}
