import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
      "prefer-const": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Inline styles are not allowed. Use Tailwind utility classes or shared CSS. OpenGraph ImageResponse files are exempt.",
        },
      ],
    },
  },
  {
    files: [
      "src/app/opengraph-image.tsx",
      "src/app/about/opengraph-image.tsx",
      "src/app/contact/opengraph-image.tsx",
      "src/app/guides/opengraph-image.tsx",
      "src/app/guides/[slug]/opengraph-image.tsx",
      "src/app/dashboard/opengraph-image.tsx",
      "src/app/projects/opengraph-image.tsx",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
];

export default eslintConfig;
