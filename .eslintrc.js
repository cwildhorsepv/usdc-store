module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Existing rules...
    "no-ui-terms-in-schema": require("./no-ui-terms-in-schema"),
    "require-lexicon-header": require("./require-lexicon-header"),
  },
  overrides: [
    {
      files: ["server/**/*", "src/pages/api/**/*", "prisma/**/*"],
      plugins: ["custom-rules"],
      rules: {
        "custom-rules/no-ui-terms-in-schema": "warn",
      },
    },
  ],
};
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint", "import"],
  settings: {
    // 👇 make ESLint resolve TS path aliases from tsconfig.json
    "import/resolver": {
      typescript: { project: "./tsconfig.json" },
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
  },
  rules: {
    // your existing custom rule bindings
    "no-ui-terms-in-schema": require("./no-ui-terms-in-schema"),
    "require-lexicon-header": require("./require-lexicon-header"),

    // (optional) tighten imports a bit
    "import/no-unresolved": "error",
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ["server/**/*", "src/pages/api/**/*", "prisma/**/*"],
      plugins: ["custom-rules"],
      rules: {
        "custom-rules/no-ui-terms-in-schema": "warn",
      },
    },
  ],
};
