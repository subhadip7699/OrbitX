export type AssistantAction = {
  label: string;
  href?: string;
  mode?: "feedback" | "rating" | "feature" | "bug" | "chat";
};

export type AssistantAnswer = {
  title: string;
  body: string;
  steps?: string[];
  actions?: AssistantAction[];
};

export const luminaKnowledge: Record<string, AssistantAnswer> = {
  wallet: {
    title: "Connect your wallet",
    body: "Use Connect Wallet to link your Stellar wallet. Orbitx never asks for your seed phrase, private key, or wallet password.",
    steps: [
      "Click Connect Wallet in the navigation.",
      "Choose Freighter or another supported Stellar wallet.",
      "Approve the connection in your wallet.",
      "Review the shortened address shown in Orbitx.",
    ],
  },
  swap: {
    title: "How to swap XLM and USDC",
    body: "Swap lets you exchange supported Stellar assets using Orbitx liquidity pools. Always review the quote before confirming.",
    steps: [
      "Connect your Stellar wallet.",
      "Open Swap.",
      "Choose the token you are paying with.",
      "Enter the amount.",
      "Review exchange rate, slippage, price impact, and minimum received.",
      "Click Swap and confirm in your wallet.",
      "Wait for Stellar network confirmation.",
    ],
    actions: [{ label: "Open Swap", href: "/swap" }],
  },
  liquidity: {
    title: "How liquidity works",
    body: "Liquidity providers deposit XLM and USDC into a selected price range. Your position can earn trading fees while the market price stays inside that range.",
    steps: [
      "Open Liquidity.",
      "Choose Add Liquidity.",
      "Review the current XLM/USDC price.",
      "Pick the minimum and maximum price where your liquidity should be active.",
      "Enter your XLM and USDC amounts.",
      "Review the position summary and confirm in your wallet.",
    ],
    actions: [{ label: "Open Liquidity", href: "/liquidity" }],
  },
  concentratedLiquidity: {
    title: "Concentrated liquidity",
    body: "Instead of spreading funds across every possible price, you choose the price range where your assets should be active. A narrower range can use capital more efficiently, but it may go out of range more often.",
  },
  slippage: {
    title: "Slippage",
    body: "Slippage is the maximum price difference you are willing to accept while your swap is being processed. If the price moves beyond your setting, the transaction should not complete.",
  },
  priceImpact: {
    title: "Price impact",
    body: "Price impact estimates how much your trade may move the pool price. Larger trades or thinner pools usually create higher price impact.",
  },
  minimumReceived: {
    title: "Minimum received",
    body: "Minimum received is the least amount of tokens you should get after slippage is applied. Review it before confirming a swap.",
  },
  feeTier: {
    title: "Fee tier",
    body: "The fee tier is the percentage of each trade paid to liquidity providers in that pool. Orbitx shows the pool fee before you provide liquidity.",
  },
  priceRange: {
    title: "Price range",
    body: "Your liquidity earns fees while the market price stays inside your selected minimum and maximum price. If the market moves outside, your position remains open but stops earning fees until it returns.",
  },
  portfolio: {
    title: "Portfolio",
    body: "Portfolio shows your connected wallet, balances, liquidity positions, and recent activity. Connect your wallet to see your own positions.",
    actions: [{ label: "Open Portfolio", href: "/portfolio" }],
  },
  transactions: {
    title: "Transaction status",
    body: "Orbitx builds the transaction, asks your wallet for approval, submits it to Stellar, and waits for confirmation. If it fails, review the message and try again after fixing the issue.",
  },
  usdc: {
    title: "Getting USDC",
    body: "USDC is a Stellar asset. On Testnet, you may need a trustline and test assets. Orbitx will warn you if your wallet cannot receive or spend the asset yet.",
  },
  outOfRange: {
    title: "Out of range",
    body: "Out of range means the market price is outside your selected liquidity range. Your position is still open, but it is not currently earning trading fees.",
  },
  financialAdvice: {
    title: "About trading decisions",
    body: "I can explain how Orbitx works, but the decision to trade or provide liquidity is yours. I cannot tell you what to buy or whether a price is good.",
  },
  security: {
    title: "Wallet safety",
    body: "For your security, never share your wallet seed phrase, private key, password, or recovery phrase. Orbitx will never ask you for them.",
  },
};

export function getPageExplanation(pathname: string): AssistantAnswer {
  if (pathname.startsWith("/swap")) {
    return {
      title: "This Swap page",
      body: "This page lets you exchange supported Stellar assets using Orbitx liquidity pools. Select what you pay with, enter an amount, review the quote and slippage, then confirm in your Stellar wallet.",
      actions: [{ label: "Ask about slippage", mode: "chat" }],
    };
  }
  if (pathname.startsWith("/liquidity/new")) {
    return {
      title: "This Add Liquidity page",
      body: "This page lets you create an XLM/USDC liquidity position. Choose the price range where your liquidity should be active, enter token amounts, review the summary, then confirm in your wallet.",
    };
  }
  if (pathname.startsWith("/liquidity")) {
    return {
      title: "This Liquidity page",
      body: "This page shows your liquidity positions and pool information. From here you can add liquidity, review active positions, and see whether a position is in range.",
    };
  }
  if (pathname.startsWith("/portfolio")) {
    return {
      title: "This Portfolio page",
      body: "This page helps you track your connected wallet, positions, balances, and activity. Connect your wallet to see your personal portfolio.",
    };
  }
  return {
    title: "This Orbitx page",
    body: "Orbitx helps you swap XLM and USDC, provide concentrated liquidity, and track positions on Stellar.",
  };
}

export function getContextualQuestions(pathname: string): string[] {
  if (pathname.startsWith("/swap")) {
    return [
      "What is slippage?",
      "What does minimum received mean?",
      "What is price impact?",
      "How do I complete this swap?",
    ];
  }
  if (pathname.startsWith("/liquidity")) {
    return [
      "What is concentrated liquidity?",
      "How do I choose a price range?",
      "What is a fee tier?",
      "Why is my position out of range?",
    ];
  }
  if (pathname.startsWith("/portfolio")) {
    return [
      "How do I track my position?",
      "Where are my earnings?",
      "What does active liquidity mean?",
      "How do I add liquidity?",
    ];
  }
  return [
    "How do I connect my wallet?",
    "How do I swap XLM for USDC?",
    "How does liquidity work?",
    "What is slippage?",
  ];
}
