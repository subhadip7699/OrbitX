export type FeedbackType = "rating" | "bug" | "feature" | "general";

export interface FeedbackContext {
  route?: string;
  walletAddress?: string;
  walletConnected?: boolean;
  network?: string;
  userAgent?: string;
  screenSize?: string;
  timestamp?: string;
}

export interface FeedbackSubmission {
  id?: string;
  type: FeedbackType;
  rating?: number;
  message: string;
  category?: string;
  route?: string;
  walletAddress?: string;
  walletConnected?: boolean;
  network?: string;
  userAgent?: string;
  screenSize?: string;
  createdAt?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}
