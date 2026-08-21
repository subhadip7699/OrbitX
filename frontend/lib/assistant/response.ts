import {
  AssistantAnswer,
  getPageExplanation,
  luminaKnowledge,
} from "@/lib/assistant/knowledge";

export interface AssistantContext {
  pathname: string;
}

const sensitivePattern =
  /\b(seed phrase|recovery phrase|secret key|private key|wallet password|password|otp|mnemonic)\b/i;

const financialAdvicePattern =
  /\b(should i buy|should i sell|good price|will .* go up|price prediction|is .* a good investment|should i provide liquidity)\b/i;

const intents: Array<{ key: keyof typeof luminaKnowledge; patterns: RegExp[] }> = [
  { key: "wallet", patterns: [/connect.*wallet/i, /freighter/i, /wallet/i] },
  { key: "swap", patterns: [/swap/i, /xlm.*usdc/i, /usdc.*xlm/i, /exchange/i] },
  { key: "slippage", patterns: [/slippage/i] },
  { key: "priceImpact", patterns: [/price impact/i, /impact/i] },
  { key: "minimumReceived", patterns: [/minimum received/i, /least.*receive/i] },
  { key: "liquidity", patterns: [/add liquidity/i, /provide liquidity/i, /liquidity work/i] },
  { key: "concentratedLiquidity", patterns: [/concentrated liquidity/i, /clmm/i] },
  { key: "priceRange", patterns: [/price range/i, /min price/i, /max price/i] },
  { key: "outOfRange", patterns: [/out of range/i, /in range/i] },
  { key: "feeTier", patterns: [/fee tier/i, /0\.3/i] },
  { key: "portfolio", patterns: [/portfolio/i, /position/i, /earnings/i, /track/i] },
  { key: "transactions", patterns: [/transaction/i, /pending/i, /failed/i, /confirm/i] },
  { key: "usdc", patterns: [/get usdc/i, /trustline/i, /receive usdc/i] },
];

export async function getAssistantResponse(
  message: string,
  context: AssistantContext
): Promise<AssistantAnswer> {
  const normalized = message.trim();
  if (!normalized) {
    return {
      title: "Ask OrbitX",
      body: "Ask me about Swap, Liquidity, Portfolio, wallet connection, or DeFi terms shown in OrbitX.",
    };
  }

  if (sensitivePattern.test(normalized)) return luminaKnowledge.security;
  if (financialAdvicePattern.test(normalized)) return luminaKnowledge.financialAdvice;
  if (/explain.*page|this page|where am i/i.test(normalized)) {
    return getPageExplanation(context.pathname);
  }
  if (/open swap|go to swap|take me to swap/i.test(normalized)) {
    return { ...luminaKnowledge.swap, actions: [{ label: "Open Swap", href: "/swap" }] };
  }
  if (/open liquidity|go to liquidity|take me to liquidity/i.test(normalized)) {
    return {
      ...luminaKnowledge.liquidity,
      actions: [{ label: "Open Liquidity", href: "/liquidity" }],
    };
  }
  if (/open portfolio|go to portfolio|take me to portfolio/i.test(normalized)) {
    return {
      ...luminaKnowledge.portfolio,
      actions: [{ label: "Open Portfolio", href: "/portfolio" }],
    };
  }

  const match = intents.find((intent) =>
    intent.patterns.some((pattern) => pattern.test(normalized))
  );
  if (match) return luminaKnowledge[match.key];

  return {
    title: "OrbitX help",
    body: "I can help with OrbitX features, swaps, liquidity, portfolio tracking, wallet connection, and common DeFi terms. Try asking: “What is slippage?” or “How do I add liquidity?”",
  };
}
