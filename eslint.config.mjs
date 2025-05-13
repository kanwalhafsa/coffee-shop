import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.tsx", "src/**/*.ts", "src/**/*.js", "src/**/*.jsx"],
    ignores: ["node_modules", ".next"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@next/next": pluginNext,
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json", // Link to tsconfig.json
      },
      globals: {
        browser: true,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginNext.configs["recommended"].rules,
      ...tseslint.configs.recommended.rules,
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off", // Disable problematic rule
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];