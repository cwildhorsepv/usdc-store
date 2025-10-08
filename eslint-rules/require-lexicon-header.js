/**
 * Require @lexicon header comment at top of federated code files.
 */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require @lexicon header block in federated files",
    },
    messages: {
      missing: "File missing @lexicon header comment at top.",
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isFederatedFile =
      filename.includes("/server/") ||
      filename.includes("/src/lib/") ||
      filename.includes("/src/pages/api/");

    if (!isFederatedFile) return {};

    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        const hasLexicon = comments.some((c) =>
          /@lexicon\s+\w+\(\w+\)/.test(c.value),
        );
        if (!hasLexicon) {
          context.report({
            node,
            messageId: "missing",
          });
        }
      },
    };
  },
};
