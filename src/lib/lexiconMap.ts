/**
 * Lexicon ↔ UI terminology bridge
 * Merlin Federated Value Wallet  (v1.3 Addendum A)
 *
 * Use lexicon terms in schema, API, and documentation.
 * Use UI terms in customer-facing components and labels.
 */
export const UI_LEXICON_MAP = {
  // Core Objects
  Wallet: "Viewport",
  Wallets: "Aggregated Viewports",
  Transaction: "Pledge Object",
  Account: "Endpoint",
  Balance: "Fed",
  Delegate: "Derived Viewport",
  Processor: "Federation Agent",
  Portfolio: "Aggregated Viewport",
  ServiceProvider: "Federation Agent",

  // Supporting Infrastructure
  Registry: "Managed Service – Naming",
  Router: "Managed Service – Routing",
  Security: "Managed Service – Security",
  Standards: "Managed Service – Interoperability",

  // Common UX phrasing
  "Linked Account": "Endpoint",
  "Shared Wallet": "Derived Viewport",
  "Team Wallet": "Derived Viewport",
  "Payment Contract": "Pledge Object",
  "Trusted Operator": "Federation Agent",
} as const;

export type LexiconTerm = keyof typeof UI_LEXICON_MAP;
export type TechnicalTerm = (typeof UI_LEXICON_MAP)[LexiconTerm];

/**
 * Helper to fetch the technical (lexicon) equivalent of a UI label.
 * Example:
 *   getLexiconEquivalent("Wallet") -> "Viewport"
 */
export const getLexiconEquivalent = (label: LexiconTerm): TechnicalTerm =>
  UI_LEXICON_MAP[label];
