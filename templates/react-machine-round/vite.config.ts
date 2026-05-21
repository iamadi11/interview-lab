import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3100,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/playwright/**", "**/*.config.*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["src/stories/**", "src/mocks/**", "playwright/**"],
    },
  },
});
