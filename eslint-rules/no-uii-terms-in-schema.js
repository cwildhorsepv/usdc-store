/**
 * Custom ESLint rule: prevent UI terminology in schema / backend code
 *
 * Warns if "wallet", "account", "transaction", etc. appear
 * in filenames or identifiers within backend / schema directories.
 */

const UI_TERMS = [
  "wallet",
  "wallets",
  "account",
  "transaction",
  "transactions",
  "balance",
  "processor",
  "portfolio",
  "serviceprovider",
  "sharedwallet",
];

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow UI terminology in schema/backend layers. Use lexicon equivalents.",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      uiTerm:
        'Avoid using UI term "{{term}}" in backend/schema code. Use the Lexicon term instead (see src/lib/lexiconMap.ts).',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isBackend =
      filename.includes("/server/") ||
      filename.includes("/api/") ||
      filename.includes("/prisma/");

    if (!isBackend) return {};

    return {
      Identifier(node) {
        const name = node.name.toLowerCase();
        for (const term of UI_TERMS) {
          if (name.includes(term)) {
            context.report({
              node,
              messageId: "uiTerm",
              data: { term },
            });
          }
        }
      },
    };
  },
};
