import { defineConfig } from "vite";
export default defineConfig({
  ssr: {
    noExternal: ["*",'@inquirer/*'],
    external: [],
  },
  build: {
    target: "es2020",
    outDir: "bin",
    ssr: true,
    lib: {
      entry: "./src/index.ts",
      name: "xh-uni-cli",
      formats: ["es", "cjs"],
      fileName: "xh-uni-cli",
    },
    rollupOptions: {
      output:{
        banner: "#!/usr/bin/env node",
      },
      external: [],
    },
  },
});
