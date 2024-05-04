/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      /**
       * Support aboslute path import, Map the @/ alias to the src/ directory
       * https://vitest.dev/guide/common-errors
       */
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
