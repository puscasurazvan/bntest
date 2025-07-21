/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      exclude: [
        "src/main.tsx",
        "src/App.tsx",
        "src/test/**",
        "node_modules/**",
        "dist/**",
        "*.config.{js,ts}",
        "**/*.d.ts",
      ],
    },
  },
});
