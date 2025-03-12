import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import stylePlugin from './plugins/style/index'
import iconPlugin from './plugins/icon/index'

export default defineConfig({
  envPrefix: "XH_",
  plugins: [uni(),iconPlugin()]
});
