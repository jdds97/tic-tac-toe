import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    plugins: ["@typescript-eslint"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", { "newlines-between": "always" }]
    }
  }
];

export default eslintConfig;
