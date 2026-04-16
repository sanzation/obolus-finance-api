import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8080,
    open: false,
    proxy: {
      "/api": {
        target: "https://www.obolusfinanz.de",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 8080,
    open: false,
  },
});
