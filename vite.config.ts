
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only import Replit plugins in development and when available
let replitPlugins = [];
const isReplit = process.env.REPL_ID || process.env.REPLIT;
const isDev = process.env.NODE_ENV !== "production";

if (isReplit && isDev) {
  try {
    const { cartographer } = require("@replit/vite-plugin-cartographer");
    const { runtimeErrorModal } = require("@replit/vite-plugin-runtime-error-modal");
    const { replitShadcnThemeJSON } = require("@replit/vite-plugin-shadcn-theme-json");
    
    replitPlugins = [cartographer(), runtimeErrorModal(), replitShadcnThemeJSON()];
  } catch (e) {
    // Replit plugins not available, continue without them
    console.log("Replit plugins not available, skipping...");
  }
}

export default defineConfig({
  plugins: [
    react(),
    ...replitPlugins,
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "frontend/index.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
      "@shared": path.resolve(__dirname, "./backend/shared"),
    },
  },
});
```
