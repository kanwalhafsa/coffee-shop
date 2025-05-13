import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";

export default [
  {
    files: ["src/**/*.tsx", "src/**/*.ts", "src/**/*.js", "src/**/*.jsx"],
    ignores: ["!src/app"], // src/app ko include karna
    plugins: {
      react: pluginReact,
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginNext.configs["recommended"].rules,
      "react/no-unescaped-entities": "off", // Yeh tumhari purani rule
    },
    languageOptions: {
      globals: {
        browser: true,
      },
    },
  },
];