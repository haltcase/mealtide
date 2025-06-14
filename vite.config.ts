import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { watch } from "vite-plugin-watch";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "./src",
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      tsr: {
        verboseFileRoutes: false,
        routesDirectory: "src/app",
      },
    }),

    // Automatically generate the Tailwind theme when the Mantine theme changes.
    watch({
      command: "pnpm theme:generate",
      pattern: resolve("src/theme/**/*"),
    }),
  ],
});
