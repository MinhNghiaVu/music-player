import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // So it does not force React import in every file
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // For now, allow components to use "any" type, but I'll remove it later
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];