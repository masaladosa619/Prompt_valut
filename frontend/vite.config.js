import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Handle SPA routing — serve index.html for all non-file routes
    historyApiFallback: true,
  },
});
