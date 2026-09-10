import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@next/next/no-img-element": "off"
    },
    ignores: ["node_modules/**", ".next/**", "out/**", "index.html"]
  }
];

export default eslintConfig;
