// src/content/why.ts

export type Pillar = { title: string; desc: string };

export const WHY = {
  tagline: "USDC you can actually use.",
  valueProp: "Buy once, use everywhere — no gas, no jargon.",
  elevator: {
    consumer:
      "Most ramps help you buy crypto; then you’re on your own. USDC Store hides the crypto chores — wallets, gas, chains — so you can pay instantly, get clear receipts, and recover your account without seed phrases.",
    merchant:
      "Accept “Pay with USDC” with card-like simplicity and crypto-native settlement. Price in fiat, settle in USDC or USD, refunds and reporting included. One integration; no onchain brain damage.",
  },
  differentiators: [
    "Time-to-Utility, not time-to-asset.",
    "No seed phrases — guardians & delegated keys.",
    "No gas UX — tap Pay, we route networks.",
    "Merchant-grade ops: refunds, partial captures, ACH off-ramps.",
    "Developer-first sandbox: clone, seed, run.",
  ],
  pillars: [
    {
      title: "Acquire",
      desc: "Simple USDC onboarding with wallet creation baked in.",
    },
    {
      title: "Use",
      desc: "Checkout that routes EVM/ACH under the hood; instant confirms.",
    },
    {
      title: "Protect",
      desc: "Guardians + Secret Store for recoverable, delegated security.",
    },
    {
      title: "Settle",
      desc: "Settle in USDC or fiat; ledgers and webhooks for finance.",
    },
    {
      title: "Build",
      desc: "Clean APIs/SDKs and a full local sandbox for partners.",
    },
  ] as Pillar[],
  kpisInternal: [
    "Time-to-Utility (TTU): signup → first payment",
    "A2U rate: % buyers who pay within 24h",
    "Merchant auth→confirm latency; settlement time",
    "Recovery success rate; delegated approval latency",
  ],
} as const;
